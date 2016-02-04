(function () {
    'use strict';

    angular
        .module('baselayout')
        .provider('rdContext', Service);

    /** @ngInject */
    function Service() {

        this.$get = function () {
            return this;
        };

    }

})();
