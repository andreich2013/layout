<?php 
    require_once "views/scripts/deviceDetect.php";
    require_once "views/scripts/markup.php";
    
    /*
     * create Singleton Markup with youthfool data
     */
    $markup = Markup::getInstance();
    
    $markup->setProperty("config", new markup_Simple())
           ->setProperty("fn", new markup_Functions());
    
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
    
    $markup->router->setRoutes()
    
//    $markup->fn->debug($markup);
    
    $js = array(
        "config" => json_encode($markup->config),
        "server" => json_encode(array(
            "referer" => $_SERVER["HTTP_REFERER"],
            "request_uri" => $_SERVER["REQUEST_URI"],
            'request' => $_REQUEST,
            'address' => $_SERVER["SERVER_ADDR"],
        )),
        "session" => json_encode($_SESSION),
    );
    
    
    include ($markup->config->path->root . "/views/layouts/index.php");
?>
