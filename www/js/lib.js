/*
 * library
 * 
 * @returns {object}
 */
window.lib = (function() {
    
    // some calculating
    
    return {
    
        touch: !!('ontouchstart' in window) ||
               !!(('msMaxTouchPoints' in window.navigator) && !('onmouseover' in window)),

        /*
        * @param {object} window.event
        * 
        * @returns {window.event}
        *
        * crossbrowser window.event
        */
        fixEvent: function(e) {
            e = e || window.event;

            if ( e.isFixed ) { return e; }

            var body, doc;

            e.preventDefault =  e.preventDefault || function(){ 
                this.returnValue = false;
                this.cancelBubble = true;
                if ( e.stopPropagation ) e.stopPropagation();
            };

            // Support: IE<9
            if ( !e.target ) {
                e.target = e.srcElement || document;
            }

            // Support: Chrome 23+, Safari?
            if ( e.target.nodeType === 3 ) {
                e.target = e.target.parentNode;
            }

            // Support: IE<9
            e.metaKey = !!e.metaKey;

            // Add relatedTarget, if necessary
            if ( !e.relatedTarget && e.fromElement ) {
                e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement;
            }

            // Calculate pageX/Y if missing and clientX/Y available
            if ( e.pageX == null && e.clientX != null ) {

                doc = document.documentElement,
                body = document.body;

                e.pageX = e.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                e.pageY = e.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );

            }

            // Add which for click: 1 === left; 2 === middle; 3 === right
            // Note: button is not normalized, so don't use it
            if ( !e.which && e.button !== undefined ) {
                e.which = ( e.button & 1 ? 1 : ( e.button & 2 ? 3 : ( e.button & 4 ? 2 : 0 ) ) );
            }

            // Add which for key events
            if ( !e.which ) {
                e.which = e.charCode != null ? e.charCode : e.keyCode;
            }

            e.time = (new Date).getTime();

            e.isFixed = true;

            return e;
        },

        getStyle: function( elem ) {
            return elem.currentStyle || window.getComputedStyle(elem, null);
        },

        get: function(query, elem) {
            return (elem || document).querySelectorAll(query);
        },

        getFirst: function(query, elem) {
            return (elem || document).querySelector(query);
        },

        /*
        * params @elem type 
        * params @parent type 
        * 
        * return type boolean
        * 
        * determines is @parent parentNode of @elem
        */
        isParent: function(elem, parent) {
           while(elem.parentNode !== null){
               if(elem.parentNode === parent) return true;

               elem = elem.parentNode;
           }

           return false;
       },

       /*
        * params @elem type 
        * 
        * return type @object object
        * 
        * determines type of @elem
        */
        typeOf: function(elem) {
           var responce = {
               simple: false,
               object: false
           }
           var toClass = {}.toString;

           switch(typeof elem) {
               case "string":
                   responce.simple = "string";
                   break;
               case "number":
                   responce.simple = "number";
                   break;
               case "boolean":
                   responce.simple = "boolean";
                   break;
               case "undefined":
                   responce.simple = "undefined";
                   break;
               case "function":
                   responce.object = "function";
                   break;
               case "object":
                   var elemType = toClass.call(elem).slice(8, -1).toLowerCase();

                   switch(elemType) {
                       case "object":
                           responce.object = "object";
                           break;
                       case "number":
                           responce.object = "number";
                           break;
                       case "string":
                           responce.object = "string";
                           break;
                       case "function":
                           responce.object = "function";
                           break;
                       case "array":
                           responce.object = "array";
                           break;
                       case "date":
                           responce.object = "date";
                           break;
                       case "null":
                           responce.simple = "null";
                           break;
                       default:
                           responce.object = "object";
                   }

                   if(elemType.indexOf('html') != -1) {
                       responce.object = "HTML";
                   }

                   break;
           }

           return responce;
       }
   }
    
})();

/*
 * depends on matchMedia.js
 * 
 * Singleton
 * 
 * @returns {window.determinesDevice.responce}
 */
(function(matchMedia) {
    var instance;
    window.determinesDevice = function() {
        if (typeof instance !== 'undefined')
            return instance;
        
        var responce = {},
            ua = navigator.userAgent,
            patterns = {
                device: {
                    isIPad: /iPad/i,
                    isIPhone: /iPhone/i,
                    isIPod: /iPod/i,
                    isBlackBerry: /BlackBerry/i,
                    isIEMobile: /IEMobile/i,
                    isAndroid: /Android/i
                },
                browser: {
                    opera: /Opera[ \/]+\w+\.\w+/i,  
                    firefox: /Firefox\/\w+\.\w+/i,     
                    chrome: /Chrome\/\w+\.\w+/i,   
                    ie: /MSIE *\d+\.\w+/i,       
                    safari: /Safari\/\w+\.\w+/i
                }
            }
            
        responce.touch = !!('ontouchstart' in window) ||
                         !!(('msMaxTouchPoints' in window.navigator) && !('onmouseover' in window));  
        
        if ( responce.touch ) {
            responce.type = ( matchMedia('only screen and (max-device-width: 640px) and (max-device-height: 640px)').matches ) 
                                ? "mobile" : "tablet";
        } else {
            responce.type = "desktop";
        }

        for (var i in patterns.device) {
            responce[i] = ua.match(patterns.device[i]) != null;
        }

        if(responce.isAndroid) {
            responce.deviceVersion = parseFloat(ua.slice(ua.indexOf("Android")+8));
        }
        
        for (var j in patterns.browser) {
            if(ua.match(patterns.browser[j])) {
                responce.browser = j;
                break;
            }
        }

        responce.decorateHtml = function () {
            $("body").addClass(responce.browser)
                     .addClass(responce.type);

             if(responce.isIPad) $("body").addClass("isIPad");
             if(responce.isIPhone) $("body").addClass("isIPhone");
             if(responce.isIPod) $("body").addClass("isIPod");
             if(responce.isBlackBerry) $("body").addClass("isBlackBerry");
             if(responce.isIEMobile) $("body").addClass("isIEMobile");
             if(responce.isAndroid) $("body").addClass("isAndroid");
        }
        
        return instance = responce;
    };
})(window.matchMedia);

/*
 * functions depends on jQuery 1.x
 */ 
if(window.jQuery) {
    (function($) {
        
        window.$lib = {
            centured: {
                height: function(elem,wrapper){ 
                    return ($(wrapper).outerHeight() - $(elem).outerHeight())/2;
                },
                width: function(elem,wrapper){ 
                    return ($(wrapper).outerWidth() - $(elem).outerWidth())/2;
                }        
            },

            /*
             * 
             * @param {type} opt = {
             *                          url: "string",
             *                          params: object/array,
             *                          callback: function,
             *                          debug: boolean
             *                     }
             * @returns {undefined}
             */
            ajaxLoad: function(opt){
                opt.debug = opt.debug || false;
                
                if(opt.debug) console.log(params);
                
                $.ajax({
                    url: opt.url, 
                    type: "POST",
                    dataType: 'json',
                    data: opt.params,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if(opt.debug) {
                            console.log(errorThrown);
                            console.log(textStatus);
                            console.log(XMLHttpRequest);
                        }
                    },
                    success: function (data, textStatus) { 
                        if(opt.debug) console.log(data);
                        
                        if(!!opt.callback && typeof opt.callback === "function") 
                            opt.callback(data);
                        
                    }               
                });
            }
        }
    })(window.jQuery);
}

/*
 * functions depends on jQuery 1.x, Modernizr 2.x
 */
if(window.Modernizr && window.jQuery) {
    (function(Modernizr, $) {
        
        window.GracefulDegradation = {
            
            validate: function(form) {
            
                if(Modernizr.input.required) return;

                var elements = $(form).find(".formElement"),
                    required = [],
                    errors = [];


                elements.each(function() {

                    if(!!$(this).attr("required")) {
                        if($(this).val().length == 0 ||
                           $(this).val() == $(this).attr("data")) required.push($(this).attr("name"));
                    }

                    var regExp = $(this).attr("pattern");

                    if(!!regExp) {
                        if(!new RegExp(regExp.toString()).test($(this).val().toString())) errors.push($(this).attr("name"));
                    }
                });

                return {
                    required: required,
                    errors: errors
                }
            }
            
        }
        
    })(window.Modernizr, window.jQuery)
}