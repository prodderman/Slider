!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.VanillaSlider=e():t.VanillaSlider=e()}(this,function(){return function(t){function e(i){if(o[i])return o[i].exports;var n=o[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var o={};return e.m=t,e.c=o,e.d=function(t,o,i){e.o(t,o)||Object.defineProperty(t,o,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=1)}([function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(){this.listeners=new Set}return t.prototype.attach=function(t){this.listeners.add(t)},t.prototype.remove=function(t){this.listeners.delete(t)},t.prototype.notify=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.listeners.forEach(function(e){e.apply(void 0,t)})},t}();e.default=i},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=o(2),n=o(3),s=o(6),r=function(){function t(e,o,i){void 0===o&&(o={}),this.context=i,this.root=t.getValidateNode(e),this.init(o)}return Object.defineProperty(t.prototype,"data",{get:function(){return Object.assign({},this.model.data,this.view.data)},enumerable:!0,configurable:!0}),t.prototype.set=function(t){this.setOptions(t),this.model.init(this.modelOptions),this.view.init(this.viewOptions),this.controller.init(this.controllerOptions,!0)},t.prototype.init=function(t){this.setOptions(t),this.model=new i.default(this.modelOptions),this.view=new n.default(this.root,this.viewOptions),this.controller=new s.default(this.model,this.view,this.controllerOptions)},t.prototype.setOptions=function(t){if(this.modelOptions={},this.viewOptions={},this.controllerOptions={},t.type&&["single","min","max","double"].includes(t.type)&&(this.viewOptions.type=t.type,this.modelOptions.type="double"===t.type),t.orientation&&["vertical","horizontal"].includes(t.orientation)&&(this.viewOptions.orientation=t.orientation),this.setModelOption("min",t.min),this.setModelOption("max",t.max),this.setModelOption("from",t.from),this.setModelOption("to",t.to),this.setModelOption("step",t.step),!this.isUndefined(t.fromFixed)){var e=/true/i.test(t.fromFixed.toString());this.modelOptions.fromFixed=e,this.viewOptions.fromFixed=e}if(!this.isUndefined(t.toFixed)){var o=/true/i.test(t.toFixed.toString());this.modelOptions.toFixed=o,this.viewOptions.toFixed=o}this.controllerOptions.onCreate=t.onCreate,this.controllerOptions.onStart=t.onStart,this.controllerOptions.onSlide=t.onSlide,this.controllerOptions.onEnd=t.onEnd,this.controllerOptions.onUpdate=t.onUpdate},t.prototype.setModelOption=function(t,e){this.isUndefined(e)||Number.isNaN(Number(e))||(this.modelOptions[t]=Number(e))},t.prototype.isUndefined=function(t){return void 0===t},t.getValidateNode=function(t){if(t instanceof HTMLDivElement||t instanceof HTMLSpanElement)return t;if(t instanceof HTMLCollection&&t[0]instanceof HTMLDivElement)return t[0];if("string"==typeof t){var e=document.querySelector(t);if(e instanceof HTMLDivElement||e instanceof HTMLSpanElement)return e}throw"Invalid node type, expected 'div' or 'span'"},t}(),a=function(){function t(e,o){void 0===o&&(o={});var i=new r(e,o,this);this.set=i.set.bind(i),this.data=i.data,t.instances.push(i)}return t.getInstance=function(e){for(var o=r.getValidateNode(e),i=0,n=t.instances;i<n.length;i++){var s=n[i];if(o&&o===s.root)return s.context}},t.instances=[],t}();e.default=a},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=o(0),n=function(){function t(t){void 0===t&&(t={}),this.triggers={fromChanged:new i.default,toChanged:new i.default},this.options={type:!1,min:0,max:100,from:0,fromFixed:!1,to:0,toFixed:!1,step:1},this.init(t)}return Object.defineProperty(t.prototype,"data",{get:function(){return this.options},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"events",{get:function(){return this.triggers},enumerable:!0,configurable:!0}),t.prototype.init=function(t){void 0===t&&(t={}),this.isUndefined(t.type)||this.setType(t.type),this.isUndefined(t.step)||this.setStep(t.step),this.isUndefined(t.min)&&this.isUndefined(t.max)||this.setRange(t.min,t.max),this.isUndefined(t.fromFixed)&&this.isUndefined(t.toFixed)||this.setFixed(t.fromFixed,t.toFixed),this.isUndefined(t.from)&&this.isUndefined(t.to)||this.setValues(t.from,t.to)},t.prototype.calcFromWithStep=function(t){var e=this.options;if(!e.fromFixed){var o,i=Math.round((t-e.min)/e.step),n=i*e.step+e.min;o=e.type?this.correctDiapason(n,e.min,e.to):this.correctDiapason(n,e.min,e.max),o!==e.from&&(e.from=o,this.triggers.fromChanged.notify(e.from))}},t.prototype.calcToWithStep=function(t){var e=this.options;if(e.type&&!e.toFixed){var o=Math.round((t-e.min)/e.step),i=o*e.step+e.min,n=this.correctDiapason(i,e.from,e.max);n!==e.to&&(e.to=n,this.triggers.toChanged.notify(e.to))}},t.prototype.setRange=function(t,e){void 0===t&&(t=this.options.min),void 0===e&&(e=this.options.max),t>e&&(e=t),this.options.min=t,this.options.max=e,this.updateFromTo()},t.prototype.setValues=function(t,e){void 0===t&&(t=this.options.from),void 0===e&&(e=this.options.to),this.options.from=t,this.options.to=e,this.updateFromTo()},t.prototype.setStep=function(t){var e=this.options,o=e.max-e.min;e.step=t<=0?1:t>o?o:t},t.prototype.setType=function(t){this.options.type=t,this.updateFromTo()},t.prototype.setFixed=function(t,e){void 0===t&&(t=this.options.fromFixed),void 0===e&&(e=this.options.toFixed),this.options.fromFixed=t,this.options.toFixed=e},t.prototype.updateFromTo=function(){var t=this.options;t.from=this.correctDiapason(t.from,t.min,t.max),t.type&&(t.to=this.correctDiapason(t.to,t.from,t.max))},t.prototype.correctDiapason=function(t,e,o){return void 0===e&&(e=this.options.min),void 0===o&&(o=this.options.min),t<e?e:t>o?o:t},t.prototype.isUndefined=function(t){return void 0===t},t}();e.default=n},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),o(4),o(5);var i=o(0),n=function(){function t(t,e){void 0===e&&(e={}),this.root=t,this.handle=null,this.mousemove=this.mouseMove.bind(this),this.mouseup=this.mouseUp.bind(this),this.triggers={slideStart:new i.default,slideEnd:new i.default,fromChanged:new i.default,toChanged:new i.default},this.options={type:"single",orientation:"horizontal",fromFixed:!1,toFixed:!1},this.nodes={track:document.createElement("div"),from:document.createElement("span")},this.init(e)}return Object.defineProperty(t.prototype,"data",{get:function(){return this.options},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"events",{get:function(){return this.triggers},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nodesData",{get:function(){return this.nodes},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"rootObject",{get:function(){return this.root},enumerable:!0,configurable:!0}),t.prototype.init=function(t){var e=this.options;t.type&&(e.type=t.type),t.orientation&&(e.orientation=t.orientation),this.isUndefined(t.fromFixed)||(e.fromFixed=t.fromFixed),this.isUndefined(t.toFixed)||(e.toFixed=t.toFixed),this.rootEmpty(),this.setNodes(),this.render(),this.setHandlers()},t.prototype.calcFrom=function(t){"horizontal"===this.options.orientation?this.nodes.from.style.left=t+"%":this.nodes.from.style.bottom=t+"%",this.calcRange()},t.prototype.calcTo=function(t){var e=this.options,o=this.nodes,i="left";"double"===e.type&&o.to&&("vertical"===e.orientation&&(i="bottom"),o.to.style[i]=t+"%",this.calcRange())},t.prototype.render=function(){var t=this.options,e=this.nodes;if(this.root.appendChild(e.track),e.track.appendChild(e.from),e.range&&e.track.appendChild(e.range),e.to&&e.track.appendChild(e.to),"horizontal"===t.orientation&&!e.track.clientWidth)throw"zero container width";if("vertical"===t.orientation&&!e.track.clientHeight)throw"zero container height"},t.prototype.setHandlers=function(){window.removeEventListener("mousemove",this.mousemove),this.nodes.track.removeEventListener("mousedown",this.mouseDown.bind(this)),window.removeEventListener("mouseup",this.mouseup),this.nodes.track.addEventListener("mousedown",this.mouseDown.bind(this))},t.prototype.calcRange=function(){var t=this.options,e=this.nodes,o="left",i="right";"single"!==t.type&&e.range&&("vertical"===t.orientation&&(o="bottom",i="top"),"min"===t.type?(e.range.style[o]="0",e.range.style[i]=100-parseFloat(e.from.style[o])+"%"):"max"===t.type?(e.range.style[o]=e.from.style[o],e.range.style[i]="0"):"double"===t.type&&e.to&&(e.range.style[o]=e.from.style[o],e.range.style[i]=100-parseFloat(e.to.style[o])+"%"))},t.prototype.setNodes=function(){var t=this.options;this.nodes={track:document.createElement("div"),from:document.createElement("span")};var e=this.nodes;e.track.setAttribute("class","vanilla-slider vanilla-slider_"+t.type+" vanilla-slider_"+t.orientation),e.from.setAttribute("tabindex","0"),e.from.setAttribute("class","vanilla-slider__handle vanilla-slider__handle_from"),t.fromFixed&&e.from.classList.add("vanilla-slider__handle_fixed"),"single"!==t.type?(e.range=document.createElement("div"),e.range.setAttribute("class","vanilla-slider__range vanilla-slider__range_"+t.type)):delete e.range,"double"===t.type?(e.to=document.createElement("span"),e.to.setAttribute("tabindex","0"),e.to.setAttribute("class","vanilla-slider__handle vanilla-slider__handle_to"),t.toFixed&&e.to.classList.add("vanilla-slider__handle_fixed")):delete e.to},t.prototype.rootEmpty=function(){for(;this.root.firstChild;)this.root.removeChild(this.root.firstChild)},t.prototype.mouseDown=function(t){var e=this.nodes,o=this.getCoord(t);t.preventDefault(),t.target===e.from?this.handle=e.from:t.target===e.to?this.handle=e.to:t.target!==e.range&&t.target!==e.track||(this.handle=this.chooseHandle(o),this.mouseMove(t)),e.from.classList.remove("last-type"),e.to&&e.to.classList.remove("last-type"),this.handle&&(this.handle.classList.add("active"),this.handle.classList.add("last-type"),this.events.slideStart.notify(this.handle,o)),window.addEventListener("mousemove",this.mousemove),window.addEventListener("mouseup",this.mouseup)},t.prototype.mouseMove=function(t){var e=this.nodes,o=this.getCoord(t);this.handle===e.from?this.events.fromChanged.notify(this.handle,o):this.handle===e.to&&this.events.toChanged.notify(this.handle,o)},t.prototype.mouseUp=function(t){var e=this.getCoord(t);window.removeEventListener("mousemove",this.mousemove),window.removeEventListener("mouseup",this.mouseup),this.handle&&(this.handle.classList.remove("active"),this.events.slideEnd.notify(this.handle,e)),this.handle=null},t.prototype.chooseHandle=function(t){var e=this.options,o=this.nodes;if(this.handle)return this.handle;if("double"!==e.type)return o.from;if(e.fromFixed&&e.toFixed)return null;if(e.fromFixed)return o.to;if(e.toFixed)return o.from;var i=this.getOffset(o.from),n=this.getOffset(o.to);return i===n?"horizontal"===e.orientation?t<i?o.from:o.to:t>i?o.from:o.to:Math.abs(i-t)<Math.abs(n-t)?o.from:o.to},t.prototype.getCoord=function(t){var e=this.nodes;return"horizontal"===this.options.orientation?t.pageX-e.track.offsetLeft:t.pageY-e.track.offsetTop},t.prototype.getOuterWidth=function(t){var e=getComputedStyle(t);return t.offsetWidth+parseInt(e.marginLeft)+parseInt(e.marginRight)},t.prototype.getOuterHeight=function(t){var e=getComputedStyle(t);return t.offsetHeight+parseInt(e.marginLeft)+parseInt(e.marginRight)},t.prototype.getOffset=function(t){return"horizontal"===this.options.orientation?t.offsetLeft+this.getOuterWidth(t)/2:t.offsetTop+this.getOuterHeight(t)/2},t.prototype.isUndefined=function(t){return void 0===t},t}();e.default=n},function(t,e){},function(t,e){},function(t,e,o){"use strict";var i=Object.assign||function(t){for(var e,o=1,i=arguments.length;o<i;o++){e=arguments[o];for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t};Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t,e,o){this.model=t,this.view=e,this.callbacks={},this.customEvents={},this.init(o)}return t.prototype.init=function(t,e){this.initCallbacks(t),e?(this.customEvents.update=this.createSliderEvent("vanillaupdate"),this.callFunction(this.customEvents.update,i({},this.model.data,this.view.data),this.callbacks.onUpdate),this.view.rootObject.dispatchEvent(this.customEvents.update)):(this.customEvents.create=this.createSliderEvent("vanillacreate"),this.callFunction(this.customEvents.create,i({},this.model.data,this.view.data),this.callbacks.onCreate),this.view.rootObject.dispatchEvent(this.customEvents.create)),this.attachModelEvents(),this.attachViewEvents(),this.view.calcFrom(this.convertToPercent(this.model.data.from)),this.view.calcTo(this.convertToPercent(this.model.data.to))},t.prototype.initCallbacks=function(t){t.onCreate&&(this.callbacks.onCreate=t.onCreate),t.onStart&&(this.callbacks.onStart=t.onStart),t.onSlide&&(this.callbacks.onSlide=t.onSlide),t.onEnd&&(this.callbacks.onEnd=t.onEnd),t.onUpdate&&(this.callbacks.onUpdate=t.onUpdate)},t.prototype.attachViewEvents=function(){var t=this,e=this.model,o=this.view;o.events.fromChanged.attach(function(o,i){e.calcFromWithStep(t.convertToReal(i))}),o.events.toChanged.attach(function(o,i){e.calcToWithStep(t.convertToReal(i))}),o.events.slideStart.attach(function(n){t.customEvents.start=t.createSliderEvent("vanillastart"),t.callFunction(t.customEvents.start,i({handle:n},e.data,o.data),t.callbacks.onStart),n.dispatchEvent(t.customEvents.start)}),o.events.slideEnd.attach(function(n){t.customEvents.end=t.createSliderEvent("vanillaend"),t.callFunction(t.customEvents.end,i({handle:n},e.data,o.data),t.callbacks.onEnd),n.dispatchEvent(t.customEvents.end)})},t.prototype.attachModelEvents=function(){var t=this,e=this.model,o=this.view;e.events.fromChanged.attach(function(n){o.calcFrom(t.convertToPercent(n)),t.customEvents.slide=t.createSliderEvent("vanillaslide"),t.customEvents.slide&&(t.callFunction(t.customEvents.slide,i({handle:o.nodesData.from},e.data,o.data),t.callbacks.onSlide),o.nodesData.from.dispatchEvent(t.customEvents.slide))}),e.events.toChanged.attach(function(n){o.calcTo(t.convertToPercent(n)),t.customEvents.slide=t.createSliderEvent("vanillaslide"),t.customEvents.slide&&(t.callFunction(t.customEvents.slide,i({handle:o.nodesData.to},e.data,o.data),t.callbacks.onSlide),o.nodesData.to.dispatchEvent(t.customEvents.slide))})},t.prototype.convertToPercent=function(t){var e=this.model.data,o=e.max-e.min;return Number((100*(t-e.min)/o).toFixed(10))},t.prototype.convertToReal=function(t){var e=this.model.data,o=this.view.nodesData,i=e.max-e.min;if("horizontal"===this.view.data.orientation){var n=o.track.clientWidth;return Number((t*i/n+e.min).toFixed(10))}var s=o.track.clientHeight;return Number(((s-t)*i/s+e.min).toFixed(10))},t.prototype.callFunction=function(t,e,o){void 0===e&&(e={}),o&&"function"==typeof o&&o(t,e)},t.prototype.createSliderEvent=function(t){return new CustomEvent(t,{detail:{from:this.model.data.from,to:this.model.data.to,target:this.view.rootObject},bubbles:!0,cancelable:!0})},t}();e.default=n}]).default});