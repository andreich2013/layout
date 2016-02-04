(function() {
    'use strict';

    /**
     * namespace "bl" - base layout
     */
    angular
        .module('baselayout', [
            'ngCookies',
            'ngSanitize',
            'ui.router',
            'ngMaterial',

            'bl.common'
        ]);

})();
