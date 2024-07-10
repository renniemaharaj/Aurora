<?php
include ("aurora-core.php");

if (ValidateController()) {
    $products = LoadProducts();
    //Make sure ID was included
    if (isset($_POST["ID"])) {
        if (RemoveProduct($_POST["ID"], $products)) {
            echo 0;
            return;
        }
        echo "E1";
    }
}