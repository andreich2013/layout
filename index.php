<?php 
    require_once "app/scripts/Autoloader.php";
    
    $autoloader = new markup_Autoloader();
    $autoloader ->loadFilesFromDir(getenv('DOCUMENT_ROOT') . '/app/scripts/', true)
                ->loadFilesFromDir(getenv('DOCUMENT_ROOT') . '/app/models/', true)
                ->loadFilesFromDir(getenv('DOCUMENT_ROOT') . '/app/controllers/', true)
                ->loadFilesFromDir(getenv('DOCUMENT_ROOT') . '/app/data/', true);
    
    /*
     * create Singleton Markup with youthfool data for markup
     */
    $markup = Markup::getInstance();
    
    $markup->setProperty("config", new markup_Simple())
           ->setProperty("fn", new markup_Functions())
           ->setProperty("router", new markup_Router());
    
    $markup->config->setProperty("url", new markup_Simple())
                   ->setProperty("path", new markup_Simple())
                   ->setProperty("mail", "andreich2013@ukr.net")
                   ->setProperty("language", new markup_Simple());
    
    $markup->config->url->setProperty("host", $_SERVER['HTTP_HOST'])
                        ->setProperty("root", 'http://' . $markup->config->url->host)
                        ->setProperty("upload", $markup->config->url->root . "/upload");
    
    $markup->config->path->setProperty("root", getenv('DOCUMENT_ROOT'))
                         ->setProperty("upload", $markup->config->path->root . "/upload");
    
    $markup->config->language->setProperty("ru", true)
                             ->setProperty("en", false);
    
    $markup->router->setRoutes(array(
        "about" => array(
            "action" => 'static',
            "pattern" => "/^about/",
            "order" => 2,
        ),
        "catalog" => array(
            "action" => 'catalog',
            "pattern" => "/^catalog/",
            "order" => 4,
        ),
        "index" => array(
            "action" => 'index',
            "pattern" => "/^index/",
            "order" => 1,
        ),
    ));
    
//    $markup->fn->debug($markup);
    
    $markup->setProperty("exportToJS", array(
        "config" => json_encode($markup->config),
        "HTTP_REFERER" => json_encode($_SERVER["HTTP_REFERER"]),
        "currentRoute" => $markup->router->getCurrentRoute(),
    ));
    
    $markup->router->dispatch();
?>
