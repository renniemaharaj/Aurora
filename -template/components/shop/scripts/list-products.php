<?php

include_once ("aurora-core.php");


// Load products from the JSON file
$products = LoadProducts();

// Example usage
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add a new product
    if (isset($_POST['addProduct'])) {
        $newProduct = [
            'title' => $_POST['title'],
            'unit-quantity' => (int) $_POST['unit-quantity'],
            'description' => $_POST['description'],
            'charge' => (float) $_POST['charge'],
            'stock' => (bool) $_POST['stock'],
            'thumbnails' => [],
            'currency' => $_POST['currency']
        ];
        AddProduct($newProduct, $products);
    }
}

// Search for products
if (isset($_GET['query'])) {
    $query = $_GET['query'];
    $results = FindProducts($query, $products);
    echo json_encode($results, JSON_PRETTY_PRINT);
}