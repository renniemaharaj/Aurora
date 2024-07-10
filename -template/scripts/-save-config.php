<?php
include ("aurora-core.php");

if (ValidateController()) {
    // Check if the 'configuration' POST parameter is set
    if (isset($_POST["configuration"])) {
        // Decode the JSON from the 'configuration' POST parameter
        $configuration = json_decode($_POST["configuration"], true);

        // Check for JSON decoding errors
        if (json_last_error() === JSON_ERROR_NONE) {

            // Call the WriteConfig function to save the configuration
            $result = WriteConfig($configuration);

            // Check if WriteConfig was successful
            if ($result) {
                // Send a success response
                echo json_encode(["status" => "success", "message" => "Configuration saved successfully."]);
            } else {
                // Send an error response if WriteConfig failed
                echo json_encode(["status" => "error", "message" => "Failed to save configuration."]);
            }
        } else {
            // Send an error response for invalid JSON
            echo json_encode(["status" => "error", "message" => "Invalid JSON data."]);
        }
    } else {
        // Send an error response if 'configuration' POST parameter is missing
        echo json_encode(["status" => "error", "message" => "'configuration' POST parameter is missing."]);
    }
}