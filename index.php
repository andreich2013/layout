<?php require_once 'app/Markup.php';?>
<?php Markup::setPage('index');?>
<!DOCTYPE HTML>
<html>
    <head>
        <?= Markup::render('head.php');?>
    </head>
    <body>
        <?= Markup::render('page-preloader.php');?>
        <main>
            <header>

            </header>
            <div id="content">
                <div class='test'></div>
            </div>
            <footer>
                
            </footer>
        </main>
    </body>
</html>

