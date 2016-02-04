(function () {
    'use strict';

    angular
        .module('baselayout')
        .provider('rdConfig', Service);

    /** @ngInject */
    function Service() {

        this.$get = function () {
            return this;
        };

    }

})();
