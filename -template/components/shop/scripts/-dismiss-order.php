<?php
include ("aurora-core.php");
if (ValidateController()) {
    if (isset($_POST["ID"])) {
        if (addressOrder($_POST["ID"])) {
            echo 0;
            return;
        }
    }
    echo 1;
}