/**
 * @license Angular v21.0.0-next.3+sha-48fee39
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */

const PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
const PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
function parseDurationToMs(duration) {
    const matches = [];
    let array;
    while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
        matches.push(array[0]);
    }
    return matches
        .map((match) => {
        const res = PAIR_SPLIT.exec(match);
        if (res === null) {
            throw new Error(`Not a valid duration: ${match}`);
        }
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
    })
        .reduce((total, value) => total + value, 0);
}

const QUESTION_MARK = '[^/]';
const WILD_SINGLE = '[^/]*';
const WILD_OPEN = '(?:.+\\/)?';
const TO_ESCAPE_BASE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
const TO_ESCAPE_WILDCARD_QM = [...TO_ESCAPE_BASE, { replace: /\?/g, with: QUESTION_MARK }];
const TO_ESCAPE_LITERAL_QM = [...TO_ESCAPE_BASE, { replace: /\?/g, with: '\\?' }];
function globToRegex(glob, literalQuestionMark = false) {
    const toEscape = literalQuestionMark ? TO_ESCAPE_LITERAL_QM : TO_ESCAPE_WILDCARD_QM;
    const segments = glob.split('/').reverse();
    let regex = '';
    while (segments.length > 0) {
        const segment = segments.pop();
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            const processed = toEscape.reduce((segment, escape) => segment.replace(escape.replace, escape.with), segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}

const DEFAULT_NAVIGATION_URLS = [
    '/**', // Include all URLs.
    '!/**/*.*', // Exclude URLs to files (containing a file extension in the last segment).
    '!/**/*__*', // Exclude URLs containing `__` in the last segment.
    '!/**/*__*/**', // Exclude URLs containing `__` in any other segment.
];
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @publicApi
 */
class Generator {
    fs;
    baseHref;
    constructor(fs, baseHref) {
        this.fs = fs;
        this.baseHref = baseHref;
    }
    async process(config) {
        const unorderedHashTable = {};
        const assetGroups = await this.processAssetGroups(config, unorderedHashTable);
        return {
            configVersion: 1,
            timestamp: Date.now(),
            appData: config.appData,
            index: joinUrls(this.baseHref, config.index),
            assetGroups,
            dataGroups: this.processDataGroups(config),
            hashTable: withOrderedKeys(unorderedHashTable),
            navigationUrls: processNavigationUrls(this.baseHref, config.navigationUrls),
            navigationRequestStrategy: config.navigationRequestStrategy ?? 'performance',
            applicationMaxAge: config.applicationMaxAge
                ? parseDurationToMs(config.applicationMaxAge)
                : undefined,
        };
    }
    async processAssetGroups(config, hashTable) {
        // Retrieve all files of the build.
        const allFiles = await this.fs.list('/');
        const seenMap = new Set();
        const filesPerGroup = new Map();
        // Computed which files belong to each asset-group.
        for (const group of config.assetGroups || []) {
            if (group.resources.versionedFiles) {
                throw new Error(`Asset-group '${group.name}' in 'ngsw-config.json' uses the 'versionedFiles' option, ` +
                    "which is no longer supported. Use 'files' instead.");
            }
            const fileMatcher = globListToMatcher(group.resources.files || []);
            const matchedFiles = allFiles
                .filter(fileMatcher)
                .filter((file) => !seenMap.has(file))
                .sort();
            matchedFiles.forEach((file) => seenMap.add(file));
            filesPerGroup.set(group, matchedFiles);
        }
        // Compute hashes for all matched files and add them to the hash-table.
        const allMatchedFiles = [].concat(...Array.from(filesPerGroup.values())).sort();
        const allMatchedHashes = await processInBatches(allMatchedFiles, 500, (file) => this.fs.hash(file));
        allMatchedFiles.forEach((file, idx) => {
            hashTable[joinUrls(this.baseHref, file)] = allMatchedHashes[idx];
        });
        // Generate and return the processed asset-groups.
        return Array.from(filesPerGroup.entries()).map(([group, matchedFiles]) => ({
            name: group.name,
            installMode: group.installMode || 'prefetch',
            updateMode: group.updateMode || group.installMode || 'prefetch',
            cacheQueryOptions: buildCacheQueryOptions(group.cacheQueryOptions),
            urls: matchedFiles.map((url) => joinUrls(this.baseHref, url)),
            patterns: (group.resources.urls || []).map((url) => urlToRegex(url, this.baseHref, true)),
        }));
    }
    processDataGroups(config) {
        return (config.dataGroups || []).map((group) => {
            return {
                name: group.name,
                patterns: group.urls.map((url) => urlToRegex(url, this.baseHref, true)),
                strategy: group.cacheConfig.strategy || 'performance',
                maxSize: group.cacheConfig.maxSize,
                maxAge: parseDurationToMs(group.cacheConfig.maxAge),
                timeoutMs: group.cacheConfig.timeout && parseDurationToMs(group.cacheConfig.timeout),
                refreshAheadMs: group.cacheConfig.refreshAhead && parseDurationToMs(group.cacheConfig.refreshAhead),
                cacheOpaqueResponses: group.cacheConfig.cacheOpaqueResponses,
                cacheQueryOptions: buildCacheQueryOptions(group.cacheQueryOptions),
                version: group.version !== undefined ? group.version : 1,
            };
        });
    }
}
function processNavigationUrls(baseHref, urls = DEFAULT_NAVIGATION_URLS) {
    return urls.map((url) => {
        const positive = !url.startsWith('!');
        url = positive ? url : url.slice(1);
        return { positive, regex: `^${urlToRegex(url, baseHref)}$` };
    });
}
async function processInBatches(items, batchSize, processFn) {
    const batches = [];
    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize));
    }
    return batches.reduce(async (prev, batch) => (await prev).concat(await Promise.all(batch.map((item) => processFn(item)))), Promise.resolve([]));
}
function globListToMatcher(globs) {
    const patterns = globs.map((pattern) => {
        if (pattern.startsWith('!')) {
            return {
                positive: false,
                regex: new RegExp('^' + globToRegex(pattern.slice(1)) + '$'),
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
function matches(file, patterns) {
    return patterns.reduce((isMatch, pattern) => {
        if (pattern.positive) {
            return isMatch || pattern.regex.test(file);
        }
        else {
            return isMatch && !pattern.regex.test(file);
        }
    }, false);
}
function urlToRegex(url, baseHref, literalQuestionMark) {
    if (!url.startsWith('/') && url.indexOf('://') === -1) {
        // Prefix relative URLs with `baseHref`.
        // Strip a leading `.` from a relative `baseHref` (e.g. `./foo/`), since it would result in an
        // incorrect regex (matching a literal `.`).
        url = joinUrls(baseHref.replace(/^\.(?=\/)/, ''), url);
    }
    return globToRegex(url, literalQuestionMark);
}
function joinUrls(a, b) {
    if (a.endsWith('/') && b.startsWith('/')) {
        return a + b.slice(1);
    }
    else if (!a.endsWith('/') && !b.startsWith('/')) {
        return a + '/' + b;
    }
    return a + b;
}
function withOrderedKeys(unorderedObj) {
    const orderedObj = {};
    Object.keys(unorderedObj)
        .sort()
        .forEach((key) => (orderedObj[key] = unorderedObj[key]));
    return orderedObj;
}
function buildCacheQueryOptions(inOptions) {
    return {
        ignoreVary: true,
        ...inOptions,
    };
}

export { Generator };
//# sourceMappingURL=config.mjs.map
