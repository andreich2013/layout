(function () {
    'use strict';

    angular
        .module('reeldeal')
        .config(Config);

    /** @ngInject */
    function Config($stateProvider, $locationProvider, $urlRouterProvider) {

        $stateProvider
            .state({
                abstract: true,
                name: 'rd',
                views: {
                    '@': {
                        templateUrl: 'rd.layout/templates/layout.html',
                        controller: 'rd.layout.ctrl'
                    },
                    'top@rd': {
                        templateUrl: 'rd.layout/templates/header.html',
                        controller: 'rd.header.ctrl'
                    },
                    'left@rd': {
                        templateUrl: 'rd.layout/templates/left-side.html',
                        controller: 'rd.leftSide.ctrl'
                    },
                    'right@rd': {
                        templateUrl: 'rd.layout/templates/right-side.html',
                        controller: 'rd.rightSide.ctrl'
                    }
                }
            })
            .state({
                parent: 'rd',
                name: '404',
                url: '/404',
                templateUrl: 'rd.layout/templates/404.html',
                controller: 'rd.404.ctrl'
            });

        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/404');
    }

})();
