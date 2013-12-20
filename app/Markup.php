<?php

/*
 * Singleton
 */
class Markup {
    private static $instance;

    private static $currentPage;

    private function __construct() {
        self::$urlRoot = 'http://' . $_SERVER['HTTP_HOST'];
        self::$pathRoot = getenv('DOCUMENT_ROOT');
    }
    
    public static $urlRoot = '';
    
    public static $pathRoot = '';
    
    public static function getInstance() {
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
    
    public static function getFilesFromDir($dir) {
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

    public static function debug($data, $exit = true) {
        echo "<pre>";
        print_r($data);
        echo "</pre>";

        if($exit) {
            exit();
        }
    }

    public static function setPage($page) {
        self::$currentPage = $page;
    }
    
    public static function getPage() {
        return self::$currentPage;
    }
    
    /**
     * rendering only from dir '/app/helpers'
     */
    public static function render( $file, $context=null ) {
        ob_start();

        include self::$pathRoot . '/app/helpers/' . $file;
        $content = ob_get_contents();

        ob_end_clean();

        return $content;
    }
    
    public function sentHeaders() {
        $expiresDate = new DateTime();
        $expiresDate->modify('+7 days');
        header("Cache-Control: private, max-age=3600");
        header("Expires: " . $expiresDate->format("D, d M Y H:m:s GMT"));
    }

    public static function redirect($url = null) {
        if($url == null) return;

        $this->sentHeaders();

        header("Location: " . $url);
    }
}

/**
 * Markup initialised
 */
Markup::getInstance();

?>
