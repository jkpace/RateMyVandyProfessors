/******/ (function(modules) { // webpackBootstrap
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// @ts-ignore
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var method = request.method ? request.method.toUpperCase() : 'GET';
    var headers = new Headers();
    if (method === 'POST')
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
    var config = {
        method: method,
        headers: headers,
        mode: 'cors',
        cache: 'default',
    };
    switch (request.action) {
        case 'showIcon':
            // @ts-ignore
            chrome.pageAction.show(sender.tab.id);
            return true;
        case 'searchForProfessor':
            fetch(request.url, config)
                .then(function (res) { return res.text(); })
                .then(function (pageText) {
                var searchPage = document.createElement('html');
                searchPage.innerHTML = pageText;
                var profId = searchPage.querySelector('.listing.PROFESSOR');
                var ret = (profId) ?
                    profId.getElementsByTagName('a')[0].getAttribute('href') :
                    profId;
                console.debug(ret);
                sendResponse({ profId: ret });
            })
                .catch(function (err) {
                console.debug('[ERROR: searchForProfessor]');
                console.debug(err);
                sendResponse();
                return false;
            });
            return true;
        case 'getOverallScore':
            fetch(request.url, config)
                .then(function (res) { return res.text(); })
                .then(function (pageText) {
                var ratingPage = document.createElement('html');
                ratingPage.innerHTML = pageText;
                var profRating = ratingPage.querySelector('div.grade').textContent;
                sendResponse({ profRating: profRating });
            })
                .catch(function (err) {
                console.debug('[ERROR: getOverallScore]');
                console.debug(err);
                sendResponse();
                return false;
            });
            return true;
        default:
            console.debug("Action " + request.action + " not recognized");
            break;
    }
});


/***/ })
/******/ ]);