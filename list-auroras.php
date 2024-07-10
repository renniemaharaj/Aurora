<?php

// Run updater to initialize config
// include_once ("update.php");

// Load the configuration from a JSON file

$directory = __DIR__ . '/i';
$directories = array_filter(glob($directory . '/*'), 'is_dir');

foreach ($directories as $dir) {
    // Load the configuration file from each Aurora directory
    $configFilePath = $dir . '/i-config.php';
    if (file_exists($configFilePath)) {
        $config = json_decode(file_get_contents($dir . '/json/configuration.json'), true);
        $document = $config['Document'];

        $name = basename($dir);
        $keywords = isset($document['keywords']) ? implode(' ', $document['keywords']) : 'No keywords';
        $description = isset($document['description']) ? $document['description'] : 'No description';

        echo '<div class="aurora-tile">';
        echo '<a href="/aurora/i/' . $name . '">/' . htmlspecialchars($name) . '</a>';
        echo '<p class="keywords"><strong>Keywords:</strong> ' . htmlspecialchars($keywords) . '</p>';
        echo '<p class="description"><strong>Description:</strong> ' . htmlspecialchars($description) . '</p>';
        echo '</div>';
    }
}
?>