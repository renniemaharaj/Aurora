<?php
include ("aurora-core.php");
if (isset($_POST["passcode"])) {
    if (GetPasscode() == null) {
        $passcode = new stdClass();
        $passcode->passcode = $_POST["passcode"];
        WriteJSON("../json/passcode.json", $passcode);
        echo 0;
        return;
    }
    if ($_POST["passcode"] == GetPasscode()) {
        echo 0;
        return;
    }
}
return "E1";