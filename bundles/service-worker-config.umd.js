/**
 * @license Angular v9.1.12
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('@angular/service-worker/config', ['exports'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.serviceWorker = global.ng.serviceWorker || {}, global.ng.serviceWorker.config = {})));
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

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
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

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }

    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
    var PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
    function parseDurationToMs(duration) {
        var matches = [];
        var array;
        while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
            matches.push(array[0]);
        }
        return matches
            .map(function (match) {
            var res = PAIR_SPLIT.exec(match);
            if (res === null) {
                throw new Error("Not a valid duration: " + match);
            }
            var factor = 0;
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
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var QUESTION_MARK = '[^/]';
    var WILD_SINGLE = '[^/]*';
    var WILD_OPEN = '(?:.+\\/)?';
    var TO_ESCAPE_BASE = [
        { replace: /\./g, with: '\\.' },
        { replace: /\+/g, with: '\\+' },
        { replace: /\*/g, with: WILD_SINGLE },
    ];
    var TO_ESCAPE_WILDCARD_QM = __spread(TO_ESCAPE_BASE, [
        { replace: /\?/g, with: QUESTION_MARK },
    ]);
    var TO_ESCAPE_LITERAL_QM = __spread(TO_ESCAPE_BASE, [
        { replace: /\?/g, with: '\\?' },
    ]);
    function globToRegex(glob, literalQuestionMark) {
        if (literalQuestionMark === void 0) { literalQuestionMark = false; }
        var toEscape = literalQuestionMark ? TO_ESCAPE_LITERAL_QM : TO_ESCAPE_WILDCARD_QM;
        var segments = glob.split('/').reverse();
        var regex = '';
        while (segments.length > 0) {
            var segment = segments.pop();
            if (segment === '**') {
                if (segments.length > 0) {
                    regex += WILD_OPEN;
                }
                else {
                    regex += '.*';
                }
            }
            else {
                var processed = toEscape.reduce(function (segment, escape) { return segment.replace(escape.replace, escape.with); }, segment);
                regex += processed;
                if (segments.length > 0) {
                    regex += '\\/';
                }
            }
        }
        return regex;
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var DEFAULT_NAVIGATION_URLS = [
        '/**',
        '!/**/*.*',
        '!/**/*__*',
        '!/**/*__*/**',
    ];
    /**
     * Consumes service worker configuration files and processes them into control files.
     *
     * @publicApi
     */
    var Generator = /** @class */ (function () {
        function Generator(fs, baseHref) {
            this.fs = fs;
            this.baseHref = baseHref;
        }
        Generator.prototype.process = function (config) {
            return __awaiter(this, void 0, void 0, function () {
                var unorderedHashTable, assetGroups;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            unorderedHashTable = {};
                            return [4 /*yield*/, this.processAssetGroups(config, unorderedHashTable)];
                        case 1:
                            assetGroups = _a.sent();
                            return [2 /*return*/, {
                                    configVersion: 1,
                                    timestamp: Date.now(),
                                    appData: config.appData,
                                    index: joinUrls(this.baseHref, config.index),
                                    assetGroups: assetGroups,
                                    dataGroups: this.processDataGroups(config),
                                    hashTable: withOrderedKeys(unorderedHashTable),
                                    navigationUrls: processNavigationUrls(this.baseHref, config.navigationUrls),
                                }];
                    }
                });
            });
        };
        Generator.prototype.processAssetGroups = function (config, hashTable) {
            return __awaiter(this, void 0, void 0, function () {
                var seenMap;
                var _this = this;
                return __generator(this, function (_a) {
                    seenMap = new Set();
                    return [2 /*return*/, Promise.all((config.assetGroups || []).map(function (group) { return __awaiter(_this, void 0, void 0, function () {
                            var fileMatcher, allFiles, matchedFiles;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (group.resources.versionedFiles) {
                                            throw new Error("Asset-group '" + group.name + "' in 'ngsw-config.json' uses the 'versionedFiles' option, " +
                                                'which is no longer supported. Use \'files\' instead.');
                                        }
                                        fileMatcher = globListToMatcher(group.resources.files || []);
                                        return [4 /*yield*/, this.fs.list('/')];
                                    case 1:
                                        allFiles = _a.sent();
                                        matchedFiles = allFiles.filter(fileMatcher).filter(function (file) { return !seenMap.has(file); }).sort();
                                        matchedFiles.forEach(function (file) { return seenMap.add(file); });
                                        // Add the hashes.
                                        return [4 /*yield*/, matchedFiles.reduce(function (previous, file) { return __awaiter(_this, void 0, void 0, function () {
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
                                        _a.sent();
                                        return [2 /*return*/, {
                                                name: group.name,
                                                installMode: group.installMode || 'prefetch',
                                                updateMode: group.updateMode || group.installMode || 'prefetch',
                                                urls: matchedFiles.map(function (url) { return joinUrls(_this.baseHref, url); }),
                                                patterns: (group.resources.urls || []).map(function (url) { return urlToRegex(url, _this.baseHref, true); }),
                                            }];
                                }
                            });
                        }); }))];
                });
            });
        };
        Generator.prototype.processDataGroups = function (config) {
            var _this = this;
            return (config.dataGroups || []).map(function (group) {
                return {
                    name: group.name,
                    patterns: group.urls.map(function (url) { return urlToRegex(url, _this.baseHref, true); }),
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
    function processNavigationUrls(baseHref, urls) {
        if (urls === void 0) { urls = DEFAULT_NAVIGATION_URLS; }
        return urls.map(function (url) {
            var positive = !url.startsWith('!');
            url = positive ? url : url.substr(1);
            return { positive: positive, regex: "^" + urlToRegex(url, baseHref) + "$" };
        });
    }
    function globListToMatcher(globs) {
        var patterns = globs.map(function (pattern) {
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
    function matches(file, patterns) {
        var res = patterns.reduce(function (isMatch, pattern) {
            if (pattern.positive) {
                return isMatch || pattern.regex.test(file);
            }
            else {
                return isMatch && !pattern.regex.test(file);
            }
        }, false);
        return res;
    }
    function urlToRegex(url, baseHref, literalQuestionMark) {
        if (!url.startsWith('/') && url.indexOf('://') === -1) {
            url = joinUrls(baseHref, url);
        }
        return globToRegex(url, literalQuestionMark);
    }
    function joinUrls(a, b) {
        if (a.endsWith('/') && b.startsWith('/')) {
            return a + b.substr(1);
        }
        else if (!a.endsWith('/') && !b.startsWith('/')) {
            return a + '/' + b;
        }
        return a + b;
    }
    function withOrderedKeys(unorderedObj) {
        var orderedObj = {};
        Object.keys(unorderedObj).sort().forEach(function (key) { return orderedObj[key] = unorderedObj[key]; });
        return orderedObj;
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.Generator = Generator;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=service-worker-config.umd.js.map
