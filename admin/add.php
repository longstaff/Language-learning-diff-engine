<?php
// See: http://blog.ircmaxell.com/2013/02/preventing-csrf-attacks.html

// Start a session (which should use cookies over HTTP only).
session_start();

$_SESSION['admin'] = true;

// Create a new CSRF token.
if (! isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = base64_encode(openssl_random_pseudo_bytes(32));
}

if (isset($_SESSION['admin'])) {
    // Create a new CSRF token.
    if (! isset($_SESSION['admin_token'])) {
        $_SESSION['admin_token'] = base64_encode(openssl_random_pseudo_bytes(32));
    }
}
else{
    //Clear token
    unset($_SESSION['admin_token']);
}
?>

<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1; maximum-scale=1.0; user-scalable=no">

        <link rel="stylesheet" href="../css/normalize.css">
        <link rel="stylesheet" href="../css/main.css">
        <link rel="manifest" href="manifest.json">
        <script src="../js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>

        <header>
        </header>

        <section class="page" data-hook="page">

            <div class="diff" data-hook="add-view"></div>

        </section>

        <input type="hidden" data-hook="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>" />
        <?php if (isset($_SESSION['admin'])): ?>
        <input type="hidden" data-hook="admin_token" value="<?php echo $_SESSION['admin_token']; ?>" />
        <?php endif; ?>

        <script src="../js/require.js" data-main="../js/new_main.js"></script>
    </body>
</html>
