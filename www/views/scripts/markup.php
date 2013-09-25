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
            
            return $files;
        }else {
            return false;
        }
    }
    
}


/*----------------------------------ITEMS-------------------------------------*/

class markup_Items {
    
    public function __construct() 
    {
        
    }
}



?>
