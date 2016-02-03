(function () {
    'use strict';

    angular
        .module('reeldeal')
        .factory('rdTopNav', Service);

    /** @ngInject */
    function Service($rootScope, rdEvents) {

        this.$get = function () {
            return this;
        };

        var data = [
                {
                    label: "Home",
                    state: 'rd.home'
                },
                {
                    label: 'Grid/List',
                    state: 'rd.grid-list'
                },
                {
                    label: 'Table',
                    state: 'rd.table'
                },
                //{
                //    lable: 'Source',
                //    url: 'https://github.com/andreich2013/layout'
                //}
            ];

        this.setData = function(list) {
            data = !!list ? list : undefined;

            $rootScope.$emit(rdEvents.TOP_NAV_DATA_CHANGED, data);
        };

        this.getData = function() {
            return data;
        };

        return this;

    }

})();
