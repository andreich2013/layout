(function () {
    'use strict';

    angular
        .module('reeldeal')
        .provider('rdContext', Service);

    /** @ngInject */
    function Service() {

        this.$get = function () {
            return this;
        };

    }

})();
