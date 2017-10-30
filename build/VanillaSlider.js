!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.VanillaSlider=e():t.VanillaSlider=e()}(this,function(){return function(t){function e(i){if(o[i])return o[i].exports;var n=o[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var o={};return e.m=t,e.c=o,e.d=function(t,o,i){e.o(t,o)||Object.defineProperty(t,o,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(o,"a",o),o},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function t(){this.listeners=new Set}return t.prototype.attach=function(t){this.listeners.add(t)},t.prototype.remove=function(t){this.listeners.delete(t)},t.prototype.notify=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];this.listeners.forEach(function(e){e.apply(void 0,t)})},t}();e.default=i},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),o(4),o(5);var i=o(0),n=function(){function t(e,o){void 0===o&&(o={}),this.root=e,this.handle=null,this.mousemove=this.mouseMove.bind(this),this.mouseup=this.mouseUp.bind(this),this.triggers={slideStart:new i.default,slideEnd:new i.default,fromChanged:new i.default,toChanged:new i.default},this.options={type:t.types.single,orientation:t.orientations.horizontal,from_fixed:!1,to_fixed:!1},this.nodes={track:document.createElement("div"),from:document.createElement("span")},this.init(o)}return Object.defineProperty(t.prototype,"data",{get:function(){return this.options},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"events",{get:function(){return this.triggers},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"nodesData",{get:function(){return this.nodes},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"rootObject",{get:function(){return this.root},enumerable:!0,configurable:!0}),t.prototype.init=function(e,o){var i=this.options,n=e;n.type&&n.type in t.types&&(i.type=n.type),n.orientation&&n.orientation in t.orientations&&(i.orientation=n.orientation),void 0!==n.from_fixed&&(i.from_fixed=n.from_fixed),void 0!==n.to_fixed&&(i.to_fixed=n.to_fixed),this.rootEmpty(),this.setNodes(),this.render(),this.setHandlers()},t.prototype.calcFrom=function(e){var o=this.options,i=t.orientations,n=this.nodes;o.orientation===i.horizontal?n.from.style.left=e+"%":n.from.style.bottom=e+"%",this.calcRange()},t.prototype.calcTo=function(e){var o=this.options,i=t.orientations,n=t.types,r=this.nodes,s="left";o.type===n.double&&r.to&&(o.orientation===i.vertical&&(s="bottom"),r.to.style[s]=e+"%",this.calcRange())},t.prototype.render=function(){var e=this.options,o=this.root,i=this.nodes,n=t.orientations;if(o.appendChild(i.track),i.track.appendChild(i.from),i.range&&i.track.appendChild(i.range),i.to&&i.track.appendChild(i.to),e.orientation===n.horizontal&&!i.track.clientWidth)throw"zero container width";if(e.orientation===n.vertical&&!i.track.clientHeight)throw"zero container height"},t.prototype.setHandlers=function(){var t=(this.triggers,this.nodes);window.removeEventListener("mousemove",this.mousemove),t.track.removeEventListener("mousedown",this.mouseDown.bind(this)),window.removeEventListener("mouseup",this.mouseup),t.track.addEventListener("mousedown",this.mouseDown.bind(this))},t.prototype.setEvents=function(){},t.prototype.calcRange=function(){var e=this.options,o=t.orientations,i=t.types,n=this.nodes,r="left",s="right";e.type!==i.single&&n.range&&(e.orientation===o.vertical&&(r="bottom",s="top"),e.type===i.min?(n.range.style[r]="0",n.range.style[s]=100-parseFloat(n.from.style[r])+"%"):e.type===i.max?(n.range.style[r]=n.from.style[r],n.range.style[s]="0"):e.type===i.double&&n.to&&(n.range.style[r]=n.from.style[r],n.range.style[s]=100-parseFloat(n.to.style[r])+"%"))},t.prototype.setNodes=function(){this.nodes={track:document.createElement("div"),from:document.createElement("span")};var e=this.options,o=this.nodes;this.root.className.indexOf("vanilla")<0&&(this.root.className+=" vanilla"),o.track.setAttribute("class","vanilla-slider vanilla-"+e.type+" vanilla-"+e.orientation),o.from.setAttribute("tabindex","0"),o.from.setAttribute("class","vanilla-handle vanilla-handle-from"),e.from_fixed&&o.from.classList.add("vanilla-handle-fixed"),e.type!==t.types.single?(o.range=document.createElement("div"),o.range.setAttribute("class","vanilla-range vanilla-range-"+e.type)):delete o.range,e.type===t.types.double?(o.to=document.createElement("span"),o.to.setAttribute("tabindex","0"),o.to.setAttribute("class","vanilla-handle vanilla-handle-to"),e.to_fixed&&o.to.classList.add("vanilla-handle-fixed")):delete o.to},t.prototype.rootEmpty=function(){for(;this.root.firstChild;)this.root.removeChild(this.root.firstChild)},t.prototype.mouseDown=function(e){var o=this.options,i=this.nodes,n=t.orientations,r=this.events,s=o.orientation===n.horizontal?e.pageX-i.track.offsetLeft:e.pageY-i.track.offsetTop;e.preventDefault(),e.target===i.from?this.handle=i.from:e.target===i.to?this.handle=i.to:e.target!==i.range&&e.target!==i.track||(this.handle=this.chooseHandle(s),this.mouseMove(e)),i.from.classList.remove("last-type"),i.to&&i.to.classList.remove("last-type");var a=this.getCoord(e);this.handle&&(this.handle.classList.add("active"),this.handle.classList.add("last-type"),r.slideStart.notify(this.handle,a)),window.addEventListener("mousemove",this.mousemove),window.addEventListener("mouseup",this.mouseup)},t.prototype.mouseMove=function(t){var e=this.events,o=this.nodes,i=this.getCoord(t);this.handle===o.from?e.fromChanged.notify(this.handle,i):this.handle===o.to&&e.toChanged.notify(this.handle,i)},t.prototype.mouseUp=function(t){var e=(this.nodes,t.target,this.events),o=this.getCoord(t);window.removeEventListener("mousemove",this.mousemove),window.removeEventListener("mouseup",this.mouseup),this.handle&&(this.handle.classList.remove("active"),e.slideEnd.notify(this.handle,o)),this.handle=null},t.prototype.chooseHandle=function(e){var o=this.options,i=t.types,n=(t.orientations,this.nodes);if(this.handle)return this.handle;if(o.type!==i.double)return n.from;if(o.from_fixed&&o.to_fixed)return null;if(o.from_fixed)return n.to;if(o.to_fixed)return n.from;var r=this.offset(n.from),s=this.offset(n.to);return r===s?e<r?n.from:n.to:Math.abs(r-e)<Math.abs(s-e)?n.from:n.to},t.prototype.getCoord=function(e){var o=this.options,i=t.orientations,n=this.nodes;return o.orientation===i.horizontal?e.pageX-n.track.offsetLeft:e.pageY-n.track.offsetTop},t.prototype.outerWidth=function(t){var e=getComputedStyle(t);return t.offsetWidth+parseInt(e.marginLeft)+parseInt(e.marginRight)},t.prototype.outerHeight=function(t){var e=getComputedStyle(t);return t.offsetHeight+parseInt(e.marginLeft)+parseInt(e.marginRight)},t.prototype.offset=function(e){var o=this.options,i=t.orientations;return o.orientation===i.horizontal?e.offsetLeft+this.outerWidth(e)/2:e.offsetTop+this.outerHeight(e)/2},t.types={single:"single",min:"min",max:"max",double:"double"},t.orientations={horizontal:"horizontal",vertical:"vertical"},t}();e.default=n},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=o(3),n=o(1),r=o(6),s=function(){function t(t,e,o){void 0===e&&(e={}),this.wrap=o,this.setRoot(t)&&this.init(e)}return Object.defineProperty(t.prototype,"data",{get:function(){return Object.assign({},this.model.data,this.view.data)},enumerable:!0,configurable:!0}),t.prototype.set=function(t){this.setOptions(t)&&(this.model.init(this.modelOptions,!0),this.view.init(this.viewOptions,!0),this.controller.init(this.controllerOptions,!0))},t.prototype.init=function(t){this.setOptions(t),this.model=new i.default(this.modelOptions),this.view=new n.default(this.root,this.viewOptions),this.controller=new r.default(this.model,this.view,this.controllerOptions)},t.prototype.setOptions=function(t){var e=t,o=n.default.types,i=n.default.orientations,r=!1;if(this.modelOptions={},this.viewOptions={},this.controllerOptions={},e.type&&e.type in o&&(this.viewOptions.type=e.type,this.modelOptions.type=e.type===o.double,r=!0),e.orientation&&e.orientation in i&&(this.viewOptions.orientation=e.orientation,r=!0),void 0===e.min||Number.isNaN(Number(e.min))||(this.modelOptions.min=Number(e.min),r=!0),void 0===e.max||Number.isNaN(Number(e.max))||(this.modelOptions.max=Number(e.max),r=!0),void 0===e.from||Number.isNaN(Number(e.from))||(this.modelOptions.from=Number(e.from),r=!0),void 0===e.to||Number.isNaN(Number(e.to))||(this.modelOptions.to=Number(e.to),r=!0),void 0!==e.from_fixed){var s=/true/i.test(e.from_fixed.toString());this.modelOptions.from_fixed=s,this.viewOptions.from_fixed=s,r=!0}if(void 0!==e.to_fixed){var s=/true/i.test(e.to_fixed.toString());this.modelOptions.to_fixed=s,this.viewOptions.to_fixed=s,r=!0}return void 0===e.step||Number.isNaN(Number(e.step))||(this.modelOptions.step=Number(e.step),r=!0),this.controllerOptions.onCreate=e.onCreate,this.controllerOptions.onStart=e.onStart,this.controllerOptions.onSlide=e.onSlide,this.controllerOptions.onEnd=e.onEnd,this.controllerOptions.onUpdate=e.onUpdate,r},t.prototype.setRoot=function(e){var o=t.checkNode(e);if(!o)throw"Invalid node type, expected 'div'";return this.root=o,!0},t.checkNode=function(t){if(t instanceof HTMLDivElement||t instanceof HTMLSpanElement)return t;if(t instanceof HTMLCollection&&t[0]instanceof HTMLDivElement)return t[0];if("string"==typeof t){var e=document.querySelector(t);if(e instanceof HTMLDivElement||e instanceof HTMLSpanElement)return e}},t}(),a=function(){function t(e,o){void 0===o&&(o={});var i=new s(e,o,this);this.set=i.set.bind(i),this.data=function(){return i.data},t.instances.push(i)}return t.for=function(e){for(var o=s.checkNode(e),i=0,n=t.instances;i<n.length;i++){var r=n[i];if(o&&o===r.root)return r.wrap}},t.instances=[],t}();e.default=a},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=o(0),n=function(){function t(t){void 0===t&&(t={}),this.triggers={fromChanged:new i.default,toChanged:new i.default},this.options={type:!1,min:0,max:100,from:0,from_fixed:!1,to:0,to_fixed:!1,step:1},this.init(t)}return Object.defineProperty(t.prototype,"data",{get:function(){return this.options},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"events",{get:function(){return this.triggers},enumerable:!0,configurable:!0}),t.prototype.init=function(t,e){void 0===t&&(t={}),void 0!==t.type&&this.setType(t.type),void 0!==t.step&&this.setStep(t.step),void 0===t.min&&void 0===t.max||this.setRange(t.min,t.max),void 0===t.from_fixed&&void 0===t.to_fixed||this.setFixed(t.from_fixed,t.to_fixed),void 0===t.from&&void 0===t.to||this.setValues(t.from,t.to)},t.prototype.calcFromWithStep=function(t){var e,o=this.options;o.from_fixed||(e=o.type?this.inDaipason(t,o.min,o.to):this.inDaipason(t,o.min,o.max),e===t&&(e=Math.round((t-o.min)/o.step)*o.step+o.min),e!=o.from&&(o.from=e,this.triggers.fromChanged.notify(o.from)))},t.prototype.calcToWithStep=function(t){var e,o=this.options;o.type&&!o.to_fixed&&(e=this.inDaipason(t,o.from,o.max),e===t&&(e=Math.round((t-o.min)/o.step)*o.step+o.min),e!=o.to&&(o.to=e,this.triggers.toChanged.notify(o.to)))},t.prototype.setRange=function(t,e){void 0===t&&(t=this.options.min),void 0===e&&(e=this.options.max);var o=this.options;t>e&&(e=t),o.min=t,o.max=e,this.updateFromTo()},t.prototype.setValues=function(t,e){void 0===t&&(t=this.options.from),void 0===e&&(e=this.options.to);var o=this.options;o.from=t,o.to=e,this.updateFromTo()},t.prototype.setStep=function(t){var e=this.options,o=e.max-e.min;e.step=t<=0?1:t>o?o:t},t.prototype.setType=function(t){this.options.type=t,this.updateFromTo()},t.prototype.setFixed=function(t,e){void 0===t&&(t=this.options.from_fixed),void 0===e&&(e=this.options.to_fixed);var o=this.options;o.from_fixed=t,o.to_fixed=e},t.prototype.updateFromTo=function(){var t=this.options;t.from=this.inDaipason(t.from,t.min,t.max),t.type&&(t.to=this.inDaipason(t.to,t.from,t.max))},t.prototype.inDaipason=function(t,e,o){return void 0===e&&(e=this.options.min),void 0===o&&(o=this.options.min),t<e?e:t>o?o:t},t}();e.default=n},function(t,e){},function(t,e){},function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=o(1),n=function(){function t(t,e,o){this.model=t,this.view=e,this.callbacks={},this.customEvents={},this.init(o)}return t.prototype.init=function(t,e){var o=this,i=this.model,n=this.view,r=this.callbacks,s=this.customEvents,a=this.model.events,d=this.view.events;t.onCreate&&(r.onCreate=t.onCreate),t.onStart&&(r.onStart=t.onStart),t.onSlide&&(r.onSlide=t.onSlide),t.onEnd&&(r.onEnd=t.onEnd),t.onUpdate&&(r.onUpdate=t.onUpdate),e?(s.update=new CustomEvent("vanillaupdate",{detail:{target:n.rootObject},bubbles:!0,cancelable:!0}),this.callFunction(s.update,{from:i.data.from,to:i.data.to},r.onUpdate),n.rootObject.dispatchEvent(s.update)):(s.create=new CustomEvent("vanillacreate",{detail:{target:n.rootObject},bubbles:!0,cancelable:!0}),n.rootObject.dispatchEvent(s.create),this.callFunction(s.create,{from:i.data.from,to:i.data.to},r.onCreate)),d.fromChanged.attach(function(t,e){s.slide=new MouseEvent("vanillaslide",{bubbles:!0,cancelable:!0}),i.calcFromWithStep(o.convertToReal(e))}),d.toChanged.attach(function(t,e){s.slide=new MouseEvent("vanillaslide",{bubbles:!0,cancelable:!0}),i.calcToWithStep(o.convertToReal(e))}),d.slideStart.attach(function(t){s.start=new MouseEvent("vanillastart",{bubbles:!0,cancelable:!0}),o.callFunction(s.start,{handle:t,from:i.data.from,to:i.data.to},r.onStart),t.dispatchEvent(s.start)}),d.slideEnd.attach(function(t){s.end=new MouseEvent("vanillaend",{bubbles:!0,cancelable:!0}),o.callFunction(s.end,{handle:t,from:i.data.from,to:i.data.to},r.onEnd),t.dispatchEvent(s.end)}),a.fromChanged.attach(function(t){n.calcFrom(o.converToPercent(t)),s.slide&&(o.callFunction(s.slide,{handle:n.nodesData.from,from:i.data.from,to:i.data.to},r.onSlide),n.nodesData.from.dispatchEvent(s.slide))}),a.toChanged.attach(function(t){n.calcTo(o.converToPercent(t)),s.slide&&(o.callFunction(s.slide,{handle:n.nodesData.to,from:i.data.from,to:i.data.to},r.onSlide),n.nodesData.to.dispatchEvent(s.slide))}),this.view.calcFrom(this.converToPercent(i.data.from)),this.view.calcTo(this.converToPercent(i.data.to))},t.prototype.converToPercent=function(t){var e=this.model.data,o=e.max-e.min;return+(100*(t-e.min)/o).toFixed(10)},t.prototype.convertToReal=function(t){var e=this.view.data,o=this.view.nodesData,n=i.default.orientations,r=this.model.data,s=r.max-r.min;if(e.orientation===n.horizontal){return+(t*s/o.track.clientWidth+r.min).toFixed(10)}var a=o.track.clientHeight;return+((a-t)*s/a+r.min).toFixed(10)},t.prototype.callFunction=function(t,e,o){void 0===e&&(e={}),o&&"function"==typeof o&&o(t,e)},t}();e.default=n}]).default});