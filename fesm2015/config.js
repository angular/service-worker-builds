/**
 * @license Angular v6.0.3
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */

import { __awaiter } from 'tslib';

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
const WILD_SINGLE = '[^\\/]*';
const WILD_OPEN = '(?:.+\\/)?';
const TO_ESCAPE = [
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
        }
        else {
            const /** @type {?} */ processed = TO_ESCAPE.reduce((segment, escape) => segment.replace(escape.replace, escape.with), segment);
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
const DEFAULT_NAVIGATION_URLS = [
    '/**',
    '!/**/*.*',
    '!/**/*__*',
    '!/**/*__*/**',
];
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
            const /** @type {?} */ unorderedHashTable = {};
            const /** @type {?} */ assetGroups = yield this.processAssetGroups(config, unorderedHashTable);
            return {
                configVersion: 1,
                appData: config.appData,
                index: joinUrls(this.baseHref, config.index), assetGroups,
                dataGroups: this.processDataGroups(config),
                hashTable: withOrderedKeys(unorderedHashTable),
                navigationUrls: processNavigationUrls(this.baseHref, config.navigationUrls),
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
                if (group.resources.versionedFiles) {
                    console.warn(`Asset-group '${group.name}' in 'ngsw-config.json' uses the 'versionedFiles' option.\n` +
                        'As of v6 \'versionedFiles\' and \'files\' options have the same behavior. ' +
                        'Use \'files\' instead.');
                }
                const /** @type {?} */ fileMatcher = globListToMatcher(group.resources.files || []);
                const /** @type {?} */ versionedMatcher = globListToMatcher(group.resources.versionedFiles || []);
                const /** @type {?} */ allFiles = yield this.fs.list('/');
                const /** @type {?} */ plainFiles = allFiles.filter(fileMatcher).filter(file => !seenMap.has(file));
                plainFiles.forEach(file => seenMap.add(file));
                const /** @type {?} */ versionedFiles = allFiles.filter(versionedMatcher).filter(file => !seenMap.has(file));
                versionedFiles.forEach(file => seenMap.add(file));
                // Add the hashes.
                const /** @type {?} */ matchedFiles = [...plainFiles, ...versionedFiles].sort();
                yield matchedFiles.reduce((previous, file) => __awaiter(this, void 0, void 0, function* () {
                    yield previous;
                    const /** @type {?} */ hash = yield this.fs.hash(file);
                    hashTable[joinUrls(this.baseHref, file)] = hash;
                }), Promise.resolve());
                return {
                    name: group.name,
                    installMode: group.installMode || 'prefetch',
                    updateMode: group.updateMode || group.installMode || 'prefetch',
                    urls: matchedFiles.map(url => joinUrls(this.baseHref, url)),
                    patterns: (group.resources.urls || []).map(url => urlToRegex(url, this.baseHref)),
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
            return {
                name: group.name,
                patterns: group.urls.map(url => urlToRegex(url, this.baseHref)),
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
 * @param {?} baseHref
 * @param {?=} urls
 * @return {?}
 */
function processNavigationUrls(baseHref, urls = DEFAULT_NAVIGATION_URLS) {
    return urls.map(url => {
        const /** @type {?} */ positive = !url.startsWith('!');
        url = positive ? url : url.substr(1);
        return { positive, regex: `^${urlToRegex(url, baseHref)}$` };
    });
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
 * @param {?} url
 * @param {?} baseHref
 * @return {?}
 */
function urlToRegex(url, baseHref) {
    if (!url.startsWith('/') && url.indexOf('://') === -1) {
        url = joinUrls(baseHref, url);
    }
    return globToRegex(url);
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
 * @template T
 * @param {?} unorderedObj
 * @return {?}
 */
function withOrderedKeys(unorderedObj) {
    const /** @type {?} */ orderedObj = /** @type {?} */ ({});
    Object.keys(unorderedObj).sort().forEach(key => orderedObj[key] = unorderedObj[key]);
    return orderedObj;
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
// This file is not used to build this module. It is only used during editing
// by the TypeScript language service and during build for verification. `ngc`
// replaces this file with production index.ts when it rewrites private symbol
// names.

/**
 * Generated bundle index. Do not edit.
 */

export { Generator };
//# sourceMappingURL=config.js.map
