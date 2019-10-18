/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { __awaiter } from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { parseDurationToMs } from './duration';
import { globToRegex } from './glob';
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
export class Generator {
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
        return __awaiter(this, void 0, void 0, /** @this {!Generator} */ function* () {
            /** @type {?} */
            const unorderedHashTable = {};
            /** @type {?} */
            const assetGroups = yield this.processAssetGroups(config, unorderedHashTable);
            return {
                configVersion: 1,
                timestamp: Date.now(),
                appData: config.appData,
                index: joinUrls(this.baseHref, config.index), assetGroups,
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
        return __awaiter(this, void 0, void 0, /** @this {!Generator} */ function* () {
            /** @type {?} */
            const seenMap = new Set();
            return Promise.all((config.assetGroups || []).map((/**
             * @param {?} group
             * @return {?}
             */
            (group) => __awaiter(this, void 0, void 0, /** @this {!Generator} */ function* () {
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
                (previous, file) => __awaiter(this, void 0, void 0, /** @this {!Generator} */ function* () {
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
export function processNavigationUrls(baseHref, urls = DEFAULT_NAVIGATION_URLS) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTdDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7O01BRzdCLHVCQUF1QixHQUFHO0lBQzlCLEtBQUs7SUFDTCxVQUFVO0lBQ1YsV0FBVztJQUNYLGNBQWM7Q0FDZjs7Ozs7O0FBT0QsTUFBTSxPQUFPLFNBQVM7Ozs7O0lBQ3BCLFlBQXFCLEVBQWMsRUFBVSxRQUFnQjtRQUF4QyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUFHLENBQUM7Ozs7O0lBRTNELE9BQU8sQ0FBQyxNQUFjOzs7a0JBQ3BCLGtCQUFrQixHQUFHLEVBQUU7O2tCQUN2QixXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDO1lBRTdFLE9BQU87Z0JBQ0wsYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNyQixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU87Z0JBQ3ZCLEtBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVztnQkFDekQsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7Z0JBQzFDLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUM7Z0JBQzlDLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUM7YUFDNUUsQ0FBQztR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QUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QjtTQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNqRCxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsQ0FBQzs7Ozs7O0FBRUQsU0FBUyxlQUFlLENBQWdDLFlBQWU7O1VBQy9ELFVBQVUsR0FBRyxtQkFBQSxFQUFFLEVBQXVCO0lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTzs7OztJQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDO0lBQ3JGLE9BQU8sbUJBQUEsVUFBVSxFQUFLLENBQUM7QUFDekIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtwYXJzZUR1cmF0aW9uVG9Nc30gZnJvbSAnLi9kdXJhdGlvbic7XG5pbXBvcnQge0ZpbGVzeXN0ZW19IGZyb20gJy4vZmlsZXN5c3RlbSc7XG5pbXBvcnQge2dsb2JUb1JlZ2V4fSBmcm9tICcuL2dsb2InO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vaW4nO1xuXG5jb25zdCBERUZBVUxUX05BVklHQVRJT05fVVJMUyA9IFtcbiAgJy8qKicsICAgICAgICAgICAvLyBJbmNsdWRlIGFsbCBVUkxzLlxuICAnIS8qKi8qLionLCAgICAgIC8vIEV4Y2x1ZGUgVVJMcyB0byBmaWxlcyAoY29udGFpbmluZyBhIGZpbGUgZXh0ZW5zaW9uIGluIHRoZSBsYXN0IHNlZ21lbnQpLlxuICAnIS8qKi8qX18qJywgICAgIC8vIEV4Y2x1ZGUgVVJMcyBjb250YWluaW5nIGBfX2AgaW4gdGhlIGxhc3Qgc2VnbWVudC5cbiAgJyEvKiovKl9fKi8qKicsICAvLyBFeGNsdWRlIFVSTHMgY29udGFpbmluZyBgX19gIGluIGFueSBvdGhlciBzZWdtZW50LlxuXTtcblxuLyoqXG4gKiBDb25zdW1lcyBzZXJ2aWNlIHdvcmtlciBjb25maWd1cmF0aW9uIGZpbGVzIGFuZCBwcm9jZXNzZXMgdGhlbSBpbnRvIGNvbnRyb2wgZmlsZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZnM6IEZpbGVzeXN0ZW0sIHByaXZhdGUgYmFzZUhyZWY6IHN0cmluZykge31cblxuICBhc3luYyBwcm9jZXNzKGNvbmZpZzogQ29uZmlnKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICBjb25zdCB1bm9yZGVyZWRIYXNoVGFibGUgPSB7fTtcbiAgICBjb25zdCBhc3NldEdyb3VwcyA9IGF3YWl0IHRoaXMucHJvY2Vzc0Fzc2V0R3JvdXBzKGNvbmZpZywgdW5vcmRlcmVkSGFzaFRhYmxlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWdWZXJzaW9uOiAxLFxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpLFxuICAgICAgYXBwRGF0YTogY29uZmlnLmFwcERhdGEsXG4gICAgICBpbmRleDogam9pblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLmluZGV4KSwgYXNzZXRHcm91cHMsXG4gICAgICBkYXRhR3JvdXBzOiB0aGlzLnByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZyksXG4gICAgICBoYXNoVGFibGU6IHdpdGhPcmRlcmVkS2V5cyh1bm9yZGVyZWRIYXNoVGFibGUpLFxuICAgICAgbmF2aWdhdGlvblVybHM6IHByb2Nlc3NOYXZpZ2F0aW9uVXJscyh0aGlzLmJhc2VIcmVmLCBjb25maWcubmF2aWdhdGlvblVybHMpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHByb2Nlc3NBc3NldEdyb3Vwcyhjb25maWc6IENvbmZpZywgaGFzaFRhYmxlOiB7W2ZpbGU6IHN0cmluZ106IHN0cmluZyB8IHVuZGVmaW5lZH0pOlxuICAgICAgUHJvbWlzZTxPYmplY3RbXT4ge1xuICAgIGNvbnN0IHNlZW5NYXAgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoKGNvbmZpZy5hc3NldEdyb3VwcyB8fCBbXSkubWFwKGFzeW5jKGdyb3VwKSA9PiB7XG4gICAgICBjb25zdCBmaWxlTWF0Y2hlciA9IGdsb2JMaXN0VG9NYXRjaGVyKGdyb3VwLnJlc291cmNlcy5maWxlcyB8fCBbXSk7XG4gICAgICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IHRoaXMuZnMubGlzdCgnLycpO1xuXG4gICAgICBjb25zdCBtYXRjaGVkRmlsZXMgPSBhbGxGaWxlcy5maWx0ZXIoZmlsZU1hdGNoZXIpLmZpbHRlcihmaWxlID0+ICFzZWVuTWFwLmhhcyhmaWxlKSkuc29ydCgpO1xuICAgICAgbWF0Y2hlZEZpbGVzLmZvckVhY2goZmlsZSA9PiBzZWVuTWFwLmFkZChmaWxlKSk7XG5cbiAgICAgIC8vIEFkZCB0aGUgaGFzaGVzLlxuICAgICAgYXdhaXQgbWF0Y2hlZEZpbGVzLnJlZHVjZShhc3luYyhwcmV2aW91cywgZmlsZSkgPT4ge1xuICAgICAgICBhd2FpdCBwcmV2aW91cztcbiAgICAgICAgY29uc3QgaGFzaCA9IGF3YWl0IHRoaXMuZnMuaGFzaChmaWxlKTtcbiAgICAgICAgaGFzaFRhYmxlW2pvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIGZpbGUpXSA9IGhhc2g7XG4gICAgICB9LCBQcm9taXNlLnJlc29sdmUoKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGdyb3VwLm5hbWUsXG4gICAgICAgIGluc3RhbGxNb2RlOiBncm91cC5pbnN0YWxsTW9kZSB8fCAncHJlZmV0Y2gnLFxuICAgICAgICB1cGRhdGVNb2RlOiBncm91cC51cGRhdGVNb2RlIHx8IGdyb3VwLmluc3RhbGxNb2RlIHx8ICdwcmVmZXRjaCcsXG4gICAgICAgIHVybHM6IG1hdGNoZWRGaWxlcy5tYXAodXJsID0+IGpvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIHVybCkpLFxuICAgICAgICBwYXR0ZXJuczogKGdyb3VwLnJlc291cmNlcy51cmxzIHx8IFtdKS5tYXAodXJsID0+IHVybFRvUmVnZXgodXJsLCB0aGlzLmJhc2VIcmVmLCB0cnVlKSksXG4gICAgICB9O1xuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvY2Vzc0RhdGFHcm91cHMoY29uZmlnOiBDb25maWcpOiBPYmplY3RbXSB7XG4gICAgcmV0dXJuIChjb25maWcuZGF0YUdyb3VwcyB8fCBbXSkubWFwKGdyb3VwID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGdyb3VwLm5hbWUsXG4gICAgICAgIHBhdHRlcm5zOiBncm91cC51cmxzLm1hcCh1cmwgPT4gdXJsVG9SZWdleCh1cmwsIHRoaXMuYmFzZUhyZWYsIHRydWUpKSxcbiAgICAgICAgc3RyYXRlZ3k6IGdyb3VwLmNhY2hlQ29uZmlnLnN0cmF0ZWd5IHx8ICdwZXJmb3JtYW5jZScsXG4gICAgICAgIG1heFNpemU6IGdyb3VwLmNhY2hlQ29uZmlnLm1heFNpemUsXG4gICAgICAgIG1heEFnZTogcGFyc2VEdXJhdGlvblRvTXMoZ3JvdXAuY2FjaGVDb25maWcubWF4QWdlKSxcbiAgICAgICAgdGltZW91dE1zOiBncm91cC5jYWNoZUNvbmZpZy50aW1lb3V0ICYmIHBhcnNlRHVyYXRpb25Ub01zKGdyb3VwLmNhY2hlQ29uZmlnLnRpbWVvdXQpLFxuICAgICAgICB2ZXJzaW9uOiBncm91cC52ZXJzaW9uICE9PSB1bmRlZmluZWQgPyBncm91cC52ZXJzaW9uIDogMSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NOYXZpZ2F0aW9uVXJscyhcbiAgICBiYXNlSHJlZjogc3RyaW5nLCB1cmxzID0gREVGQVVMVF9OQVZJR0FUSU9OX1VSTFMpOiB7cG9zaXRpdmU6IGJvb2xlYW4sIHJlZ2V4OiBzdHJpbmd9W10ge1xuICByZXR1cm4gdXJscy5tYXAodXJsID0+IHtcbiAgICBjb25zdCBwb3NpdGl2ZSA9ICF1cmwuc3RhcnRzV2l0aCgnIScpO1xuICAgIHVybCA9IHBvc2l0aXZlID8gdXJsIDogdXJsLnN1YnN0cigxKTtcbiAgICByZXR1cm4ge3Bvc2l0aXZlLCByZWdleDogYF4ke3VybFRvUmVnZXgodXJsLCBiYXNlSHJlZil9JGB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2xvYkxpc3RUb01hdGNoZXIoZ2xvYnM6IHN0cmluZ1tdKTogKGZpbGU6IHN0cmluZykgPT4gYm9vbGVhbiB7XG4gIGNvbnN0IHBhdHRlcm5zID0gZ2xvYnMubWFwKHBhdHRlcm4gPT4ge1xuICAgIGlmIChwYXR0ZXJuLnN0YXJ0c1dpdGgoJyEnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpdmU6IGZhbHNlLFxuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCgnXicgKyBnbG9iVG9SZWdleChwYXR0ZXJuLnN1YnN0cigxKSkgKyAnJCcpLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpdmU6IHRydWUsXG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKCdeJyArIGdsb2JUb1JlZ2V4KHBhdHRlcm4pICsgJyQnKSxcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIChmaWxlOiBzdHJpbmcpID0+IG1hdGNoZXMoZmlsZSwgcGF0dGVybnMpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzKGZpbGU6IHN0cmluZywgcGF0dGVybnM6IHtwb3NpdGl2ZTogYm9vbGVhbiwgcmVnZXg6IFJlZ0V4cH1bXSk6IGJvb2xlYW4ge1xuICBjb25zdCByZXMgPSBwYXR0ZXJucy5yZWR1Y2UoKGlzTWF0Y2gsIHBhdHRlcm4pID0+IHtcbiAgICBpZiAocGF0dGVybi5wb3NpdGl2ZSkge1xuICAgICAgcmV0dXJuIGlzTWF0Y2ggfHwgcGF0dGVybi5yZWdleC50ZXN0KGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXNNYXRjaCAmJiAhcGF0dGVybi5yZWdleC50ZXN0KGZpbGUpO1xuICAgIH1cbiAgfSwgZmFsc2UpO1xuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiB1cmxUb1JlZ2V4KHVybDogc3RyaW5nLCBiYXNlSHJlZjogc3RyaW5nLCBsaXRlcmFsUXVlc3Rpb25NYXJrPzogYm9vbGVhbik6IHN0cmluZyB7XG4gIGlmICghdXJsLnN0YXJ0c1dpdGgoJy8nKSAmJiB1cmwuaW5kZXhPZignOi8vJykgPT09IC0xKSB7XG4gICAgdXJsID0gam9pblVybHMoYmFzZUhyZWYsIHVybCk7XG4gIH1cblxuICByZXR1cm4gZ2xvYlRvUmVnZXgodXJsLCBsaXRlcmFsUXVlc3Rpb25NYXJrKTtcbn1cblxuZnVuY3Rpb24gam9pblVybHMoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoYS5lbmRzV2l0aCgnLycpICYmIGIuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIGEgKyBiLnN1YnN0cigxKTtcbiAgfSBlbHNlIGlmICghYS5lbmRzV2l0aCgnLycpICYmICFiLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiBhICsgJy8nICsgYjtcbiAgfVxuICByZXR1cm4gYSArIGI7XG59XG5cbmZ1bmN0aW9uIHdpdGhPcmRlcmVkS2V5czxUIGV4dGVuZHN7W2tleTogc3RyaW5nXTogYW55fT4odW5vcmRlcmVkT2JqOiBUKTogVCB7XG4gIGNvbnN0IG9yZGVyZWRPYmogPSB7fSBhc3tba2V5OiBzdHJpbmddOiBhbnl9O1xuICBPYmplY3Qua2V5cyh1bm9yZGVyZWRPYmopLnNvcnQoKS5mb3JFYWNoKGtleSA9PiBvcmRlcmVkT2JqW2tleV0gPSB1bm9yZGVyZWRPYmpba2V5XSk7XG4gIHJldHVybiBvcmRlcmVkT2JqIGFzIFQ7XG59XG4iXX0=