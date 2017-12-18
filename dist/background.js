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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

// This background file serves as a workaround for mixed content in Chrome
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    var xhr = new XMLHttpRequest();
    var method = request.method ? request.method.toUpperCase() : 'GET';
    xhr.open(method, request.url, true);
    if (method == "POST") {
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    xhr.send(request.data);
    if (request.action == "xhr") {
        xhr.onload = function () {
            callback({ pageText: xhr.responseText });
        };
        xhr.onerror = function () {
            console.debug("[ERROR: xhr]");
            callback();
        };
        return true;
    }
    else if (request.action == "searchForProfessor") {
        xhr.onload = function () {
            var searchPage = document.createElement("html");
            searchPage.innerHTML = xhr.responseText;
            var profLink = searchPage.querySelector(".listing.PROFESSOR");
            if (profLink != null) {
                profLink = profLink.getElementsByTagName("a")[0].getAttribute("href");
            }
            callback({ profLink: profLink });
        };
        xhr.onerror = function () {
            console.debug("[ERROR: searchForProfessor]");
            callback();
        };
        return true;
    }
    else if (request.action == "getOverallScore") {
        xhr.onload = function () {
            var ratingPage = document.createElement("html");
            ratingPage.innerHTML = xhr.responseText;
            var profRating = ratingPage.querySelector("div.grade").innerText;
            callback({ profRating: profRating });
        };
        xhr.onerror = function () {
            console.debug("[ERROR]: getOverallScore");
            callback();
        };
        return true;
    }
    else if (request.action == "getOtherScores") {
        xhr.onload = function () {
            var ratingPage = document.createElement("html");
            ratingPage.innerHTML = xhr.responseText;
            var pageScores = ratingPage.getElementsByClassName("rating");
            var otherScores = [];
            if (pageScores.length > 0) {
                for (var i = 0; i < 3; i++) {
                    otherScores.push(pageScores[i].innerText);
                }
            }
            callback({ otherScores: otherScores });
        };
        xhr.onerror = function () {
            console.debug("[ERROR]: getOtherScores");
            callback();
        };
        return true;
    }
});


/***/ })
/******/ ]);