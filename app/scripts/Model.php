<?php
    class markup_Model extends markup_Simple {
        
        public $layout = '';
        
        public function __construct() {
            parent::__construct();
        }
        
        public function render( $file, $context=null ) {
            $view = $this->views . '/' . $file;

            return parent::render($view, $context);
        }
    }
?>