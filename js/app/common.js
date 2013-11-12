var device = new determinesDevice();

/*
 * Normalized hide address bar for iOS & Android
 * (c) Scott Jehl, scottjehl.com
 * MIT License
 */
if( !!device.touch ) {
    (function( win ){
        var doc = win.document;

        // If there's a hash, or addEventListener is undefined, stop here
        if( !location.hash && win.addEventListener ){

            //scroll to 1
            window.scrollTo( 0, 1 );
            var scrollTop = 1,
                    getScrollTop = function(){
                            return win.pageYOffset || doc.compatMode === "CSS1Compat" && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
                    },

                    //reset to 0 on bodyready, if needed
                    bodycheck = setInterval(function(){
                            if( doc.body ){
                                    clearInterval( bodycheck );
                                    scrollTop = getScrollTop();
                                    win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
                            }	
                    }, 15 );

            win.addEventListener( "load", function(){
                    setTimeout(function(){
                            //at load, if user hasn't scrolled more than 20 or so...
                            if( getScrollTop() < 20 ){
                                    //reset to hide addr bar at onload
                                    win.scrollTo( 0, scrollTop === 1 ? 0 : 1 );
                            }
                    }, 0);
            } );
        }
    })( this );
}

// не работает в ie8
lib.addEvent(document, 'DOMContentLoaded', function() {
    
});

$(document).on('ready', function() {
    
    device.decorateHtml();

    window.hidePagePreloader = (function() {
        var preloader = lib.get(".page-preloader", null, true),
            isHidden = false;
            
        return function() {
            if(!!preloader && !isHidden) {
                preloader.style.display = 'none';
                isHidden = true;
            }
        }
    })();
    
});

lib.addEvent(window, 'load', function() {
    hidePagePreloader();
});

lib.addEvent(window, 'resize', function() {
    
});