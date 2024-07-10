<?php include_once ("i-config.php") ?>
<!DOCTYPE html>
<html lang="<?php echo htmlspecialchars($document['language'], ENT_QUOTES, 'UTF-8'); ?>">

<!-- Head file will iterate through component folders for css and record other files-->

<head>
    <?php include_once ("../../-template/essentials/head.php") ?>
</head>

<style>
    html {
        scroll-behavior: smooth;
    }
</style>
<!-- Dynamically componenets's bodies -->

<body>
    <?php
    //Component bodies would have already been recorded
    foreach ($inclusions->scripts_php as $script_dir) {
        include_once ($script_dir);
    }
    ?>
</body>
<!-- Dynamically load scripts -->

<?php
//Scripts would have already been recorded
foreach ($inclusions->scripts as $script_dir) {
    echo '<script type="text/javascript" src="' . htmlspecialchars($script_dir, ENT_QUOTES, 'UTF-8') . '"></script>' . PHP_EOL;
}
?>
<!--Apply configuration's pallete-->
<script>
    //Website configuration
    let Configuration;
    //HTML request function
    function sendAwait(e, t) {
        return new Promise((n, i) => {
            let a = new Object(),
                s = new XMLHttpRequest();
            s.open("POST", e),
                (s.data = JSON.stringify(a)),
                s.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
                (s.onloadend = () => {
                    n(s.responseText);
                }),
                s.send(t);
        });
    }
    sendAwait("scripts/read-config.php").then(configuration => {
        configuration = JSON.parse(configuration);
        Configuration = configuration;
        ApplyColouring(configuration);
    })
</script>

</html>