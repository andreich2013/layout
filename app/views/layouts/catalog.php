<?php $markup = Markup::getInstance();?>
<!DOCTYPE HTML>
<html>
    <head>
        <?php echo $this->render('helpers/head.php');?>
    </head>
    <body>
        <main>
            <?php echo $this->render('helpers/page-preloader.php');?>
            <header>

            </header>
            <div id="content">
                <?php 
                    echo $context->layout;
                ?>
            </div>
            <footer>
                
            </footer>
        </main>
    </body>
</html>