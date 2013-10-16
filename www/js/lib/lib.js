/**
 * library
 * 
 * @returns {object}
 */
window.lib = (function() {
    
    var pattern = {
        space: /\s+/
    },
    isTouch = !!('ontouchstart' in window) ||
                  !!(('msMaxTouchPoints' in window.navigator) && !('onmouseover' in window));
    
    return {
    
        touch: isTouch,

        /**
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

        addEvent: function(el, event, func) {
            if ( el.addEventListener ) {
                el.addEventListener(event, func, false);
                return;
            }

            if ( el.attachEvent ) {
                el.detachEvent('on'+ event, function(e) {
                    func.call(el, e);
                });
                el.attachEvent('on'+ event, function(e) {
                    func.call(el, e);
                });
                return;
            }

            el['on'+ event] = func;
        },

        removeEvent: function(el, event, func) {

            if ( el.removeEventListener ) {
                el.removeEventListener(event, func, false);
                return;
            }

            if ( el.detachEvent ) {
                el.detachEvent('on'+ event, func);
                return;
            }

            el['on'+ event] = null;

        },

        getStyle: function( elem ) {
            return elem.currentStyle || window.getComputedStyle(elem, null);
        },

        getTime: Date.now || function getTime () { return new Date().getTime(); },

        get: function(query, elem) {
            return (elem || document).querySelectorAll(query);
        },

        getFirst: function(query, elem) {
            return (elem || document).querySelector(query);
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

        /**
         * Удалить класс.
         *
         * @param {HTMLElement} el требуемый элемент.
         * @param {String} nameClass имя, которое требуется удалить.
         *
         * @return {String|Boolean} удаляемое имя класса или ложь.
         */
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

        /**
         * Переключить класс.
         *
         * @param {HTMLElement} el требуемый элемент.
         * @param {String} nameClass имя, которое требуется переключить.
         */
        toggleClass: function( el, nameClass ) {

            this.hasClass(el, nameClass) ?
                this.removeClass(el, nameClass) :
                this.addClass(el, nameClass);

        },

        /**
         * Проверить класс.
         *
         * @param {HTMLElement} el требуемый элемент.
         * @param {String} nameClass имя, которое требуется проверить.
         *
         * @return {Boolean} если имя класса найдено, возвращает истину,
         * иначе ложь.
         */
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

       /**
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

       /**
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
    
})();

/**
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
            
        responce.touch = !!('ontouchstart' in window) ||
                         !!(('msMaxTouchPoints' in window.navigator) && !('onmouseover' in window));  
        
        if ( responce.touch ) {
            responce.type = ( matchMedia('only screen and (max-device-width: 640px) and (max-device-height: 640px)').matches ) 
                                ? "mobile" : "tablet";
        } else {
            responce.type = "desktop";
        }

        for (var i in patterns.device) {
            responce["is" + i] = ua.match(patterns.device[i]) != null;
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

        if( responce.touch ) {
            responce.touchEvents = {
                start: (responce.isIEMobile) ? "MSPointerDown" : "touchstart",
                move: (responce.isIEMobile) ? "MSPointerMove" : "touchmove",
                end: (responce.isIEMobile) ? "MSPointerUp" : "touchend",
                cancel : (responce.isIEMobile) ? "MSPointerCancel" : "touchcancel",
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

/**
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
    })(window.jQuery);
}

(function() {
    window.GracefulDegradation = function() {
        if(!!GracefulDegradation.initialised) return;
        
        var inputElem  = document.createElement('input'),
            support = {
                placeholder: !!("placeholder" in inputElem),
                required: !!("required" in inputElem)
            },
            isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) != null,
            safari = (navigator.userAgent.indexOf("Safari") != -1) && 
                     (navigator.userAgent.indexOf("Chrome") == -1) &&
                     (navigator.userAgent.indexOf("Opera") == -1);

        init();
        
        function init() {
            initForms();
            GracefulDegradation.initialised = true;
        }
        
        function initForms() {
            var forms = document.forms;
            
            for( var i=0, lenF=forms.length; i<lenF; i++ ) {
                var form = forms[i];

                for( var j=0, lenE=form.elements.length; j<lenE; j++ ) {
                    var elem = form.elements[j];

                    if(!!elem.getAttribute("placeholder") && (isIOS || safari || !support.placeholder)) {
                        emulatePlaceholder.call(elem);
                    } 

                    if((elem.type.toLowerCase() == "submit" ||
                       elem.type.toLowerCase() == "button") && (isIOS || safari || !support.required)) {
                        GracefulDegradation.utilites.addEvent(elem, "click", emulateValidate);
                    }
                }
            }
        }
        
        function searchForm(elem) {
            while(elem.parentNode !== null){
                if(elem.parentNode.tagName.toLowerCase() == "form") {
                    return elem.parentNode;
                }

                elem = elem.parentNode;
            }

            return false;
        }

        function emulateValidate(e) {
            e = GracefulDegradation.utilites.fixEvent(e);

            var form = searchForm(this),
                warning = "",
                isValid = true,
                errors = {
                    required: [],
                    pattern: []
                };

            for( var j=0, lenE=form.elements.length; j<lenE; j++ ) {
                var elem = form.elements[j],
                    name = elem.getAttribute("name"),
                    pattern = elem.getAttribute("pattern");

                if(elem.getAttribute("required") !== null) {
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

        /**
         * context - input element
         */
        function emulatePlaceholder() {

            var placeholder = this.getAttribute("placeholder");

            this.value = placeholder;

            this.onfocus = function() {
                if(this.value == placeholder) this.value='';
            }

            this.onblur = function() {
                if(this.value == '') this.value = placeholder;
            }

        }
    }

    window.GracefulDegradation.utilites = window.lib;
})();