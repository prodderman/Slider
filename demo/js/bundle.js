/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "3cd52e2f44eba5aa7ded"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./index.js")(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./components/view/theme.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".vanilla-slider {\n  background-color: #f6f6f6;\n  border-radius: 0.3em; }\n\n.vanilla-horizontal {\n  height: 0.6em; }\n  .vanilla-horizontal .vanilla-range {\n    height: 100%; }\n\n.vanilla-vertical {\n  width: 0.6em;\n  min-height: 200px; }\n  .vanilla-vertical .vanilla-range {\n    width: 100%; }\n\n.vanilla-handle {\n  width: 1.2em;\n  height: 1.2em;\n  border-radius: 0.3em;\n  background-color: #f6f6f6;\n  border: 1px solid #ed5565;\n  cursor: pointer;\n  outline: none; }\n  .vanilla-handle:hover {\n    border-color: #c71528; }\n  .vanilla-handle:focus {\n    box-shadow: 0 0 2px 0 blue;\n    border-color: #c71528; }\n  .vanilla-handle-active {\n    background-color: #c71528; }\n\n.vanilla-range {\n  background-color: #ed5565;\n  border-radius: 0.3em; }\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./components/view/view.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, ".vanilla-slider {\n  position: relative;\n  text-align: left; }\n\n.vanilla-horizontal {\n  width: 100%; }\n  .vanilla-horizontal .vanilla-handle {\n    top: -0.35em;\n    margin-left: -0.55em; }\n\n.vanilla-vertical {\n  height: 100%; }\n  .vanilla-vertical .vanilla-handle {\n    left: -0.35em;\n    margin-bottom: -0.7em; }\n\n.vanilla-handle {\n  position: absolute;\n  display: block;\n  z-index: 3;\n  cursor: default;\n  white-space: nowrap; }\n  .vanilla-handle.last-type {\n    z-index: 4; }\n  .vanilla-handle.active {\n    z-index: 5; }\n  .vanilla-handle-fixed {\n    z-index: 2; }\n\n.vanilla-range {\n  position: absolute;\n  display: block;\n  z-index: 1; }\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./index.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "body {\n  padding: 10vh 10vw;\n  min-height: 50vh; }\n\n.slider {\n  height: 100%;\n  margin-bottom: 50px; }\n", ""]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "../node_modules/style-loader/lib/addStyles.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__("../node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "../node_modules/style-loader/lib/urls.js":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./components/controller/controller.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = __webpack_require__("./components/view/view.ts");
var Controller = /** @class */ (function () {
    function Controller(model, view, callbacks) {
        this.model = model;
        this.view = view;
        this.callbacks = {};
        this.customEvents = {};
        this.init(callbacks);
    }
    // ================= public methods ===================
    Controller.prototype.init = function (callbacks, isUpdate) {
        var _this = this;
        var m = this.model;
        var v = this.view;
        var c = this.callbacks;
        var e = this.customEvents;
        var modelE = this.model.events;
        var viewE = this.view.events;
        if (callbacks.onCreate) {
            c.onCreate = callbacks.onCreate;
        }
        if (callbacks.onStart) {
            c.onStart = callbacks.onStart;
        }
        if (callbacks.onSlide) {
            c.onSlide = callbacks.onSlide;
        }
        if (callbacks.onEnd) {
            c.onEnd = callbacks.onEnd;
        }
        if (callbacks.onUpdate) {
            c.onUpdate = callbacks.onUpdate;
        }
        if (isUpdate) {
            e.update = new CustomEvent('vanillaupdate', {
                detail: {
                    target: v.rootObject
                }
            });
            this.callFunction(e.update, c.onUpdate);
            v.rootObject.dispatchEvent(e.update);
        }
        else {
            e.create = new CustomEvent('vanillacreate', {
                detail: {
                    target: v.rootObject
                }
            });
            v.rootObject.dispatchEvent(e.create);
            this.callFunction(e.create, c.onCreate);
        }
        viewE.fromChanged.attach(function (handle, value) {
            e.slide = new MouseEvent('vanillaslide', {
                bubbles: true
            });
            m.calcFromWithStep(_this.convertToReal(value));
        });
        viewE.toChanged.attach(function (handle, value) {
            e.slide = new MouseEvent('vanillaslide', {
                bubbles: true
            });
            m.calcToWithStep(_this.convertToReal(value));
        });
        viewE.slideStart.attach(function (handle) {
            var value;
            e.start = new MouseEvent('vanillastart', {
                bubbles: true
            });
            if (handle === v.nodesData.from) {
                value = m.data.from;
            }
            else {
                value = m.data.to;
            }
            _this.callFunction(e.start, {
                handle: handle,
                value: value
            }, c.onStart);
            handle.dispatchEvent(e.start);
        });
        viewE.slideEnd.attach(function (handle) {
            var value;
            e.end = new MouseEvent('vanillaend', {
                bubbles: true
            });
            if (handle === v.nodesData.from) {
                value = m.data.from;
            }
            else {
                value = m.data.to;
            }
            _this.callFunction(e.end, {
                handle: handle,
                value: m.data.from
            }, c.onEnd);
            handle.dispatchEvent(e.end);
        });
        modelE.fromChanged.attach(function (from) {
            v.calcFrom(from);
            if (!e.slide)
                return;
            _this.callFunction(e.slide, {
                handle: v.nodesData.from,
                value: m.data.from
            }, c.onSlide);
            v.nodesData.from.dispatchEvent(e.slide);
        });
        modelE.toChanged.attach(function (to) {
            v.calcTo(to);
            if (!e.slide)
                return;
            _this.callFunction(e.slide, {
                handle: v.nodesData.to,
                value: m.data.to
            }, c.onSlide);
            v.nodesData.to.dispatchEvent(e.slide);
        });
        this.view.calcFrom(this.converToPercent(m.data.from));
        this.view.calcTo(this.converToPercent(m.data.to));
    };
    // ================= private methods ===================
    Controller.prototype.converToPercent = function (value) {
        var m = this.model.data;
        var range = m.max - m.min;
        return +((value - m.min) * 100 / range).toFixed(10);
    };
    Controller.prototype.convertToReal = function (pixels) {
        var v = this.view.data;
        var n = this.view.nodesData;
        var d = view_1.default.orientations;
        var m = this.model.data;
        var range = m.max - m.min;
        if (v.orientation === d.horizontal) {
            var width = n.track.clientWidth;
            return +((pixels * range / width) + m.min).toFixed(10);
        }
        else {
            var height = n.track.clientHeight;
            return +(((height - pixels) * range / height) + m.min).toFixed(10);
        }
    };
    Controller.prototype.callFunction = function (event, data, callback) {
        if (data === void 0) { data = {}; }
        if (callback && typeof callback === "function") {
            callback(event, data);
        }
    };
    return Controller;
}());
exports.default = Controller;


/***/ }),

/***/ "./components/model/model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var observer_1 = __webpack_require__("./components/observer/observer.ts");
var Model = /** @class */ (function () {
    function Model(modelOptions) {
        if (modelOptions === void 0) { modelOptions = {}; }
        this.triggers = {
            fromChanged: new observer_1.default(),
            toChanged: new observer_1.default(),
        };
        this.options = {
            type: false,
            min: 0,
            max: 100,
            from: 0,
            from_fixed: false,
            to: 0,
            to_fixed: false,
            step: 1
        };
        this.init(modelOptions);
    }
    Object.defineProperty(Model.prototype, "data", {
        // accessors
        get: function () {
            return this.options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "events", {
        get: function () {
            return this.triggers;
        },
        enumerable: true,
        configurable: true
    });
    // public methods
    Model.prototype.init = function (options, isUpdate) {
        if (options === void 0) { options = {}; }
        if (options.type !== undefined) {
            this.setType(options.type);
        }
        if (options.step !== undefined) {
            this.setStep(options.step);
        }
        if (options.min !== undefined || options.max !== undefined) {
            this.setRange(options.min, options.max);
        }
        if (options.from_fixed !== undefined || options.to_fixed !== undefined) {
            this.setFixed(options.from_fixed, options.to_fixed);
        }
        if (options.from !== undefined || options.to !== undefined) {
            this.setValues(options.from, options.to);
        }
    };
    Model.prototype.calcFromWithStep = function (value) {
        var o = this.options;
        var result;
        if (o.from_fixed) {
            return;
        }
        if (o.type) {
            result = this.inDaipason(value, o.min, o.to);
        }
        else {
            result = this.inDaipason(value, o.min, o.max);
        }
        if (result === value) {
            result = Math.round((value - o.min) / o.step) * o.step + o.min;
        }
        if (result != o.from) {
            o.from = result;
            this.triggers.fromChanged.notify(o.from);
        }
    };
    Model.prototype.calcToWithStep = function (value) {
        var o = this.options;
        var result;
        if (!o.type || o.to_fixed) {
            return;
        }
        result = this.inDaipason(value, o.from, o.max);
        if (result === value) {
            result = Math.round((value - o.min) / o.step) * o.step + o.min;
        }
        if (result != o.to) {
            o.to = result;
            this.triggers.toChanged.notify(o.to);
        }
    };
    // private methods
    Model.prototype.setRange = function (min, max) {
        if (min === void 0) { min = this.options.min; }
        if (max === void 0) { max = this.options.max; }
        var o = this.options;
        if (min > max) {
            max = min;
        }
        o.min = min;
        o.max = max;
        this.updateFromTo();
    };
    Model.prototype.setValues = function (from, to) {
        if (from === void 0) { from = this.options.from; }
        if (to === void 0) { to = this.options.to; }
        var o = this.options;
        o.from = from;
        o.to = to;
        this.updateFromTo();
    };
    Model.prototype.setStep = function (step) {
        var o = this.options;
        var range = o.max - o.min;
        if (step < 0) {
            o.step = 1;
        }
        else if (step > range) {
            o.step = range;
        }
        else {
            o.step = step;
        }
    };
    Model.prototype.setType = function (type) {
        var o = this.options;
        o.type = type;
        this.updateFromTo();
    };
    Model.prototype.setFixed = function (from, to) {
        if (from === void 0) { from = this.options.from_fixed; }
        if (to === void 0) { to = this.options.to_fixed; }
        var o = this.options;
        o.from_fixed = from;
        o.to_fixed = to;
    };
    Model.prototype.updateFromTo = function () {
        var o = this.options;
        o.from = this.inDaipason(o.from, o.min, o.max);
        if (o.type) {
            o.to = this.inDaipason(o.to, o.from, o.max);
        }
    };
    Model.prototype.inDaipason = function (value, min, max) {
        if (min === void 0) { min = this.options.min; }
        if (max === void 0) { max = this.options.min; }
        if (value < min) {
            return min;
        }
        else if (value > max) {
            return max;
        }
        else {
            return value;
        }
    };
    return Model;
}());
exports.default = Model;


/***/ }),

/***/ "./components/observer/observer.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Event = /** @class */ (function () {
    function Event() {
        this.listeners = new Set();
    }
    Event.prototype.attach = function (listener) {
        this.listeners.add(listener);
    };
    Event.prototype.remove = function (listener) {
        this.listeners.delete(listener);
    };
    Event.prototype.notify = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.listeners.forEach(function (listener) {
            listener.apply(void 0, args);
        });
    };
    return Event;
}());
exports.default = Event;


/***/ }),

/***/ "./components/view/theme.scss":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./components/view/theme.scss");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./components/view/theme.scss", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./components/view/theme.scss");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/view/view.scss":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./components/view/view.scss");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./components/view/view.scss", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./components/view/view.scss");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./components/view/view.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./components/view/view.scss");
__webpack_require__("./components/view/theme.scss");
var observer_1 = __webpack_require__("./components/observer/observer.ts");
var View = /** @class */ (function () {
    function View(root, viewOptions) {
        if (viewOptions === void 0) { viewOptions = {}; }
        this.root = root;
        this.handle = null;
        this.mousemove = this.mouseMove.bind(this);
        this.mouseup = this.mouseUp.bind(this);
        this.triggers = {
            slideStart: new observer_1.default(),
            slideEnd: new observer_1.default(),
            fromChanged: new observer_1.default(),
            toChanged: new observer_1.default(),
        };
        this.options = {
            type: View.types.single,
            orientation: View.orientations.horizontal,
            from_fixed: false,
            to_fixed: false
        };
        this.nodes = {
            track: document.createElement('div'),
            from: document.createElement('span')
        };
        this.init(viewOptions);
    }
    Object.defineProperty(View.prototype, "data", {
        // ======================= accessors =========================
        get: function () {
            return this.options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "events", {
        get: function () {
            return this.triggers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "nodesData", {
        get: function () {
            return this.nodes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "rootObject", {
        get: function () {
            return this.root;
        },
        enumerable: true,
        configurable: true
    });
    // ======================= public methods ======================
    View.prototype.init = function (viewOptions, isUpdate) {
        var o = this.options;
        var v = viewOptions;
        if (v.type && v.type in View.types) {
            o.type = v.type;
        }
        if (v.orientation && v.orientation in View.orientations) {
            o.orientation = v.orientation;
        }
        if (v.from_fixed !== undefined) {
            o.from_fixed = v.from_fixed;
        }
        if (v.to_fixed !== undefined) {
            o.to_fixed = v.to_fixed;
        }
        this.rootEmpty();
        this.setNodes();
        this.render();
        this.setHandlers();
    };
    View.prototype.calcFrom = function (from) {
        var o = this.options;
        var d = View.orientations;
        var n = this.nodes;
        if (o.orientation === d.horizontal) {
            n.from.style.left = from + "%";
        }
        else {
            n.from.style.bottom = from + "%";
        }
        this.calcRange();
    };
    View.prototype.calcTo = function (to) {
        var o = this.options;
        var d = View.orientations;
        var t = View.types;
        var n = this.nodes;
        var base = 'left';
        if (o.type !== t.double || !n.to) {
            return;
        }
        if (o.orientation === d.vertical) {
            base = 'bottom';
        }
        n.to.style[base] = to + "%";
        this.calcRange();
    };
    // ================= private methods ===================
    View.prototype.render = function () {
        var o = this.options;
        var r = this.root;
        var n = this.nodes;
        var d = View.orientations;
        r.appendChild(n.track);
        n.track.appendChild(n.from);
        if (n.range) {
            n.track.appendChild(n.range);
        }
        if (n.to) {
            n.track.appendChild(n.to);
        }
        if (o.orientation === d.horizontal && !n.track.clientWidth) {
            throw "zero container width";
        }
        else if (o.orientation === d.vertical && !n.track.clientHeight) {
            throw "zero container height";
        }
    };
    View.prototype.setHandlers = function () {
        var t = this.triggers;
        var n = this.nodes;
        window.removeEventListener('mousemove', this.mousemove);
        n.track.removeEventListener('mousedown', this.mouseDown.bind(this));
        window.removeEventListener('mouseup', this.mouseup);
        n.track.addEventListener('mousedown', this.mouseDown.bind(this));
    };
    View.prototype.setEvents = function () {
    };
    View.prototype.calcRange = function () {
        var o = this.options;
        var d = View.orientations;
        var t = View.types;
        var n = this.nodes;
        var baseF = 'left';
        var baseT = 'right';
        if (o.type === t.single || !n.range) {
            return;
        }
        if (o.orientation === d.vertical) {
            baseF = 'bottom';
            baseT = 'top';
        }
        if (o.type === t.min) {
            n.range.style[baseF] = "0";
            n.range.style[baseT] = 100 - parseFloat(n.from.style[baseF]) + "%";
        }
        else if (o.type === t.max) {
            n.range.style[baseF] = n.from.style[baseF];
            n.range.style[baseT] = "0";
        }
        else if (o.type === t.double && n.to) {
            n.range.style[baseF] = n.from.style[baseF];
            n.range.style[baseT] = 100 - parseFloat(n.to.style[baseF]) + "%";
        }
    };
    View.prototype.setNodes = function () {
        this.nodes = {
            track: document.createElement('div'),
            from: document.createElement('span')
        };
        var o = this.options;
        var n = this.nodes;
        if (this.root.className.indexOf('vanilla') < 0) {
            this.root.className += ' vanilla';
        }
        n.track.setAttribute('class', "vanilla-slider vanilla-" + o.type + " vanilla-" + o.orientation);
        n.from.setAttribute('tabindex', "0");
        n.from.setAttribute('class', "vanilla-handle vanilla-handle-from");
        if (o.from_fixed) {
            n.from.classList.add("vanilla-handle-fixed");
        }
        if (o.type !== View.types.single) {
            n.range = document.createElement('div');
            n.range.setAttribute('class', "vanilla-range vanilla-range-" + o.type);
        }
        else {
            delete n.range;
        }
        if (o.type === View.types.double) {
            n.to = document.createElement('span');
            n.to.setAttribute('tabindex', "0");
            n.to.setAttribute('class', "vanilla-handle vanilla-handle-to");
            if (o.to_fixed) {
                n.to.classList.add("vanilla-handle-fixed");
            }
        }
        else {
            delete n.to;
        }
    };
    View.prototype.rootEmpty = function () {
        while (this.root.firstChild) {
            this.root.removeChild(this.root.firstChild);
        }
    };
    View.prototype.mouseDown = function (event) {
        var o = this.options;
        var n = this.nodes;
        var d = View.orientations;
        var e = this.events;
        var coord = (o.orientation === d.horizontal ?
            event.pageX - n.track.offsetLeft :
            event.pageY - n.track.offsetTop);
        event.preventDefault();
        if (event.target === n.from) {
            this.handle = n.from;
        }
        else if (event.target === n.to) {
            this.handle = n.to;
        }
        else if (event.target === n.range || event.target === n.track) {
            this.handle = this.chooseHandle(coord);
            this.mouseMove(event);
        }
        n.from.classList.remove('last-type');
        if (n.to) {
            n.to.classList.remove('last-type');
        }
        var value = this.getCoord(event);
        if (this.handle) {
            this.handle.classList.add('active');
            this.handle.classList.add('last-type');
            e.slideStart.notify(this.handle, value);
        }
        window.addEventListener('mousemove', this.mousemove);
        window.addEventListener('mouseup', this.mouseup);
    };
    View.prototype.mouseMove = function (event) {
        var e = this.events;
        var n = this.nodes;
        var value = this.getCoord(event);
        if (this.handle === n.from) {
            e.fromChanged.notify(this.handle, value);
        }
        else if (this.handle === n.to) {
            e.toChanged.notify(this.handle, value);
        }
    };
    View.prototype.mouseUp = function (event) {
        var n = this.nodes;
        var t = event.target;
        var e = this.events;
        var value = this.getCoord(event);
        window.removeEventListener('mousemove', this.mousemove);
        window.removeEventListener('mouseup', this.mouseup);
        if (this.handle) {
            this.handle.classList.remove('active');
            e.slideEnd.notify(this.handle, value);
        }
        this.handle = null;
    };
    View.prototype.chooseHandle = function (coord) {
        var o = this.options;
        var t = View.types;
        var d = View.orientations;
        var n = this.nodes;
        var result;
        if (this.handle) {
            return this.handle;
        }
        if (o.type !== t.double) {
            return n.from;
        }
        if (o.from_fixed && o.to_fixed) {
            return null;
        }
        else if (o.from_fixed) {
            return n.to;
        }
        else if (o.to_fixed) {
            return n.from;
        }
        var fromCoord = this.offset(n.from);
        var toCoord = this.offset(n.to);
        if (fromCoord === toCoord) {
            result = (coord < fromCoord ? n.from : n.to);
        }
        else {
            result = (Math.abs(fromCoord - coord) < Math.abs(toCoord - coord) ? n.from : n.to);
        }
        return result;
    };
    View.prototype.getCoord = function (event) {
        var o = this.options;
        var d = View.orientations;
        var n = this.nodes;
        if (o.orientation === d.horizontal) {
            return event.pageX - n.track.offsetLeft;
        }
        else {
            return event.pageY - n.track.offsetTop;
        }
    };
    View.prototype.outerWidth = function (node) {
        var style = getComputedStyle(node);
        var width = node.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
        return width;
    };
    View.prototype.outerHeight = function (node) {
        var style = getComputedStyle(node);
        var height = node.offsetHeight + parseInt(style.marginLeft) + parseInt(style.marginRight);
        return height;
    };
    View.prototype.offset = function (node) {
        var o = this.options;
        var d = View.orientations;
        if (o.orientation === d.horizontal) {
            return node.offsetLeft + this.outerWidth(node) / 2;
        }
        else {
            return node.offsetTop + this.outerHeight(node) / 2;
        }
    };
    View.types = {
        single: 'single',
        min: 'min',
        max: 'max',
        double: 'double'
    };
    View.orientations = {
        horizontal: 'horizontal',
        vertical: 'vertical'
    };
    return View;
}());
exports.default = View;


/***/ }),

/***/ "./index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__("./index.scss");

var _slider = __webpack_require__("./slider.ts");

var _slider2 = _interopRequireDefault(_slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slider = new _slider2.default('#slider', {
  type: "double",
  from: 10,
  from_fixed: true,
  to: 20,
  onSlide: function onSlide(e, d) {
    document.querySelector('#settings').innerHTML = d.value;
  }
});

if (true) {
  module.hot.accept();
}

/***/ }),

/***/ "./index.scss":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./index.scss");
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__("../node_modules/style-loader/lib/addStyles.js")(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = __webpack_require__("../node_modules/css-loader/index.js?importLoaders=2!../node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./slider.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = __webpack_require__("./components/model/model.ts");
var view_1 = __webpack_require__("./components/view/view.ts");
var controller_1 = __webpack_require__("./components/controller/controller.ts");
var Constructor = /** @class */ (function () {
    function Constructor(rootObject, options, wrap) {
        if (options === void 0) { options = {}; }
        this.wrap = wrap;
        if (this.setRoot(rootObject)) {
            this.init(options);
        }
    }
    Object.defineProperty(Constructor.prototype, "data", {
        get: function () {
            return Object.assign({}, this.model.data, this.view.data);
        },
        enumerable: true,
        configurable: true
    });
    Constructor.prototype.set = function (options) {
        if (this.setOptions(options)) {
            this.model.init(this.modelOptions, true);
            this.view.init(this.viewOptions, true);
            this.controller.init(this.controllerOptions, true);
        }
    };
    Constructor.prototype.init = function (options) {
        this.setOptions(options);
        this.model = new model_1.default(this.modelOptions);
        this.view = new view_1.default(this.root, this.viewOptions);
        this.controller = new controller_1.default(this.model, this.view, this.controllerOptions);
    };
    Constructor.prototype.setOptions = function (options) {
        var o = options;
        var t = view_1.default.types;
        var d = view_1.default.orientations;
        var updated = false;
        this.modelOptions = {};
        this.viewOptions = {};
        this.controllerOptions = {};
        if (o.type && o.type in t) {
            this.viewOptions.type = o.type;
            this.modelOptions.type = o.type === t.double ? true : false;
            updated = true;
        }
        if (o.orientation && o.orientation in d) {
            this.viewOptions.orientation = o.orientation;
            updated = true;
        }
        if (o.min !== undefined && !Number.isNaN(Number(o.min))) {
            this.modelOptions.min = Number(o.min);
            updated = true;
        }
        if (o.max !== undefined && !Number.isNaN(Number(o.max))) {
            this.modelOptions.max = Number(o.max);
            updated = true;
        }
        if (o.from !== undefined && !Number.isNaN(Number(o.from))) {
            this.modelOptions.from = Number(o.from);
            updated = true;
        }
        if (o.to !== undefined && !Number.isNaN(Number(o.to))) {
            this.modelOptions.to = Number(o.to);
            updated = true;
        }
        if (o.from_fixed !== undefined) {
            var r = (/true/i).test(o.from_fixed.toString());
            this.modelOptions.from_fixed = r;
            this.viewOptions.from_fixed = r;
        }
        if (o.to_fixed !== undefined) {
            var r = (/true/i).test(o.to_fixed.toString());
            this.modelOptions.to_fixed = r;
            this.viewOptions.to_fixed = r;
        }
        if (o.step !== undefined && !Number.isNaN(Number(o.step))) {
            this.modelOptions.step = Number(o.step);
            updated = true;
        }
        this.controllerOptions.onCreate = o.onCreate;
        this.controllerOptions.onStart = o.onStart;
        this.controllerOptions.onSlide = o.onSlide;
        this.controllerOptions.onEnd = o.onEnd;
        this.controllerOptions.onUpdate = o.onUpdate;
        return updated;
    };
    Constructor.prototype.setRoot = function (root) {
        var r = Constructor.checkNode(root);
        if (r) {
            this.root = r;
        }
        else {
            throw "Invalid node type, expected 'div'";
        }
        return true;
    };
    Constructor.checkNode = function (node) {
        if (node instanceof HTMLDivElement || node instanceof HTMLSpanElement) {
            return node;
        }
        else if (node instanceof HTMLCollection && node[0] instanceof HTMLDivElement) {
            return node[0];
        }
        else if (typeof node === 'string') {
            var t = document.querySelector(node);
            if (t instanceof HTMLDivElement || t instanceof HTMLSpanElement) {
                return t;
            }
        }
    };
    return Constructor;
}());
var VanillaSlider = /** @class */ (function () {
    function VanillaSlider(root, options) {
        if (options === void 0) { options = {}; }
        var instance = new Constructor(root, options, this);
        this.set = instance.set.bind(instance);
        this.data = function () { return instance.data; };
        VanillaSlider.instances.push(instance);
    }
    VanillaSlider.for = function (node) {
        var n = Constructor.checkNode(node);
        for (var _i = 0, _a = VanillaSlider.instances; _i < _a.length; _i++) {
            var ins = _a[_i];
            if (n && n === ins.root) {
                return ins.wrap;
            }
        }
    };
    VanillaSlider.instances = [];
    return VanillaSlider;
}());
exports.default = VanillaSlider;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgM2NkNTJlMmY0NGViYTVhYTdkZWQiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy92aWV3L3RoZW1lLnNjc3MiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy92aWV3L3ZpZXcuc2NzcyIsIndlYnBhY2s6Ly8vLi9pbmRleC5zY3NzIiwid2VicGFjazovLy8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qcyIsIndlYnBhY2s6Ly8vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL2NvbnRyb2xsZXIvY29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL21vZGVsL21vZGVsLnRzIiwid2VicGFjazovLy8uL2NvbXBvbmVudHMvb2JzZXJ2ZXIvb2JzZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy92aWV3L3RoZW1lLnNjc3M/YTQ5YyIsIndlYnBhY2s6Ly8vLi9jb21wb25lbnRzL3ZpZXcvdmlldy5zY3NzPzY3NGIiLCJ3ZWJwYWNrOi8vLy4vY29tcG9uZW50cy92aWV3L3ZpZXcudHMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vaW5kZXguc2Nzcz85MzY4Iiwid2VicGFjazovLy8uL3NsaWRlci50cyJdLCJuYW1lcyI6WyJzbGlkZXIiLCJ0eXBlIiwiZnJvbSIsImZyb21fZml4ZWQiLCJ0byIsIm9uU2xpZGUiLCJlIiwiZCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImlubmVySFRNTCIsInZhbHVlIiwibW9kdWxlIiwiaG90IiwiYWNjZXB0Il0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUEyRDtBQUMzRDtBQUNBO0FBQ0EsV0FBRzs7QUFFSCxvREFBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsd0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxlQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOzs7O0FBSUE7QUFDQSxzREFBOEM7QUFDOUM7QUFDQTtBQUNBLG9DQUE0QjtBQUM1QixxQ0FBNkI7QUFDN0IseUNBQWlDOztBQUVqQywrQ0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOENBQXNDO0FBQ3RDO0FBQ0E7QUFDQSxxQ0FBNkI7QUFDN0IscUNBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBb0IsZ0JBQWdCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUFvQixnQkFBZ0I7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxhQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUFpQiw4QkFBOEI7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKOztBQUVBLDREQUFvRDtBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDaEUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsQ0FBQztRQUVELENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNULENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBRUQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUEyQixJQUFJLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFDRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxF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QUNILGtCQUFDO0FBQUQsQ0FBQztBQUVEO0lBT0UsdUJBQVksSUFBYyxFQUFFLE9BQXNCO1FBQXRCLHNDQUFzQjtRQUNoRCxJQUFNLFFBQVEsR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFNLGVBQVEsQ0FBQyxJQUFJLEVBQWIsQ0FBYSxDQUFDO1FBQ2hDLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFTSxpQkFBRyxHQUFWLFVBQVcsSUFBYztRQUN2QixJQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsQ0FBQyxDQUFZLFVBQXVCLEVBQXZCLGtCQUFhLENBQUMsU0FBUyxFQUF2QixjQUF1QixFQUF2QixJQUF1QjtZQUFsQyxJQUFJLEdBQUc7WUFDVixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztZQUNsQixDQUFDO1NBQ0Y7SUFDSCxDQUFDO0lBaEJjLHVCQUFTLEdBQXVCLEVBQUUsQ0FBQztJQWlCcEQsb0JBQUM7Q0FBQTtrQkF0Qm9CLGFBQWEiLCJmaWxlIjoianMvYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdO1xuIFx0dGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl0gPSBcclxuIFx0ZnVuY3Rpb24gd2VicGFja0hvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdFx0aWYocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0fSA7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBoZWFkID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG4gXHRcdHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xyXG4gXHRcdHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjtcclxuIFx0XHRzY3JpcHQuY2hhcnNldCA9IFwidXRmLThcIjtcclxuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xyXG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRNYW5pZmVzdChyZXF1ZXN0VGltZW91dCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0cmVxdWVzdFRpbWVvdXQgPSByZXF1ZXN0VGltZW91dCB8fCAxMDAwMDtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRpZih0eXBlb2YgWE1MSHR0cFJlcXVlc3QgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTm8gYnJvd3NlciBzdXBwb3J0XCIpKTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiBcdFx0XHRcdHZhciByZXF1ZXN0UGF0aCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNvblwiO1xyXG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnRpbWVvdXQgPSByZXF1ZXN0VGltZW91dDtcclxuIFx0XHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnIpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3Quc3RhdHVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiB0aW1lZCBvdXQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzID09PSA0MDQpIHtcclxuIFx0XHRcdFx0XHQvLyBubyB1cGRhdGUgYXZhaWxhYmxlXHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgIT09IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyAhPT0gMzA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxyXG4gXHRcdFx0XHRcdHJlamVjdChuZXcgRXJyb3IoXCJNYW5pZmVzdCByZXF1ZXN0IHRvIFwiICsgcmVxdWVzdFBhdGggKyBcIiBmYWlsZWQuXCIpKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdHZhciB1cGRhdGUgPSBKU09OLnBhcnNlKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuIFx0XHRcdFx0XHRcdHJlamVjdChlKTtcclxuIFx0XHRcdFx0XHRcdHJldHVybjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZSh1cGRhdGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0XHJcbiBcdFxyXG4gXHR2YXIgaG90QXBwbHlPblVwZGF0ZSA9IHRydWU7XHJcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiM2NkNTJlMmY0NGViYTVhYTdkZWRcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90UmVxdWVzdFRpbWVvdXQgPSAxMDAwMDtcclxuIFx0dmFyIGhvdEN1cnJlbnRNb2R1bGVEYXRhID0ge307XHJcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgbWUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRpZighbWUpIHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fO1xyXG4gXHRcdHZhciBmbiA9IGZ1bmN0aW9uKHJlcXVlc3QpIHtcclxuIFx0XHRcdGlmKG1lLmhvdC5hY3RpdmUpIHtcclxuIFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xyXG4gXHRcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKSA8IDApXHJcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA8IDApXHJcbiBcdFx0XHRcdFx0bWUuY2hpbGRyZW4ucHVzaChyZXF1ZXN0KTtcclxuIFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlcXVlc3QgKyBcIikgZnJvbSBkaXNwb3NlZCBtb2R1bGUgXCIgKyBtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW107XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcclxuIFx0XHR9O1xyXG4gXHRcdHZhciBPYmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gT2JqZWN0RmFjdG9yeShuYW1lKSB7XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRjb25maWd1cmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXHJcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX19bbmFtZV07XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcclxuIFx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdID0gdmFsdWU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fTtcclxuIFx0XHRmb3IodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKF9fd2VicGFja19yZXF1aXJlX18sIG5hbWUpICYmIG5hbWUgIT09IFwiZVwiKSB7XHJcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicmVhZHlcIilcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLmUoY2h1bmtJZCkudGhlbihmaW5pc2hDaHVua0xvYWRpbmcsIGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRmaW5pc2hDaHVua0xvYWRpbmcoKTtcclxuIFx0XHRcdFx0dGhyb3cgZXJyO1xyXG4gXHRcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xyXG4gXHRcdFx0XHRob3RDaHVua3NMb2FkaW5nLS07XHJcbiBcdFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcclxuIFx0XHRcdFx0XHRpZighaG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9O1xyXG4gXHRcdHJldHVybiBmbjtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaG90ID0ge1xyXG4gXHRcdFx0Ly8gcHJpdmF0ZSBzdHVmZlxyXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9kZWNsaW5lZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfc2VsZkFjY2VwdGVkOiBmYWxzZSxcclxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X2Rpc3Bvc2VIYW5kbGVyczogW10sXHJcbiBcdFx0XHRfbWFpbjogaG90Q3VycmVudENoaWxkTW9kdWxlICE9PSBtb2R1bGVJZCxcclxuIFx0XHJcbiBcdFx0XHQvLyBNb2R1bGUgQVBJXHJcbiBcdFx0XHRhY3RpdmU6IHRydWUsXHJcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJmdW5jdGlvblwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcF0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBdID0gdHJ1ZTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5pbmRleE9mKGNhbGxiYWNrKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxyXG4gXHRcdFx0Y2hlY2s6IGhvdENoZWNrLFxyXG4gXHRcdFx0YXBwbHk6IGhvdEFwcGx5LFxyXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGlmKCFsKSByZXR1cm4gaG90U3RhdHVzO1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZFN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90U3RhdHVzSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vaW5oZXJpdCBmcm9tIHByZXZpb3VzIGRpc3Bvc2UgY2FsbFxyXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXHJcbiBcdFx0fTtcclxuIFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSB1bmRlZmluZWQ7XHJcbiBcdFx0cmV0dXJuIGhvdDtcclxuIFx0fVxyXG4gXHRcclxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XHJcbiBcdHZhciBob3RTdGF0dXMgPSBcImlkbGVcIjtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcclxuIFx0XHRob3RTdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiBcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0aG90U3RhdHVzSGFuZGxlcnNbaV0uY2FsbChudWxsLCBuZXdTdGF0dXMpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHQvLyB3aGlsZSBkb3dubG9hZGluZ1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzID0gMDtcclxuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xyXG4gXHR2YXIgaG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdERlZmVycmVkO1xyXG4gXHRcclxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXHJcbiBcdHZhciBob3RVcGRhdGUsIGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XHJcbiBcdFx0dmFyIGlzTnVtYmVyID0gKCtpZCkgKyBcIlwiID09PSBpZDtcclxuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwiaWRsZVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJjaGVjaygpIGlzIG9ubHkgYWxsb3dlZCBpbiBpZGxlIHN0YXR1c1wiKTtcclxuIFx0XHRob3RBcHBseU9uVXBkYXRlID0gYXBwbHk7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XHJcbiBcdFx0cmV0dXJuIGhvdERvd25sb2FkTWFuaWZlc3QoaG90UmVxdWVzdFRpbWVvdXQpLnRoZW4oZnVuY3Rpb24odXBkYXRlKSB7XHJcbiBcdFx0XHRpZighdXBkYXRlKSB7XHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0XHRcdHJldHVybiBudWxsO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcclxuIFx0XHRcdGhvdFVwZGF0ZU5ld0hhc2ggPSB1cGRhdGUuaDtcclxuIFx0XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0dmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdFx0aG90RGVmZXJyZWQgPSB7XHJcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcclxuIFx0XHRcdFx0XHRyZWplY3Q6IHJlamVjdFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHRob3RVcGRhdGUgPSB7fTtcclxuIFx0XHRcdHZhciBjaHVua0lkID0gMDtcclxuIFx0XHRcdHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb25lLWJsb2Nrc1xyXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xyXG4gXHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIHByb21pc2U7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gfHwgIWhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdKVxyXG4gXHRcdFx0cmV0dXJuO1xyXG4gXHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gZmFsc2U7XHJcbiBcdFx0Zm9yKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0aWYoLS1ob3RXYWl0aW5nRmlsZXMgPT09IDAgJiYgaG90Q2h1bmtzTG9hZGluZyA9PT0gMCkge1xyXG4gXHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XHJcbiBcdFx0XHRob3REb3dubG9hZFVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90VXBkYXRlRG93bmxvYWRlZCgpIHtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcclxuIFx0XHR2YXIgZGVmZXJyZWQgPSBob3REZWZlcnJlZDtcclxuIFx0XHRob3REZWZlcnJlZCA9IG51bGw7XHJcbiBcdFx0aWYoIWRlZmVycmVkKSByZXR1cm47XHJcbiBcdFx0aWYoaG90QXBwbHlPblVwZGF0ZSkge1xyXG4gXHRcdFx0Ly8gV3JhcCBkZWZlcnJlZCBvYmplY3QgaW4gUHJvbWlzZSB0byBtYXJrIGl0IGFzIGEgd2VsbC1oYW5kbGVkIFByb21pc2UgdG9cclxuIFx0XHRcdC8vIGF2b2lkIHRyaWdnZXJpbmcgdW5jYXVnaHQgZXhjZXB0aW9uIHdhcm5pbmcgaW4gQ2hyb21lLlxyXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxyXG4gXHRcdFx0UHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xyXG4gXHRcdFx0fSkudGhlbihcclxuIFx0XHRcdFx0ZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShyZXN1bHQpO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZWplY3QoZXJyKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0KTtcclxuIFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBcHBseShvcHRpb25zKSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpIHRocm93IG5ldyBFcnJvcihcImFwcGx5KCkgaXMgb25seSBhbGxvd2VkIGluIHJlYWR5IHN0YXR1c1wiKTtcclxuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIGNiO1xyXG4gXHRcdHZhciBpO1xyXG4gXHRcdHZhciBqO1xyXG4gXHRcdHZhciBtb2R1bGU7XHJcbiBcdFx0dmFyIG1vZHVsZUlkO1xyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBnZXRBZmZlY3RlZFN0dWZmKHVwZGF0ZU1vZHVsZUlkKSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcclxuIFx0XHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xyXG4gXHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdGNoYWluOiBbaWRdLFxyXG4gXHRcdFx0XHRcdGlkOiBpZFxyXG4gXHRcdFx0XHR9O1xyXG4gXHRcdFx0fSk7XHJcbiBcdFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRcdHZhciBxdWV1ZUl0ZW0gPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW4gPSBxdWV1ZUl0ZW0uY2hhaW47XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZighbW9kdWxlIHx8IG1vZHVsZS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fc2VsZkRlY2xpbmVkKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9tYWluKSB7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwidW5hY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbW9kdWxlLnBhcmVudHMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcclxuIFx0XHRcdFx0XHR2YXIgcGFyZW50ID0gaW5zdGFsbGVkTW9kdWxlc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0aWYoIXBhcmVudCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcImRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0cGFyZW50SWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihvdXRkYXRlZE1vZHVsZXMuaW5kZXhPZihwYXJlbnRJZCkgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0aWYocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSwgW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaChwYXJlbnRJZCk7XHJcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0aWQ6IHBhcmVudElkXHJcbiBcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHJcbiBcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHR0eXBlOiBcImFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcclxuIFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzOiBvdXRkYXRlZE1vZHVsZXMsXHJcbiBcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzOiBvdXRkYXRlZERlcGVuZGVuY2llc1xyXG4gXHRcdFx0fTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcclxuIFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBiLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcclxuIFx0XHRcdFx0aWYoYS5pbmRleE9mKGl0ZW0pIDwgMClcclxuIFx0XHRcdFx0XHRhLnB1c2goaXRlbSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBhdCBiZWdpbiBhbGwgdXBkYXRlcyBtb2R1bGVzIGFyZSBvdXRkYXRlZFxyXG4gXHRcdC8vIHRoZSBcIm91dGRhdGVkXCIgc3RhdHVzIGNhbiBwcm9wYWdhdGUgdG8gcGFyZW50cyBpZiB0aGV5IGRvbid0IGFjY2VwdCB0aGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0dmFyIGFwcGxpZWRVcGRhdGUgPSB7fTtcclxuIFx0XHJcbiBcdFx0dmFyIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSA9IGZ1bmN0aW9uIHdhcm5VbmV4cGVjdGVkUmVxdWlyZSgpIHtcclxuIFx0XHRcdGNvbnNvbGUud2FybihcIltITVJdIHVuZXhwZWN0ZWQgcmVxdWlyZShcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiKSB0byBkaXNwb3NlZCBtb2R1bGVcIik7XHJcbiBcdFx0fTtcclxuIFx0XHJcbiBcdFx0Zm9yKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVJZCA9IHRvTW9kdWxlSWQoaWQpO1xyXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG4gXHRcdFx0XHRpZihob3RVcGRhdGVbaWRdKSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0cmVzdWx0ID0ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxyXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWQ6IGlkXHJcbiBcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR2YXIgYWJvcnRFcnJvciA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgZG9EaXNwb3NlID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBjaGFpbkluZm8gPSBcIlwiO1xyXG4gXHRcdFx0XHRpZihyZXN1bHQuY2hhaW4pIHtcclxuIFx0XHRcdFx0XHRjaGFpbkluZm8gPSBcIlxcblVwZGF0ZSBwcm9wYWdhdGlvbjogXCIgKyByZXN1bHQuY2hhaW4uam9pbihcIiAtPiBcIik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0c3dpdGNoKHJlc3VsdC50eXBlKSB7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIGRlY2xpbmVkIGRlcGVuZGVuY3k6IFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIgaW4gXCIgKyByZXN1bHQucGFyZW50SWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcInVuYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25VbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uVW5hY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBcIiArIG1vZHVsZUlkICsgXCIgaXMgbm90IGFjY2VwdGVkXCIgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25BY2NlcHRlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGlzcG9zZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EaXNwb3NlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRpc3Bvc2VkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0Rpc3Bvc2UgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0ZGVmYXVsdDpcclxuIFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuZXhjZXB0aW9uIHR5cGUgXCIgKyByZXN1bHQudHlwZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoYWJvcnRFcnJvcikge1xyXG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xyXG4gXHRcdFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChhYm9ydEVycm9yKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0FwcGx5KSB7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSBob3RVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0XHRcdFx0Zm9yKG1vZHVsZUlkIGluIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0XHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSwgcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvRGlzcG9zZSkge1xyXG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgW3Jlc3VsdC5tb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gd2FyblVuZXhwZWN0ZWRSZXF1aXJlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBTdG9yZSBzZWxmIGFjY2VwdGVkIG91dGRhdGVkIG1vZHVsZXMgdG8gcmVxdWlyZSB0aGVtIGxhdGVyIGJ5IHRoZSBtb2R1bGUgc3lzdGVtXHJcbiBcdFx0dmFyIG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdGZvcihpID0gMDsgaSA8IG91dGRhdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBvdXRkYXRlZE1vZHVsZXNbaV07XHJcbiBcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZClcclxuIFx0XHRcdFx0b3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLnB1c2goe1xyXG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0ZXJyb3JIYW5kbGVyOiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5ob3QuX3NlbGZBY2NlcHRlZFxyXG4gXHRcdFx0XHR9KTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdyBpbiBcImRpc3Bvc2VcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XHJcbiBcdFx0T2JqZWN0LmtleXMoaG90QXZhaWxhYmxlRmlsZXNNYXApLmZvckVhY2goZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XHJcbiBcdFx0XHRcdGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0dmFyIGlkeDtcclxuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcclxuIFx0XHR3aGlsZShxdWV1ZS5sZW5ndGggPiAwKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRpZighbW9kdWxlKSBjb250aW51ZTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgZGF0YSA9IHt9O1xyXG4gXHRcclxuIFx0XHRcdC8vIENhbGwgZGlzcG9zZSBoYW5kbGVyc1xyXG4gXHRcdFx0dmFyIGRpc3Bvc2VIYW5kbGVycyA9IG1vZHVsZS5ob3QuX2Rpc3Bvc2VIYW5kbGVycztcclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IGRpc3Bvc2VIYW5kbGVycy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRjYiA9IGRpc3Bvc2VIYW5kbGVyc1tqXTtcclxuIFx0XHRcdFx0Y2IoZGF0YSk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF0gPSBkYXRhO1xyXG4gXHRcclxuIFx0XHRcdC8vIGRpc2FibGUgbW9kdWxlICh0aGlzIGRpc2FibGVzIHJlcXVpcmVzIGZyb20gdGhpcyBtb2R1bGUpXHJcbiBcdFx0XHRtb2R1bGUuaG90LmFjdGl2ZSA9IGZhbHNlO1xyXG4gXHRcclxuIFx0XHRcdC8vIHJlbW92ZSBtb2R1bGUgZnJvbSBjYWNoZVxyXG4gXHRcdFx0ZGVsZXRlIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcclxuIFx0XHRcdC8vIHdoZW4gZGlzcG9zaW5nIHRoZXJlIGlzIG5vIG5lZWQgdG8gY2FsbCBkaXNwb3NlIGhhbmRsZXJcclxuIFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKG1vZHVsZSkge1xyXG4gXHRcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRcdGlmKGNiKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKGNhbGxiYWNrcy5pbmRleE9mKGNiKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyciwgLy8gVE9ETyByZW1vdmUgaW4gd2VicGFjayA0XHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnIyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxyXG4gXHRcdGlmKGVycm9yKSB7XHJcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xyXG4gXHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImlkbGVcIik7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcclxuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZShcIi4vaW5kZXguanNcIikoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2luZGV4LmpzXCIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDNjZDUyZTJmNDRlYmE1YWE3ZGVkIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLnZhbmlsbGEtc2xpZGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNmY2ZjY7XFxuICBib3JkZXItcmFkaXVzOiAwLjNlbTsgfVxcblxcbi52YW5pbGxhLWhvcml6b250YWwge1xcbiAgaGVpZ2h0OiAwLjZlbTsgfVxcbiAgLnZhbmlsbGEtaG9yaXpvbnRhbCAudmFuaWxsYS1yYW5nZSB7XFxuICAgIGhlaWdodDogMTAwJTsgfVxcblxcbi52YW5pbGxhLXZlcnRpY2FsIHtcXG4gIHdpZHRoOiAwLjZlbTtcXG4gIG1pbi1oZWlnaHQ6IDIwMHB4OyB9XFxuICAudmFuaWxsYS12ZXJ0aWNhbCAudmFuaWxsYS1yYW5nZSB7XFxuICAgIHdpZHRoOiAxMDAlOyB9XFxuXFxuLnZhbmlsbGEtaGFuZGxlIHtcXG4gIHdpZHRoOiAxLjJlbTtcXG4gIGhlaWdodDogMS4yZW07XFxuICBib3JkZXItcmFkaXVzOiAwLjNlbTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNmY2ZjY7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjZWQ1NTY1O1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgb3V0bGluZTogbm9uZTsgfVxcbiAgLnZhbmlsbGEtaGFuZGxlOmhvdmVyIHtcXG4gICAgYm9yZGVyLWNvbG9yOiAjYzcxNTI4OyB9XFxuICAudmFuaWxsYS1oYW5kbGU6Zm9jdXMge1xcbiAgICBib3gtc2hhZG93OiAwIDAgMnB4IDAgYmx1ZTtcXG4gICAgYm9yZGVyLWNvbG9yOiAjYzcxNTI4OyB9XFxuICAudmFuaWxsYS1oYW5kbGUtYWN0aXZlIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2M3MTUyODsgfVxcblxcbi52YW5pbGxhLXJhbmdlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNlZDU1NjU7XFxuICBib3JkZXItcmFkaXVzOiAwLjNlbTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP2ltcG9ydExvYWRlcnM9MiEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL2NvbXBvbmVudHMvdmlldy90aGVtZS5zY3NzXG4vLyBtb2R1bGUgaWQgPSAuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9pbXBvcnRMb2FkZXJzPTIhLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9jb21wb25lbnRzL3ZpZXcvdGhlbWUuc2Nzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIudmFuaWxsYS1zbGlkZXIge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdGV4dC1hbGlnbjogbGVmdDsgfVxcblxcbi52YW5pbGxhLWhvcml6b250YWwge1xcbiAgd2lkdGg6IDEwMCU7IH1cXG4gIC52YW5pbGxhLWhvcml6b250YWwgLnZhbmlsbGEtaGFuZGxlIHtcXG4gICAgdG9wOiAtMC4zNWVtO1xcbiAgICBtYXJnaW4tbGVmdDogLTAuNTVlbTsgfVxcblxcbi52YW5pbGxhLXZlcnRpY2FsIHtcXG4gIGhlaWdodDogMTAwJTsgfVxcbiAgLnZhbmlsbGEtdmVydGljYWwgLnZhbmlsbGEtaGFuZGxlIHtcXG4gICAgbGVmdDogLTAuMzVlbTtcXG4gICAgbWFyZ2luLWJvdHRvbTogLTAuN2VtOyB9XFxuXFxuLnZhbmlsbGEtaGFuZGxlIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgei1pbmRleDogMztcXG4gIGN1cnNvcjogZGVmYXVsdDtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cXG4gIC52YW5pbGxhLWhhbmRsZS5sYXN0LXR5cGUge1xcbiAgICB6LWluZGV4OiA0OyB9XFxuICAudmFuaWxsYS1oYW5kbGUuYWN0aXZlIHtcXG4gICAgei1pbmRleDogNTsgfVxcbiAgLnZhbmlsbGEtaGFuZGxlLWZpeGVkIHtcXG4gICAgei1pbmRleDogMjsgfVxcblxcbi52YW5pbGxhLXJhbmdlIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgei1pbmRleDogMTsgfVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyP2ltcG9ydExvYWRlcnM9MiEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL2NvbXBvbmVudHMvdmlldy92aWV3LnNjc3Ncbi8vIG1vZHVsZSBpZCA9IC4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP2ltcG9ydExvYWRlcnM9MiEuLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL2NvbXBvbmVudHMvdmlldy92aWV3LnNjc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiYm9keSB7XFxuICBwYWRkaW5nOiAxMHZoIDEwdnc7XFxuICBtaW4taGVpZ2h0OiA1MHZoOyB9XFxuXFxuLnNsaWRlciB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBtYXJnaW4tYm90dG9tOiA1MHB4OyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXI/aW1wb3J0TG9hZGVycz0yIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vaW5kZXguc2Nzc1xuLy8gbW9kdWxlIGlkID0gLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/aW1wb3J0TG9hZGVycz0yIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vaW5kZXguc2Nzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IC4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0RWxlbWVudCA9IChmdW5jdGlvbiAoZm4pIHtcblx0dmFyIG1lbW8gPSB7fTtcblxuXHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdH1cblxuXHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHR9O1xufSkoZnVuY3Rpb24gKHRhcmdldCkge1xuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpXG59KTtcblxudmFyIHNpbmdsZXRvbiA9IG51bGw7XG52YXJcdHNpbmdsZXRvbkNvdW50ZXIgPSAwO1xudmFyXHRzdHlsZXNJbnNlcnRlZEF0VG9wID0gW107XG5cbnZhclx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL3VybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZiAodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICghb3B0aW9ucy5zaW5nbGV0b24pIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50IChzdHlsZSkge1xuXHRpZiAoc3R5bGUucGFyZW50Tm9kZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuXHRzdHlsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlKTtcblxuXHR2YXIgaWR4ID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlKTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZXNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudCAob3B0aW9ucykge1xuXHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGFkZEF0dHJzKHN0eWxlLCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlKTtcblxuXHRyZXR1cm4gc3R5bGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50IChvcHRpb25zKSB7XG5cdHZhciBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGlkID0gLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgSUV2ZW50IGZyb20gJy4vLi4vb2JzZXJ2ZXIvb2JzZXJ2ZXInO1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi8uLi9tb2RlbC9tb2RlbCc7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4vLi4vdmlldy92aWV3JztcclxuXHJcbmltcG9ydCB7IElWaWV3RXZlbnRzIH0gZnJvbSAnLi4vdmlldy9uYW1lc3BhY2UnO1xyXG5pbXBvcnQgeyBJTW9kZWxFdmVudHMgfSBmcm9tICcuLi9tb2RlbC9uYW1lc3BhY2UnO1xyXG5pbXBvcnQgeyBJQ29udHJvbGxlck9wdGlvbnMgfSBmcm9tICcuL25hbWVzcGFjZSc7XHJcblxyXG50eXBlIGV2ZW50ID0gTW91c2VFdmVudCB8IEtleWJvYXJkRXZlbnQgfCBUb3VjaEV2ZW50IHwgQ3VzdG9tRXZlbnQ7XHJcblxyXG5pbnRlcmZhY2UgY3VzdG9tRXZlbnRzIHtcclxuICBjcmVhdGU/OiBDdXN0b21FdmVudCxcclxuICBzdGFydD86IE1vdXNlRXZlbnQsXHJcbiAgc2xpZGU/OiBNb3VzZUV2ZW50LFxyXG4gIGVuZD86IE1vdXNlRXZlbnQsXHJcbiAgdXBkYXRlPzogQ3VzdG9tRXZlbnRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbGxlciB7XHJcblxyXG4gIHByaXZhdGUgY2FsbGJhY2tzOiBJQ29udHJvbGxlck9wdGlvbnMgPSB7fTtcclxuXHJcbiAgcHJpdmF0ZSBjdXN0b21FdmVudHM6IGN1c3RvbUV2ZW50cyA9IHt9O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG1vZGVsOiBNb2RlbCwgcHJpdmF0ZSB2aWV3OiBWaWV3LCBjYWxsYmFja3M6IElDb250cm9sbGVyT3B0aW9ucykge1xyXG4gICAgdGhpcy5pbml0KGNhbGxiYWNrcyk7XHJcbiAgfVxyXG5cclxuICAvLyA9PT09PT09PT09PT09PT09PSBwdWJsaWMgbWV0aG9kcyA9PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHB1YmxpYyBpbml0KGNhbGxiYWNrczogSUNvbnRyb2xsZXJPcHRpb25zLGlzVXBkYXRlPzogYm9vbGVhbikge1xyXG4gICAgY29uc3QgbSA9IHRoaXMubW9kZWw7XHJcbiAgICBjb25zdCB2ID0gdGhpcy52aWV3O1xyXG4gICAgY29uc3QgYyA9IHRoaXMuY2FsbGJhY2tzO1xyXG4gICAgY29uc3QgZSA9IHRoaXMuY3VzdG9tRXZlbnRzO1xyXG4gICAgY29uc3QgbW9kZWxFID0gdGhpcy5tb2RlbC5ldmVudHM7XHJcbiAgICBjb25zdCB2aWV3RSA9IHRoaXMudmlldy5ldmVudHM7XHJcblxyXG4gICAgaWYgKGNhbGxiYWNrcy5vbkNyZWF0ZSkge1xyXG4gICAgICBjLm9uQ3JlYXRlID0gY2FsbGJhY2tzLm9uQ3JlYXRlO1xyXG4gICAgfVxyXG4gICAgaWYgKGNhbGxiYWNrcy5vblN0YXJ0KSB7XHJcbiAgICAgIGMub25TdGFydCA9IGNhbGxiYWNrcy5vblN0YXJ0O1xyXG4gICAgfVxyXG4gICAgaWYgKGNhbGxiYWNrcy5vblNsaWRlKSB7XHJcbiAgICAgIGMub25TbGlkZSA9IGNhbGxiYWNrcy5vblNsaWRlO1xyXG4gICAgfVxyXG4gICAgaWYgKGNhbGxiYWNrcy5vbkVuZCkge1xyXG4gICAgICBjLm9uRW5kID0gY2FsbGJhY2tzLm9uRW5kO1xyXG4gICAgfVxyXG4gICAgaWYgKGNhbGxiYWNrcy5vblVwZGF0ZSkge1xyXG4gICAgICBjLm9uVXBkYXRlID0gY2FsbGJhY2tzLm9uVXBkYXRlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoaXNVcGRhdGUpIHtcclxuICAgICAgZS51cGRhdGUgPSBuZXcgQ3VzdG9tRXZlbnQoJ3ZhbmlsbGF1cGRhdGUnLCB7XHJcbiAgICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IHYucm9vdE9iamVjdFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuY2FsbEZ1bmN0aW9uKGUudXBkYXRlLCBjLm9uVXBkYXRlKTtcclxuICAgICAgdi5yb290T2JqZWN0LmRpc3BhdGNoRXZlbnQoZS51cGRhdGUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZS5jcmVhdGUgPSBuZXcgQ3VzdG9tRXZlbnQoJ3ZhbmlsbGFjcmVhdGUnLCB7XHJcbiAgICAgICAgZGV0YWlsOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IHYucm9vdE9iamVjdFxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHYucm9vdE9iamVjdC5kaXNwYXRjaEV2ZW50KGUuY3JlYXRlKTtcclxuICAgICAgdGhpcy5jYWxsRnVuY3Rpb24oZS5jcmVhdGUsIGMub25DcmVhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHZpZXdFLmZyb21DaGFuZ2VkLmF0dGFjaCgoaGFuZGxlOiBIVE1MU3BhbkVsZW1lbnQsdmFsdWU6IG51bWJlcikgPT4ge1xyXG4gICAgICBlLnNsaWRlID0gbmV3IE1vdXNlRXZlbnQoJ3ZhbmlsbGFzbGlkZScsIHtcclxuICAgICAgICBidWJibGVzOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgICBtLmNhbGNGcm9tV2l0aFN0ZXAodGhpcy5jb252ZXJ0VG9SZWFsKHZhbHVlKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB2aWV3RS50b0NoYW5nZWQuYXR0YWNoKChoYW5kbGU6IEhUTUxTcGFuRWxlbWVudCAsdmFsdWU6IG51bWJlcikgPT4ge1xyXG4gICAgICBlLnNsaWRlID0gbmV3IE1vdXNlRXZlbnQoJ3ZhbmlsbGFzbGlkZScsIHtcclxuICAgICAgICBidWJibGVzOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgICBtLmNhbGNUb1dpdGhTdGVwKHRoaXMuY29udmVydFRvUmVhbCh2YWx1ZSkpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIHZpZXdFLnNsaWRlU3RhcnQuYXR0YWNoKChoYW5kbGU6IEhUTUxTcGFuRWxlbWVudCkgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU7XHJcbiAgICAgIGUuc3RhcnQgPSBuZXcgTW91c2VFdmVudCgndmFuaWxsYXN0YXJ0Jywge1xyXG4gICAgICAgIGJ1YmJsZXM6IHRydWVcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoaGFuZGxlID09PSB2Lm5vZGVzRGF0YS5mcm9tKSB7XHJcbiAgICAgICAgdmFsdWUgPSBtLmRhdGEuZnJvbTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YWx1ZSA9IG0uZGF0YS50bztcclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgdGhpcy5jYWxsRnVuY3Rpb24oZS5zdGFydCwge1xyXG4gICAgICAgIGhhbmRsZTogaGFuZGxlLFxyXG4gICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICB9LCBjLm9uU3RhcnQpO1xyXG4gICAgICBoYW5kbGUuZGlzcGF0Y2hFdmVudChlLnN0YXJ0KTtcclxuICAgIH0pXHJcblxyXG4gICAgdmlld0Uuc2xpZGVFbmQuYXR0YWNoKChoYW5kbGU6IEhUTUxTcGFuRWxlbWVudCkgPT4ge1xyXG4gICAgICBsZXQgdmFsdWU7XHJcbiAgICAgIGUuZW5kID0gbmV3IE1vdXNlRXZlbnQoJ3ZhbmlsbGFlbmQnLCB7XHJcbiAgICAgICAgYnViYmxlczogdHJ1ZVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChoYW5kbGUgPT09IHYubm9kZXNEYXRhLmZyb20pIHtcclxuICAgICAgICB2YWx1ZSA9IG0uZGF0YS5mcm9tO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gbS5kYXRhLnRvO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNhbGxGdW5jdGlvbihlLmVuZCwge1xyXG4gICAgICAgIGhhbmRsZTogaGFuZGxlLFxyXG4gICAgICAgIHZhbHVlOiBtLmRhdGEuZnJvbVxyXG4gICAgICB9LCBjLm9uRW5kKTtcclxuICAgICAgaGFuZGxlLmRpc3BhdGNoRXZlbnQoZS5lbmQpO1xyXG4gICAgfSlcclxuXHJcbiAgICBtb2RlbEUuZnJvbUNoYW5nZWQuYXR0YWNoKChmcm9tOiBudW1iZXIpID0+IHtcclxuICAgICAgdi5jYWxjRnJvbShmcm9tKTtcclxuXHJcbiAgICAgIGlmICghZS5zbGlkZSkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jYWxsRnVuY3Rpb24oZS5zbGlkZSwge1xyXG4gICAgICAgIGhhbmRsZTogdi5ub2Rlc0RhdGEuZnJvbSxcclxuICAgICAgICB2YWx1ZTogbS5kYXRhLmZyb21cclxuICAgICAgfSwgYy5vblNsaWRlKTtcclxuXHJcbiAgICAgIHYubm9kZXNEYXRhLmZyb20uZGlzcGF0Y2hFdmVudChlLnNsaWRlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG1vZGVsRS50b0NoYW5nZWQuYXR0YWNoKCh0bzogbnVtYmVyKSA9PiB7XHJcbiAgICAgIHYuY2FsY1RvKHRvKTtcclxuICAgICAgXHJcbiAgICAgIGlmICghZS5zbGlkZSkgcmV0dXJuO1xyXG5cclxuICAgICAgdGhpcy5jYWxsRnVuY3Rpb24oZS5zbGlkZSwge1xyXG4gICAgICAgIGhhbmRsZTogdi5ub2Rlc0RhdGEudG8sXHJcbiAgICAgICAgdmFsdWU6IG0uZGF0YS50b1xyXG4gICAgICB9LCBjLm9uU2xpZGUpO1xyXG5cclxuICAgICAgKDxIVE1MU3BhbkVsZW1lbnQ+di5ub2Rlc0RhdGEudG8pLmRpc3BhdGNoRXZlbnQoZS5zbGlkZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnZpZXcuY2FsY0Zyb20odGhpcy5jb252ZXJUb1BlcmNlbnQobS5kYXRhLmZyb20pKTtcclxuICAgIHRoaXMudmlldy5jYWxjVG8odGhpcy5jb252ZXJUb1BlcmNlbnQobS5kYXRhLnRvKSk7XHJcbiAgfVxyXG5cclxuICAvLyA9PT09PT09PT09PT09PT09PSBwcml2YXRlIG1ldGhvZHMgPT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBwcml2YXRlIGNvbnZlclRvUGVyY2VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBtID0gdGhpcy5tb2RlbC5kYXRhO1xyXG4gICAgY29uc3QgcmFuZ2UgPSBtLm1heCAtIG0ubWluO1xyXG4gICAgcmV0dXJuICsoKHZhbHVlIC0gbS5taW4pICogMTAwIC8gcmFuZ2UpLnRvRml4ZWQoMTApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb252ZXJ0VG9SZWFsKHBpeGVsczogbnVtYmVyKSB7XHJcbiAgICBjb25zdCB2ID0gdGhpcy52aWV3LmRhdGE7XHJcbiAgICBjb25zdCBuID0gdGhpcy52aWV3Lm5vZGVzRGF0YTtcclxuICAgIGNvbnN0IGQgPSBWaWV3Lm9yaWVudGF0aW9ucztcclxuICAgIGNvbnN0IG0gPSB0aGlzLm1vZGVsLmRhdGE7XHJcblxyXG4gICAgY29uc3QgcmFuZ2UgPSBtLm1heCAtIG0ubWluO1xyXG5cclxuICAgIGlmICh2Lm9yaWVudGF0aW9uID09PSBkLmhvcml6b250YWwpIHtcclxuICAgICAgY29uc3Qgd2lkdGggPSBuLnRyYWNrLmNsaWVudFdpZHRoO1xyXG4gICAgICByZXR1cm4gKygocGl4ZWxzICogcmFuZ2UgLyB3aWR0aCkgKyBtLm1pbikudG9GaXhlZCgxMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBoZWlnaHQgPSBuLnRyYWNrLmNsaWVudEhlaWdodDtcclxuICAgICAgcmV0dXJuICsoKChoZWlnaHQgLSBwaXhlbHMpICogcmFuZ2UgLyBoZWlnaHQpICsgbS5taW4pLnRvRml4ZWQoMTApO1xyXG4gICAgfSAgICBcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FsbEZ1bmN0aW9uKGV2ZW50OiBldmVudCwgZGF0YSA9IHt9LCBjYWxsYmFjaz86IEZ1bmN0aW9uKSB7XHJcbiAgICBpZiAoY2FsbGJhY2sgJiYgdHlwZW9mIGNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgY2FsbGJhY2soZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG4gIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudHMvY29udHJvbGxlci9jb250cm9sbGVyLnRzIiwiaW1wb3J0IElFdmVudCBmcm9tICcuLy4uL29ic2VydmVyL29ic2VydmVyJztcclxuaW1wb3J0IHsgSU1vZGVsLCBJTW9kZWxPcHRpb25zLCBJTWFuZGF0b3J5T3B0aW9ucywgSU1vZGVsRXZlbnRzIH0gZnJvbSAnLi9uYW1lc3BhY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZWwgaW1wbGVtZW50cyBJTW9kZWwge1xyXG4gIFxyXG4gIHByaXZhdGUgdHJpZ2dlcnM6IElNb2RlbEV2ZW50cyA9IHtcclxuICAgIGZyb21DaGFuZ2VkOiBuZXcgSUV2ZW50KCksXHJcbiAgICB0b0NoYW5nZWQ6IG5ldyBJRXZlbnQoKSxcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb3B0aW9uczogSU1hbmRhdG9yeU9wdGlvbnMgID0ge1xyXG4gICAgdHlwZTogZmFsc2UsXHJcbiAgICBtaW46IDAsXHJcbiAgICBtYXg6IDEwMCxcclxuICAgIGZyb206IDAsXHJcbiAgICBmcm9tX2ZpeGVkOiBmYWxzZSxcclxuICAgIHRvOiAwLFxyXG4gICAgdG9fZml4ZWQ6IGZhbHNlLFxyXG4gICAgc3RlcDogMVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKG1vZGVsT3B0aW9uczogSU1vZGVsT3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLmluaXQobW9kZWxPcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8vIGFjY2Vzc29yc1xyXG5cclxuICBnZXQgZGF0YSgpOiBJTWFuZGF0b3J5T3B0aW9ucyB7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGV2ZW50cygpOiBJTW9kZWxFdmVudHMge1xyXG4gICAgcmV0dXJuIHRoaXMudHJpZ2dlcnM7XHJcbiAgfVxyXG5cclxuICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICBwdWJsaWMgaW5pdChvcHRpb25zOiBJTW9kZWxPcHRpb25zID0ge30sIGlzVXBkYXRlPzogYm9vbGVhbikgeyBcclxuXHJcbiAgICBpZiAob3B0aW9ucy50eXBlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5zZXRUeXBlKG9wdGlvbnMudHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG9wdGlvbnMuc3RlcCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RlcChvcHRpb25zLnN0ZXApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLm1pbiAhPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMubWF4ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5zZXRSYW5nZShvcHRpb25zLm1pbiwgb3B0aW9ucy5tYXgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmZyb21fZml4ZWQgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnRvX2ZpeGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5zZXRGaXhlZChvcHRpb25zLmZyb21fZml4ZWQsIG9wdGlvbnMudG9fZml4ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvcHRpb25zLmZyb20gIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLnRvICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5zZXRWYWx1ZXMob3B0aW9ucy5mcm9tLCBvcHRpb25zLnRvKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBjYWxjRnJvbVdpdGhTdGVwKHZhbHVlOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IG8gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG5cclxuICAgIGlmIChvLmZyb21fZml4ZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChvLnR5cGUpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5pbkRhaXBhc29uKHZhbHVlLCBvLm1pbiwgby50byk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmluRGFpcGFzb24odmFsdWUsIG8ubWluLCBvLm1heCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGlmIChyZXN1bHQgPT09IHZhbHVlKSB7XHJcbiAgICAgIHJlc3VsdCA9IE1hdGgucm91bmQoKCB2YWx1ZSAtIG8ubWluICkgLyBvLnN0ZXApICogby5zdGVwICsgby5taW47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdCAhPSBvLmZyb20pIHtcclxuICAgICAgby5mcm9tID0gcmVzdWx0O1xyXG4gICAgICB0aGlzLnRyaWdnZXJzLmZyb21DaGFuZ2VkLm5vdGlmeShvLmZyb20pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGNhbGNUb1dpdGhTdGVwKHZhbHVlOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IG8gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBsZXQgcmVzdWx0O1xyXG5cclxuICAgIGlmICghby50eXBlIHx8IG8udG9fZml4ZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc3VsdCA9IHRoaXMuaW5EYWlwYXNvbih2YWx1ZSwgby5mcm9tLCBvLm1heCk7XHJcbiAgICBcclxuICAgIGlmIChyZXN1bHQgPT09IHZhbHVlKSB7XHJcbiAgICAgIHJlc3VsdCA9IE1hdGgucm91bmQoKCB2YWx1ZSAtIG8ubWluICkgLyBvLnN0ZXApICogby5zdGVwICsgby5taW47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlc3VsdCAhPSBvLnRvKSB7XHJcbiAgICAgIG8udG8gPSByZXN1bHQ7XHJcbiAgICAgIHRoaXMudHJpZ2dlcnMudG9DaGFuZ2VkLm5vdGlmeShvLnRvKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICBwcml2YXRlIHNldFJhbmdlKG1pbiA9IHRoaXMub3B0aW9ucy5taW4sIG1heCA9IHRoaXMub3B0aW9ucy5tYXgpIHtcclxuICAgIGNvbnN0IG8gPSB0aGlzLm9wdGlvbnM7XHJcblxyXG4gICAgaWYgKG1pbiA+IG1heCkge1xyXG4gICAgICBtYXggPSBtaW47XHJcbiAgICB9XHJcblxyXG4gICAgby5taW4gPSBtaW47XHJcbiAgICBvLm1heCA9IG1heDtcclxuICAgIHRoaXMudXBkYXRlRnJvbVRvKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFZhbHVlcyhmcm9tID0gdGhpcy5vcHRpb25zLmZyb20sIHRvID0gdGhpcy5vcHRpb25zLnRvKSB7XHJcbiAgICBjb25zdCBvID0gdGhpcy5vcHRpb25zO1xyXG4gICAgby5mcm9tID0gZnJvbTtcclxuICAgIG8udG8gPSB0bztcclxuICAgIHRoaXMudXBkYXRlRnJvbVRvKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFN0ZXAoc3RlcDogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBvID0gdGhpcy5vcHRpb25zO1xyXG4gICAgY29uc3QgcmFuZ2UgPSBvLm1heCAtIG8ubWluO1xyXG4gICAgaWYgKHN0ZXAgPCAwKSB7XHJcbiAgICAgIG8uc3RlcCA9IDE7XHJcbiAgICB9IGVsc2UgaWYgKHN0ZXAgPiByYW5nZSkge1xyXG4gICAgICBvLnN0ZXAgPSByYW5nZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG8uc3RlcCA9IHN0ZXA7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFR5cGUodHlwZTogYm9vbGVhbikge1xyXG4gICAgY29uc3QgbyA9IHRoaXMub3B0aW9ucztcclxuICAgIG8udHlwZSA9IHR5cGU7XHJcbiAgICB0aGlzLnVwZGF0ZUZyb21UbygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRGaXhlZChmcm9tID0gdGhpcy5vcHRpb25zLmZyb21fZml4ZWQsIHRvPSB0aGlzLm9wdGlvbnMudG9fZml4ZWQpIHtcclxuICAgIGNvbnN0IG8gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBvLmZyb21fZml4ZWQgPSBmcm9tO1xyXG4gICAgby50b19maXhlZCA9IHRvO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVGcm9tVG8oKSB7XHJcbiAgICBjb25zdCBvID0gdGhpcy5vcHRpb25zO1xyXG4gICAgby5mcm9tID0gdGhpcy5pbkRhaXBhc29uKG8uZnJvbSwgby5taW4sIG8ubWF4KTtcclxuXHJcbiAgICBpZiAoby50eXBlKSB7XHJcbiAgICAgIG8udG8gPSB0aGlzLmluRGFpcGFzb24oby50bywgby5mcm9tLCBvLm1heClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5EYWlwYXNvbih2YWx1ZTogbnVtYmVyLCBtaW4gPSB0aGlzLm9wdGlvbnMubWluLCBtYXggPSB0aGlzLm9wdGlvbnMubWluKSB7XHJcbiAgICBpZiAodmFsdWUgPCBtaW4pIHtcclxuICAgICAgcmV0dXJuIG1pbjtcclxuICAgIH0gZWxzZSBpZiAodmFsdWUgPiBtYXgpIHtcclxuICAgICAgcmV0dXJuIG1heDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9jb21wb25lbnRzL21vZGVsL21vZGVsLnRzIiwiaW1wb3J0IHsgSUV2ZW50IH0gZnJvbSAnLi9uYW1lc3BhY2UnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnQgaW1wbGVtZW50cyBJRXZlbnR7XHJcbiAgcHJpdmF0ZSBsaXN0ZW5lcnM6IFNldDxGdW5jdGlvbj47XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMubGlzdGVuZXJzID0gbmV3IFNldCgpOyAgXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXR0YWNoKGxpc3RlbmVyOiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW1vdmUobGlzdGVuZXI6IEZ1bmN0aW9uKSB7XHJcbiAgICB0aGlzLmxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xyXG4gIH1cclxuICBcclxuICBwdWJsaWMgbm90aWZ5PEE+KC4uLmFyZ3M6IEFbXSk6IHZvaWQge1xyXG4gICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcclxuICAgICAgbGlzdGVuZXIoLi4uYXJncyk7XHJcbiAgICB9KVxyXG4gIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2NvbXBvbmVudHMvb2JzZXJ2ZXIvb2JzZXJ2ZXIudHMiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/aW1wb3J0TG9hZGVycz0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdGhlbWUuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvbGliL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/aW1wb3J0TG9hZGVycz0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdGhlbWUuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/aW1wb3J0TG9hZGVycz0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdGhlbWUuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL3ZpZXcvdGhlbWUuc2Nzc1xuLy8gbW9kdWxlIGlkID0gLi9jb21wb25lbnRzL3ZpZXcvdGhlbWUuc2Nzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanM/aW1wb3J0TG9hZGVycz0yIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9saWIvbG9hZGVyLmpzIS4vdmlldy5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9pbXBvcnRMb2FkZXJzPTIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi92aWV3LnNjc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzP2ltcG9ydExvYWRlcnM9MiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvbGliL2xvYWRlci5qcyEuL3ZpZXcuc2Nzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9jb21wb25lbnRzL3ZpZXcvdmlldy5zY3NzXG4vLyBtb2R1bGUgaWQgPSAuL2NvbXBvbmVudHMvdmlldy92aWV3LnNjc3Ncbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICcuL3ZpZXcuc2Nzcyc7XHJcbmltcG9ydCAnLi90aGVtZS5zY3NzJztcclxuXHJcbmltcG9ydCBJRXZlbnQgZnJvbSAnLi8uLi9vYnNlcnZlci9vYnNlcnZlcic7XHJcbmltcG9ydCB7IElNb2RlbCBhcyBNb2RlbCwgSU1vZGVsRXZlbnRzLCBJTW9kZWxPcHRpb25zIH0gZnJvbSAnLi4vbW9kZWwvbmFtZXNwYWNlJztcclxuaW1wb3J0IHsgSVZpZXdPcHRpb25zLCBJVmlld0V2ZW50cyB9IGZyb20gJy4vbmFtZXNwYWNlJztcclxuXHJcbmludGVyZmFjZSBJTWFuZGF0b3J5T3B0aW9ucyBleHRlbmRzIElWaWV3T3B0aW9ucyB7XHJcbiAgdHlwZTogc3RyaW5nO1xyXG4gIG9yaWVudGF0aW9uOiBzdHJpbmc7XHJcbiAgZnJvbV9maXhlZDogYm9vbGVhbjtcclxuICB0b19maXhlZDogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIElOb2RlcyB7XHJcbiAgdHJhY2s6IEhUTUxEaXZFbGVtZW50O1xyXG4gIGZyb206IEhUTUxTcGFuRWxlbWVudDtcclxuICB0bz86IEhUTUxTcGFuRWxlbWVudDtcclxuICByYW5nZT86IEhUTUxEaXZFbGVtZW50O1xyXG59XHJcblxyXG50eXBlIFN0eWxlID0gJ3RvcCcgfCAnbGVmdCcgfCAncmlnaHQnIHwgJ2JvdHRvbSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGU6IEhUTUxTcGFuRWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gIHByaXZhdGUgbW91c2Vtb3ZlID0gdGhpcy5tb3VzZU1vdmUuYmluZCh0aGlzKTtcclxuICBwcml2YXRlIG1vdXNldXAgPSB0aGlzLm1vdXNlVXAuYmluZCh0aGlzKTtcclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyczogSVZpZXdFdmVudHMgID0ge1xyXG4gICAgc2xpZGVTdGFydDogbmV3IElFdmVudCgpLFxyXG4gICAgc2xpZGVFbmQ6IG5ldyBJRXZlbnQoKSxcclxuICAgIGZyb21DaGFuZ2VkOiBuZXcgSUV2ZW50KCksXHJcbiAgICB0b0NoYW5nZWQ6IG5ldyBJRXZlbnQoKSxcclxuICB9XHJcblxyXG4gIHN0YXRpYyB0eXBlcyA9IHsgXHJcbiAgICBzaW5nbGU6ICdzaW5nbGUnLCBcclxuICAgIG1pbjogJ21pbicsIFxyXG4gICAgbWF4OiAnbWF4JywgXHJcbiAgICBkb3VibGU6ICdkb3VibGUnIFxyXG4gIH07XHJcblxyXG4gIHN0YXRpYyBvcmllbnRhdGlvbnMgPSB7XHJcbiAgICBob3Jpem9udGFsOiAnaG9yaXpvbnRhbCcsXHJcbiAgICB2ZXJ0aWNhbDogJ3ZlcnRpY2FsJ1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvcHRpb25zOiBJTWFuZGF0b3J5T3B0aW9ucyA9IHtcclxuICAgIHR5cGU6IFZpZXcudHlwZXMuc2luZ2xlLFxyXG4gICAgb3JpZW50YXRpb246IFZpZXcub3JpZW50YXRpb25zLmhvcml6b250YWwsXHJcbiAgICBmcm9tX2ZpeGVkOiBmYWxzZSxcclxuICAgIHRvX2ZpeGVkOiBmYWxzZVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub2RlczogSU5vZGVzID0ge1xyXG4gICAgdHJhY2s6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgZnJvbTogZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpXHJcbiAgfTtcclxuICBcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJvb3Q6IEhUTUxEaXZFbGVtZW50IHwgSFRNTFNwYW5FbGVtZW50LCB2aWV3T3B0aW9uczogSVZpZXdPcHRpb25zID0ge30pIHtcclxuICAgICAgdGhpcy5pbml0KHZpZXdPcHRpb25zKTtcclxuICB9XHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09IGFjY2Vzc29ycyA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIGdldCBkYXRhKCk6IElNYW5kYXRvcnlPcHRpb25zIHtcclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnM7XHJcbiAgfVxyXG5cclxuICBnZXQgZXZlbnRzKCk6IElWaWV3RXZlbnRzIHtcclxuICAgIHJldHVybiB0aGlzLnRyaWdnZXJzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IG5vZGVzRGF0YSgpIHtcclxuICAgIHJldHVybiB0aGlzLm5vZGVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHJvb3RPYmplY3QoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yb290O1xyXG4gIH1cclxuXHJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT0gcHVibGljIG1ldGhvZHMgPT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICBwdWJsaWMgaW5pdCh2aWV3T3B0aW9uczogSVZpZXdPcHRpb25zLCBpc1VwZGF0ZT86IGJvb2xlYW4pIHtcclxuICAgIGNvbnN0IG8gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBjb25zdCB2ID0gdmlld09wdGlvbnM7XHJcblxyXG4gICAgaWYgKHYudHlwZSAmJiB2LnR5cGUgaW4gVmlldy50eXBlcykge1xyXG4gICAgICBvLnR5cGUgPSB2LnR5cGU7XHJcbiAgICB9XHJcbiAgICBpZiAodi5vcmllbnRhdGlvbiAmJiB2Lm9yaWVudGF0aW9uIGluIFZpZXcub3JpZW50YXRpb25zKSB7XHJcbiAgICAgIG8ub3JpZW50YXRpb24gPSB2Lm9yaWVudGF0aW9uO1xyXG4gICAgfVxyXG4gICAgaWYgKHYuZnJvbV9maXhlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIG8uZnJvbV9maXhlZCA9IHYuZnJvbV9maXhlZDsgXHJcbiAgICB9XHJcbiAgICBpZiAodi50b19maXhlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIG8udG9fZml4ZWQgPSB2LnRvX2ZpeGVkOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy5yb290RW1wdHkoKTtcclxuICAgIHRoaXMuc2V0Tm9kZXMoKTtcclxuICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB0aGlzLnNldEhhbmRsZXJzKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2FsY0Zyb20oZnJvbTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBvID0gdGhpcy5vcHRpb25zO1xyXG4gICAgY29uc3QgZCA9IFZpZXcub3JpZW50YXRpb25zO1xyXG4gICAgY29uc3QgbiA9IHRoaXMubm9kZXM7XHJcbiAgICBcclxuICAgIGlmIChvLm9yaWVudGF0aW9uID09PSBkLmhvcml6b250YWwpIHtcclxuICAgICAgbi5mcm9tLnN0eWxlLmxlZnQgPSBgJHtmcm9tfSVgO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbi5mcm9tLnN0eWxlLmJvdHRvbSA9IGAke2Zyb219JWA7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMuY2FsY1JhbmdlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY2FsY1RvKHRvOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IG8gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBjb25zdCBkID0gVmlldy5vcmllbnRhdGlvbnM7XHJcbiAgICBjb25zdCB0ID0gVmlldy50eXBlcztcclxuICAgIGNvbnN0IG4gPSB0aGlzLm5vZGVzO1xyXG4gICAgbGV0IGJhc2U6IFN0eWxlID0gJ2xlZnQnO1xyXG5cclxuICAgIGlmIChvLnR5cGUgIT09IHQuZG91YmxlIHx8ICFuLnRvKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoby5vcmllbnRhdGlvbiA9PT0gZC52ZXJ0aWNhbCkge1xyXG4gICAgICBiYXNlID0gJ2JvdHRvbSc7XHJcbiAgICB9XHJcbiAgICAgIFxyXG4gICAgbi50by5zdHlsZVtiYXNlXSA9IGAke3RvfSVgO1xyXG4gICAgdGhpcy5jYWxjUmFuZ2UoKTtcclxuICB9XHJcblxyXG4gIC8vID09PT09PT09PT09PT09PT09IHByaXZhdGUgbWV0aG9kcyA9PT09PT09PT09PT09PT09PT09XHJcblxyXG4gIHByaXZhdGUgcmVuZGVyKCkge1xyXG4gICAgY29uc3QgbyA9IHRoaXMub3B0aW9ucztcclxuICAgIGNvbnN0IHIgPSB0aGlzLnJvb3Q7XHJcbiAgICBjb25zdCBuID0gdGhpcy5ub2RlcztcclxuICAgIGNvbnN0IGQgPSBWaWV3Lm9yaWVudGF0aW9ucztcclxuXHJcbiAgICByLmFwcGVuZENoaWxkKG4udHJhY2spO1xyXG4gICAgbi50cmFjay5hcHBlbmRDaGlsZChuLmZyb20pO1xyXG5cclxuICAgIGlmIChuLnJhbmdlKSB7XHJcbiAgICAgIG4udHJhY2suYXBwZW5kQ2hpbGQobi5yYW5nZSk7XHJcbiAgICB9XHJcbiAgICBpZiAobi50bykge1xyXG4gICAgICBuLnRyYWNrLmFwcGVuZENoaWxkKG4udG8pXHJcbiAgICB9XHJcbiAgICBpZiAoby5vcmllbnRhdGlvbiA9PT0gZC5ob3Jpem9udGFsICYmICFuLnRyYWNrLmNsaWVudFdpZHRoKSB7XHJcbiAgICAgIHRocm93IFwiemVybyBjb250YWluZXIgd2lkdGhcIjtcclxuICAgIH0gZWxzZSBpZiAoby5vcmllbnRhdGlvbiA9PT0gZC52ZXJ0aWNhbCAmJiAhbi50cmFjay5jbGllbnRIZWlnaHQpIHtcclxuICAgICAgdGhyb3cgXCJ6ZXJvIGNvbnRhaW5lciBoZWlnaHRcIjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0SGFuZGxlcnMoKSB7XHJcbiAgICBjb25zdCB0ID0gdGhpcy50cmlnZ2VycztcclxuICAgIGNvbnN0IG4gPSB0aGlzLm5vZGVzO1xyXG5cclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW92ZSk7XHJcbiAgICBuLnRyYWNrLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMubW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm1vdXNldXApO1xyXG4gICAgXHJcbiAgICBuLnRyYWNrLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMubW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRFdmVudHMoKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjYWxjUmFuZ2UoKSB7XHJcbiAgICBjb25zdCBvID0gdGhpcy5vcHRpb25zO1xyXG4gICAgY29uc3QgZCA9IFZpZXcub3JpZW50YXRpb25zO1xyXG4gICAgY29uc3QgdCA9IFZpZXcudHlwZXM7XHJcbiAgICBjb25zdCBuID0gdGhpcy5ub2RlcztcclxuICAgIFxyXG4gICAgbGV0IGJhc2VGOiBTdHlsZSA9ICdsZWZ0JztcclxuICAgIGxldCBiYXNlVDogU3R5bGUgPSAncmlnaHQnO1xyXG5cclxuICAgIGlmIChvLnR5cGUgPT09IHQuc2luZ2xlIHx8ICFuLnJhbmdlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoby5vcmllbnRhdGlvbiA9PT0gZC52ZXJ0aWNhbCkgeyBcclxuICAgICAgYmFzZUYgPSAnYm90dG9tJztcclxuICAgICAgYmFzZVQgPSAndG9wJztcclxuICAgIH1cclxuICAgIFxyXG4gICAgaWYgKG8udHlwZSA9PT0gdC5taW4pIHtcclxuICAgICAgbi5yYW5nZS5zdHlsZVtiYXNlRl0gPSBgMGA7XHJcbiAgICAgIG4ucmFuZ2Uuc3R5bGVbYmFzZVRdID0gYCR7MTAwIC0gcGFyc2VGbG9hdCg8c3RyaW5nPm4uZnJvbS5zdHlsZVtiYXNlRl0pfSVgO1xyXG4gICAgfSBlbHNlIGlmIChvLnR5cGUgPT09IHQubWF4KSB7XHJcbiAgICAgIG4ucmFuZ2Uuc3R5bGVbYmFzZUZdID0gbi5mcm9tLnN0eWxlW2Jhc2VGXTtcclxuICAgICAgbi5yYW5nZS5zdHlsZVtiYXNlVF0gPSBgMGA7XHJcbiAgICB9IGVsc2UgaWYgKG8udHlwZSA9PT0gdC5kb3VibGUgJiYgbi50bykge1xyXG4gICAgICBuLnJhbmdlLnN0eWxlW2Jhc2VGXSA9IG4uZnJvbS5zdHlsZVtiYXNlRl07XHJcbiAgICAgIG4ucmFuZ2Uuc3R5bGVbYmFzZVRdID0gYCR7MTAwIC0gcGFyc2VGbG9hdCg8c3RyaW5nPm4udG8uc3R5bGVbYmFzZUZdKX0lYDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2V0Tm9kZXMoKSB7XHJcblxyXG4gICAgdGhpcy5ub2RlcyA9IHtcclxuICAgICAgdHJhY2s6IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxyXG4gICAgICBmcm9tOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvID0gdGhpcy5vcHRpb25zO1xyXG4gICAgY29uc3QgbiA9IHRoaXMubm9kZXM7XHJcblxyXG4gICAgaWYgKHRoaXMucm9vdC5jbGFzc05hbWUuaW5kZXhPZigndmFuaWxsYScpIDwgMCkge1xyXG4gICAgICB0aGlzLnJvb3QuY2xhc3NOYW1lICs9ICcgdmFuaWxsYSc7XHJcbiAgICB9XHJcbiAgICBuLnRyYWNrLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgdmFuaWxsYS1zbGlkZXIgdmFuaWxsYS0ke28udHlwZX0gdmFuaWxsYS0ke28ub3JpZW50YXRpb259YCk7XHJcblxyXG4gICAgbi5mcm9tLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCBgMGApO1xyXG4gICAgbi5mcm9tLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgdmFuaWxsYS1oYW5kbGUgdmFuaWxsYS1oYW5kbGUtZnJvbWApO1xyXG5cclxuICAgIGlmIChvLmZyb21fZml4ZWQpIHtcclxuICAgICAgbi5mcm9tLmNsYXNzTGlzdC5hZGQoYHZhbmlsbGEtaGFuZGxlLWZpeGVkYCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG8udHlwZSAhPT0gVmlldy50eXBlcy5zaW5nbGUpIHtcclxuICAgICAgbi5yYW5nZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICBuLnJhbmdlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBgdmFuaWxsYS1yYW5nZSB2YW5pbGxhLXJhbmdlLSR7by50eXBlfWApO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVsZXRlIG4ucmFuZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG8udHlwZSA9PT0gVmlldy50eXBlcy5kb3VibGUpIHtcclxuICAgICAgbi50byA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgbi50by5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgYDBgKTtcclxuICAgICAgbi50by5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgYHZhbmlsbGEtaGFuZGxlIHZhbmlsbGEtaGFuZGxlLXRvYCk7XHJcblxyXG4gICAgICBpZiAoby50b19maXhlZCkge1xyXG4gICAgICAgIG4udG8uY2xhc3NMaXN0LmFkZChgdmFuaWxsYS1oYW5kbGUtZml4ZWRgKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGVsZXRlIG4udG87XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJvb3RFbXB0eSgpIHtcclxuICAgIHdoaWxlICh0aGlzLnJvb3QuZmlyc3RDaGlsZCkge1xyXG4gICAgICB0aGlzLnJvb3QucmVtb3ZlQ2hpbGQodGhpcy5yb290LmZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtb3VzZURvd24oZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIGNvbnN0IG8gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBjb25zdCBuID0gdGhpcy5ub2RlcztcclxuICAgIGNvbnN0IGQgPSBWaWV3Lm9yaWVudGF0aW9ucztcclxuICAgIGNvbnN0IGUgPSB0aGlzLmV2ZW50cztcclxuICAgIGNvbnN0IGNvb3JkID0gKG8ub3JpZW50YXRpb24gPT09IGQuaG9yaXpvbnRhbCA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucGFnZVggLSBuLnRyYWNrLm9mZnNldExlZnQgOiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnBhZ2VZIC0gbi50cmFjay5vZmZzZXRUb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmIChldmVudC50YXJnZXQgPT09IG4uZnJvbSkge1xyXG4gICAgICB0aGlzLmhhbmRsZSA9IG4uZnJvbTtcclxuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBuLnRvKSB7XHJcbiAgICAgIHRoaXMuaGFuZGxlID0gbi50bztcclxuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBuLnJhbmdlIHx8IGV2ZW50LnRhcmdldCA9PT0gbi50cmFjaykge1xyXG4gICAgICB0aGlzLmhhbmRsZSA9IHRoaXMuY2hvb3NlSGFuZGxlKGNvb3JkKTtcclxuICAgICAgdGhpcy5tb3VzZU1vdmUoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIG4uZnJvbS5jbGFzc0xpc3QucmVtb3ZlKCdsYXN0LXR5cGUnKTtcclxuICAgIGlmIChuLnRvKSB7XHJcbiAgICAgIG4udG8uY2xhc3NMaXN0LnJlbW92ZSgnbGFzdC10eXBlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLmdldENvb3JkKGV2ZW50KTtcclxuXHJcbiAgICBpZiAodGhpcy5oYW5kbGUpIHtcclxuICAgICAgdGhpcy5oYW5kbGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgIHRoaXMuaGFuZGxlLmNsYXNzTGlzdC5hZGQoJ2xhc3QtdHlwZScpO1xyXG4gICAgICBlLnNsaWRlU3RhcnQubm90aWZ5PEhUTUxTcGFuRWxlbWVudCB8IG51bWJlcj4odGhpcy5oYW5kbGUsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW92ZSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCkge1xyXG4gICAgY29uc3QgZSA9IHRoaXMuZXZlbnRzO1xyXG4gICAgY29uc3QgbiA9IHRoaXMubm9kZXM7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0Q29vcmQoZXZlbnQpO1xyXG4gICAgaWYgKHRoaXMuaGFuZGxlID09PSBuLmZyb20pIHtcclxuICAgICAgZS5mcm9tQ2hhbmdlZC5ub3RpZnk8SFRNTFNwYW5FbGVtZW50IHwgbnVtYmVyPih0aGlzLmhhbmRsZSwgdmFsdWUpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLmhhbmRsZSA9PT0gbi50bykge1xyXG4gICAgICBlLnRvQ2hhbmdlZC5ub3RpZnk8SFRNTFNwYW5FbGVtZW50IHwgbnVtYmVyPih0aGlzLmhhbmRsZSwgdmFsdWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBjb25zdCBuID0gdGhpcy5ub2RlcztcclxuICAgIGNvbnN0IHQgPSBldmVudC50YXJnZXQ7XHJcbiAgICBjb25zdCBlID0gdGhpcy5ldmVudHM7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZ2V0Q29vcmQoZXZlbnQpO1xyXG5cclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm1vdXNlbW92ZSk7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMubW91c2V1cCk7XHJcbiAgICBpZiAodGhpcy5oYW5kbGUpIHtcclxuICAgICAgdGhpcy5oYW5kbGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgIGUuc2xpZGVFbmQubm90aWZ5PEhUTUxTcGFuRWxlbWVudCB8IG51bWJlcj4odGhpcy5oYW5kbGUsIHZhbHVlKTtcclxuICAgIH1cclxuICAgIHRoaXMuaGFuZGxlID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2hvb3NlSGFuZGxlKGNvb3JkOiBudW1iZXIpOiBIVE1MU3BhbkVsZW1lbnQgfCBudWxsIHtcclxuICAgIGNvbnN0IG8gPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBjb25zdCB0ID0gVmlldy50eXBlcztcclxuICAgIGNvbnN0IGQgPSBWaWV3Lm9yaWVudGF0aW9ucztcclxuICAgIGNvbnN0IG4gPSB0aGlzLm5vZGVzO1xyXG4gICAgbGV0IHJlc3VsdDogSFRNTFNwYW5FbGVtZW50O1xyXG5cclxuICAgIGlmICh0aGlzLmhhbmRsZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG8udHlwZSAhPT0gdC5kb3VibGUpIHtcclxuICAgICAgcmV0dXJuIG4uZnJvbTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoby5mcm9tX2ZpeGVkICYmIG8udG9fZml4ZWQpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9IGVsc2UgaWYgKG8uZnJvbV9maXhlZCkge1xyXG4gICAgICByZXR1cm4gbi50byBhcyBIVE1MRWxlbWVudDtcclxuICAgIH0gZWxzZSBpZiAoby50b19maXhlZCkge1xyXG4gICAgICByZXR1cm4gbi5mcm9tO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjb25zdCBmcm9tQ29vcmQgPSB0aGlzLm9mZnNldChuLmZyb20pO1xyXG4gICAgY29uc3QgdG9Db29yZCA9IHRoaXMub2Zmc2V0KG4udG8gYXMgSFRNTEVsZW1lbnQpO1xyXG5cclxuICAgIGlmIChmcm9tQ29vcmQgPT09IHRvQ29vcmQpIHtcclxuICAgICAgcmVzdWx0ID0gPEhUTUxTcGFuRWxlbWVudD4oY29vcmQgPCBmcm9tQ29vcmQgPyBuLmZyb20gOiBuLnRvKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9IDxIVE1MU3BhbkVsZW1lbnQ+KE1hdGguYWJzKGZyb21Db29yZCAtIGNvb3JkKSA8IE1hdGguYWJzKHRvQ29vcmQgLSBjb29yZCkgPyBuLmZyb20gOiBuLnRvKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldENvb3JkKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBjb25zdCBvID0gdGhpcy5vcHRpb25zO1xyXG4gICAgY29uc3QgZCA9IFZpZXcub3JpZW50YXRpb25zO1xyXG4gICAgY29uc3QgbiA9IHRoaXMubm9kZXM7XHJcblxyXG4gICAgaWYgKG8ub3JpZW50YXRpb24gPT09IGQuaG9yaXpvbnRhbCkge1xyXG4gICAgICAgcmV0dXJuIGV2ZW50LnBhZ2VYIC0gbi50cmFjay5vZmZzZXRMZWZ0O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGV2ZW50LnBhZ2VZIC0gbi50cmFjay5vZmZzZXRUb3A7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG91dGVyV2lkdGgobm9kZTogSFRNTEVsZW1lbnQpIHtcclxuICAgIGNvbnN0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShub2RlKTtcclxuICAgIGNvbnN0IHdpZHRoID0gbm9kZS5vZmZzZXRXaWR0aCArIHBhcnNlSW50KHN0eWxlLm1hcmdpbkxlZnQgYXMgc3RyaW5nKSArIHBhcnNlSW50KHN0eWxlLm1hcmdpblJpZ2h0IGFzIHN0cmluZyk7XHJcblxyXG4gICAgcmV0dXJuIHdpZHRoO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvdXRlckhlaWdodChub2RlOiBIVE1MRWxlbWVudCkge1xyXG4gICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKG5vZGUpO1xyXG4gICAgY29uc3QgaGVpZ2h0ID0gbm9kZS5vZmZzZXRIZWlnaHQgKyBwYXJzZUludChzdHlsZS5tYXJnaW5MZWZ0IGFzIHN0cmluZykgKyBwYXJzZUludChzdHlsZS5tYXJnaW5SaWdodCBhcyBzdHJpbmcpO1xyXG5cclxuICAgIHJldHVybiBoZWlnaHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9mZnNldChub2RlOiBIVE1MRWxlbWVudCkge1xyXG4gICAgY29uc3QgbyA9IHRoaXMub3B0aW9ucztcclxuICAgIGNvbnN0IGQgPSBWaWV3Lm9yaWVudGF0aW9ucztcclxuXHJcbiAgICBpZiAoby5vcmllbnRhdGlvbiA9PT0gZC5ob3Jpem9udGFsKSB7XHJcbiAgICAgIHJldHVybiBub2RlLm9mZnNldExlZnQgKyB0aGlzLm91dGVyV2lkdGgobm9kZSkvMjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBub2RlLm9mZnNldFRvcCArIHRoaXMub3V0ZXJIZWlnaHQobm9kZSkvMjtcclxuICAgIH0gXHJcbiAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vY29tcG9uZW50cy92aWV3L3ZpZXcudHMiLCJpbXBvcnQgJy4vaW5kZXguc2Nzcyc7XHJcbmltcG9ydCBWYW5pbGxhU2xpZGVyIGZyb20gJy4vc2xpZGVyJztcclxuXHJcblxyXG5jb25zdCBzbGlkZXIgPSBuZXcgVmFuaWxsYVNsaWRlcignI3NsaWRlcicsIHtcclxuICB0eXBlOiBcImRvdWJsZVwiLFxyXG4gIGZyb206IDEwLFxyXG4gIGZyb21fZml4ZWQ6IHRydWUsXHJcbiAgdG86IDIwLFxyXG4gIG9uU2xpZGU6IChlLCBkKSA9PiB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjc2V0dGluZ3MnKS5pbm5lckhUTUwgPSBkLnZhbHVlO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuaWYgKG1vZHVsZS5ob3QgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xyXG4gIG1vZHVsZS5ob3QuYWNjZXB0KCk7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9pbmRleC5qcyIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9pbXBvcnRMb2FkZXJzPTIhLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9pbmRleC5zY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9pbXBvcnRMb2FkZXJzPTIhLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9pbmRleC5zY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcz9pbXBvcnRMb2FkZXJzPTIhLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2xpYi9sb2FkZXIuanMhLi9pbmRleC5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2luZGV4LnNjc3Ncbi8vIG1vZHVsZSBpZCA9IC4vaW5kZXguc2Nzc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgTW9kZWwgZnJvbSAnLi9jb21wb25lbnRzL21vZGVsL21vZGVsJztcclxuaW1wb3J0IFZpZXcgZnJvbSAnLi9jb21wb25lbnRzL3ZpZXcvdmlldyc7XHJcbmltcG9ydCBDb250cm9sbGVyIGZyb20gJy4vY29tcG9uZW50cy9jb250cm9sbGVyL2NvbnRyb2xsZXInO1xyXG5cclxuaW1wb3J0IHtJTW9kZWxPcHRpb25zfSBmcm9tICcuL2NvbXBvbmVudHMvbW9kZWwvbmFtZXNwYWNlJztcclxuaW1wb3J0IHtJVmlld09wdGlvbnN9IGZyb20gJy4vY29tcG9uZW50cy92aWV3L25hbWVzcGFjZSc7XHJcbmltcG9ydCB7SUNvbnRyb2xsZXJPcHRpb25zfSBmcm9tICcuL2NvbXBvbmVudHMvY29udHJvbGxlci9uYW1lc3BhY2UnO1xyXG5cclxuaW50ZXJmYWNlIElPcHRpb25zIHtcclxuICB0eXBlPzogc3RyaW5nO1xyXG4gIG9yaWVudGF0aW9uPzogc3RyaW5nO1xyXG4gIG1pbj86IG51bWJlciB8IHN0cmluZztcclxuICBtYXg/OiBudW1iZXIgfCBzdHJpbmc7XHJcbiAgZnJvbT86IG51bWJlciB8IHN0cmluZztcclxuICBmcm9tX2ZpeGVkPzogYm9vbGVhbiB8IHN0cmluZztcclxuICB0bz86IG51bWJlciB8IHN0cmluZztcclxuICB0b19maXhlZD86IGJvb2xlYW4gfCBzdHJpbmc7XHJcbiAgc3RlcD86IG51bWJlciB8IHN0cmluZztcclxuXHJcbiAgb25DcmVhdGU/OiBGdW5jdGlvbjtcclxuICBvblN0YXJ0PzogRnVuY3Rpb247XHJcbiAgb25TbGlkZT86IEZ1bmN0aW9uO1xyXG4gIG9uRW5kPzogRnVuY3Rpb247XHJcbiAgb25VcGRhdGU/OiBGdW5jdGlvbjtcclxufVxyXG5cclxudHlwZSBTZWxlY3RvciA9IEhUTUxFbGVtZW50IHwgSFRNTENvbGxlY3Rpb24gfCBzdHJpbmc7XHJcblxyXG5jbGFzcyBDb25zdHJ1Y3RvciB7XHJcblxyXG4gIHB1YmxpYyByb290OiBIVE1MRGl2RWxlbWVudCB8IEhUTUxTcGFuRWxlbWVudDtcclxuXHJcbiAgcHJpdmF0ZSBtb2RlbE9wdGlvbnM6IElNb2RlbE9wdGlvbnM7XHJcbiAgcHJpdmF0ZSB2aWV3T3B0aW9uczogSVZpZXdPcHRpb25zO1xyXG4gIHByaXZhdGUgY29udHJvbGxlck9wdGlvbnM6IElDb250cm9sbGVyT3B0aW9ucztcclxuXHJcbiAgcHJpdmF0ZSB2aWV3OiBWaWV3O1xyXG4gIHByaXZhdGUgbW9kZWw6IE1vZGVsO1xyXG4gIHByaXZhdGUgY29udHJvbGxlcjogQ29udHJvbGxlcjtcclxuIFxyXG4gIGNvbnN0cnVjdG9yKHJvb3RPYmplY3Q6IFNlbGVjdG9yLCBvcHRpb25zOiBJT3B0aW9ucyA9IHt9LCBwdWJsaWMgd3JhcDogVmFuaWxsYVNsaWRlcikge1xyXG4gICAgaWYgKHRoaXMuc2V0Um9vdChyb290T2JqZWN0KSkge1xyXG4gICAgICB0aGlzLmluaXQob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgZGF0YSgpIHtcclxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm1vZGVsLmRhdGEsIHRoaXMudmlldy5kYXRhKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXQob3B0aW9uczogSU9wdGlvbnMpIHtcclxuICAgIGlmICh0aGlzLnNldE9wdGlvbnMob3B0aW9ucykpIHtcclxuICAgICAgdGhpcy5tb2RlbC5pbml0KHRoaXMubW9kZWxPcHRpb25zLCB0cnVlKTtcclxuICAgICAgdGhpcy52aWV3LmluaXQodGhpcy52aWV3T3B0aW9ucywgdHJ1ZSk7XHJcbiAgICAgIHRoaXMuY29udHJvbGxlci5pbml0KHRoaXMuY29udHJvbGxlck9wdGlvbnMsIHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0KG9wdGlvbnM6IElPcHRpb25zKSB7XHJcbiAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICB0aGlzLm1vZGVsID0gbmV3IE1vZGVsKHRoaXMubW9kZWxPcHRpb25zKTtcclxuICAgIHRoaXMudmlldyA9IG5ldyBWaWV3KHRoaXMucm9vdCwgdGhpcy52aWV3T3B0aW9ucyk7XHJcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBuZXcgQ29udHJvbGxlcih0aGlzLm1vZGVsLCB0aGlzLnZpZXcsIHRoaXMuY29udHJvbGxlck9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZXRPcHRpb25zKG9wdGlvbnM6IElPcHRpb25zKSB7XHJcbiAgICBjb25zdCBvID0gb3B0aW9ucztcclxuICAgIGNvbnN0IHQgPSBWaWV3LnR5cGVzO1xyXG4gICAgY29uc3QgZCA9IFZpZXcub3JpZW50YXRpb25zO1xyXG4gICAgbGV0IHVwZGF0ZWQgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgdGhpcy5tb2RlbE9wdGlvbnMgPSB7fTtcclxuICAgIHRoaXMudmlld09wdGlvbnMgPSB7fTtcclxuICAgIHRoaXMuY29udHJvbGxlck9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICBpZiAoby50eXBlICYmIG8udHlwZSBpbiB0KSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMudHlwZSA9IG8udHlwZTtcclxuICAgICAgdGhpcy5tb2RlbE9wdGlvbnMudHlwZSA9IG8udHlwZSA9PT0gdC5kb3VibGUgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgIHVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKG8ub3JpZW50YXRpb24gJiYgby5vcmllbnRhdGlvbiBpbiBkKSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMub3JpZW50YXRpb24gPSBvLm9yaWVudGF0aW9uO1xyXG4gICAgICB1cGRhdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmIChvLm1pbiAhPT0gdW5kZWZpbmVkICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKG8ubWluKSkpIHtcclxuICAgICAgdGhpcy5tb2RlbE9wdGlvbnMubWluID0gTnVtYmVyKG8ubWluKTtcclxuICAgICAgdXBkYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAoby5tYXggIT09IHVuZGVmaW5lZCAmJiAhTnVtYmVyLmlzTmFOKE51bWJlcihvLm1heCkpKSB7XHJcbiAgICAgIHRoaXMubW9kZWxPcHRpb25zLm1heCA9IE51bWJlcihvLm1heCk7XHJcbiAgICAgIHVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKG8uZnJvbSAhPT0gdW5kZWZpbmVkICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKG8uZnJvbSkpKSB7XHJcbiAgICAgIHRoaXMubW9kZWxPcHRpb25zLmZyb20gPSBOdW1iZXIoby5mcm9tKTtcclxuICAgICAgdXBkYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAoby50byAhPT0gdW5kZWZpbmVkICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKG8udG8pKSkge1xyXG4gICAgICB0aGlzLm1vZGVsT3B0aW9ucy50byA9IE51bWJlcihvLnRvKTtcclxuICAgICAgdXBkYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAoby5mcm9tX2ZpeGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29uc3QgciA9ICgvdHJ1ZS9pKS50ZXN0KG8uZnJvbV9maXhlZC50b1N0cmluZygpKTtcclxuICAgICAgdGhpcy5tb2RlbE9wdGlvbnMuZnJvbV9maXhlZCA9IHI7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMuZnJvbV9maXhlZCA9IHI7XHJcbiAgICB9XHJcbiAgICBpZiAoby50b19maXhlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGNvbnN0IHIgPSAoL3RydWUvaSkudGVzdChvLnRvX2ZpeGVkLnRvU3RyaW5nKCkpO1xyXG4gICAgICB0aGlzLm1vZGVsT3B0aW9ucy50b19maXhlZCA9IHI7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMudG9fZml4ZWQgPSByO1xyXG4gICAgfVxyXG4gICAgaWYgKG8uc3RlcCAhPT0gdW5kZWZpbmVkICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKG8uc3RlcCkpKSB7XHJcbiAgICAgIHRoaXMubW9kZWxPcHRpb25zLnN0ZXAgPSBOdW1iZXIoby5zdGVwKTtcclxuICAgICAgdXBkYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jb250cm9sbGVyT3B0aW9ucy5vbkNyZWF0ZSA9IG8ub25DcmVhdGU7XHJcbiAgICB0aGlzLmNvbnRyb2xsZXJPcHRpb25zLm9uU3RhcnQgPSBvLm9uU3RhcnQ7XHJcbiAgICB0aGlzLmNvbnRyb2xsZXJPcHRpb25zLm9uU2xpZGUgPSBvLm9uU2xpZGU7XHJcbiAgICB0aGlzLmNvbnRyb2xsZXJPcHRpb25zLm9uRW5kID0gby5vbkVuZDtcclxuICAgIHRoaXMuY29udHJvbGxlck9wdGlvbnMub25VcGRhdGUgPSBvLm9uVXBkYXRlO1xyXG4gICAgcmV0dXJuIHVwZGF0ZWQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldFJvb3Qocm9vdDogU2VsZWN0b3IpIHtcclxuICAgIGNvbnN0IHIgPSBDb25zdHJ1Y3Rvci5jaGVja05vZGUocm9vdCk7XHJcblxyXG4gICAgaWYgKHIpIHtcclxuICAgICAgdGhpcy5yb290ID0gciBhcyBIVE1MRGl2RWxlbWVudCB8IEhUTUxTcGFuRWxlbWVudDtcclxuICAgIH0gXHJcbiAgICBlbHNle1xyXG4gICAgICB0aHJvdyBcIkludmFsaWQgbm9kZSB0eXBlLCBleHBlY3RlZCAnZGl2J1wiO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY2hlY2tOb2RlKG5vZGU6IFNlbGVjdG9yKSB7XHJcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEhUTUxEaXZFbGVtZW50IHx8IG5vZGUgaW5zdGFuY2VvZiBIVE1MU3BhbkVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBIVE1MQ29sbGVjdGlvbiAmJiBub2RlWzBdIGluc3RhbmNlb2YgSFRNTERpdkVsZW1lbnQpIHtcclxuICAgICAgcmV0dXJuIDxIVE1MRGl2RWxlbWVudCB8IEhUTUxTcGFuRWxlbWVudD5ub2RlWzBdO1xyXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgY29uc3QgdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iobm9kZSk7XHJcbiAgICAgIGlmICh0IGluc3RhbmNlb2YgSFRNTERpdkVsZW1lbnQgfHwgdCBpbnN0YW5jZW9mIEhUTUxTcGFuRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWYW5pbGxhU2xpZGVyIHtcclxuXHJcbiAgc2V0OiAob3B0aW9uczogSU9wdGlvbnMpID0+IHZvaWQ7XHJcbiAgZGF0YTogKCkgPT4gSU9wdGlvbnM7XHJcbiAgXHJcbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VzOiBBcnJheTxDb25zdHJ1Y3Rvcj4gPSBbXTtcclxuICBcclxuICBjb25zdHJ1Y3Rvcihyb290OiBTZWxlY3Rvciwgb3B0aW9uczogSU9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3Iocm9vdCwgb3B0aW9ucywgdGhpcyk7XHJcbiAgICB0aGlzLnNldCA9IGluc3RhbmNlLnNldC5iaW5kKGluc3RhbmNlKTtcclxuICAgIHRoaXMuZGF0YSA9ICgpID0+IGluc3RhbmNlLmRhdGE7XHJcbiAgICBWYW5pbGxhU2xpZGVyLmluc3RhbmNlcy5wdXNoKGluc3RhbmNlKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBmb3Iobm9kZTogU2VsZWN0b3IpIHtcclxuICAgIGNvbnN0IG4gPSBDb25zdHJ1Y3Rvci5jaGVja05vZGUobm9kZSk7XHJcbiAgICBmb3IgKGxldCBpbnMgb2YgVmFuaWxsYVNsaWRlci5pbnN0YW5jZXMpIHtcclxuICAgICAgaWYgKG4gJiYgbiA9PT0gaW5zLnJvb3QpIHtcclxuICAgICAgICByZXR1cm4gaW5zLndyYXA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc2xpZGVyLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==