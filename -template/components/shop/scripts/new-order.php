<?php
include_once ("aurora-core.php");
if (isset($_POST["order"])) {
    echo AddOrder(json_decode($_POST["order"], true));
} else {
    echo "E1";
}