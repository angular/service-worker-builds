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
import * as tslib_1 from "tslib";
import { parseDurationToMs } from './duration';
import { globToRegex } from './glob';
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * \@experimental
 */
var /**
 * Consumes service worker configuration files and processes them into control files.
 *
 * \@experimental
 */
Generator = /** @class */ (function () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var hashTable, _a;
            return tslib_1.__generator(this, function (_b) {
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
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var seenMap;
            return tslib_1.__generator(this, function (_a) {
                seenMap = new Set();
                return [2 /*return*/, Promise.all((config.assetGroups || []).map(function (group) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var fileMatcher, versionedMatcher, allFiles, versionedFiles, plainFiles, patterns;
                        return tslib_1.__generator(this, function (_a) {
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
                                    return [4 /*yield*/, versionedFiles.concat(plainFiles).reduce(function (previous, file) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            var hash;
                                            return tslib_1.__generator(this, function (_a) {
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
 * Consumes service worker configuration files and processes them into control files.
 *
 * \@experimental
 */
export { Generator };
function Generator_tsickle_Closure_declarations() {
    /** @type {?} */
    Generator.prototype.fs;
    /** @type {?} */
    Generator.prototype.baseHref;
}
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
//# sourceMappingURL=generator.js.map