(function() {
    'use strict';

    angular
        .module('baselayout')
        .constant('rdEvents', {
            CONTEXT_CHANGED: 'contextChanged',
            TOP_NAV_DATA_CHANGED: 'topNavDataChanged'
        });

})();
