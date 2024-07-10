<?php

//Run updater to intialize config
include_once ("update.php");

// Load the configuration from a JSON file
$config = json_decode(file_get_contents('json/configuration.json'), true);
$document = $config['Document'];