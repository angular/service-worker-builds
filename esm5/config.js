/**
 * @license Angular v5.0.0-rc.0-30d5a2c
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
import { __awaiter, __generator } from 'tslib';

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
            continue;
        }
        else {
            var /** @type {?} */ processed = segment.replace(/\./g, '\\.').replace(/\*/g, WILD_SINGLE);
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
 * Compute the SHA1 of the given string
 *
 * see http://csrc.nist.gov/publications/fips/fips180-4/fips-180-4.pdf
 *
 * WARNING: this function has not been designed not tested with security in mind.
 *          DO NOT USE IT IN A SECURITY SENSITIVE CONTEXT.
 *
 * Borrowed from \@angular/compiler/src/i18n/digest.ts
 * @param {?} str
 * @return {?}
 */
function sha1(str) {
    var /** @type {?} */ utf8 = str;
    var /** @type {?} */ words32 = stringToWords32(utf8, Endian.Big);
    var /** @type {?} */ len = utf8.length * 8;
    var /** @type {?} */ w = new Array(80);
    var _a = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], a = _a[0], b = _a[1], c = _a[2], d = _a[3], e = _a[4];
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[((len + 64 >> 9) << 4) + 15] = len;
    for (var /** @type {?} */ i = 0; i < words32.length; i += 16) {
        var _b = [a, b, c, d, e], h0 = _b[0], h1 = _b[1], h2 = _b[2], h3 = _b[3], h4 = _b[4];
        for (var /** @type {?} */ j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var _c = fk(j, b, c, d), f = _c[0], k = _c[1];
            var /** @type {?} */ temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            _d = [d, c, rol32(b, 30), a, temp], e = _d[0], d = _d[1], c = _d[2], b = _d[3], a = _d[4];
        }
        _e = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)], a = _e[0], b = _e[1], c = _e[2], d = _e[3], e = _e[4];
    }
    return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
    var _d, _e;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function add32(a, b) {
    return add32to64(a, b)[1];
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function add32to64(a, b) {
    var /** @type {?} */ low = (a & 0xffff) + (b & 0xffff);
    var /** @type {?} */ high = (a >>> 16) + (b >>> 16) + (low >>> 16);
    return [high >>> 16, (high << 16) | (low & 0xffff)];
}
/**
 * @param {?} a
 * @param {?} count
 * @return {?}
 */
function rol32(a, count) {
    return (a << count) | (a >>> (32 - count));
}
/** @enum {number} */
var Endian = {
    Little: 0,
    Big: 1,
};
Endian[Endian.Little] = "Little";
Endian[Endian.Big] = "Big";
/**
 * @param {?} index
 * @param {?} b
 * @param {?} c
 * @param {?} d
 * @return {?}
 */
function fk(index, b, c, d) {
    if (index < 20) {
        return [(b & c) | (~b & d), 0x5a827999];
    }
    if (index < 40) {
        return [b ^ c ^ d, 0x6ed9eba1];
    }
    if (index < 60) {
        return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
    }
    return [b ^ c ^ d, 0xca62c1d6];
}
/**
 * @param {?} str
 * @param {?} endian
 * @return {?}
 */
function stringToWords32(str, endian) {
    var /** @type {?} */ words32 = Array((str.length + 3) >>> 2);
    for (var /** @type {?} */ i = 0; i < words32.length; i++) {
        words32[i] = wordAt(str, i * 4, endian);
    }
    return words32;
}
/**
 * @param {?} str
 * @param {?} index
 * @return {?}
 */
function byteAt(str, index) {
    return index >= str.length ? 0 : str.charCodeAt(index) & 0xff;
}
/**
 * @param {?} str
 * @param {?} index
 * @param {?} endian
 * @return {?}
 */
function wordAt(str, index, endian) {
    var /** @type {?} */ word = 0;
    if (endian === Endian.Big) {
        for (var /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (var /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << 8 * i;
        }
    }
    return word;
}
/**
 * @param {?} words32
 * @return {?}
 */
function words32ToByteString(words32) {
    return words32.reduce(function (str, word) { return str + word32ToByteString(word); }, '');
}
/**
 * @param {?} word
 * @return {?}
 */
function word32ToByteString(word) {
    var /** @type {?} */ str = '';
    for (var /** @type {?} */ i = 0; i < 4; i++) {
        str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
    }
    return str;
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToHexString(str) {
    var /** @type {?} */ hex = '';
    for (var /** @type {?} */ i = 0; i < str.length; i++) {
        var /** @type {?} */ b = byteAt(str, i);
        hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
    }
    return hex.toLowerCase();
}
/**
 * @param {?} x
 * @param {?} y
 * @return {?}
 */
function addBigInt(x, y) {
    var /** @type {?} */ sum = '';
    var /** @type {?} */ len = Math.max(x.length, y.length);
    for (var /** @type {?} */ i = 0, /** @type {?} */ carry = 0; i < len || carry; i++) {
        var /** @type {?} */ tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
        if (tmpSum >= 10) {
            carry = 1;
            sum += tmpSum - 10;
        }
        else {
            carry = 0;
            sum += tmpSum;
        }
    }
    return sum;
}
/**
 * @param {?} num
 * @param {?} b
 * @return {?}
 */
function numberTimesBigInt(num, b) {
    var /** @type {?} */ product = '';
    var /** @type {?} */ bToThePower = b;
    for (; num !== 0; num = num >>> 1) {
        if (num & 1)
            product = addBigInt(product, bToThePower);
        bToThePower = addBigInt(bToThePower, bToThePower);
    }
    return product;
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
var Generator = (function () {
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
                                    return [4 /*yield*/, plainFiles.reduce(function (previous, file) { return __awaiter(_this, void 0, void 0, function () {
                                            var hash, _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, previous];
                                                    case 1:
                                                        _b.sent();
                                                        _a = sha1;
                                                        return [4 /*yield*/, this.fs.read(file)];
                                                    case 2:
                                                        hash = _a.apply(void 0, [_b.sent()]);
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { Generator };
//# sourceMappingURL=config.js.map
