/**
 * library
 */
var lib = (function(win, doc) {
    
    var pattern = {
        space: /\s+/
    },
    
    isTouch = !!('ontouchstart' in win) ||
              !!(('msMaxTouchPoints' in win.navigator) && !('onmouseover' in win)),
      
    html = doc.documentElement,
    body = doc.body || html.body;
    
    function getObjectType(elem) {
        return {}.toString.call(elem).slice(8, -1).toLowerCase();
    }
    
    return {
    
        touch: isTouch,
        
        // date
        
        getTime: (function() {
            
            function _native() {
                return win.Date.now;
            }
            
            function emulate() {
                return new win.Date().getTime();
            }
            
            return ('now' in win.Date) ? _native : emulate;
        }),
        
        // events

        fixEvent: function(e) {
            e = e || win.event;

            if ( e.isFixed ) { return e; }

            e.preventDefault =  e.preventDefault || function(){ 
                this.returnValue = false;
                this.cancelBubble = true;
                if ( e.stopPropagation ) e.stopPropagation();
            };

            // Support: IE<9
            if ( !e.target ) {
                e.target = e.srcElement || doc;
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

                e.pageX = e.clientX + ( html && html.scrollLeft || body && body.scrollLeft || 0 ) - ( html && html.clientLeft || body && body.clientLeft || 0 );
                e.pageY = e.clientY + ( html && html.scrollTop  || body && body.scrollTop  || 0 ) - ( html && html.clientTop  || body && body.clientTop  || 0 );

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

            e.time = (new win.Date).getTime();

            e.isFixed = true;

            return e;
        },

        addEvent: (function(){
            
            function _native(el, event, fn) {
                el.addEventListener(event, fn, false);
            }
            
            function emulate(el, event, fn) {
                el.detachEvent('on'+ event, function(e) {
                    fn.call(el, e);
                });
                el.attachEvent('on'+ event, function(e) {
                    fn.call(el, e);
                });
            }
            
            function old(el, event, fn) {
                el['on'+ event] = fn;
            }
            
            if('addEventListener' in win) {
                return _native;
            } else if('attachEvent' in win) {
                return emulate;
            } else {
                return old;
            }
            
        })(),

        removeEvent: (function() {

            function _native(el, event, fn) {
                el.removeEventListener(event, fn, false);
            }
            
            function emulate(el, event, fn) {
                el.detachEvent('on'+ event, fn);
            }

            function old(el, event, fn) {
                el['on'+ event] = null;
            }

            if('removeEventListener' in win) {
                return _native;
            } else if('detachEvent' in win) {
                return emulate;
            } else {
                return old;
            }

        })(),

        // DOM

        get: function(query, elem, isFirst) {
            return (elem || document)[(!!isFirst ? 'querySelector' : 'querySelectorAll')](query);
        },
        
        next: (function() {
            
            var isNative = document.documentElement.nextElementSibling !== undefined;
            
            function _native(elem) {
                return elem.nextElementSibling;
            }
            
            function emulate(elem) {
                var current = elem.nextSibling;

                while(current && current.nodeType != 1) {
                  current = current.nextSibling;
                }

                return current;
            }
            
            return !!isNative ? _native : emulate;
                
        })(),
        
        prev: (function() {
            
            var isNative = document.documentElement.previousElementSibling !== undefined;
            
            function _native(elem) {
                return elem.previousElementSibling;
            }
            
            function emulate(elem) {
                var current = elem.previousSibling;

                while(current && current.nodeType != 1) {
                  current = current.previousSibling;
                }

                return current;
            }
            
            return !!isNative ? _native : emulate;
                
        })(),

        getStyle: (function() {
            
            function _native(elem) {
                return window.getComputedStyle(elem, null)
            }
            
            function emulate(elem) {
                return elem.currentStyle;
            }
            
            return ('getComputedStyle' in window) ? _native : emulate;
        })(),
        
        after: function (elem, referenceElem) {
            return referenceElem.parentNode.insertBefore(elem, this.next(referenceElem));
        },
        
        before: function(elem, referenceElem) {
            return referenceElem.parentNode.insertBefore(elem, referenceElem);
        },

        removeChildren: function (elem) {
            while(elem.lastChild) {
                elem.removeChild(elem.lastChild);
            }
        },
        
        addClass: function( el, nameClass ) {

            // Получить список классов.
            var classList = el.className,
                space = /\s+/;

            // Если ни один класс не установлен.
            if (!classList) {
                el.className = nameClass;
                return nameClass;
            }

            // Здесь ожидается, что className установленно.

            // Проверим, возможно устанавливаемый класс уже назначен.
            if (classList === nameClass) {
                return false;
            }

            // Проверим, есть ли пробелы у назначенных классов.
            // Если пробелов нет, смело добавим новый класс
            // в начало списка классов.
            if (!space.test(classList)) {
                el.className = nameClass+' '+classList;
                return nameClass;
            }

            // Иначе могут быть пробельные символы.
            // Разобьем строку.
            var classListArray = classList.split( space );


            for ( var i=0, len=classListArray.length; i<len; i++ ) {

                // Возможно в списке уже есть устанавливаемый класс.
                if (classListArray[ i ] === nameClass) {
                    return false;
                }

            }

            el.className = nameClass+' '+classList;

            return nameClass;

        },

        removeClass: function( el, nameClass ) {

            // Получить список классов.
            var classList = el.className,
                space = /\s+/;

            // Если ни один класс не установлен.
            if (!classList) {
                return false;
            }

            // Здесь ожидается, что className установленно.

            // Проверим, возможно устанавливаемый класс уже назначен.
            if (classList === nameClass) {
                el.removeAttribute( "class" );
                return nameClass;
            }

            // Проверим, возможно есть другие классы или пробелы.
            // Если пробелов нет, значит этот класс не установлен.
            if (!space.test(classList)) {
                return false;
            }

            // Иначе разберем массив классов.
            var classListArray = classList.split( space ),
                classListNew = [];

            for ( var i=0, len=classListArray.length; i<len; i++ ) {

                // Возможно в списке уже есть устанавливаемый класс.
                if (classListArray[ i ] !== nameClass) {
                    classListNew.push( classListArray[ i ] );
                }

            }
            
            el.className = classListNew.join( ' ' );

            return nameClass;

        },

        hasClass: function( el, nameClass ) {

            // Получить список классов.
            var classList = el.className,
                space = /\s+/;

            // Если ни один класс не установлен.
            if (!classList) {
                return false;
            }

            // Если точное совпадение.
            if (classList === nameClass) {
                return true;
            }

            // Если нет пробелов, значит не наш класс.
            if (!space.test(classList)) {
                return false;
            }

            var classListArray = classList.split( space );

            for ( var i=0, len=classListArray.length; i<len; i++ ) {

                if (classListArray[ i ] === nameClass) {
                    return true;
                }

            }

            return false;

        },

        toggleClass: function( el, nameClass ) {

            this.hasClass(el, nameClass) ?
                this.removeClass(el, nameClass) :
                this.addClass(el, nameClass);

        },

        isParent: function(elem, parent) {
            while(elem.parentNode !== null){
                if(elem.parentNode === parent) return true;

                elem = elem.parentNode;
            }

            return false;
        },
        
        onDOMready: (function () {

                var called = false,
                    html = document.documentElement,
                    handlers = [];

                function ready() {
                        if (called) {
                            return;
                        }
                        
                        called = true;
                        
                        for(var i = 0, length = handlers.length; i < length; i++) {
                            handlers[i]();
                        }
                }

                function addHandler(handler) {
                    handlers.push(handler);
                }

                function tryScroll(){
                    if (called) {
                        return;
                    }
                    
                    if (!document.body) {
                        return;
                    }
                    
                    try {
                        html.doScroll("left");
                        ready();
                    } catch(e) {
                        setTimeout(tryScroll, 0);
                    }
                }

                if ( document.addEventListener ) { 
                    document.addEventListener( "DOMContentLoaded", ready, false );
                } else if ( document.attachEvent ) {
                    if ( document.documentElement.doScroll && window == window.top ) {
                        tryScroll();
                    }

                    document.attachEvent("onreadystatechange", function(){
                        if ( document.readyState === "complete" ) {
                            ready();
                        }
                    });
                }
                
                return addHandler;
        })(),
         
        getWindowWidth: (function() {
        
            function _native() {
                return win.innerWidth;
            }

            function emulate() {
                return html.offsetWidth;
            }

            function old() {
                return body.offsetWidth;
            }

            if (!!win.innerWidth) {
                return _native;
            } else if (doc.compatMode == 'CSS1Compat' && !!html && !!html.offsetWidth ) {
                return emulate;
            } else if (!!body && !!body.offsetWidth) {
                return old;
            }
            
        }()),

        getWindowHeight: (function() {

            function _native() {
                return win.innerHeight;
            }

            function emulate() {
                return html.offsetHeight;
            }

            function old() {
                return body.offsetHeight;
            }

            if (!!win.innerHeight) {
                return _native;
            } else if (doc.compatMode == 'CSS1Compat' && !!html && !!html.offsetHeight ) {
                return emulate;
            } else if (!!body && !!body.offsetHeight) {
                return old;
            }
            
        }()),
        
        isHidden: function(elem) {
            return !elem.offsetWidth && !elem.offsetHeight;
        },
        
        getElemCoords: function (elem) {

            var box = elem.getBoundingClientRect();

            var scrollTop = win.pageYOffset || html.scrollTop || body.scrollTop;
            var scrollLeft = win.pageXOffset || html.scrollLeft || body.scrollLeft;

            var clientTop = html.clientTop || body.clientTop || 0;
            var clientLeft = html.clientLeft || body.clientLeft || 0;

            return { 
                top: Math.round(box.top + scrollTop - clientTop), 
                left: Math.round(box.left + scrollLeft - clientLeft) 
            };
        },

        // determine type

        isNodeList: function(elem) {
            return getObjectType(elem) === 'nodelist';
        },

        isArray: function(elem) {
            return getObjectType(elem) === 'array';
        },
        
        isFunction: function(elem) {
            return getObjectType(elem) === 'function';
        },
        
        isObject: function(elem) {
            return getObjectType(elem) === 'object';
        },
        
        isTagNode: function(elem) {
            return !!elem.nodeType && elem.nodeType === 1;
        },

        typeOf: function(elem) {
            var responce = {
                simple: false,
                object: false
            }
            
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
                    var objType = getObjectType(elem);

                    if(objType.nodeName == 1) {
                        responce.object = "node";
                        break;
                    }

                    switch(objType) {
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

                    break;
             }

             return responce;
         },
              
        /**
         * we can add this object like prototype to handlers objects
         */
        objectExtention: {

            on: function(eventName, handler) {
                if (!this._eventHandlers) this._eventHandlers = [];
                if (!this._eventHandlers[eventName]) this._eventHandlers[eventName] = [];
                this._eventHandlers[eventName].push(handler);
            },

            off: function(eventName, handler) {
                var handlers = this._eventHandlers[eventName];
                if (!handlers) return;
                for(var i=0; i<handlers.length; i++) {
                    if (handlers[i] == handler) handlers.splice(i--, 1);
                }
            },

            trigger: function(eventName) {
                if (!this._eventHandlers[eventName]) return;

                var handlers = this._eventHandlers[eventName];
                for (var i = 0; i < handlers.length; i++) {
                    handlers[i].apply(this, [].slice.call(arguments, 1));
                }
            },
            
            extend: function (obj) {
                for( var x in obj ) {
                    this[x] = obj[x];
                }
            }
        },
        
        // cookie
        
        getCookie: function(name) {
            var matches = document.cookie.match(new RegExp(
              "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
    
            return matches ? decodeURIComponent(matches[1]) : undefined;
        },
        
        setCookie: function(name, value, options) {
            options = options || {};

            var expires = options.expires;

            if (typeof expires == "number" && expires) {
              var d = new Date();
              d.setTime(d.getTime() + expires*1000);
              expires = options.expires = d;
            }
            if (expires && expires.toUTCString) { 
                  options.expires = expires.toUTCString();
            }

            value = encodeURIComponent(value);

            var updatedCookie = name + "=" + value;

            for(var propName in options) {
              updatedCookie += "; " + propName;
              var propValue = options[propName];    
              if (propValue !== true) { 
                updatedCookie += "=" + propValue;
               }
            }

            document.cookie = updatedCookie;
       }

    }
    
})(window, document);

/**
 * depends on matchMedia.js
 * 
 * Singleton
 */
var determinesDevice = (function() {
    
    // determine dependencies
    var utils = window.lib;
    
    var instance;
    
    return function() {
        if (typeof instance !== 'undefined') {
            return instance;
        }
        
        
        var ua = navigator.userAgent,
            patterns = {
            device: {
                IPad: /iPad/i,
                IPhone: /iPhone/i,
                IPod: /iPod/i,
                BlackBerry: /BlackBerry/i,
                IEMobile: /IEMobile/i,
                Android: /Android/i
            },
            browser: {
                opera: /Opera[ \/]+\w+\.\w+/i,  
                firefox: /Firefox\/\w+\.\w+/i,     
                chrome: /Chrome\/\w+\.\w+/i,   
                ie: /MSIE *\d+\.\w+/i,       
                safari: /Safari\/\w+\.\w+/i
            }
        }
            
        instance = {};
            
        instance.touch = utils.touch;  
        
        if ( instance.touch ) {
            instance.type = ( matchMedia('only screen and (max-device-width: 640px) and (max-device-height: 640px)').matches ) 
                                ? "mobile" : "tablet";
        } else {
            instance.type = "desktop";
        }

        for (var i in patterns.device) {
            instance["is" + i] = ua.match(patterns.device[i]) != null;
        }

        if(instance.isAndroid) {
            instance.deviceVersion = parseFloat(ua.slice(ua.indexOf("Android")+8));
        }
        
        for (var j in patterns.browser) {
            if(ua.match(patterns.browser[j])) {
                instance.browser = j;
                break;
            }
        }

        if( instance.touch ) {
            instance.touchEvents = {
                start: (instance.isIEMobile) ? "MSPointerDown" : "touchstart",
                move: (instance.isIEMobile) ? "MSPointerMove" : "touchmove",
                end: (instance.isIEMobile) ? "MSPointerUp" : "touchend",
                cancel : (instance.isIEMobile) ? "MSPointerCancel" : "touchcancel",
            }
        }

        instance.decorateHtml = function () {
            var body = utils.get("body", null, true),
                className = instance.browser + ' ' + instance.type;

            if(instance.isIPad) {
                className += " isIPad";
            }
            
            if(instance.isIPhone) {
                className += " isIPhone";
            }
            
            if(instance.isIPod) {
                className += " isIPod";
            }
            
            if(instance.isBlackBerry) {
                className += " isBlackBerry";
            }
            
            if(instance.isIEMobile) {
                className += " isIEMobile";
            }
            
            if(instance.isAndroid) {
                className += " isAndroid";
            }
            
            utils.addClass(className);
        }
        
        return instance;
    };
})();

/**
 * functions depends on jQuery 1.x
 */ 
if(jQuery) {
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

            /**
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
    })(jQuery);
}


var gracefulDegradation = (function() {

    var utils = window.lib,
        initialised = false;

    return function() {
        if(!!initialised) return;

        var inputElem  = document.createElement('input'),
            support = {
                placeholder: !!("placeholder" in inputElem),
                required: !!("required" in inputElem)
            },
            isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) != null,
            safari = (navigator.userAgent.indexOf("Safari") != -1) && 
                     (navigator.userAgent.indexOf("Chrome") == -1) &&
                     (navigator.userAgent.indexOf("Opera") == -1);

        function init() {
            var forms = document.forms;

            for( var i=0, length=forms.length; i<length; i++ ) {
                initForm(forms[i]);
            }

            initialised = true;
        }

        function initForm(form) {
            for( var j=0, length=form.elements.length; j<length; j++ ) {
                initElement(form.elements[j]);
            }
        }

        function initElement(elem) {
            if(!!elem.getAttribute("placeholder") && (isIOS || safari || !support.placeholder)) {
                emulatePlaceholder(elem);
            } 

            if((elem.type.toLowerCase() == "submit" ||
               elem.type.toLowerCase() == "button") && (isIOS || safari || !support.required)) {
                utils.addEvent(elem, "click", emulateValidate);
            }
        }

        /*
         * context button|submit Node
         */
        function emulateValidate(e) {
            e = utils.fixEvent(e);

            var form = this.form,
                warning = "",
                isValid = true,
                errors = {
                    required: [],
                    pattern: []
                };

            for(var j=0, length=form.elements.length; j<length; j++) {
                var elem = form.elements[j],
                    name = elem.getAttribute("name"),
                    pattern = elem.getAttribute("pattern");

                if(!!elem.getAttribute("required")) {
                    if(elem.value.length == 0 || 
                       elem.value == elem.getAttribute("placeholder"))
                        errors.required.push(name);
                }

                if(!!pattern) {
                    if(!new RegExp(pattern.toString()).test(elem.value.toString()))
                        errors.pattern.push(name);
                }
            }

            if(errors.required.length != 0) {
                warning += "Next fields of form are required: " + errors.required.join(', ') + ".\n\n";
                isValid = false;
            }

            if(errors.pattern.length != 0) {
                warning += "Next fields of form are filled incorrectly: " + errors.pattern.join(',') + ".\n\n";
                isValid = false;
            }

            if(!isValid) {
                e.preventDefault();
                alert(warning);
            }
        };

        function emulatePlaceholder(elem) {

            var placeholder = elem.getAttribute("placeholder");

            elem.value = placeholder;

            elem.onfocus = function() {
                if(elem.value == placeholder) elem.value='';
            }

            elem.onblur = function() {
                if(elem.value == '') elem.value = placeholder;
            }

        }

        init();
    }
})();