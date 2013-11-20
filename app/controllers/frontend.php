<?php

class markup_FrontendController extends markup_Controller {
    
    protected $currentRoute = null;
    
    public function __construct($currentRoute) {
        parent::__construct();
        
        $this->currentRoute = $currentRoute;
    }
    
    public function indexAction() {

        $model = new markup_IndexModel();

        echo $this->render($model->layout, $model);
    }
    
    public function catalogAction() {

        $model = new markup_CatalogModel();

        echo $this->render($model->layout, $model);
    }
    
    public function staticAction() {

        $model = new markup_StaticModel();

        echo $this->render($model->layout, $model);
    }
    
    
    
}

