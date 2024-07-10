<?php
//Provide parent directory to updated files
$parent = "../../-template/";

//Provide required directories
$requiredDirectories = ["scripts"];

//Variables for statistics and logging
$logs = array();
$copiedDirectories = 0;
$updatedFiles = 0;

//Define logging function
function logProgress($msg)
{
    global $logs;
    array_push($logs, microtime() . ': ' . $msg . "<br>");
}
//Required write function
function WriteJSON($path, $data)
{
    $f = fopen($path, 'w+');
    fwrite($f, json_encode($data, JSON_PRETTY_PRINT));
    fclose($f);
}
//Required read function
function ReadJSON($path)
{
    if (!file_exists($path)) {
        return null;
    }
    $size = filesize($path);
    if ($size == 0) {
        return [];
    }
    $f = fopen($path, 'r+');
    $d = json_decode(fread($f, $size), TRUE);
    fclose($f);
    return $d;
}

logProgress("Initiating image updater");
$startTime = microtime();
//Copy accross all files from all required directories
foreach ($requiredDirectories as $directory) {
    logProgress("Scanning directory: $directory");
    //Check if directory is valid
    if (is_dir($parent . '/' . $directory)) {
        //Initially gather all contents of directory and filter out . & ..
        $files = array_diff(scandir($parent . '/' . $directory), ['.', ".."]);

        logProgress("Found " . count($files) . " files");
        //Combined path of parent and directory
        $external = $parent . '/' . $directory;

        // Filter out non-files (directories)
        $files = array_filter($files, function ($file) use ($external) {
            return is_file("$external/$file");
        });

        //Now copy mirror directory into current, working directory
        foreach ($files as $file) {
            logProgress("Checking file: $file");
            //Define capture variable
            $fileContents;
            //
            //Read external file and capture contents into capture variable
            $size = filesize($external . '/' . $file);
            if ($size == 0) {
                $fileContents = "";
            } else {
                $f = fopen($external . '/' . $file, 'r+');
                $fileContents = fread($f, $size);
                fclose($f);
            }
            //Update current directory image with parent's

            if (!file_exists($directory)) {
                logProgress("Making directory: $directory");
                mkdir($directory, 0755);
                for ($i = 0; $i < 5; $i++) {
                    chmod($directory, 0755);
                }
            }

            //Note file's existence or the inverse thereof
            $found_file = file_exists($directory . '/' . $file);

            //Check if file was found and compare it to original
            //Comparing eliminates reduntant drive writes

            //Initially assume file is incorrect
            $file_correct = false;
            if ($found_file) {
                logProgress("File already exists: $file. Checking for updates");
                //Define capture variable
                $fileContents2;
                //Read current, working directory file to compare
                $size = filesize($directory . '/' . $file);
                if ($size == 0) {
                    $fileContents2 = "";
                } else {
                    $f = fopen($directory . '/' . $file, 'r+');
                    $fileContents2 = fread($f, $size);
                    fclose($f);
                }
                //Compare fileContent with fileContent2
                if ($fileContents2 == $fileContents) {
                    logProgress("File: $file OK");
                    $file_correct = true;
                }
            }
            if (!$file_correct) {
                logProgress("File: $file REPAIRING");
                //Use w+ to open or create on absent and then copy contents into file
                $f = fopen($directory . '/' . $file, 'w+');
                fwrite($f, $fileContents);
                fclose($f);
                $updatedFiles++;
            }
        }
    }
    $copiedDirectories++;
}
logProgress("Version repairing finished. Took ");
if ($updatedFiles == 0) {
    logProgress("All files were found updated");
} else {
    logProgress("Updated $updatedFiles files from $copiedDirectories directories.");
}

if (!is_dir("json")) {
    logProgress("Initializing JSON folder.");
    mkdir("json", 0755);
    for ($i = 0; $i < 5; $i++) {
        chmod("json", 0755);
    }
}
if (!is_dir("media")) {
    logProgress("Initializing MEDIA folder.");
    mkdir("media", 0755);
    for ($i = 0; $i < 5; $i++) {
        chmod("media", 0755);
    }
}
if (!file_exists("json/configuration.json")) {

    logProgress("Initializing configuration file");
    writeJSON("json/configuration.json", ReadJSON("../../-template/json/configuration.json"));
}

if (!is_file("json/index.json")) {
    logProgress("Initializing indexing file.");
    $default_index = "{\"place\": 0}";
    writeJSON("json/index.json", ReadJSON("../../-template/json/index.json"));
}