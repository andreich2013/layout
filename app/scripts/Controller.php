<?php

class markup_Controller extends markup_Simple {
    
    public function __construct() {
        parent::__construct();
    }
    
    public function render( $file, $context=null ) {
        $view = $this->views . '/' . $file;

        return parent::render($view, $context);
    }
    
}
