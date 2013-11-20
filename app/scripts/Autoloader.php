<?php
    class markup_Autoloader {

        public function __construct() 
        {

        }

        private function isFilePHP($file) {
            return filetype($file) != dir && preg_match('/\.php$/', $file);
        }

        protected function getAllFromDir($dir) {
            if (!is_dir($dir)) {
                return false;
            }

            $files = array();

            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    array_push($files, $file);
                }
                closedir($dh);
            }

            unset($files[0]);
            unset($files[1]);

            if(is_array($files)) {
                sort($files);
            }

            return $files;
        }

        public function getFilesFromDir($dir) {
            $files = $this->getAllFromDir($dir);

            if(!$files) {
                return;
            }

            $filesPHP = array();

            foreach ($files as $file) {
                if(is_dir($dir . $file)) {
                    $filesPHP[$file] = $this->getFilesFromDir($dir . $file . '/');
                    continue;
                }

                if($this->isFilePHP($dir . $file)) {
                    array_push($filesPHP, $dir . $file);
                }
            }

            return $filesPHP;

        }

        public function loadFilesFromDir($dir, $once = false) {

            $files = $this->getAllFromDir($dir);

            if(!$files) {
                return;
            }

            foreach ($files as $file) {
                if(is_dir($dir . $file)) {
                    $this->loadFilesFromDir($dir . $file . '/');
                    continue;
                }

                if($this->isFilePHP($dir . $file)) {
                    (!!$once) ? require_once $dir . $file : include $dir . $file;
                }
            }

        }

        protected function loadFiles($files = array()) {

            if(count($files) == 0) return;

            foreach($files as $file) {
                if(!!$file['once']) {
                    require_once $file['file'];
                } else {
                    include $file['file'];
                }

            }

        }

    }
?>