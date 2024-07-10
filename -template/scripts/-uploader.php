<?php
include ("aurora-core.php");

if (ValidateController()) {
    $user_uploads = "media";
    $fileName = $_POST['filename'];
    $chunk_part = $_POST['part'];
    // $location = ParentDirectory() . '/' . $user_uploads;
    $location = $user_uploads;
    $finished = $_POST['finished'];

    move_uploaded_file($_FILES['file']['tmp_name'], "$location/$fileName.part.$chunk_part");
    if ($finished == "true") {
        $filePath = "$location/$fileName.part.*";
        $fileParts = glob($filePath);
        sort($fileParts, SORT_NATURAL);
        $finalFile = fopen("$location/$fileName", 'w');
        foreach ($fileParts as $filePart) {
            $chunk = file_get_contents($filePart);
            fwrite($finalFile, $chunk);
            unlink($filePart);
        }
        fclose($finalFile);
    }
}