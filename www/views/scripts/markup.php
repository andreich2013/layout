<?php

/*
 * Singleton
 */
class Markup {
    private static $instance;

    private function __construct() { }

    static public function getInstance() {
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
            
            return $files;
        }else {
            return false;
        }
    }
    
}

class markup_Router extends markup_Simple {
    
    public function __construct() 
    {
        
    }
    
    private $routes = array();
    
    public function setRoutes($routes = null) {
        if($routes == null) return;
        
        foreach ($routes as $key=>$value) {
            $this->routes[] = $value;
        }
        
        return $this;
    }
    
    public function deleteRoutes($routes = null) {
        if($routes == null) return;
        
        foreach ($routes as $key=>$value) {
            if(key_exists($value, $this->routes)) {
                unset($this->routes[$value]);
            }
        }
        
        return $this;
    }
    
    public function dispatch() {
        // парсим url, забираем переменные
//        if(strstr($href, $page_number_pref)){ // если в url есть номер страницы пагинатора
//            $page_num_pos = strpos($href, $page_number_pref);
//            $page_num_str = substr($href, $page_num_pos);
//            $page_num = substr($page_num_str,strlen($page_number_pref));    // номер страницы пагинатора
//            $url_new = substr($href,0,$page_num_pos-1);   // новый url без страницы пагинатора
//        }else if(strstr($href, '/show/')){
//            // в общем - я решил, что так проще и надежней...
//            $arr_url = split('/', $href);
//
//            $array['params']['url'] = $arr_url[count($arr_url)-1];
//            $array['params']['page'] = $arr_url[count($arr_url)-3];
//
//            switch($array['params']['page']){
//                case 'news': $url_new = '/news_show'; break;
//                case 'ministries': $url_new = '/ministries_show'; break;
//                case 'home_groups': $url_new = '/home_groups_show'; break;
//                case 'structure': $url_new = '/structure_show'; break;
//                case 'video': $url_new = '/video_show'; break;
//                case 'articles': $url_new = '/articles_show'; break;
//                case 'testemonies': $url_new = '/testemonies_show'; break;
//            }
//
//        }else if($href == '/'){ 
//            $url_new = '/'.$index;
//        }else{ // иначе используем $href
//            $url_new = $href;
//        }
    }
    
}
/*----------------------------------ITEMS-------------------------------------*/

class markup_Items {
    
    public function __construct() 
    {
        
    }
}



?>
