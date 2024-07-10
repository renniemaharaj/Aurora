<?php
function ParentDirectory()
{
    return dirname(__DIR__, 1);
}
function indexFile()
{
    return JSONFolder() . "/index.json";
}
function stepIndex()
{
    $index = ReadJSON(indexFile())["place"];
    $step = new stdClass();
    $step->place = $index + 1;
    WriteJSON(indexFile(), $step);
    return $index;
}
function JSONFolder()
{
    return ParentDirectory() . "/json";
}
function ProductsFile()
{
    return JSONFolder() . "/products.json";
}
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
function WriteJSON($path, $data)
{
    $f = fopen($path, 'w+');
    fwrite($f, json_encode($data, JSON_PRETTY_PRINT));
    fclose($f);
}
// This public function will load and return products as an OBJECT
function LoadProducts()
{
    $filename = ProductsFile();
    if (!file_exists($filename)) {
        return [];
    }
    $json = file_get_contents($filename);
    return json_decode($json, true);
}

// Function to save products to JSON file
function saveProducts($products)
{
    $filename = ProductsFile();
    $json = json_encode($products, JSON_PRETTY_PRINT);
    file_put_contents($filename, $json);
}

// Function to rewrite main index.php file head with document configurations

// This public function will find products by a query and return matches
function FindProducts($query, $products)
{
    if ($query === "") {
        return $products; // Return all products if query is empty
    }

    $results = [];
    foreach ($products as $product) {
        if (stripos($product['title'], $query) !== false || stripos($product['description'], $query) !== false) {
            $results[] = $product;
        }
    }
    return $results;
}
function generateRandomString($length = 10)
{
    $letters = 'abcdefghijklmnopqrstuvwxyz';
    $numbers = '0123456789';
    $specialChars = "!@#$%^&*()_+-={[}],./;:'\"<>?";

    // Create a random string with all characters
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomNumber = rand(1, strlen($numbers) - 1);
        $randomLetter = rand(0, strlen($letters) - 1);
        $randomSpecialChar = rand(0, strlen($specialChars) - 1);
        if ($randomNumber === '9') {
            $randomString .= $numbers[$randomNumber];
        } elseif ($randomNumber < strlen($numbers)) {
            $randomString .= $numbers[$randomNumber];
        } elseif (rand(0, 1) === 1 && rand(0, strlen($letters) - 1) !== 'x') {
            $randomString .= $letters[rand(0, strlen($letters) - 1)];
        } else {
            $randomString .= $specialChars[rand(0, strlen($specialChars) - 1)];
        }
    }
    return $randomString;
}
function generateProductID()
{
    // $product_string = json_encode($product);
    // return hash("sha256", $product_string .= generateRandomString());
    return "ID" . stepIndex();

}
// This public function will add a product to a product[] OBJECT. 
function AddProduct($newProduct, &$products)
{
    $newProduct["ID"] = generateProductID();
    $products[] = $newProduct;
    saveProducts($products);

    return true;
}
//Equivalent function to remove function
function RemoveProduct($contextID, &$products)
{
    foreach ($products as $key => $product) {
        if ($product["ID"] === $contextID) {
            unset($products[$key]);
            saveProducts($products);
            return true;
        }
    }
}
// Function to update stock of a product
function updateStock($title, $quantityChange, &$products)
{
    foreach ($products as &$product) {
        if ($product['title'] === $title) {
            $product['unit-quantity'] += $quantityChange;
            if ($product['unit-quantity'] < 0) {
                $product['unit-quantity'] = 0;
            }
            $product['stock'] = $product['unit-quantity'] > 0;
            saveProducts($products);
            return true;
        }
    }
    return false;
}

//This function will return a list of all files in the media folder
function ListMedia()
{
    // Path to the images directory
    $dir = '../media';

    // Check if the directory exists
    if (!is_dir($dir)) {
        echo json_encode(["error" => "Directory not found"]);
        exit;
    }

    // Scan the directory for files
    $files = array_diff(scandir($dir), ['.', '..']);

    // Filter out non-files (directories)
    $files = array_filter($files, function ($file) use ($dir) {
        return is_file("$dir/$file");
    });
    return $files;
}
//This public function will return the configuration file's path
function ConfigFile()
{
    return JSONFolder() . "/configuration.json";
}

//This public function will return the configuration file's content as JSON
function ReadConfig()
{
    return ReadJSON(ConfigFile());
}

//This public function will write JSON to the configuration file
function WriteConfig($configuration)
{
    WriteJSON(ConfigFile(), $configuration);
    return true;
}

//This public function will return the orders file's path
function OrderFile()
{
    return JSONFolder() . "/orders.json";
}
// This public function will add an order to a list of orders
function AddOrder($newOrder)
{
    $newOrder["ID"] = stepIndex();
    $newOrder["time-added"] = getTimeStamp();
    $orders = ReadJSON(OrderFile());
    $orders[] = $newOrder;
    WriteJSON(OrderFile(), $orders);
    return $newOrder["ID"];
}

//This function will return unseen orders
function GetUnseenOrders()
{
    $unseen = [];
    $orders = ReadJSON(OrderFile());
    foreach ($orders as $order) {
        if (!$order["Seen"]) {
            array_push($unseen, $order);
        }
    }
    return $unseen;
}

//This function will return the last 20 
function GetLast20Orders()
{
    $orders = ReadJSON(OrderFile());
    // return array_splice($orders, 0, 20);
    return $orders;
}

//This function will return all past orders
function GetAllOrders()
{
    return ReadJSON(OrderFile());
}

//This function will run a query extraction on a list of orders
function ExtractByQuery($orders, $query)
{
    return $orders;
}
//This function will return the trolley of an order
function getOrderTrolley($orderID)
{
    $orders = ReadJSON(OrderFile());
    foreach ($orders as $order) {
        if ($order["ID"] == $orderID) {
            return $order["Trolley"];
        }
    }
    return [];
}

//This public function will mark an order as addressed
function addressOrder($orderID)
{
    $orders = ReadJSON(OrderFile());
    foreach ($orders as $key => $order) {
        if ($order["ID"] == $orderID) {
            $orders[$key]["Seen"] = true;
            WriteJSON(OrderFile(), $orders);
            return true;
        }
    }
    return false;
}
//This function will return a timestamp
function getTimeStamp()
{
    date_default_timezone_set('America/Chicago'); // CDT
    return date('d/m/Y == H:i:s');
}
//This public function will return passcode which is used to validate aurora's controller
function GetPasscode()
{
    $filePath = __DIR__ . "/../json/passcode.json";
    if (!file_exists($filePath)) {
        return null;
    }
    $json = file_get_contents($filePath);
    $data = json_decode($json);
    return $data->passcode ?? null;
}
//This public function will validate administrator privileges
function ValidateController()
{
    if (isset($_POST["passcode"])) {
        if ($_POST["passcode"] != GetPasscode()) {
            1;
            return;
        } else {
            return true;
        }
    } else {
        1;
        return;
    }
}