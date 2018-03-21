/**
 * @license Angular v5.2.9-50761fb
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.serviceWorker = global.ng.serviceWorker || {}, global.ng.serviceWorker.config = {})));
}(this, (function (exports) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */













function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
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
}

/**
 * @license Angular v5.2.9-50761fb
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
var PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
/**
 * @param {?} duration
 * @return {?}
 */
function parseDurationToMs(duration) {
    var /** @type {?} */ matches = [];
    var /** @type {?} */ array;
    while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
        matches.push(array[0]);
    }
    return matches
        .map(function (match) {
        var /** @type {?} */ res = PAIR_SPLIT.exec(match);
        if (res === null) {
            throw new Error("Not a valid duration: " + match);
        }
        var /** @type {?} */ factor = 0;
        switch (res[2]) {
            case 'd':
                factor = 86400000;
                break;
            case 'h':
                factor = 3600000;
                break;
            case 'm':
                factor = 60000;
                break;
            case 's':
                factor = 1000;
                break;
            case 'u':
                factor = 1;
                break;
            default:
                throw new Error("Not a valid duration unit: " + res[2]);
        }
        return parseInt(res[1]) * factor;
    })
        .reduce(function (total, value) { return total + value; }, 0);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var WILD_SINGLE = '[^\\/]+';
var WILD_OPEN = '(?:.+\\/)?';
var TO_ESCAPE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\?/g, with: '\\?' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
/**
 * @param {?} glob
 * @return {?}
 */
function globToRegex(glob) {
    var /** @type {?} */ segments = glob.split('/').reverse();
    var /** @type {?} */ regex = '';
    while (segments.length > 0) {
        var /** @type {?} */ segment = /** @type {?} */ ((segments.pop()));
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            var /** @type {?} */ processed = TO_ESCAPE.reduce(function (segment, escape) { return segment.replace(escape.replace, escape.with); }, segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * \@experimental
 */
var Generator = /** @class */ (function () {
    function Generator(fs, baseHref) {
        this.fs = fs;
        this.baseHref = baseHref;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    Generator.prototype.process = /**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var hashTable, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        hashTable = {};
                        _a = {
                            configVersion: 1,
                            index: joinUrls(this.baseHref, config.index),
                            appData: config.appData
                        };
                        return [4 /*yield*/, this.processAssetGroups(config, hashTable)];
                    case 1: return [2 /*return*/, (_a.assetGroups = _b.sent(),
                            _a.dataGroups = this.processDataGroups(config),
                            _a.hashTable = hashTable,
                            _a)];
                }
            });
        });
    };
    /**
     * @param {?} config
     * @param {?} hashTable
     * @return {?}
     */
    Generator.prototype.processAssetGroups = /**
     * @param {?} config
     * @param {?} hashTable
     * @return {?}
     */
    function (config, hashTable) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var seenMap;
            return __generator(this, function (_a) {
                seenMap = new Set();
                return [2 /*return*/, Promise.all((config.assetGroups || []).map(function (group) { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var fileMatcher, versionedMatcher, allFiles, versionedFiles, plainFiles, patterns;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    fileMatcher = globListToMatcher(group.resources.files || []);
                                    versionedMatcher = globListToMatcher(group.resources.versionedFiles || []);
                                    return [4 /*yield*/, this.fs.list('/')];
                                case 1:
                                    allFiles = (_a.sent());
                                    versionedFiles = allFiles.filter(versionedMatcher).filter(function (file) { return !seenMap.has(file); });
                                    versionedFiles.forEach(function (file) { return seenMap.add(file); });
                                    plainFiles = allFiles.filter(fileMatcher).filter(function (file) { return !seenMap.has(file); });
                                    plainFiles.forEach(function (file) { return seenMap.add(file); });
                                    // Add the hashes.
                                    return [4 /*yield*/, versionedFiles.concat(plainFiles).reduce(function (previous, file) { return __awaiter(_this, void 0, void 0, function () {
                                            var hash;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, previous];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, this.fs.hash(file)];
                                                    case 2:
                                                        hash = _a.sent();
                                                        hashTable[joinUrls(this.baseHref, file)] = hash;
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); }, Promise.resolve())];
                                case 2:
                                    // Add the hashes.
                                    // Add the hashes.
                                    _a.sent();
                                    patterns = (group.resources.urls || [])
                                        .map(function (glob) {
                                        return glob.startsWith('/') || glob.indexOf('://') !== -1 ?
                                            glob :
                                            joinUrls(_this.baseHref, glob);
                                    })
                                        .map(function (glob) { return globToRegex(glob); });
                                    return [2 /*return*/, {
                                            name: group.name,
                                            installMode: group.installMode || 'prefetch',
                                            updateMode: group.updateMode || group.installMode || 'prefetch',
                                            urls: (/** @type {?} */ ([]))
                                                .concat(plainFiles)
                                                .concat(versionedFiles)
                                                .map(function (url) { return joinUrls(_this.baseHref, url); }),
                                            patterns: patterns,
                                        }];
                            }
                        });
                    }); }))];
            });
        });
    };
    /**
     * @param {?} config
     * @return {?}
     */
    Generator.prototype.processDataGroups = /**
     * @param {?} config
     * @return {?}
     */
    function (config) {
        var _this = this;
        return (config.dataGroups || []).map(function (group) {
            var /** @type {?} */ patterns = group.urls
                .map(function (glob) {
                return glob.startsWith('/') || glob.indexOf('://') !== -1 ?
                    glob :
                    joinUrls(_this.baseHref, glob);
            })
                .map(function (glob) { return globToRegex(glob); });
            return {
                name: group.name,
                patterns: patterns,
                strategy: group.cacheConfig.strategy || 'performance',
                maxSize: group.cacheConfig.maxSize,
                maxAge: parseDurationToMs(group.cacheConfig.maxAge),
                timeoutMs: group.cacheConfig.timeout && parseDurationToMs(group.cacheConfig.timeout),
                version: group.version !== undefined ? group.version : 1,
            };
        });
    };
    return Generator;
}());
/**
 * @param {?} globs
 * @return {?}
 */
function globListToMatcher(globs) {
    var /** @type {?} */ patterns = globs.map(function (pattern) {
        if (pattern.startsWith('!')) {
            return {
                positive: false,
                regex: new RegExp('^' + globToRegex(pattern.substr(1)) + '$'),
            };
        }
        else {
            return {
                positive: true,
                regex: new RegExp('^' + globToRegex(pattern) + '$'),
            };
        }
    });
    return function (file) { return matches(file, patterns); };
}
/**
 * @param {?} file
 * @param {?} patterns
 * @return {?}
 */
function matches(file, patterns) {
    var /** @type {?} */ res = patterns.reduce(function (isMatch, pattern) {
        if (pattern.positive) {
            return isMatch || pattern.regex.test(file);
        }
        else {
            return isMatch && !pattern.regex.test(file);
        }
    }, false);
    return res;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function joinUrls(a, b) {
    if (a.endsWith('/') && b.startsWith('/')) {
        return a + b.substr(1);
    }
    else if (!a.endsWith('/') && !b.startsWith('/')) {
        return a + '/' + b;
    }
    return a + b;
}

exports.Generator = Generator;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=service-worker-config.umd.js.map
