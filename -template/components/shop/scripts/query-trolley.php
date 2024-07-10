<?php
include_once ("aurora-core.php");
if (isset($_POST["ID"])) {
    echo json_encode(getOrderTrolley($_POST["ID"]));
    return;
}
echo 1;