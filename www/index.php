<?php 
    require_once "views/scripts/deviceDetect.php";
    require_once "views/scripts/markup.php";
    
    /*
     * create Singleton Markup with yothfool data
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
    
//    $markup->fn->debug($markup);
    
    include ($markup->config->path->root . "/views/layouts/index.php");
?>
