<?php
    class markup_Simple {
    
        public $app = '';
        public $models = '';
        public $controllers = '';
        public $views = '';

        public function __construct() 
        {
            // define path
            $this->app = getenv('DOCUMENT_ROOT') . '/app';
            $this->models = $this->app . '/models';
            $this->controllers = $this->app . '/controllers';
            $this->views = $this->app . '/views';
        }

        public function setProperty( $key, $val ) {
            $this->$key = $val;
            return $this;
        }

        public function getProperty( $key ) {
            return $this->$key;
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

        public function debug($data, $exit = true) {
            echo "<pre>";
            print_r($data);
            echo "</pre>";

            if($exit) {
                exit();
            }
        }

        public function render( $file, $context=null ) {
            ob_start();

            include $file;
            $content = ob_get_contents();

            ob_end_clean();

            return $content;
        }
    }
?>