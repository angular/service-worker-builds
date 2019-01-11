/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const unorderedHashTable = {};
            /** @type {?} */
            const assetGroups = yield this.processAssetGroups(config, unorderedHashTable);
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
     * @private
     * @param {?} config
     * @param {?} hashTable
     * @return {?}
     */
    processAssetGroups(config, hashTable) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const seenMap = new Set();
            return Promise.all((config.assetGroups || []).map((group) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (group.resources.versionedFiles) {
                    console.warn(`Asset-group '${group.name}' in 'ngsw-config.json' uses the 'versionedFiles' option.\n` +
                        'As of v6 \'versionedFiles\' and \'files\' options have the same behavior. ' +
                        'Use \'files\' instead.');
                }
                /** @type {?} */
                const fileMatcher = globListToMatcher(group.resources.files || []);
                /** @type {?} */
                const versionedMatcher = globListToMatcher(group.resources.versionedFiles || []);
                /** @type {?} */
                const allFiles = yield this.fs.list('/');
                /** @type {?} */
                const plainFiles = allFiles.filter(fileMatcher).filter(file => !seenMap.has(file));
                plainFiles.forEach(file => seenMap.add(file));
                /** @type {?} */
                const versionedFiles = allFiles.filter(versionedMatcher).filter(file => !seenMap.has(file));
                versionedFiles.forEach(file => seenMap.add(file));
                // Add the hashes.
                /** @type {?} */
                const matchedFiles = [...plainFiles, ...versionedFiles].sort();
                yield matchedFiles.reduce((previous, file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield previous;
                    /** @type {?} */
                    const hash = yield this.fs.hash(file);
                    hashTable[joinUrls(this.baseHref, file)] = hash;
                }), Promise.resolve());
                return {
                    name: group.name,
                    installMode: group.installMode || 'prefetch',
                    updateMode: group.updateMode || group.installMode || 'prefetch',
                    urls: matchedFiles.map(url => joinUrls(this.baseHref, url)),
                    patterns: (group.resources.urls || []).map(url => urlToRegex(url, this.baseHref, true)),
                };
            })));
        });
    }
    /**
     * @private
     * @param {?} config
     * @return {?}
     */
    processDataGroups(config) {
        return (config.dataGroups || []).map(group => {
            return {
                name: group.name,
                patterns: group.urls.map(url => urlToRegex(url, this.baseHref, true)),
                strategy: group.cacheConfig.strategy || 'performance',
                maxSize: group.cacheConfig.maxSize,
                maxAge: parseDurationToMs(group.cacheConfig.maxAge),
                timeoutMs: group.cacheConfig.timeout && parseDurationToMs(group.cacheConfig.timeout),
                version: group.version !== undefined ? group.version : 1,
            };
        });
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
    return urls.map(url => {
        /** @type {?} */
        const positive = !url.startsWith('!');
        url = positive ? url : url.substr(1);
        return { positive, regex: `^${urlToRegex(url, baseHref)}$` };
    });
}
/**
 * @param {?} globs
 * @return {?}
 */
function globListToMatcher(globs) {
    /** @type {?} */
    const patterns = globs.map(pattern => {
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
    /** @type {?} */
    const res = patterns.reduce((isMatch, pattern) => {
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
    Object.keys(unorderedObj).sort().forEach(key => orderedObj[key] = unorderedObj[key]);
    return orderedObj;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTdDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7O01BRzdCLHVCQUF1QixHQUFHO0lBQzlCLEtBQUs7SUFDTCxVQUFVO0lBQ1YsV0FBVztJQUNYLGNBQWM7Q0FDZjs7Ozs7O0FBT0QsTUFBTSxPQUFPLFNBQVM7Ozs7O0lBQ3BCLFlBQXFCLEVBQWMsRUFBVSxRQUFnQjtRQUF4QyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUFHLENBQUM7Ozs7O0lBRTNELE9BQU8sQ0FBQyxNQUFjOzs7a0JBQ3BCLGtCQUFrQixHQUFHLEVBQUU7O2tCQUN2QixXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDO1lBRTdFLE9BQU87Z0JBQ0wsYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztnQkFDdkIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXO2dCQUN6RCxVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztnQkFDMUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDOUMsY0FBYyxFQUFFLHFCQUFxQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQzthQUM1RSxDQUFDO1FBQ0osQ0FBQztLQUFBOzs7Ozs7O0lBRWEsa0JBQWtCLENBQUMs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dCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGFyc2VEdXJhdGlvblRvTXN9IGZyb20gJy4vZHVyYXRpb24nO1xuaW1wb3J0IHtGaWxlc3lzdGVtfSBmcm9tICcuL2ZpbGVzeXN0ZW0nO1xuaW1wb3J0IHtnbG9iVG9SZWdleH0gZnJvbSAnLi9nbG9iJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuL2luJztcblxuY29uc3QgREVGQVVMVF9OQVZJR0FUSU9OX1VSTFMgPSBbXG4gICcvKionLCAgICAgICAgICAgLy8gSW5jbHVkZSBhbGwgVVJMcy5cbiAgJyEvKiovKi4qJywgICAgICAvLyBFeGNsdWRlIFVSTHMgdG8gZmlsZXMgKGNvbnRhaW5pbmcgYSBmaWxlIGV4dGVuc2lvbiBpbiB0aGUgbGFzdCBzZWdtZW50KS5cbiAgJyEvKiovKl9fKicsICAgICAvLyBFeGNsdWRlIFVSTHMgY29udGFpbmluZyBgX19gIGluIHRoZSBsYXN0IHNlZ21lbnQuXG4gICchLyoqLypfXyovKionLCAgLy8gRXhjbHVkZSBVUkxzIGNvbnRhaW5pbmcgYF9fYCBpbiBhbnkgb3RoZXIgc2VnbWVudC5cbl07XG5cbi8qKlxuICogQ29uc3VtZXMgc2VydmljZSB3b3JrZXIgY29uZmlndXJhdGlvbiBmaWxlcyBhbmQgcHJvY2Vzc2VzIHRoZW0gaW50byBjb250cm9sIGZpbGVzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZzOiBGaWxlc3lzdGVtLCBwcml2YXRlIGJhc2VIcmVmOiBzdHJpbmcpIHt9XG5cbiAgYXN5bmMgcHJvY2Vzcyhjb25maWc6IENvbmZpZyk6IFByb21pc2U8T2JqZWN0PiB7XG4gICAgY29uc3QgdW5vcmRlcmVkSGFzaFRhYmxlID0ge307XG4gICAgY29uc3QgYXNzZXRHcm91cHMgPSBhd2FpdCB0aGlzLnByb2Nlc3NBc3NldEdyb3Vwcyhjb25maWcsIHVub3JkZXJlZEhhc2hUYWJsZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnVmVyc2lvbjogMSxcbiAgICAgIGFwcERhdGE6IGNvbmZpZy5hcHBEYXRhLFxuICAgICAgaW5kZXg6IGpvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIGNvbmZpZy5pbmRleCksIGFzc2V0R3JvdXBzLFxuICAgICAgZGF0YUdyb3VwczogdGhpcy5wcm9jZXNzRGF0YUdyb3Vwcyhjb25maWcpLFxuICAgICAgaGFzaFRhYmxlOiB3aXRoT3JkZXJlZEtleXModW5vcmRlcmVkSGFzaFRhYmxlKSxcbiAgICAgIG5hdmlnYXRpb25VcmxzOiBwcm9jZXNzTmF2aWdhdGlvblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLm5hdmlnYXRpb25VcmxzKSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzQXNzZXRHcm91cHMoY29uZmlnOiBDb25maWcsIGhhc2hUYWJsZToge1tmaWxlOiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWR9KTpcbiAgICAgIFByb21pc2U8T2JqZWN0W10+IHtcbiAgICBjb25zdCBzZWVuTWFwID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKChjb25maWcuYXNzZXRHcm91cHMgfHwgW10pLm1hcChhc3luYyhncm91cCkgPT4ge1xuICAgICAgaWYgKGdyb3VwLnJlc291cmNlcy52ZXJzaW9uZWRGaWxlcykge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgQXNzZXQtZ3JvdXAgJyR7Z3JvdXAubmFtZX0nIGluICduZ3N3LWNvbmZpZy5qc29uJyB1c2VzIHRoZSAndmVyc2lvbmVkRmlsZXMnIG9wdGlvbi5cXG5gICtcbiAgICAgICAgICAgICdBcyBvZiB2NiBcXCd2ZXJzaW9uZWRGaWxlc1xcJyBhbmQgXFwnZmlsZXNcXCcgb3B0aW9ucyBoYXZlIHRoZSBzYW1lIGJlaGF2aW9yLiAnICtcbiAgICAgICAgICAgICdVc2UgXFwnZmlsZXNcXCcgaW5zdGVhZC4nKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsZU1hdGNoZXIgPSBnbG9iTGlzdFRvTWF0Y2hlcihncm91cC5yZXNvdXJjZXMuZmlsZXMgfHwgW10pO1xuICAgICAgY29uc3QgdmVyc2lvbmVkTWF0Y2hlciA9IGdsb2JMaXN0VG9NYXRjaGVyKGdyb3VwLnJlc291cmNlcy52ZXJzaW9uZWRGaWxlcyB8fCBbXSk7XG5cbiAgICAgIGNvbnN0IGFsbEZpbGVzID0gYXdhaXQgdGhpcy5mcy5saXN0KCcvJyk7XG5cbiAgICAgIGNvbnN0IHBsYWluRmlsZXMgPSBhbGxGaWxlcy5maWx0ZXIoZmlsZU1hdGNoZXIpLmZpbHRlcihmaWxlID0+ICFzZWVuTWFwLmhhcyhmaWxlKSk7XG4gICAgICBwbGFpbkZpbGVzLmZvckVhY2goZmlsZSA9PiBzZWVuTWFwLmFkZChmaWxlKSk7XG5cbiAgICAgIGNvbnN0IHZlcnNpb25lZEZpbGVzID0gYWxsRmlsZXMuZmlsdGVyKHZlcnNpb25lZE1hdGNoZXIpLmZpbHRlcihmaWxlID0+ICFzZWVuTWFwLmhhcyhmaWxlKSk7XG4gICAgICB2ZXJzaW9uZWRGaWxlcy5mb3JFYWNoKGZpbGUgPT4gc2Vlbk1hcC5hZGQoZmlsZSkpO1xuXG4gICAgICAvLyBBZGQgdGhlIGhhc2hlcy5cbiAgICAgIGNvbnN0IG1hdGNoZWRGaWxlcyA9IFsuLi5wbGFpbkZpbGVzLCAuLi52ZXJzaW9uZWRGaWxlc10uc29ydCgpO1xuICAgICAgYXdhaXQgbWF0Y2hlZEZpbGVzLnJlZHVjZShhc3luYyhwcmV2aW91cywgZmlsZSkgPT4ge1xuICAgICAgICBhd2FpdCBwcmV2aW91cztcbiAgICAgICAgY29uc3QgaGFzaCA9IGF3YWl0IHRoaXMuZnMuaGFzaChmaWxlKTtcbiAgICAgICAgaGFzaFRhYmxlW2pvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIGZpbGUpXSA9IGhhc2g7XG4gICAgICB9LCBQcm9taXNlLnJlc29sdmUoKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGdyb3VwLm5hbWUsXG4gICAgICAgIGluc3RhbGxNb2RlOiBncm91cC5pbnN0YWxsTW9kZSB8fCAncHJlZmV0Y2gnLFxuICAgICAgICB1cGRhdGVNb2RlOiBncm91cC51cGRhdGVNb2RlIHx8IGdyb3VwLmluc3RhbGxNb2RlIHx8ICdwcmVmZXRjaCcsXG4gICAgICAgIHVybHM6IG1hdGNoZWRGaWxlcy5tYXAodXJsID0+IGpvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIHVybCkpLFxuICAgICAgICBwYXR0ZXJuczogKGdyb3VwLnJlc291cmNlcy51cmxzIHx8IFtdKS5tYXAodXJsID0+IHVybFRvUmVnZXgodXJsLCB0aGlzLmJhc2VIcmVmLCB0cnVlKSksXG4gICAgICB9O1xuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvY2Vzc0RhdGFHcm91cHMoY29uZmlnOiBDb25maWcpOiBPYmplY3RbXSB7XG4gICAgcmV0dXJuIChjb25maWcuZGF0YUdyb3VwcyB8fCBbXSkubWFwKGdyb3VwID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGdyb3VwLm5hbWUsXG4gICAgICAgIHBhdHRlcm5zOiBncm91cC51cmxzLm1hcCh1cmwgPT4gdXJsVG9SZWdleCh1cmwsIHRoaXMuYmFzZUhyZWYsIHRydWUpKSxcbiAgICAgICAgc3RyYXRlZ3k6IGdyb3VwLmNhY2hlQ29uZmlnLnN0cmF0ZWd5IHx8ICdwZXJmb3JtYW5jZScsXG4gICAgICAgIG1heFNpemU6IGdyb3VwLmNhY2hlQ29uZmlnLm1heFNpemUsXG4gICAgICAgIG1heEFnZTogcGFyc2VEdXJhdGlvblRvTXMoZ3JvdXAuY2FjaGVDb25maWcubWF4QWdlKSxcbiAgICAgICAgdGltZW91dE1zOiBncm91cC5jYWNoZUNvbmZpZy50aW1lb3V0ICYmIHBhcnNlRHVyYXRpb25Ub01zKGdyb3VwLmNhY2hlQ29uZmlnLnRpbWVvdXQpLFxuICAgICAgICB2ZXJzaW9uOiBncm91cC52ZXJzaW9uICE9PSB1bmRlZmluZWQgPyBncm91cC52ZXJzaW9uIDogMSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NOYXZpZ2F0aW9uVXJscyhcbiAgICBiYXNlSHJlZjogc3RyaW5nLCB1cmxzID0gREVGQVVMVF9OQVZJR0FUSU9OX1VSTFMpOiB7cG9zaXRpdmU6IGJvb2xlYW4sIHJlZ2V4OiBzdHJpbmd9W10ge1xuICByZXR1cm4gdXJscy5tYXAodXJsID0+IHtcbiAgICBjb25zdCBwb3NpdGl2ZSA9ICF1cmwuc3RhcnRzV2l0aCgnIScpO1xuICAgIHVybCA9IHBvc2l0aXZlID8gdXJsIDogdXJsLnN1YnN0cigxKTtcbiAgICByZXR1cm4ge3Bvc2l0aXZlLCByZWdleDogYF4ke3VybFRvUmVnZXgodXJsLCBiYXNlSHJlZil9JGB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2xvYkxpc3RUb01hdGNoZXIoZ2xvYnM6IHN0cmluZ1tdKTogKGZpbGU6IHN0cmluZykgPT4gYm9vbGVhbiB7XG4gIGNvbnN0IHBhdHRlcm5zID0gZ2xvYnMubWFwKHBhdHRlcm4gPT4ge1xuICAgIGlmIChwYXR0ZXJuLnN0YXJ0c1dpdGgoJyEnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpdmU6IGZhbHNlLFxuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCgnXicgKyBnbG9iVG9SZWdleChwYXR0ZXJuLnN1YnN0cigxKSkgKyAnJCcpLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpdmU6IHRydWUsXG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKCdeJyArIGdsb2JUb1JlZ2V4KHBhdHRlcm4pICsgJyQnKSxcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIChmaWxlOiBzdHJpbmcpID0+IG1hdGNoZXMoZmlsZSwgcGF0dGVybnMpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzKGZpbGU6IHN0cmluZywgcGF0dGVybnM6IHtwb3NpdGl2ZTogYm9vbGVhbiwgcmVnZXg6IFJlZ0V4cH1bXSk6IGJvb2xlYW4ge1xuICBjb25zdCByZXMgPSBwYXR0ZXJucy5yZWR1Y2UoKGlzTWF0Y2gsIHBhdHRlcm4pID0+IHtcbiAgICBpZiAocGF0dGVybi5wb3NpdGl2ZSkge1xuICAgICAgcmV0dXJuIGlzTWF0Y2ggfHwgcGF0dGVybi5yZWdleC50ZXN0KGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXNNYXRjaCAmJiAhcGF0dGVybi5yZWdleC50ZXN0KGZpbGUpO1xuICAgIH1cbiAgfSwgZmFsc2UpO1xuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiB1cmxUb1JlZ2V4KHVybDogc3RyaW5nLCBiYXNlSHJlZjogc3RyaW5nLCBsaXRlcmFsUXVlc3Rpb25NYXJrPzogYm9vbGVhbik6IHN0cmluZyB7XG4gIGlmICghdXJsLnN0YXJ0c1dpdGgoJy8nKSAmJiB1cmwuaW5kZXhPZignOi8vJykgPT09IC0xKSB7XG4gICAgdXJsID0gam9pblVybHMoYmFzZUhyZWYsIHVybCk7XG4gIH1cblxuICByZXR1cm4gZ2xvYlRvUmVnZXgodXJsLCBsaXRlcmFsUXVlc3Rpb25NYXJrKTtcbn1cblxuZnVuY3Rpb24gam9pblVybHMoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoYS5lbmRzV2l0aCgnLycpICYmIGIuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIGEgKyBiLnN1YnN0cigxKTtcbiAgfSBlbHNlIGlmICghYS5lbmRzV2l0aCgnLycpICYmICFiLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiBhICsgJy8nICsgYjtcbiAgfVxuICByZXR1cm4gYSArIGI7XG59XG5cbmZ1bmN0aW9uIHdpdGhPcmRlcmVkS2V5czxUIGV4dGVuZHN7W2tleTogc3RyaW5nXTogYW55fT4odW5vcmRlcmVkT2JqOiBUKTogVCB7XG4gIGNvbnN0IG9yZGVyZWRPYmogPSB7fSBhcyBUO1xuICBPYmplY3Qua2V5cyh1bm9yZGVyZWRPYmopLnNvcnQoKS5mb3JFYWNoKGtleSA9PiBvcmRlcmVkT2JqW2tleV0gPSB1bm9yZGVyZWRPYmpba2V5XSk7XG4gIHJldHVybiBvcmRlcmVkT2JqO1xufVxuIl19