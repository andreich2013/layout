<!DOCTYPE HTML>
<html>
    <head>
        <?php include ($markup->config->path->root . "/views/helpers/head.php")?>
    </head>
    <body>
        <main>
            <header>

            </header>
            <div id="content">
                <?php 
                    $page = $markup->router->getCurrentPage();
//                    $markup->fn->debug($page);
                    if($page == "catalog") {
                        echo "каталог";
                    } else if($page == "product") {
                        echo "продукт";
                    }
                ?>
                каталог
            </div>
            <footer>
                
            </footer>
        </main>
    </body>
</html>