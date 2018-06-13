!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.VanillaSlider=e():t.VanillaSlider=e()}("undefined"!=typeof self?self:this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}var n={};return e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=5)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=e.TSliderType=void 0;!function(t){t["from-start"]="from-start",t["from-end"]="from-end",t.double="double"}(i||(e.TSliderType=i={}));var o=e.TOrientation=void 0;!function(t){t.vertical="vertical",t.horizontal="horizontal"}(o||(e.TOrientation=o={}))},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=function(){function t(){i(this,t),this.listeners=new Set}return o(t,[{key:"attach",value:function(t){this.listeners.add(t)}},{key:"remove",value:function(t){this.listeners.delete(t)}},{key:"notify",value:function(t){this.listeners.forEach(function(e){e(t)})}}]),t}();e.default=r},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.initialOptions={isDouble:!1,min:0,max:100,from:0,to:0,step:1}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.initialOptions=void 0;var i=n(0);e.initialOptions={type:i.TSliderType["from-start"],orientation:i.TOrientation.horizontal,hasRange:!0,isFromFixed:!1,isToFixed:!1}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.initialOptions={onCreate:null,onSlideStart:null,onSlide:null,onSlideFinish:null,onUpdate:null}},function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),a=n(6),s=i(a),l=n(7),u=i(l),c=n(12),d=i(c),f=n(2),h=n(0),p=n(3),v=n(4),y=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,t),this.root=e,this.modelOptions=Object.assign({},f.initialOptions),this.viewOptions=Object.assign({},p.initialOptions),this.controllerCallbacks=Object.assign({},v.initialOptions),this.init(n)}return r(t,[{key:"update",value:function(t){this.setOptions(t),this.model.updateOptions(this.modelOptions),this.view.updateOptions(this.viewOptions),this.controller.updateClientsCallbacks(this.controllerCallbacks)}},{key:"init",value:function(t){this.model=new s.default,this.view=new u.default(this.root),this.setOptions(t),this.model.updateOptions(this.modelOptions),this.view.updateOptions(this.viewOptions),this.controller=new d.default(this.model,this.view,this.controllerCallbacks)}},{key:"setOptions",value:function(t){this.modelOptions=Object.assign({},this.model.options),this.viewOptions=Object.assign({},this.view.options),t.type&&t.type in h.TSliderType&&(this.viewOptions.type=t.type,this.modelOptions.isDouble=t.type===h.TSliderType.double),t.orientation&&t.orientation in h.TOrientation&&(this.viewOptions.orientation=t.orientation),this.setNumberOption("min",t.min),this.setNumberOption("max",t.max),this.setNumberOption("from",t.from),this.setNumberOption("to",t.to),this.setNumberOption("step",t.step),this.setBoolOption("isFromFixed",t.isFromFixed),this.setBoolOption("isToFixed",t.isToFixed),this.setBoolOption("hasRange",t.hasRange),this.setCallback("onCreate",t.onCreate),this.setCallback("onSlideStart",t.onSlideStart),this.setCallback("onSlide",t.onSlide),this.setCallback("onSlideFinish",t.onSlideFinish),this.setCallback("onUpdate",t.onUpdate)}},{key:"setNumberOption",value:function(t,e){void 0===e||Number.isNaN(Number(e))||(this.modelOptions[t]=Number(e))}},{key:"setBoolOption",value:function(t,e){void 0!==e&&(this.viewOptions[t]=JSON.parse(e.toString()))}},{key:"setCallback",value:function(t,e){void 0!==e&&"function"==typeof e&&(this.controllerCallbacks[t]=e)}},{key:"getOptions",value:function(){return{type:this.view.options.type,from:this.model.state.from,to:this.model.state.to,isFromFixed:this.view.options.isFromFixed,isToFixed:this.view.options.isToFixed,orientation:this.view.options.orientation,min:this.model.options.min,max:this.model.options.max,step:this.model.options.step}}},{key:"data",get:function(){return this.getOptions()}}]),t}(),m=function(){function t(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};o(this,t);var i=t.getValidateNode(e);if(t.instances.has(i))return t.instances.get(i);var r=new y(i,n);this.setOptions=r.update.bind(r),this.data=r.data,t.instances.set(i,this)}return r(t,null,[{key:"getInstance",value:function(e){if(this.isDivOrSpan(e))return t.instances.get(e)}},{key:"getValidateNode",value:function(t){var e="string"==typeof t?document.querySelector(t):t;if(this.isDivOrSpan(e))return e;if(e instanceof HTMLCollection&&this.isDivOrSpan(e[0]))return e[0];throw new Error("Invalid node type, expected 'div' or 'span'")}},{key:"isDivOrSpan",value:function(t){return t instanceof HTMLDivElement||t instanceof HTMLSpanElement}}]),t}();e.default=m,m.instances=new Map},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=n(1),a=function(t){return t&&t.__esModule?t:{default:t}}(r),s=n(2),l=function(){function t(){i(this,t),this._events={stateChanged:new a.default},this._options=Object.assign({},s.initialOptions),this._state={from:s.initialOptions.from,to:s.initialOptions.to}}return o(t,[{key:"updateOptions",value:function(t){this.setType(t.isDouble),this.setStep(t.step),this.setRange(t.min,t.max),this.setHandleValues(t.from,t.to)}},{key:"updateState",value:function(t){var e=this._options;void 0!==t.from&&this.updateFromHandleValue(e,t.from),void 0!==t.to&&this.updateToHandleValue(e,t.to)}},{key:"updateFromHandleValue",value:function(t,e){var n=this.calcValueWithStep(e,t.min,t.step),i=t.isDouble?this.correctDiapason(n,t.min,this._state.to):this.correctDiapason(n,t.min,t.max);i!==this._state.from&&this.updateStateHandleValue("from",i)}},{key:"updateToHandleValue",value:function(t,e){var n=this.calcValueWithStep(e,t.min,t.step),i=t.isDouble?this.correctDiapason(n,this._state.from,t.max):this.correctDiapason(n,t.min,t.max);i!==this._state.to&&this.updateStateHandleValue("to",i)}},{key:"updateStateHandleValue",value:function(t,e){this._state[t]=e,this._events.stateChanged.notify({handle:t,value:e})}},{key:"setRange",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this._options.min,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this._options.max;this._options.min=t>e?e:t,this._options.max=e,this.correctFromTo()}},{key:"setHandleValues",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this._options.from,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this._options.to;this._options.from=t,this._options.to=e,this.correctFromTo()}},{key:"setStep",value:function(t){var e=this._options,n=e.max-e.min;e.step=this.correctStep(t,n)}},{key:"setType",value:function(t){this._options.isDouble=t,this.correctFromTo()}},{key:"correctFromTo",value:function(){var t=this._options;t.from=this.correctDiapason(t.from,t.min,t.max),t.to=t.isDouble?this.correctDiapason(t.to,t.from,t.max):t.to,this._state={from:t.from,to:t.to}}},{key:"calcValueWithStep",value:function(t,e,n){return Math.round((t-e)/n)*n+e}},{key:"correctDiapason",value:function(t,e,n){return t<=e?e:t>=n?n:t}},{key:"correctStep",value:function(t,e){return t<=0?1:t>e?e:t}},{key:"options",get:function(){return Object.assign({},this._options)}},{key:"state",get:function(){return Object.assign({},this._state)}},{key:"events",get:function(){return Object.assign({},this._events)}}]),t}();e.default=l},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),r=n(8),a=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(r),s=n(9),l=n(1),u=function(t){return t&&t.__esModule?t:{default:t}}(l),c=n(0),d=n(3);n(10),n(11);var f=function(){function t(e){i(this,t),this.draggingHandle=null,this._events={slideStart:new u.default,slideFinish:new u.default,slide:new u.default},this._options=Object.assign({},d.initialOptions),this.init(e)}return o(t,[{key:"updateOptions",value:function(t){this.setOptions(t),this.render()}},{key:"emitCustomEvent",value:function(t,e){this.nodes[e].dispatchEvent(t)}},{key:"changeHandlePosition",value:function(t,e){var n=this._options.orientation,i=this.nodes[t],o=n===c.TOrientation.vertical?"bottom":"left";i.style[o]=e+"%",this.calcRange()}},{key:"init",value:function(t){this.nodes={root:t,track:document.createElement("div"),from:document.createElement("span"),to:document.createElement("span"),range:document.createElement("div")},this.render(),this.initDragHandlers()}},{key:"setOptions",value:function(t){this._options=Object.assign({},t)}},{key:"render",value:function(){var t=this._options,e=this.nodes;this.stylizeNodes(),e.root.innerHTML="",e.track.innerHTML="",e.root.appendChild(e.track),t.hasRange&&e.track.appendChild(e.range),t.type===c.TSliderType["from-start"]&&e.track.appendChild(e.from),t.type===c.TSliderType["from-end"]&&e.track.appendChild(e.to),t.type===c.TSliderType.double&&(e.track.appendChild(e.from),e.track.appendChild(e.to))}},{key:"initDragHandlers",value:function(){window.removeEventListener("mousemove",this.drag),window.removeEventListener("mouseup",this.finishDragging),this.nodes.track.addEventListener("mousedown",this.startDragging)}},{key:"calcRange",value:function(){if(this._options.hasRange){var t=this._options,e=this.nodes,n=t.orientation===c.TOrientation.vertical?"bottom":"left",i=t.orientation===c.TOrientation.vertical?"top":"right";t.type===c.TSliderType["from-start"]&&(e.range.style[n]="0",e.range.style[i]=100-parseFloat(e.from.style[n])+"%"),t.type===c.TSliderType["from-end"]&&(e.range.style[n]=e.to.style[n],e.range.style[i]="0"),t.type===c.TSliderType.double&&(e.range.style[n]=e.from.style[n],e.range.style[i]=100-parseFloat(e.to.style[n])+"%")}}},{key:"stylizeNodes",value:function(){var t=this._options,e=this.nodes;e.track.setAttribute("class","vanilla-slider vanilla-slider_"+t.type+" vanilla-slider_"+t.orientation),e.range.setAttribute("class","vanilla-slider__range vanilla-slider__range_"+t.type),e.range.removeAttribute("style"),e.from.setAttribute("tabindex","0"),e.from.setAttribute("class","vanilla-slider__handle vanilla-slider__handle_from"+(t.isFromFixed?" vanilla-slider__handle_fixed":"")),e.from.removeAttribute("style"),e.to.setAttribute("tabindex","1"),e.to.setAttribute("class","vanilla-slider__handle vanilla-slider__handle_to"+(t.isToFixed?" vanilla-slider__handle_fixed":"")),e.to.removeAttribute("style")}},{key:"startDragging",value:function(t){var e=this.nodes;this.draggingHandle=this.chooseHandle(t),this.draggingHandle&&(e.from.classList.remove("vanilla-slider__handle_last-type"),e.to.classList.remove("vanilla-slider__handle_last-type"),e[this.draggingHandle].classList.add("vanilla-slider__handle_active"),e[this.draggingHandle].classList.add("vanilla-slider__handle_last-type"),this.drag(t),window.addEventListener("mousemove",this.drag),window.addEventListener("mouseup",this.finishDragging),this._events.slideStart.notify({handle:this.draggingHandle}))}},{key:"drag",value:function(t){if(this.draggingHandle){var e=this.getRelativeCoords(t);this._events.slide.notify({handle:this.draggingHandle,pixels:e})}}},{key:"finishDragging",value:function(){this.draggingHandle&&(window.removeEventListener("mousemove",this.drag),window.removeEventListener("mouseup",this.finishDragging),this.nodes[this.draggingHandle].classList.remove("vanilla-slider__handle_active"),this._events.slideFinish.notify({handle:this.draggingHandle}),this.draggingHandle=null)}},{key:"chooseHandle",value:function(t){var e=this._options;return e.isFromFixed&&e.isToFixed?null:e.type===c.TSliderType["from-start"]?e.isFromFixed?null:"from":e.type===c.TSliderType["from-end"]?e.isToFixed?null:"to":e.type===c.TSliderType.double?this.chooseDoubleSliderHandle(t):null}},{key:"chooseDoubleSliderHandle",value:function(t){var e=this._options,n=this.nodes,i=t.target;return i===n.from?e.isFromFixed?null:"from":i===n.to?e.isToFixed?null:"to":i===n.range||i===n.track?e.isFromFixed?"to":e.isToFixed?"from":this.chooseHandleByCoords(t):null}},{key:"chooseHandleByCoords",value:function(t){var e=this._options,n=this.nodes,i=this.getHandleCoords(n.from),o=this.getHandleCoords(n.to),r=this.getRelativeCoords(t);return e.orientation===c.TOrientation.horizontal&&r<i?"from":e.orientation===c.TOrientation.horizontal&&r>o?"to":e.orientation===c.TOrientation.vertical&&r>i?"from":e.orientation===c.TOrientation.vertical&&r<o?"to":Math.abs(i-r)<Math.abs(o-r)?"from":"to"}},{key:"getRelativeCoords",value:function(t){var e=this.nodes,n=this._options.orientation===c.TOrientation.horizontal?"pageX":"pageY",i=this._options.orientation===c.TOrientation.horizontal?"offsetLeft":"offsetTop";return t[n]-e.track[i]}},{key:"getHandleCoords",value:function(t){var e=this._options.orientation===c.TOrientation.horizontal?"offsetLeft":"offsetTop",n=this._options.orientation===c.TOrientation.horizontal?"offsetWidth":"offsetHeight";return t[e]+t[n]/2}},{key:"getSliderSize",value:function(){return{width:this.nodes.track.clientWidth,height:this.nodes.track.clientHeight}}},{key:"options",get:function(){return Object.assign({},this._options)}},{key:"sliderSize",get:function(){return this.getSliderSize()}},{key:"events",get:function(){return Object.assign({},this._events)}}]),t}();a.__decorate([s.bind],f.prototype,"startDragging",null),a.__decorate([s.bind],f.prototype,"drag",null),a.__decorate([s.bind],f.prototype,"finishDragging",null),e.default=f},function(t,e,n){"use strict";function i(t,e){function n(){this.constructor=t}O(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}function o(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&e.indexOf(i)<0&&(n[i]=t[i]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,i=Object.getOwnPropertySymbols(t);o<i.length;o++)e.indexOf(i[o])<0&&(n[i[o]]=t[i[o]]);return n}function r(t,e,n,i){var o,r=arguments.length,a=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,i);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(a=(r<3?o(a):r>3?o(e,n,a):o(e,n))||a);return r>3&&a&&Object.defineProperty(e,n,a),a}function a(t,e){return function(n,i){e(n,i,t)}}function s(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}function l(t,e,n,i){return new(n||(n=Promise))(function(o,r){function a(t){try{l(i.next(t))}catch(t){r(t)}}function s(t){try{l(i.throw(t))}catch(t){r(t)}}function l(t){t.done?o(t.value):new n(function(e){e(t.value)}).then(a,s)}l((i=i.apply(t,e||[])).next())})}function u(t,e){function n(t){return function(e){return i([t,e])}}function i(n){if(o)throw new TypeError("Generator is already executing.");for(;l;)try{if(o=1,r&&(a=2&n[0]?r.return:n[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,n[1])).done)return a;switch(r=0,a&&(n=[2&n[0],a.value]),n[0]){case 0:case 1:a=n;break;case 4:return l.label++,{value:n[1],done:!1};case 5:l.label++,r=n[1],n=[0];continue;case 7:n=l.ops.pop(),l.trys.pop();continue;default:if(a=l.trys,!(a=a.length>0&&a[a.length-1])&&(6===n[0]||2===n[0])){l=0;continue}if(3===n[0]&&(!a||n[1]>a[0]&&n[1]<a[3])){l.label=n[1];break}if(6===n[0]&&l.label<a[1]){l.label=a[1],a=n;break}if(a&&l.label<a[2]){l.label=a[2],l.ops.push(n);break}a[2]&&l.ops.pop(),l.trys.pop();continue}n=e.call(t,l)}catch(t){n=[6,t],r=0}finally{o=a=0}if(5&n[0])throw n[1];return{value:n[0]?n[1]:void 0,done:!0}}var o,r,a,s,l={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return s={next:n(0),throw:n(1),return:n(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s}function c(t,e){for(var n in t)e.hasOwnProperty(n)||(e[n]=t[n])}function d(t){var e="function"==typeof Symbol&&t[Symbol.iterator],n=0;return e?e.call(t):{next:function(){return t&&n>=t.length&&(t=void 0),{value:t&&t[n++],done:!t}}}}function f(t,e){var n="function"==typeof Symbol&&t[Symbol.iterator];if(!n)return t;var i,o,r=n.call(t),a=[];try{for(;(void 0===e||e-- >0)&&!(i=r.next()).done;)a.push(i.value)}catch(t){o={error:t}}finally{try{i&&!i.done&&(n=r.return)&&n.call(r)}finally{if(o)throw o.error}}return a}function h(){for(var t=[],e=0;e<arguments.length;e++)t=t.concat(f(arguments[e]));return t}function p(t){return this instanceof p?(this.v=t,this):new p(t)}function v(t,e,n){function i(t){c[t]&&(u[t]=function(e){return new Promise(function(n,i){d.push([t,e,n,i])>1||o(t,e)})})}function o(t,e){try{r(c[t](e))}catch(t){l(d[0][3],t)}}function r(t){t.value instanceof p?Promise.resolve(t.value.v).then(a,s):l(d[0][2],t)}function a(t){o("next",t)}function s(t){o("throw",t)}function l(t,e){t(e),d.shift(),d.length&&o(d[0][0],d[0][1])}if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var u,c=n.apply(t,e||[]),d=[];return u={},i("next"),i("throw"),i("return"),u[Symbol.asyncIterator]=function(){return this},u}function y(t){function e(e,o){n[e]=t[e]?function(n){return(i=!i)?{value:p(t[e](n)),done:"return"===e}:o?o(n):n}:o}var n,i;return n={},e("next"),e("throw",function(t){throw t}),e("return"),n[Symbol.iterator]=function(){return this},n}function m(t){function e(e){i[e]=t[e]&&function(i){return new Promise(function(o,r){i=t[e](i),n(o,r,i.done,i.value)})}}function n(t,e,n,i){Promise.resolve(i).then(function(e){t({value:e,done:n})},e)}if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var i,o=t[Symbol.asyncIterator];return o?o.call(t):(t="function"==typeof d?d(t):t[Symbol.iterator](),i={},e("next"),e("throw"),e("return"),i[Symbol.asyncIterator]=function(){return this},i)}function b(t,e){return Object.defineProperty?Object.defineProperty(t,"raw",{value:e}):t.raw=e,t}function g(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}function _(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0}),e.__extends=i,n.d(e,"__assign",function(){return k}),e.__rest=o,e.__decorate=r,e.__param=a,e.__metadata=s,e.__awaiter=l,e.__generator=u,e.__exportStar=c,e.__values=d,e.__read=f,e.__spread=h,e.__await=p,e.__asyncGenerator=v,e.__asyncDelegator=y,e.__asyncValues=m,e.__makeTemplateObject=b,e.__importStar=g,e.__importDefault=_;var O=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])},k=Object.assign||function(t){for(var e,n=1,i=arguments.length;n<i;n++){e=arguments[n];for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o])}return t}},function(t,e,n){var i,o,r;!function(n,a){o=[e],i=a,void 0!==(r="function"==typeof i?i.apply(e,o):i)&&(t.exports=r)}(0,function(t){"use strict";function e(t,e){e=e||t.decorate||n(t);var i=e();return function(){for(var n=arguments.length,o=Array(n),r=0;r<n;r++)o[r]=arguments[r];var a=o.length;return(a<2?e:a>2?i:t).apply(void 0,o)}}function n(t){return function(e){return"function"==typeof e?t(e):function(n,i,o){o.value=t(o.value,e,n,i,o)}}}t.__esModule=!0;var i={},o=Object.prototype.hasOwnProperty,r={memoize:function(t){var e=arguments.length<=1||void 0===arguments[1]?i:arguments[1],n=e.cache||{};return function(){for(var i=arguments.length,r=Array(i),a=0;a<i;a++)r[a]=arguments[a];var s=String(r[0]);return!1===e.caseSensitive&&(s=s.toLowerCase()),o.call(n,s)?n[s]:n[s]=t.apply(this,r)}},debounce:function(t,e){if("function"==typeof e){var n=t;t=e,e=n}var i=e&&e.delay||e||0,o=void 0,r=void 0,a=void 0;return function(){for(var e=arguments.length,n=Array(e),s=0;s<e;s++)n[s]=arguments[s];o=n,r=this,a||(a=setTimeout(function(){t.apply(r,o),o=r=a=null},i))}},bind:function(t,e,n){var i=n.value;return{configurable:!0,get:function(){var t=i.bind(this);return Object.defineProperty(this,e,{value:t,configurable:!0,writable:!0}),t}}}},a=e(r.memoize),s=e(r.debounce),l=e(function(t,e){return t.bind(e)},function(){return r.bind});t.memoize=a,t.debounce=s,t.bind=l,t.default={memoize:a,debounce:s,bind:l}})},function(t,e){},function(t,e){},function(t,e,n){"use strict";function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),a=n(0),s=n(4),l=function(){function t(e,n,i){o(this,t),this.model=e,this.view=n,this.callbacks=Object.assign({},s.initialOptions),this.init(i)}return r(t,[{key:"updateClientsCallbacks",value:function(t){this.setCallbacks(t),this.emitEvent("vanillaupdate","root",this.callbacks.onUpdate),this.updateViewHandlesPosition()}},{key:"init",value:function(t){this.setCallbacks(t),this.emitEvent("vanillacreate","root",this.callbacks.onCreate),this.attachModelEvents(),this.attachViewEvents(),this.updateViewHandlesPosition()}},{key:"setCallbacks",value:function(t){this.callbacks.onCreate=t.onCreate,this.callbacks.onSlideStart=t.onSlideStart,this.callbacks.onSlide=t.onSlide,this.callbacks.onSlideFinish=t.onSlideFinish,this.callbacks.onUpdate=t.onUpdate}},{key:"attachViewEvents",value:function(){var t=this,e=this.model,n=this.view;n.events.slide.attach(function(n){var o=n.handle,r=n.pixels;e.updateState(i({},o,t.convertToSliderValue(r)))}),n.events.slideStart.attach(function(e){var n=e.handle;t.emitEvent("vanillastart",n,t.callbacks.onSlideStart)}),n.events.slideFinish.attach(function(e){var n=e.handle;t.emitEvent("vanillafinish",n,t.callbacks.onSlideFinish)})}},{key:"attachModelEvents",value:function(){var t=this,e=this.model,n=this.view;e.events.stateChanged.attach(function(e){var i=e.handle,o=e.value;n.changeHandlePosition(i,t.convertToPercent(o)),t.emitEvent("vanillaslide",i,t.callbacks.onSlide)})}},{key:"convertToPercent",value:function(t){var e=this.model.options,n=e.max-e.min;return Number((100*(t-e.min)/n).toFixed(10))}},{key:"convertToSliderValue",value:function(t){var e=this.model.options,n=this.view.sliderSize,i=e.max-e.min;return this.view.options.orientation===a.TOrientation.horizontal?Number((t*i/n.width+e.min).toFixed(10)):Number(((n.height-t)*i/n.height+e.min).toFixed(10))}},{key:"emitEvent",value:function(t,e,n){var i=this.createSliderEvent(t);this.view.emitCustomEvent(i,e),this.callClientCallback(i,n)}},{key:"updateViewHandlesPosition",value:function(){this.view.changeHandlePosition("from",this.convertToPercent(this.model.state.from)),this.view.changeHandlePosition("to",this.convertToPercent(this.model.state.to))}},{key:"callClientCallback",value:function(t,e){e&&e(t,Object.assign({},this.model.state))}},{key:"createSliderEvent",value:function(t){return new CustomEvent(t,{detail:Object.assign({},this.model.state),bubbles:!0,cancelable:!0})}}]),t}();e.default=l}]).default});