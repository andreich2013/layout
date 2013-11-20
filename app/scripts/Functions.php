<?php
    class markup_Functions extends markup_Simple {

        public function __construct() 
        {
            parent::__construct();
        }

        public function debug($data, $exit = true) {
            echo "<pre>";
            print_r($data);
            echo "</pre>";

            if($exit) {
                exit();
            }
        }

        public function getFilesFromDir($dir) {
            if (!is_dir($dir)) {
                return false;
            }

            $files = array();

            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    if(filetype($dir . $file) != dir) array_push($files, $file);
                }
                closedir($dh);
            }

            sort($files);

            return $files;
        }

    }
?>