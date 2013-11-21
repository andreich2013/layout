<?php
    class markup_Router extends markup_Simple {

        public function __construct($routes = null) 
        {
            parent::__construct();
            
            $this->setRoutes($routes);
        }

        protected $routes = array(
            "404" => array(
                "action" => "page404",
                "title" => "404",
                "order" => 999999,
            ),
        );

        protected $current = false;

        protected function findRoute($routeName) {
            $newRoute = null;

            foreach($this->routes as $item) {
                if($item['title'] == $routeName) {
                    $newRoute = $item;
                }
            }

            return $newRoute;
        }

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

        public function getRoute($routeName = null) {
            if($routes == null) return null;

            return (key_exists($routeName, $this->routes)) ? $this->routes[$routeName] : null;
        }

        public function getRoutePath($routeName = null) {
            if($routeName == null) return null;

            $route = $this->findRoute($routeName);

            return !!$route['url'] ? $route['url'] : null;
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
                    $this->routes[$key]["title"] = $key;
                }
            }

            usort($this->routes, function($a, $b) {
                return ($a["order"] < $b["order"]) ? -1 : 1;
            });

            return $this;
        }

        public function getCurrentRoute() {
            return $this->current;
        }

        public function getCurrentPage() {
            return $this->current["title"];
        }

        public function dispatch() {
            $url = substr($_SERVER["REQUEST_URI"], 1);

            if(strstr($url, "?")) {
                $url = substr($url, 0, strpos($url, "?"));
            }

            foreach($this->routes as $key=>$item) {
                if($url == "" && $item["title"] == "index") {
                    $this->current = $item;
                    break;
                }

                if(!!$item["pattern"] && preg_match($item["pattern"], $url)) {
                    $this->current = $item;
                    break;
                }
            }

            if(!$this->current) {
                $this->currentRouteName = "404";
                $this->current = $this->routes[count($this->routes)-1];
            }

            $controller = new markup_FrontendController($this->current);
            $controller->{$this->current["action"] . 'Action'}();
        }
    }
?>