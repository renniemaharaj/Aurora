<?php
include ("aurora-core.php");

if (ValidateController()) {
    $orders;

    //If lookup then pass order records hystory
    if (isset($_POST["lookup"]) && $_POST["lookup"] == "true") {
        $orders = GetAllOrders();
    }

    //If !lookup Then get only unseen
    if (isset($_POST["lookup"]) && $_POST["lookup"] == "false") {
        $orders = GetUnseenOrders();
    }

    //Return queried result
    if (isset($_POST["query"])) {
        echo json_encode(ExtractByQuery($orders, $_POST["query"]));
    }
}