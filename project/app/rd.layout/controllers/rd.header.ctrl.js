(function () {
    'use strict';

    angular
        .module('reeldeal')
        .controller('rd.header.ctrl', Controller);

    /** @ngInject */
    function Controller($scope, rdEvents, $mdSidenav, $mdBottomSheet, rdTopNav, $log) {

        $scope.links = rdTopNav.getData();

        $scope.search = '';

        $scope.searchBlock = {
            isVisible: false,
            toggle: function() {$log.debug(this);
                this.isVisible = !this.isVisible;
            }
        };

        $scope.toggleSideRight = function() {
            $mdSidenav('right').toggle();
        };

        $scope.showBottomSheet = function() {
            $mdBottomSheet.show({
                controller: 'rd.bottomSheet.ctrl',
                templateUrl: 'rd.layout/templates/bottom-sheet.html'
            });
        };

        $scope.$on(rdEvents.TOP_NAV_DATA_CHANGED, function(data) {
            $scope.links = data;
        });

    }

})();
