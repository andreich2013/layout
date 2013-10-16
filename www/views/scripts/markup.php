<?php

/*
 * Singleton
 */
class Markup {
    private static $instance;

    private function __construct() { }

    public function getInstance() {
        if ( empty( self::$instance ) ) {
            self::$instance = new Markup();
        }
        return self::$instance;
    }

    public function setProperty( $key, $val ) {
        $this->$key = $val;
        return self::$instance;
    }

    public function getProperty( $key ) {
        return $this->$key;
    }
}

class markup_Simple {
    
    public function __construct() 
    {
        
    }

    public function setProperty( $key, $val ) {
        $this->$key = $val;
        return $this;
    }

    public function getProperty( $key ) {
        return $this->$key;
    }
}

class markup_Functions extends markup_Simple {
    
    public function __construct() 
    {
        
    }
    
    public function deBug($data) {
        echo "<pre>";
        print_r($data);
        echo "</pre>";
        exit();
    }
    
    public function getFilesFromDir($dir) {
        if (is_dir($dir)) {
            $files = array();
            
            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    if(filetype($dir . $file) != dir) array_push($files, $file);
                }
                closedir($dh);
            }
            
            sort($files);
            
            return $files;
        }else {
            return false;
        }
    }
    
}

/*---------------------------------ROUTER-------------------------------------*/

class markup_Router extends markup_Simple {
    
    public function __construct($routes = null) 
    {
        $this->setRoutes($routes);
    }
    
    protected $routes = array();
    
    public function getRoutes($routes = null) {
        if($routes == null || count($routes) == 0) {
            return $this->routes;
        }
        
        $responce = array();
        
        if(count($routes) > 0) {
            foreach ($routes as $item) {
                if(key_exists($item, $this->routes)) {
                    $responce[] = $item;
                }
            }
        }
        
        return (count($responce) > 0) ? $responce : false;
    }
    
    public function deleteRoutes($routes = null) {
        if($routes == null || count($routes) == 0) {
            $this->routes = array();
        }
        
        if(count($routes) > 0) {
            foreach ($routes as $item) {
                if(key_exists($item, $this->routes)) {
                    unset($this->routes[$item]);
                }
            }
        }
        
        return $this;
    }
    
    public function setRoutes($routes = null) {
        if($routes == null || count($routes) == 0) {
            return;
        }
        
        if(count($routes) > 0) {
            foreach ($routes as $key => $value) {
                $this->routes[$key] = $value;
            }
        }
        
        return $this;
    }
    
    public function dispatch() {
        $page = $this->routes[0];
        
        include ($page);
    }
}

/*----------------------------------ITEMS-------------------------------------*/

class markup_Items {
    
    public function __construct() 
    {
        
    }
}



?>
