(function () {
    'use strict';

    angular
        .module('baselayout')
        .config(Config);

    /** @ngInject */
    function Config($stateProvider, $locationProvider, $urlRouterProvider) {

        $stateProvider
            .state({
                abstract: true,
                name: 'rd',
                views: {
                    '@': {
                        templateUrl: 'bl.layout/templates/layout.html',
                        controller: 'bl.layout.ctrl'
                    },
                    'top@rd': {
                        templateUrl: 'bl.layout/templates/header.html',
                        controller: 'bl.header.ctrl'
                    },
                    'left@rd': {
                        templateUrl: 'bl.layout/templates/left-side.html',
                        controller: 'bl.leftSide.ctrl'
                    },
                    'right@rd': {
                        templateUrl: 'bl.layout/templates/right-side.html',
                        controller: 'bl.rightSide.ctrl'
                    }
                }
            })
            .state({
                parent: 'rd',
                name: '404',
                url: '/404',
                templateUrl: 'bl.layout/templates/404.html',
                controller: 'bl.404.ctrl'
            });

        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/404');
    }

})();
