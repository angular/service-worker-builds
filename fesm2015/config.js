/**
 * @license Angular v9.1.12
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */

import { __awaiter } from 'tslib';

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/config/src/duration.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
const PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
/** @type {?} */
const PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
/**
 * @param {?} duration
 * @return {?}
 */
function parseDurationToMs(duration) {
    /** @type {?} */
    const matches = [];
    /** @type {?} */
    let array;
    while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
        matches.push(array[0]);
    }
    return matches
        .map((/**
     * @param {?} match
     * @return {?}
     */
    match => {
        /** @type {?} */
        const res = PAIR_SPLIT.exec(match);
        if (res === null) {
            throw new Error(`Not a valid duration: ${match}`);
        }
        /** @type {?} */
        let factor = 0;
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
    }))
        .reduce((/**
     * @param {?} total
     * @param {?} value
     * @return {?}
     */
    (total, value) => total + value), 0);
}

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/config/src/glob.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
const QUESTION_MARK = '[^/]';
/** @type {?} */
const WILD_SINGLE = '[^/]*';
/** @type {?} */
const WILD_OPEN = '(?:.+\\/)?';
/** @type {?} */
const TO_ESCAPE_BASE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
/** @type {?} */
const TO_ESCAPE_WILDCARD_QM = [
    ...TO_ESCAPE_BASE,
    { replace: /\?/g, with: QUESTION_MARK },
];
/** @type {?} */
const TO_ESCAPE_LITERAL_QM = [
    ...TO_ESCAPE_BASE,
    { replace: /\?/g, with: '\\?' },
];
/**
 * @param {?} glob
 * @param {?=} literalQuestionMark
 * @return {?}
 */
function globToRegex(glob, literalQuestionMark = false) {
    /** @type {?} */
    const toEscape = literalQuestionMark ? TO_ESCAPE_LITERAL_QM : TO_ESCAPE_WILDCARD_QM;
    /** @type {?} */
    const segments = glob.split('/').reverse();
    /** @type {?} */
    let regex = '';
    while (segments.length > 0) {
        /** @type {?} */
        const segment = (/** @type {?} */ (segments.pop()));
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            /** @type {?} */
            const processed = toEscape.reduce((/**
             * @param {?} segment
             * @param {?} escape
             * @return {?}
             */
            (segment, escape) => segment.replace(escape.replace, escape.with)), segment);
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
 * Generated from: packages/service-worker/config/src/generator.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const DEFAULT_NAVIGATION_URLS = [
    '/**',
    '!/**/*.*',
    '!/**/*__*',
    '!/**/*__*/**',
];
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * \@publicApi
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
            /** @type {?} */
            const unorderedHashTable = {};
            /** @type {?} */
            const assetGroups = yield this.processAssetGroups(config, unorderedHashTable);
            return {
                configVersion: 1,
                timestamp: Date.now(),
                appData: config.appData,
                index: joinUrls(this.baseHref, config.index),
                assetGroups,
                dataGroups: this.processDataGroups(config),
                hashTable: withOrderedKeys(unorderedHashTable),
                navigationUrls: processNavigationUrls(this.baseHref, config.navigationUrls),
            };
        });
    }
    /**
     * @private
     * @param {?} config
     * @param {?} hashTable
     * @return {?}
     */
    processAssetGroups(config, hashTable) {
        return __awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const seenMap = new Set();
            return Promise.all((config.assetGroups || []).map((/**
             * @param {?} group
             * @return {?}
             */
            (group) => __awaiter(this, void 0, void 0, function* () {
                if (((/** @type {?} */ (group.resources))).versionedFiles) {
                    throw new Error(`Asset-group '${group.name}' in 'ngsw-config.json' uses the 'versionedFiles' option, ` +
                        'which is no longer supported. Use \'files\' instead.');
                }
                /** @type {?} */
                const fileMatcher = globListToMatcher(group.resources.files || []);
                /** @type {?} */
                const allFiles = yield this.fs.list('/');
                /** @type {?} */
                const matchedFiles = allFiles.filter(fileMatcher).filter((/**
                 * @param {?} file
                 * @return {?}
                 */
                file => !seenMap.has(file))).sort();
                matchedFiles.forEach((/**
                 * @param {?} file
                 * @return {?}
                 */
                file => seenMap.add(file)));
                // Add the hashes.
                yield matchedFiles.reduce((/**
                 * @param {?} previous
                 * @param {?} file
                 * @return {?}
                 */
                (previous, file) => __awaiter(this, void 0, void 0, function* () {
                    yield previous;
                    /** @type {?} */
                    const hash = yield this.fs.hash(file);
                    hashTable[joinUrls(this.baseHref, file)] = hash;
                })), Promise.resolve());
                return {
                    name: group.name,
                    installMode: group.installMode || 'prefetch',
                    updateMode: group.updateMode || group.installMode || 'prefetch',
                    urls: matchedFiles.map((/**
                     * @param {?} url
                     * @return {?}
                     */
                    url => joinUrls(this.baseHref, url))),
                    patterns: (group.resources.urls || []).map((/**
                     * @param {?} url
                     * @return {?}
                     */
                    url => urlToRegex(url, this.baseHref, true))),
                };
            }))));
        });
    }
    /**
     * @private
     * @param {?} config
     * @return {?}
     */
    processDataGroups(config) {
        return (config.dataGroups || []).map((/**
         * @param {?} group
         * @return {?}
         */
        group => {
            return {
                name: group.name,
                patterns: group.urls.map((/**
                 * @param {?} url
                 * @return {?}
                 */
                url => urlToRegex(url, this.baseHref, true))),
                strategy: group.cacheConfig.strategy || 'performance',
                maxSize: group.cacheConfig.maxSize,
                maxAge: parseDurationToMs(group.cacheConfig.maxAge),
                timeoutMs: group.cacheConfig.timeout && parseDurationToMs(group.cacheConfig.timeout),
                version: group.version !== undefined ? group.version : 1,
            };
        }));
    }
}
if (false) {
    /** @type {?} */
    Generator.prototype.fs;
    /**
     * @type {?}
     * @private
     */
    Generator.prototype.baseHref;
}
/**
 * @param {?} baseHref
 * @param {?=} urls
 * @return {?}
 */
function processNavigationUrls(baseHref, urls = DEFAULT_NAVIGATION_URLS) {
    return urls.map((/**
     * @param {?} url
     * @return {?}
     */
    url => {
        /** @type {?} */
        const positive = !url.startsWith('!');
        url = positive ? url : url.substr(1);
        return { positive, regex: `^${urlToRegex(url, baseHref)}$` };
    }));
}
/**
 * @param {?} globs
 * @return {?}
 */
function globListToMatcher(globs) {
    /** @type {?} */
    const patterns = globs.map((/**
     * @param {?} pattern
     * @return {?}
     */
    pattern => {
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
    }));
    return (/**
     * @param {?} file
     * @return {?}
     */
    (file) => matches(file, patterns));
}
/**
 * @param {?} file
 * @param {?} patterns
 * @return {?}
 */
function matches(file, patterns) {
    /** @type {?} */
    const res = patterns.reduce((/**
     * @param {?} isMatch
     * @param {?} pattern
     * @return {?}
     */
    (isMatch, pattern) => {
        if (pattern.positive) {
            return isMatch || pattern.regex.test(file);
        }
        else {
            return isMatch && !pattern.regex.test(file);
        }
    }), false);
    return res;
}
/**
 * @param {?} url
 * @param {?} baseHref
 * @param {?=} literalQuestionMark
 * @return {?}
 */
function urlToRegex(url, baseHref, literalQuestionMark) {
    if (!url.startsWith('/') && url.indexOf('://') === -1) {
        url = joinUrls(baseHref, url);
    }
    return globToRegex(url, literalQuestionMark);
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
    /** @type {?} */
    const orderedObj = (/** @type {?} */ ({}));
    Object.keys(unorderedObj).sort().forEach((/**
     * @param {?} key
     * @return {?}
     */
    key => orderedObj[key] = unorderedObj[key]));
    return (/** @type {?} */ (orderedObj));
}

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/config/public_api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/config/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { Generator };
//# sourceMappingURL=config.js.map
