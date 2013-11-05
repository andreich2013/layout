/*
 * customised by Andrey Vakhrushev andreich2013@ukr.net
 */

/* This function makes a div scrollable with android and iphone */ 
function isTouchDevice() { /* Added Android 3.0 honeycomb detection because touchscroll.js breaks the built in div scrolling of android 3.0 mobile safari browser */
    if ((navigator.userAgent.match(/android 3/i)) || (navigator.userAgent.match(/honeycomb/i))) {
        return false;
    } else {
        return !!('ontouchstart' in window) ||
               !!(('msMaxTouchPoints' in window.navigator) && !('onmouseover' in window));
    }
}
function touchScroll(id) {
    if (isTouchDevice()) {
        //if touch events exist... 
        var elem = document.getElementById(id),
            scrollStartPosY = 0,
            scrollStartPosX = 0,
            eventTouch = {
                start: !!(navigator.userAgent.match(/IEMobile/i)) ? "MSPointerDown" : "touchstart",
                move: !!(navigator.userAgent.match(/IEMobile/i)) ? "MSPointerMove" : "touchmove"
            }

        if(elem !== null) {
        
            elem.addEventListener(eventTouch.start, function(event) {
                var point = event.touches ? event.touches[0] : event;

                scrollStartPosY = this.scrollTop + point.pageY;
                scrollStartPosX = this.scrollLeft + point.pageX;
                
                //event.preventDefault(); 
                // Keep this remarked so you can click on buttons and links in the div 
            }, false);
            
            elem.addEventListener(eventTouch.move, function(event) {
                var point = event.touches ? event.touches[0] : event;
                
                // These if statements allow the full page to scroll (not just the div) if they are 
                // at the top of the div scroll or the bottom of the div scroll 
                // The -5 and +5 below are in case they are trying to scroll the page sideways 
                // but their finger moves a few pixels down or up. The event.preventDefault() function 
                // will not be called in that case so that the whole page can scroll. 
                if ((this.scrollTop < this.scrollHeight - this.offsetHeight && this.scrollTop + point.pageY < scrollStartPosY - 5) ||
                    (this.scrollTop != 0 && this.scrollTop + point.pageY > scrollStartPosY + 5)) {
                    event.preventDefault();
                    
                }
                    
                if ((this.scrollLeft < this.scrollWidth - this.offsetWidth && this.scrollLeft + point.pageX < scrollStartPosX - 5) ||
                    (this.scrollLeft != 0 && this.scrollLeft + point.pageX > scrollStartPosX + 5)) {
                    event.preventDefault();
                    
                }

                this.scrollTop = scrollStartPosY - point.pageY;
                this.scrollLeft = scrollStartPosX - point.pageX;
            }, false);
        }
    }
}
