<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $websiteName = trim($_POST['aurora_name']);
    $dirPath = __DIR__ . '/i' . '/' . $websiteName;

    // Read the allowed limit from allowed.txt
    $allowedFilePath = __DIR__ . '/i/allowed.txt';
    if (!file_exists($allowedFilePath)) {
        echo "The allowed.txt file does not exist.";
        exit;
    }
    $allowedLimit = (int) file_get_contents($allowedFilePath);

    // Get the number of directories in /i excluding allowed.txt
    $dirs = array_filter(glob(__DIR__ . '/i/*'), 'is_dir');
    $numDirs = count($dirs);

    if ($numDirs >= $allowedLimit) {
        echo "The maximum number of allowed directories ($allowedLimit) has been reached. Cannot create a new Aurora. Please contact Rennie Maharaj if this happens to you. ";
        echo "<a href=\"mailto: rvesprey@gmail.com\">rvesprey@gmail.com</a>";
        exit;
    }

    // Check if the directory already exists
    if (is_dir($dirPath)) {
        echo "'$websiteName' already exists. Please enter a unique name for your website.";
        echo '<a href="index.php">Start over</a>';
        exit;
    }

    // Create the new directory and necessary subdirectories
    mkdir($dirPath, 0755, true);
    mkdir($dirPath . '/json', 0755, true);

    // Copy the template files
    $indexTemplatePath = __DIR__ . '/-template/index.php';
    $updateTemplatePath = __DIR__ . '/-template/update.php';
    $iconfigTemplatePath = __DIR__ . '/-template/i-config.php';

    if (!copy($indexTemplatePath, $dirPath . '/index.php')) {
        echo "Failed to copy index.php\n";
        exit;
    }
    if (!copy($updateTemplatePath, $dirPath . '/update.php')) {
        echo "Failed to copy update.php\n";
        exit;
    }
    if (!copy($iconfigTemplatePath, $dirPath . '/i-config.php')) {
        echo "Failed to copy i-config.php\n";
        exit;
    }

    echo "Aurora '$websiteName' created successfully!";
    echo "<a href=\"i/$websiteName/\">See it</a>";
}