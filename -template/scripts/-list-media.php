<?php
header('Content-Type: application/json');
include ("aurora-core.php");

if (ValidateController()) {
    // Return a list of all files in the media folder
    echo json_encode(array_values(ListMedia()));
}
