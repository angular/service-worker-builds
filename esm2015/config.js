/**
 * @license Angular v5.0.0-rc.0-d4d9009
 * (c) 2010-2017 Google, Inc. https://angular.io/
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
const PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
const PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
/**
 * @param {?} duration
 * @return {?}
 */
function parseDurationToMs(duration) {
    const /** @type {?} */ matches = [];
    let /** @type {?} */ array;
    while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
        matches.push(array[0]);
    }
    return matches
        .map(match => {
        const /** @type {?} */ res = PAIR_SPLIT.exec(match);
        if (res === null) {
            throw new Error(`Not a valid duration: ${match}`);
        }
        let /** @type {?} */ factor = 0;
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
                throw new Error(`Not a valid duration unit: ${res[2]}`);
        }
        return parseInt(res[1]) * factor;
    })
        .reduce((total, value) => total + value, 0);
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
const WILD_SINGLE = '[^\\/]+';
const WILD_OPEN = '(?:.+\\/)?';
/**
 * @param {?} glob
 * @return {?}
 */
function globToRegex(glob) {
    const /** @type {?} */ segments = glob.split('/').reverse();
    let /** @type {?} */ regex = '';
    while (segments.length > 0) {
        const /** @type {?} */ segment = /** @type {?} */ ((segments.pop()));
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
            const /** @type {?} */ processed = segment.replace(/\./g, '\\.').replace(/\*/g, WILD_SINGLE);
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
    const /** @type {?} */ utf8 = str;
    const /** @type {?} */ words32 = stringToWords32(utf8, Endian.Big);
    const /** @type {?} */ len = utf8.length * 8;
    const /** @type {?} */ w = new Array(80);
    let [a, b, c, d, e] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
    words32[len >> 5] |= 0x80 << (24 - len % 32);
    words32[((len + 64 >> 9) << 4) + 15] = len;
    for (let /** @type {?} */ i = 0; i < words32.length; i += 16) {
        const [h0, h1, h2, h3, h4] = [a, b, c, d, e];
        for (let /** @type {?} */ j = 0; j < 80; j++) {
            if (j < 16) {
                w[j] = words32[i + j];
            }
            else {
                w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            const [f, k] = fk(j, b, c, d);
            const /** @type {?} */ temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
            [e, d, c, b, a] = [d, c, rol32(b, 30), a, temp];
        }
        [a, b, c, d, e] = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)];
    }
    return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
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
    const /** @type {?} */ low = (a & 0xffff) + (b & 0xffff);
    const /** @type {?} */ high = (a >>> 16) + (b >>> 16) + (low >>> 16);
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
const Endian = {
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
    const /** @type {?} */ words32 = Array((str.length + 3) >>> 2);
    for (let /** @type {?} */ i = 0; i < words32.length; i++) {
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
    let /** @type {?} */ word = 0;
    if (endian === Endian.Big) {
        for (let /** @type {?} */ i = 0; i < 4; i++) {
            word += byteAt(str, index + i) << (24 - 8 * i);
        }
    }
    else {
        for (let /** @type {?} */ i = 0; i < 4; i++) {
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
    return words32.reduce((str, word) => str + word32ToByteString(word), '');
}
/**
 * @param {?} word
 * @return {?}
 */
function word32ToByteString(word) {
    let /** @type {?} */ str = '';
    for (let /** @type {?} */ i = 0; i < 4; i++) {
        str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
    }
    return str;
}
/**
 * @param {?} str
 * @return {?}
 */
function byteStringToHexString(str) {
    let /** @type {?} */ hex = '';
    for (let /** @type {?} */ i = 0; i < str.length; i++) {
        const /** @type {?} */ b = byteAt(str, i);
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
    let /** @type {?} */ sum = '';
    const /** @type {?} */ len = Math.max(x.length, y.length);
    for (let /** @type {?} */ i = 0, /** @type {?} */ carry = 0; i < len || carry; i++) {
        const /** @type {?} */ tmpSum = carry + +(x[i] || 0) + +(y[i] || 0);
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
    let /** @type {?} */ product = '';
    let /** @type {?} */ bToThePower = b;
    for (; num !== 0; num = num >>> 1) {
        if (num & 1)
            product = addBigInt(product, bToThePower);
        bToThePower = addBigInt(bToThePower, bToThePower);
    }
    return product;
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
class Generator {
    /**
     * @param {?} fs
     * @param {?} baseHref
     */
    constructor(fs, baseHref) {
        this.fs = fs;
        this.baseHref = baseHref;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    process(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const /** @type {?} */ hashTable = {};
            return {
                configVersion: 1,
                index: joinUrls(this.baseHref, config.index),
                appData: config.appData,
                assetGroups: yield this.processAssetGroups(config, hashTable),
                dataGroups: this.processDataGroups(config), hashTable,
            };
        });
    }
    /**
     * @param {?} config
     * @param {?} hashTable
     * @return {?}
     */
    processAssetGroups(config, hashTable) {
        return __awaiter(this, void 0, void 0, function* () {
            const /** @type {?} */ seenMap = new Set();
            return Promise.all((config.assetGroups || []).map((group) => __awaiter(this, void 0, void 0, function* () {
                const /** @type {?} */ fileMatcher = globListToMatcher(group.resources.files || []);
                const /** @type {?} */ versionedMatcher = globListToMatcher(group.resources.versionedFiles || []);
                const /** @type {?} */ allFiles = (yield this.fs.list('/'));
                const /** @type {?} */ versionedFiles = allFiles.filter(versionedMatcher).filter(file => !seenMap.has(file));
                versionedFiles.forEach(file => seenMap.add(file));
                const /** @type {?} */ plainFiles = allFiles.filter(fileMatcher).filter(file => !seenMap.has(file));
                plainFiles.forEach(file => seenMap.add(file));
                // Add the hashes.
                yield plainFiles.reduce((previous, file) => __awaiter(this, void 0, void 0, function* () {
                    yield previous;
                    const /** @type {?} */ hash = sha1(yield this.fs.read(file));
                    hashTable[joinUrls(this.baseHref, file)] = hash;
                }), Promise.resolve());
                // Figure out the patterns.
                const /** @type {?} */ patterns = (group.resources.urls || [])
                    .map(glob => glob.startsWith('/') || glob.indexOf('://') !== -1 ?
                    glob :
                    joinUrls(this.baseHref, glob))
                    .map(glob => globToRegex(glob));
                return {
                    name: group.name,
                    installMode: group.installMode || 'prefetch',
                    updateMode: group.updateMode || group.installMode || 'prefetch',
                    urls: (/** @type {?} */ ([]))
                        .concat(plainFiles)
                        .concat(versionedFiles)
                        .map(url => joinUrls(this.baseHref, url)),
                    patterns,
                };
            })));
        });
    }
    /**
     * @param {?} config
     * @return {?}
     */
    processDataGroups(config) {
        return (config.dataGroups || []).map(group => {
            const /** @type {?} */ patterns = group.urls
                .map(glob => glob.startsWith('/') || glob.indexOf('://') !== -1 ?
                glob :
                joinUrls(this.baseHref, glob))
                .map(glob => globToRegex(glob));
            return {
                name: group.name,
                patterns,
                strategy: group.cacheConfig.strategy || 'performance',
                maxSize: group.cacheConfig.maxSize,
                maxAge: parseDurationToMs(group.cacheConfig.maxAge),
                timeoutMs: group.cacheConfig.timeout && parseDurationToMs(group.cacheConfig.timeout),
                version: group.version !== undefined ? group.version : 1,
            };
        });
    }
}
/**
 * @param {?} globs
 * @return {?}
 */
function globListToMatcher(globs) {
    const /** @type {?} */ patterns = globs.map(pattern => {
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
    return (file) => matches(file, patterns);
}
/**
 * @param {?} file
 * @param {?} patterns
 * @return {?}
 */
function matches(file, patterns) {
    const /** @type {?} */ res = patterns.reduce((isMatch, pattern) => {
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
