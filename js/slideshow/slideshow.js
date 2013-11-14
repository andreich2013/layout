var Slideshow = (function() {
    
    var objects = [],
        count = 0;
    
    // utilites
    
    var utilites = (function() {
        
        isTouch = !!('ontouchstart' in window) ||
                  !!(('msMaxTouchPoints' in window.navigator) && !('onmouseover' in window));

        function getObjectType(elem) {
            return {}.toString.call(elem).slice(8, -1).toLowerCase();
        }
        
        var api = {
            
            extend: function (obj) {
                for( var x in obj ) {
                    this[x] = obj[x];
                }
            },

            // DOM node

            get: function(query, elem, isFirst) {
                return (elem || document)[(!!isFirst ? 'querySelector' : 'querySelectorAll')](query);
            },

            next: (function() {

                var isNative = document.documentElement.nextElementSibling !== undefined;

                function native(elem) {
                    return elem.nextElementSibling;
                }

                function emulate(elem) {
                    var current = elem.nextSibling;

                    while(current && current.nodeType != 1) {
                      current = current.nextSibling;
                    }

                    return current;
                }

                return !!isNative ? native : emulate;

            })(),

            prev: (function() {

                var isNative = document.documentElement.previousElementSibling !== undefined;

                function native(elem) {
                    return elem.previousElementSibling;
                }

                function emulate(elem) {
                    var current = elem.previousSibling;

                    while(current && current.nodeType != 1) {
                      current = current.previousSibling;
                    }

                    return current;
                }

                return !!isNative ? native : emulate;

            })(),

            // event

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

            // attribute class

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

            toggleClass: function( el, nameClass ) {

                this.hasClass(el, nameClass) ?
                    this.removeClass(el, nameClass) :
                    this.addClass(el, nameClass);

            },

            // publish subscribe

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

            // determines type

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
            
            isNodeList: function(elem) {
                return getObjectType(elem) == 'nodelist';
            }
        };
        
        return api;
        
    })();
    
    // options
    
    var opt = {
        start: null,
        scroll: false,
        circle: false,
        touch: false,
        auto: null,
        direction: null,
        rtl: null,

        ajax: {
            url: null,
            callback: null,
            length: null
        },
        json: {
            data: null,
            callback: null,
            length: null,
            slideLayout: null
        },
        bullets: {
            next: {
                event: null,
                before: null,
                after: null
            },
            prev: {
                event: null,
                before: null,
                after: null
            }
        },
        pagination: {
            html: null,
            event: null,
            callback: null
        },
        thumbs: {
            html: null,
            event: null,
            callback: null
        },
        animation: {
            type: null,
            speed: null,
            easing: null,
            stepCallback: null,
        },

        createCallback: null,
        recreateCallback: null,
        resizeCallback: null,
        beforeCallback: null,
        afterCallback: null
    };
    
    // prototype
    
    var Base = function() {

        this.number = count;
        count++;

        this.events = {};

        this.container = null;
        this.wrapper =  null;
        this.slides = null;
        this.current = null;
        
        this.isAnimate = false;
        this.isLoaded = false;
        
        
        this.getSelf = function() {
            return this;
        };
        
        this.create = function() {
            
            opt.start = (!!opt.start && typeof opt.start === "number") ? opt.start : 0; 
            
            this.setCurrent(opt.start);
            this.createEvents();
            
            if(!!opt.createCallback && typeof opt.createCallback === "function") {
                opt.createCallback.call(this);
            }
            
            objects[this.number] = this;
            
            return this;
        };
        
        this.recreate = function(options) {
            this.destroy();
            var base = new this.constructor(options);
            
            if(!!opt.recreateCallback && typeof opt.recreateCallback === "function")
                opt.recreateCallback(this);
            
            return base;
        };
        
        this.destroy = function() {
            this.destroyEvents();
            delete objects[this.number];
        };

        this.createEvents = function() {
            
        };

        function removeListeners(elem, events) {
            for(var event in events) {
                for(var fn in event) {
                    this.removeEvent(elem, event, elem[event][fn]);
                } 
            }
        }

        this.destroyEvents = function() {
            for(var elem in this.events) {
                removeListeners.call(elem, this.events[elem]);
            }
        };
        
        this.getSlideForAttribute = function(index) {

            for(var i = 0, length = this.slides.length; i < length; i++) {
                var slide = this.slides[i];
                
                if(parseInt(slide.getAttribute("data-index")) == index) {
                    return slide;
                }
            }
            
            return false;
        }
        
        this.getSlide = function(slide){
            
            if(!!slide.nodeType && slide.nodeType == 1) {
                return this.slides[slide];
            } else if(typeof slide === 'number') {
                return this.getSlideForAttribute(slide);
            }
            
        };
        
        this.isFirstSlide = function(slide) {
            return !!(parseInt(slide.getAttribute("data-index")) == 0);
        };
        
        this.isLastSlide = function(slide) {
            return !!(parseInt(slide.getAttribute("data-index")) == this.slides.length-1);
        };

        this.setCurrent = function(slide) {
            if(slide === undefined) return;
            
            if(!!this.current) {
                this.removeClass(this.current, 'current');
            }
            
            this.current = this.getSlide(slide);
            this.addClass(this.current, 'current');
        };

        this.changeSlide = function(slide){
            if(this.isAnimate) return;
            
            if(!!opt.beforeCallback && typeof opt.beforeCallback === "function") {
                if(!opt.beforeCallback(this)) return;
            }
            
            this.setCurrent(slide);
            
            if(!!opt.afterCallback && typeof opt.afterCallback === "function") {
                opt.afterCallback(this);
            }
        };
                
        this.auto = function(){
            
        };       

    }
     
    Base.prototype = utilites;
    
    // widgets
    
    var Pagination = function() {};
    
    var Thumbs = function() {};
    
    var Navigation = function() {};
    
    var Animation = function(opt) {
        
        var transition = (function() {
            
            var style = document.body.style;

            var prefix = (style.Transition !== undefined) ? '' : 
                         (style.WebkitTransition !== undefined) ? 'Webkit' : 
                         (style.MozTransition !== undefined) ? 'Moz' : 
                         (style.OTransition !== undefined) ? 'O' : 
                         (style.MSTransition !== undefined) ? 'MS' : false;

            if(prefix === false) {
                return false;
            }
            
            return {
                string: prefix+'Transition',
                fn: prefix+'TransitionTimingFunction',
                duration: prefix+'TransitionDuration',
                property: prefix+'TransitionProperty',
                delay: prefix+'TransitionDelay',
            }

        })();
        
        var transform = (function() {
            
            var style = document.documentElement.style;

            var prefix = (!!style.Transform) ? '' : 
                         (!!style.WebkitTransform) ? 'Webkit' : 
                         (!!style.MozTransform) ? 'Moz' : 
                         (!!style.OTransform) ? 'O' : 
                         (!!style.MSTransform) ? 'MS' : false;

            if(prefix === false) {
                return false;
            }
            
            return {
                string: prefix+'Transform'
            }

        })();
        
        this.addAnimation = function(elem) {
            
            if(!!this.isNodeList(elem)) {
                
                for (var i = 0, length = elem.length; i < length; i++) {
                    elem[i].style[transition.string] = 'All 2s linear 0s';   
                    console.log(elem[i].style[transition.string]);
                }
                
            } else if(this.isTagNode(elem)) {
                
                elem.style[transition.string] = 'All 2s linear 0s';
                
            }
            
            
        }
        
        this.removeAnimation = function(elem) {
            
            elem.style[transition.string] = 'All 0.4s linear 0s';
            
        }
        
        this.decorate = function(slidesContainer) {
            
            this.addClass(slidesContainer, opt.type);
            
        }
        
    };
    
    Animation.prototype = utilites;
    
    var Ajax = function() {}; 
    
    var Json = function() {};
    
    // class
    
    var Slider = function(elem, options) {
        
        var self = this;
    
        self.extend.call(opt, options);
    
        self.wrapper =  self.get('.slideshow-wrapper', elem, true);
        self.container = self.get('.slides', self.wrapper, true);
        self.slides = self.get('.slide', self.container);
        
        if(!!opt.animation) {
            var animationWidget = new Animation(opt.animation);
            
            animationWidget.decorate(self.container);
            animationWidget.addAnimation(self.slides);
            
            self.setCurrent = function(slide) {
                if(slide === undefined) return;

                if(!!self.current) {
                    self.removeClass(self.current, 'current');
                }

                self.current = self.getSlide(slide);
                self.addClass(self.current, 'current');
            };
        }
        
        self.create();
    };
    
    Slider.prototype = new Base();
    
    return Slider;
})();