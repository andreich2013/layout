(function () {
    'use strict';

    angular
        .module('reeldeal')
        .provider('rdConfig', Service);

    /** @ngInject */
    function Service() {

        this.$get = function () {
            return this;
        };

    }

})();
