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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restricted__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__subs__ = __webpack_require__(2);
/**
 * Rate My Vandy Professors
 * JavaScript file to scrape information and replace it in Class Search
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var BASE_URL = 'http://www.ratemyprofessors.com';
var BASE_SEARCH_URL = 'http://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=Vanderbilt+University&schoolID=4002&query=';
var GREEN = '#27AE60';
var YELLOW = '#FF9800';
var RED = '#E74C3C';
// Use the same loading indicator that the page already does; don't host our own
var LOADING_INDICATOR = '<img src="https://webapp.mis.vanderbilt.edu/more/images/loading.gif">';
// The divs that contain possible locations for professor names to populate
var $COURSE_LIST_AREAS = [
    document.getElementById('searchClassSectionsResults'),
    document.getElementById('studentCart_content'),
    document.getElementById('enrolledClassSections_content'),
];
// @ts-ignore
chrome.runtime.sendMessage({ action: 'showIcon' });
// Watch each of the areas where professor names may appear for changes. When detected, rate each professor.
var getOverallScoresObserver = new MutationObserver(rateProfessorsOnPage);
$COURSE_LIST_AREAS.forEach(function (area) { return getOverallScoresObserver.observe(area, { childList: true }); });
/**
 * Rates each of the professors currently in view.
 */
function rateProfessorsOnPage() {
    var _this = this;
    var professorNodes = getProfessorNodes();
    // Group nodes by professor name. This way, only one API call needs to be made per professor, then that score
    // is assigned to each of the nodes with that professor
    var groupedProfessorNodes = groupProfessors(professorNodes);
    Object.keys(groupedProfessorNodes).forEach(function (name) { return __awaiter(_this, void 0, void 0, function () {
        var score_1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!(isValidProfessor(name) && isUnratedProfessor(name))) return [3 /*break*/, 2];
                    groupedProfessorNodes[name].forEach(setIsLoading);
                    return [4 /*yield*/, getProfessorId(name).then(getOverallScore)];
                case 1:
                    score_1 = _a.sent();
                    groupedProfessorNodes[name].forEach(function (node) { return setScore(name, node, score_1); });
                    return [3 /*break*/, 3];
                case 2:
                    if (isUnratedProfessor(name)) {
                        groupedProfessorNodes[name].forEach(function (node) { return setInvalidScore(name, node); });
                    }
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    groupedProfessorNodes[name].forEach(function (node) { return setInvalidScore(name, node); });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
}
/**
 * Returns an array of nodes of each search result's professor field
 */
function getProfessorNodes() {
    return document.getElementsByClassName('classInstructor');
}
/**
 * Gets the part of the URL that needs to be appended to the base URL to reach the professor's page
 * Example return: '/ShowRatings.jsp?tid=2301025'
 */
function getProfessorId(profName) {
    var config = {
        action: 'searchForProfessor',
        method: 'POST',
        url: BASE_SEARCH_URL + convertName(profName)
    };
    return new Promise(function (resolve, reject) {
        // @ts-ignore
        chrome.runtime.sendMessage(config, function (res) {
            if (res.profId) {
                resolve(res.profId);
            }
            else {
                reject('Search result not found');
            }
        });
    });
}
/**
 * Scrapes the RMP page for the professor at <profId> for their overall score and returns it
 */
function getOverallScore(profId) {
    var config = {
        action: 'getOverallScore',
        method: 'POST',
        url: BASE_URL + profId,
    };
    return new Promise(function (resolve, reject) {
        // @ts-ignore
        chrome.runtime.sendMessage(config, function (res) {
            if (res.profRating) {
                if (res.profRating === '0.0' || res.profRating.includes('Grade received')) {
                    reject('Professor not rated');
                }
                else {
                    resolve(parseFloat(res.profRating));
                }
            }
            else {
                reject('No rating found');
            }
        });
    });
}
/**
 * Converts a name from it's notation as shown in the search results to a form
 * that can be appended to the base RateMyProfessors URL in order to emulate
 * a search.
 */
function convertName(original) {
    var regex = /\w+(, )\w+/g;
    var temp = regex.exec(original);
    if (temp[0].trim() in __WEBPACK_IMPORTED_MODULE_1__subs__["a" /* subs */]) {
        temp[0] = __WEBPACK_IMPORTED_MODULE_1__subs__["a" /* subs */][temp[0].trim()];
    }
    return encodeURIComponent(temp[0]);
}
/**
 * Returns a color based on <rating>. These numbers match the values on RateMyProfessors.com
 */
function getColor(rating) {
    // TODO: search SPAN, scroll to "Alpren, Francis". The rating is 3.4 but the color is red.
    if (rating >= 3.5) {
        return GREEN;
    }
    if (rating < 2.5) {
        return RED;
    }
    return YELLOW;
}
/**
 * Given an array of elements, groups them by professor name and returns an object
 * where the key represents the professor name and the value is an array of the nodes
 * that correspond to that professor.
 *
 * Slight modification of https://stackoverflow.com/questions/14446511/what-is-the-most-efficient-method-to-groupby-on-a-javascript-array-of-objects
 */
function groupProfessors(vals) {
    return Array.from(vals).reduce(function (ret, val) {
        (ret[val.textContent.trim()] = ret[val.textContent.trim()] || []).push(val);
        return ret;
    }, {});
}
/**
 * Returns TRUE if the professor is a single, non-Staff professor. Staff professors and
 * courses with multiple professors return FALSE.
 */
function isValidProfessor(name) {
    return (name !== '' && !name.includes('Staff') && !name.includes(' | ') && !__WEBPACK_IMPORTED_MODULE_0__restricted__["a" /* restricted */].includes(name));
}
/**
 * Return TRUE if the professor is not already rated or is in the process of being rated.
 * FALSE otherwise.
 */
function isUnratedProfessor(name) {
    return !name.includes(' - ');
}
/**
 * Adds 'N/A' as the score to professor on the search page
 */
function setInvalidScore(name, node) {
    setScore(name, node);
}
/**
 * Appends the loading indicator next to professor names in the results list
 */
function setIsLoading(node) {
    node.innerHTML = node.innerHTML + ' - ' + LOADING_INDICATOR;
}
/**
 * Adds the score and changes the color of the professor on the search page
 */
function setScore(name, node, score) {
    if (score) {
        node.textContent = name + ' - ' + score.toFixed(1);
        node.style.color = getColor(score);
    }
    else {
        node.textContent = name + ' - N/A';
    }
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return subs; });
// Be sure to keep in alphabetical order by key
// Format: 'Class Search', 'Rate My Professors'
var subs = {
    'Crooke, Philip S.': 'Crooke',
    'Davis, Victoria J.': 'Davis, Vicki',
    'Hardin, Douglas P.': 'Hardin, Doug',
    'Johnsen, Arthur': 'Johnsen, Art',
    'Leguizamon J S.': 'Leguizamon, Sebastian',
    'Link, Stanley': 'Link, Stan',
    'Rizzo, Carmelo J.': 'Rizzo, M',
    'Roth, Gerald H.': 'Roth, Jerry',
    'Savelyev, Petr A.': 'Savelyev, Peter',
    'Schmidt, Douglas C.': 'Schmidt, Doug',
    'Stahl, Sandra': 'Stahl, Sandy',
    'Tairas, Robert A.': 'Tairas, Rob',
    'Van Schaack, Andrew J.': 'Van Schaack, Andy',
    'White, Christopher J.': 'White, Jules',
};


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return restricted; });
// Names that should not be rated
// Be sure to keep in alphabetical order
// Be sure to list the reason for each professor above the name
var restricted = [
    // There are two "William Robinson"s at Vanderbilt and this one is not on RateMyProfessors
    'Robinson, William F.',
];


/***/ })
/******/ ]);