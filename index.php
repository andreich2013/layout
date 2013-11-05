<?php 
    require_once "views/scripts/deviceDetect.php";
    require_once "views/scripts/markup.php";
    
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
            "path" => $markup->config->path->root . "/views/layouts/static.php",
            "pattern" => "/^about/",
            "order" => 2,
        ),
        "catalog" => array(
            "path" => $markup->config->path->root . "/views/layouts/catalog.php",
            "pattern" => "/^catalog/",
            "order" => 4,
        ),
        "product" => array(
            "path" => $markup->config->path->root . "/views/layouts/catalog.php",
            "pattern" => "/^catalog\/(\d+)/",
            "order" => 3,
        ),
        "index" => array(
            "path" => $markup->config->path->root . "/views/layouts/index.php",
            "pattern" => "/^ololo/",
            "order" => 1,
        ),
    ));
    
//    $markup->fn->debug($markup);
    
    $markup->setProperty("exportToJS", array(
        "config" => json_encode($markup->config),
        "REQUEST" => json_encode($_REQUEST),
        "REQUEST_URI" => json_encode($_SERVER["REQUEST_URI"]),
        "REQUEST_TIME" => json_encode($_SERVER["REQUEST_TIME"]),
        "HTTP_REFERER" => json_encode($_SERVER["HTTP_REFERER"]),
        "router" => json_encode(array(
            "routes" => $markup->router->getRoutes(),
            "currentRoute" => $markup->router->getCurrentRoute(),
        )),
    ));
    
    $markup->router->dispatch();
?>
