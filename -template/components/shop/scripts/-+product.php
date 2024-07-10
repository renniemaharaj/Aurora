<?php
include ("aurora-core.php");

if (ValidateController()) {
    $products = LoadProducts();
    // Check if the 'configuration' POST parameter is set
    if (isset($_POST["product"])) {
        // Decode the JSON from the 'configuration' POST parameter
        $configuration = json_decode($_POST["product"], true);

        // Check for JSON decoding errors
        if (json_last_error() === JSON_ERROR_NONE) {
            // Call the addProducts function
            $result = AddProduct($configuration, $products);

            // Check if adding product was successfull
            if ($result) {
                // Send a success response
                echo json_encode(["status" => "success", "message" => "Product added."]);
            } else {
                // Send an error response if WriteConfig failed
                echo json_encode(["status" => "error", "message" => "Failed to add product"]);
            }
        } else {
            // Send an error response for invalid JSON
            echo json_encode(["status" => "error", "message" => "Invalid JSON data."]);
        }
    } else {
        // Send an error response if 'configuration' POST parameter is missing
        echo json_encode(["status" => "error", "message" => "'product' POST parameter is missing."]);
    }
}
