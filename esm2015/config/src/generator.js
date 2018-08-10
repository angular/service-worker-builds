/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
 * \@experimental
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
    /** @type {?} */
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
    const orderedObj = /** @type {?} */ ({});
    Object.keys(unorderedObj).sort().forEach(key => orderedObj[key] = unorderedObj[key]);
    return orderedObj;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTdDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxRQUFRLENBQUM7O0FBR25DLE1BQU0sdUJBQXVCLEdBQUc7SUFDOUIsS0FBSztJQUNMLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztDQUNmLENBQUM7Ozs7OztBQU9GLE1BQU07Ozs7O0lBQ0osWUFBcUIsRUFBYyxFQUFVLFFBQWdCO1FBQXhDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO0tBQUk7Ozs7O0lBRTNELE9BQU8sQ0FBQyxNQUFjOzs7WUFDMUIsTUFBTSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7O1lBQzlCLE1BQU0sV0FBVyxHQUFHLE1BQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1lBRTlFLE9BQU87Z0JBQ0wsYUFBYSxFQUFFLENBQUM7Z0JBQ2hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztnQkFDdkIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXO2dCQUN6RCxVQUFVLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztnQkFDMUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDOUMsY0FBYyxFQUFFLHFCQUFxQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQzthQUM1RSxDQUFDOztLQUNIOzs7Ozs7SUFFYSxrQkFBa0IsQ0FB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QUVELG9CQUFvQixHQUFXLEVBQUUsUUFBZ0IsRUFBRSxtQkFBNkI7SUFDOUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUNyRCxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztLQUMvQjtJQUVELE9BQU8sV0FBVyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0NBQzlDOzs7Ozs7QUFFRCxrQkFBa0IsQ0FBUyxFQUFFLENBQVM7SUFDcEMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QjtTQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNqRCxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ2Q7Ozs7OztBQUVELHlCQUF3RCxZQUFlOztJQUNyRSxNQUFNLFVBQVUscUJBQUcsRUFBTyxFQUFDO0lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLE9BQU8sVUFBVSxDQUFDO0NBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhcnNlRHVyYXRpb25Ub01zfSBmcm9tICcuL2R1cmF0aW9uJztcbmltcG9ydCB7RmlsZXN5c3RlbX0gZnJvbSAnLi9maWxlc3lzdGVtJztcbmltcG9ydCB7Z2xvYlRvUmVnZXh9IGZyb20gJy4vZ2xvYic7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi9pbic7XG5cbmNvbnN0IERFRkFVTFRfTkFWSUdBVElPTl9VUkxTID0gW1xuICAnLyoqJywgICAgICAgICAgIC8vIEluY2x1ZGUgYWxsIFVSTHMuXG4gICchLyoqLyouKicsICAgICAgLy8gRXhjbHVkZSBVUkxzIHRvIGZpbGVzIChjb250YWluaW5nIGEgZmlsZSBleHRlbnNpb24gaW4gdGhlIGxhc3Qgc2VnbWVudCkuXG4gICchLyoqLypfXyonLCAgICAgLy8gRXhjbHVkZSBVUkxzIGNvbnRhaW5pbmcgYF9fYCBpbiB0aGUgbGFzdCBzZWdtZW50LlxuICAnIS8qKi8qX18qLyoqJywgIC8vIEV4Y2x1ZGUgVVJMcyBjb250YWluaW5nIGBfX2AgaW4gYW55IG90aGVyIHNlZ21lbnQuXG5dO1xuXG4vKipcbiAqIENvbnN1bWVzIHNlcnZpY2Ugd29ya2VyIGNvbmZpZ3VyYXRpb24gZmlsZXMgYW5kIHByb2Nlc3NlcyB0aGVtIGludG8gY29udHJvbCBmaWxlcy5cbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBjbGFzcyBHZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBmczogRmlsZXN5c3RlbSwgcHJpdmF0ZSBiYXNlSHJlZjogc3RyaW5nKSB7fVxuXG4gIGFzeW5jIHByb2Nlc3MoY29uZmlnOiBDb25maWcpOiBQcm9taXNlPE9iamVjdD4ge1xuICAgIGNvbnN0IHVub3JkZXJlZEhhc2hUYWJsZSA9IHt9O1xuICAgIGNvbnN0IGFzc2V0R3JvdXBzID0gYXdhaXQgdGhpcy5wcm9jZXNzQXNzZXRHcm91cHMoY29uZmlnLCB1bm9yZGVyZWRIYXNoVGFibGUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ1ZlcnNpb246IDEsXG4gICAgICBhcHBEYXRhOiBjb25maWcuYXBwRGF0YSxcbiAgICAgIGluZGV4OiBqb2luVXJscyh0aGlzLmJhc2VIcmVmLCBjb25maWcuaW5kZXgpLCBhc3NldEdyb3VwcyxcbiAgICAgIGRhdGFHcm91cHM6IHRoaXMucHJvY2Vzc0RhdGFHcm91cHMoY29uZmlnKSxcbiAgICAgIGhhc2hUYWJsZTogd2l0aE9yZGVyZWRLZXlzKHVub3JkZXJlZEhhc2hUYWJsZSksXG4gICAgICBuYXZpZ2F0aW9uVXJsczogcHJvY2Vzc05hdmlnYXRpb25VcmxzKHRoaXMuYmFzZUhyZWYsIGNvbmZpZy5uYXZpZ2F0aW9uVXJscyksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcHJvY2Vzc0Fzc2V0R3JvdXBzKGNvbmZpZzogQ29uZmlnLCBoYXNoVGFibGU6IHtbZmlsZTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkfSk6XG4gICAgICBQcm9taXNlPE9iamVjdFtdPiB7XG4gICAgY29uc3Qgc2Vlbk1hcCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbCgoY29uZmlnLmFzc2V0R3JvdXBzIHx8IFtdKS5tYXAoYXN5bmMoZ3JvdXApID0+IHtcbiAgICAgIGlmIChncm91cC5yZXNvdXJjZXMudmVyc2lvbmVkRmlsZXMpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYEFzc2V0LWdyb3VwICcke2dyb3VwLm5hbWV9JyBpbiAnbmdzdy1jb25maWcuanNvbicgdXNlcyB0aGUgJ3ZlcnNpb25lZEZpbGVzJyBvcHRpb24uXFxuYCArXG4gICAgICAgICAgICAnQXMgb2YgdjYgXFwndmVyc2lvbmVkRmlsZXNcXCcgYW5kIFxcJ2ZpbGVzXFwnIG9wdGlvbnMgaGF2ZSB0aGUgc2FtZSBiZWhhdmlvci4gJyArXG4gICAgICAgICAgICAnVXNlIFxcJ2ZpbGVzXFwnIGluc3RlYWQuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGVNYXRjaGVyID0gZ2xvYkxpc3RUb01hdGNoZXIoZ3JvdXAucmVzb3VyY2VzLmZpbGVzIHx8IFtdKTtcbiAgICAgIGNvbnN0IHZlcnNpb25lZE1hdGNoZXIgPSBnbG9iTGlzdFRvTWF0Y2hlcihncm91cC5yZXNvdXJjZXMudmVyc2lvbmVkRmlsZXMgfHwgW10pO1xuXG4gICAgICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IHRoaXMuZnMubGlzdCgnLycpO1xuXG4gICAgICBjb25zdCBwbGFpbkZpbGVzID0gYWxsRmlsZXMuZmlsdGVyKGZpbGVNYXRjaGVyKS5maWx0ZXIoZmlsZSA9PiAhc2Vlbk1hcC5oYXMoZmlsZSkpO1xuICAgICAgcGxhaW5GaWxlcy5mb3JFYWNoKGZpbGUgPT4gc2Vlbk1hcC5hZGQoZmlsZSkpO1xuXG4gICAgICBjb25zdCB2ZXJzaW9uZWRGaWxlcyA9IGFsbEZpbGVzLmZpbHRlcih2ZXJzaW9uZWRNYXRjaGVyKS5maWx0ZXIoZmlsZSA9PiAhc2Vlbk1hcC5oYXMoZmlsZSkpO1xuICAgICAgdmVyc2lvbmVkRmlsZXMuZm9yRWFjaChmaWxlID0+IHNlZW5NYXAuYWRkKGZpbGUpKTtcblxuICAgICAgLy8gQWRkIHRoZSBoYXNoZXMuXG4gICAgICBjb25zdCBtYXRjaGVkRmlsZXMgPSBbLi4ucGxhaW5GaWxlcywgLi4udmVyc2lvbmVkRmlsZXNdLnNvcnQoKTtcbiAgICAgIGF3YWl0IG1hdGNoZWRGaWxlcy5yZWR1Y2UoYXN5bmMocHJldmlvdXMsIGZpbGUpID0+IHtcbiAgICAgICAgYXdhaXQgcHJldmlvdXM7XG4gICAgICAgIGNvbnN0IGhhc2ggPSBhd2FpdCB0aGlzLmZzLmhhc2goZmlsZSk7XG4gICAgICAgIGhhc2hUYWJsZVtqb2luVXJscyh0aGlzLmJhc2VIcmVmLCBmaWxlKV0gPSBoYXNoO1xuICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKCkpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBncm91cC5uYW1lLFxuICAgICAgICBpbnN0YWxsTW9kZTogZ3JvdXAuaW5zdGFsbE1vZGUgfHwgJ3ByZWZldGNoJyxcbiAgICAgICAgdXBkYXRlTW9kZTogZ3JvdXAudXBkYXRlTW9kZSB8fCBncm91cC5pbnN0YWxsTW9kZSB8fCAncHJlZmV0Y2gnLFxuICAgICAgICB1cmxzOiBtYXRjaGVkRmlsZXMubWFwKHVybCA9PiBqb2luVXJscyh0aGlzLmJhc2VIcmVmLCB1cmwpKSxcbiAgICAgICAgcGF0dGVybnM6IChncm91cC5yZXNvdXJjZXMudXJscyB8fCBbXSkubWFwKHVybCA9PiB1cmxUb1JlZ2V4KHVybCwgdGhpcy5iYXNlSHJlZiwgdHJ1ZSkpLFxuICAgICAgfTtcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZzogQ29uZmlnKTogT2JqZWN0W10ge1xuICAgIHJldHVybiAoY29uZmlnLmRhdGFHcm91cHMgfHwgW10pLm1hcChncm91cCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBncm91cC5uYW1lLFxuICAgICAgICBwYXR0ZXJuczogZ3JvdXAudXJscy5tYXAodXJsID0+IHVybFRvUmVnZXgodXJsLCB0aGlzLmJhc2VIcmVmLCB0cnVlKSksXG4gICAgICAgIHN0cmF0ZWd5OiBncm91cC5jYWNoZUNvbmZpZy5zdHJhdGVneSB8fCAncGVyZm9ybWFuY2UnLFxuICAgICAgICBtYXhTaXplOiBncm91cC5jYWNoZUNvbmZpZy5tYXhTaXplLFxuICAgICAgICBtYXhBZ2U6IHBhcnNlRHVyYXRpb25Ub01zKGdyb3VwLmNhY2hlQ29uZmlnLm1heEFnZSksXG4gICAgICAgIHRpbWVvdXRNczogZ3JvdXAuY2FjaGVDb25maWcudGltZW91dCAmJiBwYXJzZUR1cmF0aW9uVG9Ncyhncm91cC5jYWNoZUNvbmZpZy50aW1lb3V0KSxcbiAgICAgICAgdmVyc2lvbjogZ3JvdXAudmVyc2lvbiAhPT0gdW5kZWZpbmVkID8gZ3JvdXAudmVyc2lvbiA6IDEsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzTmF2aWdhdGlvblVybHMoXG4gICAgYmFzZUhyZWY6IHN0cmluZywgdXJscyA9IERFRkFVTFRfTkFWSUdBVElPTl9VUkxTKToge3Bvc2l0aXZlOiBib29sZWFuLCByZWdleDogc3RyaW5nfVtdIHtcbiAgcmV0dXJuIHVybHMubWFwKHVybCA9PiB7XG4gICAgY29uc3QgcG9zaXRpdmUgPSAhdXJsLnN0YXJ0c1dpdGgoJyEnKTtcbiAgICB1cmwgPSBwb3NpdGl2ZSA/IHVybCA6IHVybC5zdWJzdHIoMSk7XG4gICAgcmV0dXJuIHtwb3NpdGl2ZSwgcmVnZXg6IGBeJHt1cmxUb1JlZ2V4KHVybCwgYmFzZUhyZWYpfSRgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdsb2JMaXN0VG9NYXRjaGVyKGdsb2JzOiBzdHJpbmdbXSk6IChmaWxlOiBzdHJpbmcpID0+IGJvb2xlYW4ge1xuICBjb25zdCBwYXR0ZXJucyA9IGdsb2JzLm1hcChwYXR0ZXJuID0+IHtcbiAgICBpZiAocGF0dGVybi5zdGFydHNXaXRoKCchJykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aXZlOiBmYWxzZSxcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAoJ14nICsgZ2xvYlRvUmVnZXgocGF0dGVybi5zdWJzdHIoMSkpICsgJyQnKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aXZlOiB0cnVlLFxuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCgnXicgKyBnbG9iVG9SZWdleChwYXR0ZXJuKSArICckJyksXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoZmlsZTogc3RyaW5nKSA9PiBtYXRjaGVzKGZpbGUsIHBhdHRlcm5zKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyhmaWxlOiBzdHJpbmcsIHBhdHRlcm5zOiB7cG9zaXRpdmU6IGJvb2xlYW4sIHJlZ2V4OiBSZWdFeHB9W10pOiBib29sZWFuIHtcbiAgY29uc3QgcmVzID0gcGF0dGVybnMucmVkdWNlKChpc01hdGNoLCBwYXR0ZXJuKSA9PiB7XG4gICAgaWYgKHBhdHRlcm4ucG9zaXRpdmUpIHtcbiAgICAgIHJldHVybiBpc01hdGNoIHx8IHBhdHRlcm4ucmVnZXgudGVzdChmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlzTWF0Y2ggJiYgIXBhdHRlcm4ucmVnZXgudGVzdChmaWxlKTtcbiAgICB9XG4gIH0sIGZhbHNlKTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gdXJsVG9SZWdleCh1cmw6IHN0cmluZywgYmFzZUhyZWY6IHN0cmluZywgbGl0ZXJhbFF1ZXN0aW9uTWFyaz86IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoIXVybC5zdGFydHNXaXRoKCcvJykgJiYgdXJsLmluZGV4T2YoJzovLycpID09PSAtMSkge1xuICAgIHVybCA9IGpvaW5VcmxzKGJhc2VIcmVmLCB1cmwpO1xuICB9XG5cbiAgcmV0dXJuIGdsb2JUb1JlZ2V4KHVybCwgbGl0ZXJhbFF1ZXN0aW9uTWFyayk7XG59XG5cbmZ1bmN0aW9uIGpvaW5VcmxzKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGEuZW5kc1dpdGgoJy8nKSAmJiBiLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiBhICsgYi5zdWJzdHIoMSk7XG4gIH0gZWxzZSBpZiAoIWEuZW5kc1dpdGgoJy8nKSAmJiAhYi5zdGFydHNXaXRoKCcvJykpIHtcbiAgICByZXR1cm4gYSArICcvJyArIGI7XG4gIH1cbiAgcmV0dXJuIGEgKyBiO1xufVxuXG5mdW5jdGlvbiB3aXRoT3JkZXJlZEtleXM8VCBleHRlbmRze1trZXk6IHN0cmluZ106IGFueX0+KHVub3JkZXJlZE9iajogVCk6IFQge1xuICBjb25zdCBvcmRlcmVkT2JqID0ge30gYXMgVDtcbiAgT2JqZWN0LmtleXModW5vcmRlcmVkT2JqKS5zb3J0KCkuZm9yRWFjaChrZXkgPT4gb3JkZXJlZE9ialtrZXldID0gdW5vcmRlcmVkT2JqW2tleV0pO1xuICByZXR1cm4gb3JkZXJlZE9iajtcbn1cbiJdfQ==