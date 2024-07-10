<?php if (!empty($document['charset'])): ?>
    <meta charset="<?php echo htmlspecialchars($document['charset'], ENT_QUOTES, 'UTF-8'); ?>">
<?php endif ?>
<?php if (!empty($document['title'])): ?>
    <title><?php echo htmlspecialchars($document['title'], ENT_QUOTES, 'UTF-8'); ?></title>
<?php endif; ?>
<?php if (!empty($document['description'])): ?>
    <meta name="description" content="<?php echo htmlspecialchars($document['description'], ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($document['keywords'])): ?>
    <meta name="keywords"
        content="<?php echo htmlspecialchars(implode(',', $document['keywords']), ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($document['author'])): ?>
    <meta name="author" content="<?php echo htmlspecialchars($document['author'], ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($document['viewport'])): ?>
    <meta name="viewport" content="<?php echo htmlspecialchars($document['viewport'], ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($document['canonical'])): ?>
    <link rel="canonical" href="<?php echo htmlspecialchars($document['canonical'], ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($document['favicon'])): ?>
    <link rel="icon" href="<?php echo htmlspecialchars($document['favicon'], ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($document['theme_color'])): ?>
    <meta name="theme-color" content="<?php echo htmlspecialchars($document['theme_color'], ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>
<?php if (!empty($document['robots'])): ?>
    <meta name="robots" content="<?php echo htmlspecialchars($document['robots'], ENT_QUOTES, 'UTF-8'); ?>">
<?php endif; ?>

<?php if ($document['open_graph']['enabled']): ?>
    <?php if (!empty($document['open_graph']['og_title'])): ?>
        <meta property="og:title"
            content="<?php echo htmlspecialchars($document['open_graph']['og_title'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['open_graph']['og_type'])): ?>
        <meta property="og:type"
            content="<?php echo htmlspecialchars($document['open_graph']['og_type'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['open_graph']['og_image'])): ?>
        <meta property="og:image"
            content="<?php echo htmlspecialchars($document['open_graph']['og_image'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['open_graph']['og_url'])): ?>
        <meta property="og:url"
            content="<?php echo htmlspecialchars($document['open_graph']['og_url'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['open_graph']['og_description'])): ?>
        <meta property="og:description"
            content="<?php echo htmlspecialchars($document['open_graph']['og_description'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
<?php endif; ?>
<?php if ($document['twitter_card']['enabled']): ?>
    <?php if (!empty($document['twitter_card']['twitter_card'])): ?>
        <meta name="twitter:card"
            content="<?php echo htmlspecialchars($document['twitter_card']['twitter_card'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['twitter_card']['twitter_site'])): ?>
        <meta name="twitter:site"
            content="<?php echo htmlspecialchars($document['twitter_card']['twitter_site'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['twitter_card']['twitter_creator'])): ?>
        <meta name="twitter:creator"
            content="<?php echo htmlspecialchars($document['twitter_card']['twitter_creator'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['twitter_card']['twitter_title'])): ?>
        <meta name="twitter:title"
            content="<?php echo htmlspecialchars($document['twitter_card']['twitter_title'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['twitter_card']['twitter_description'])): ?>
        <meta name="twitter:description"
            content="<?php echo htmlspecialchars($document['twitter_card']['twitter_description'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
    <?php if (!empty($document['twitter_card']['twitter_image'])): ?>
        <meta name="twitter:image"
            content="<?php echo htmlspecialchars($document['twitter_card']['twitter_image'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endif; ?>
<?php endif; ?>

<?php if (!empty($document['alternate_links'])): ?>
    <?php foreach ($document['alternate_links'] as $link): ?>
        <link rel="alternate" href="<?php echo htmlspecialchars($link['href'], ENT_QUOTES, 'UTF-8'); ?>"
            hreflang="<?php echo htmlspecialchars($link['hreflang'], ENT_QUOTES, 'UTF-8'); ?>">
    <?php endforeach; ?>
<?php endif; ?>
<!--Include Static & Dynamic Styles-->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="../../-template/css/index.css">
<link rel="stylesheet" href="../../-template/css/heavenui.css">
<link rel="stylesheet" href="../../-template/css/controller.css">
<link rel="stylesheet" href="../../-template/css/forms.css">
<?php
$inclusions = new stdClass();
$inclusions->scripts = array();
$inclusions->scripts_php = array();
if (isset($document["Components"])) {
    foreach ($document["Components"] as $component) {
        $dir = "../../-template/components/{$component}/css";
        $scripts = "../../-template/components/{$component}/js";
        $scripts_php = "../../-template/components/{$component}/php";
        if (is_dir($dir)) {
            $files = glob($dir . "/*.css");
            foreach ($files as $file) {
                echo '<link rel="stylesheet" href="' . htmlspecialchars($file, ENT_QUOTES, 'UTF-8') . '">' . PHP_EOL;
            }
        }
        if (is_dir($scripts)) {
            $inclusions->scripts = array_merge($inclusions->scripts, glob($scripts . "/*.js"));
        }
        if (is_dir($scripts_php)) {
            $inclusions->scripts_php = array_merge($inclusions->scripts_php, glob($scripts_php . "/*.php"));
        }
    }
}
?>
<!--Include Static & Dynamic Scripts-->
<script type="text/javascript" src="../../-template/essentials/colouring.js"></script>
<script type="text/javascript" src="../../-template/scripts/js/controller.js"></script>
<script type="text/javascript" src="../../-template/scripts/js/heavenui.js"></script>
<script type="text/javascript" src="../../-template/scripts/js/uploader.js"></script>