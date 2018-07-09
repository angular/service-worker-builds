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
var DEFAULT_NAVIGATION_URLS = [
    '/**',
    '!/**/*.*',
    '!/**/*__*',
    '!/**/*__*/**',
];
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @experimental
 */
var /**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @experimental
 */
Generator = /** @class */ (function () {
    function Generator(fs, baseHref) {
        this.fs = fs;
        this.baseHref = baseHref;
    }
    Generator.prototype.process = function (config) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var unorderedHashTable, assetGroups;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unorderedHashTable = {};
                        return [4 /*yield*/, this.processAssetGroups(config, unorderedHashTable)];
                    case 1:
                        assetGroups = _a.sent();
                        return [2 /*return*/, {
                                configVersion: 1,
                                appData: config.appData,
                                index: joinUrls(this.baseHref, config.index), assetGroups: assetGroups,
                                dataGroups: this.processDataGroups(config),
                                hashTable: withOrderedKeys(unorderedHashTable),
                                navigationUrls: processNavigationUrls(this.baseHref, config.navigationUrls),
                            }];
                }
            });
        });
    };
    Generator.prototype.processAssetGroups = function (config, hashTable) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            var seenMap;
            return tslib_1.__generator(this, function (_a) {
                seenMap = new Set();
                return [2 /*return*/, Promise.all((config.assetGroups || []).map(function (group) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        var fileMatcher, versionedMatcher, allFiles, plainFiles, versionedFiles, matchedFiles;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (group.resources.versionedFiles) {
                                        console.warn("Asset-group '" + group.name + "' in 'ngsw-config.json' uses the 'versionedFiles' option.\n" +
                                            'As of v6 \'versionedFiles\' and \'files\' options have the same behavior. ' +
                                            'Use \'files\' instead.');
                                    }
                                    fileMatcher = globListToMatcher(group.resources.files || []);
                                    versionedMatcher = globListToMatcher(group.resources.versionedFiles || []);
                                    return [4 /*yield*/, this.fs.list('/')];
                                case 1:
                                    allFiles = _a.sent();
                                    plainFiles = allFiles.filter(fileMatcher).filter(function (file) { return !seenMap.has(file); });
                                    plainFiles.forEach(function (file) { return seenMap.add(file); });
                                    versionedFiles = allFiles.filter(versionedMatcher).filter(function (file) { return !seenMap.has(file); });
                                    versionedFiles.forEach(function (file) { return seenMap.add(file); });
                                    matchedFiles = tslib_1.__spread(plainFiles, versionedFiles).sort();
                                    return [4 /*yield*/, matchedFiles.reduce(function (previous, file) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                                    _a.sent();
                                    return [2 /*return*/, {
                                            name: group.name,
                                            installMode: group.installMode || 'prefetch',
                                            updateMode: group.updateMode || group.installMode || 'prefetch',
                                            urls: matchedFiles.map(function (url) { return joinUrls(_this.baseHref, url); }),
                                            patterns: (group.resources.urls || []).map(function (url) { return urlToRegex(url, _this.baseHref); }),
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
                patterns: group.urls.map(function (url) { return urlToRegex(url, _this.baseHref); }),
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
 * @experimental
 */
export { Generator };
export function processNavigationUrls(baseHref, urls) {
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
function urlToRegex(url, baseHref) {
    if (!url.startsWith('/') && url.indexOf('://') === -1) {
        url = joinUrls(baseHref, url);
    }
    return globToRegex(url);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFN0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUduQyxJQUFNLHVCQUF1QixHQUFHO0lBQzlCLEtBQUs7SUFDTCxVQUFVO0lBQ1YsV0FBVztJQUNYLGNBQWM7Q0FDZixDQUFDOzs7Ozs7QUFPRjs7Ozs7QUFBQTtJQUNFLG1CQUFxQixFQUFjLEVBQVUsUUFBZ0I7UUFBeEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVE7S0FBSTtJQUUzRCwyQkFBTyxHQUFiLFVBQWMsTUFBYzs7Ozs7O3dCQUNwQixrQkFBa0IsR0FBRyxFQUFFLENBQUM7d0JBQ1YscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxFQUFBOzt3QkFBdkUsV0FBVyxHQUFHLFNBQXlEO3dCQUU3RSxzQkFBTztnQ0FDTCxhQUFhLEVBQUUsQ0FBQztnQ0FDaEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dDQUN2QixLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsYUFBQTtnQ0FDekQsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7Z0NBQzFDLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUM7Z0NBQzlDLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUM7NkJBQzVFLEVBQUM7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QUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ2Q7QUFFRCx5QkFBd0QsWUFBZTtJQUNyRSxJQUFNLFVBQVUsR0FBRyxFQUFPLENBQUM7SUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7SUFDckYsTUFBTSxDQUFDLFVBQVUsQ0FBQztDQUNuQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtwYXJzZUR1cmF0aW9uVG9Nc30gZnJvbSAnLi9kdXJhdGlvbic7XG5pbXBvcnQge0ZpbGVzeXN0ZW19IGZyb20gJy4vZmlsZXN5c3RlbSc7XG5pbXBvcnQge2dsb2JUb1JlZ2V4fSBmcm9tICcuL2dsb2InO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vaW4nO1xuXG5jb25zdCBERUZBVUxUX05BVklHQVRJT05fVVJMUyA9IFtcbiAgJy8qKicsICAgICAgICAgICAvLyBJbmNsdWRlIGFsbCBVUkxzLlxuICAnIS8qKi8qLionLCAgICAgIC8vIEV4Y2x1ZGUgVVJMcyB0byBmaWxlcyAoY29udGFpbmluZyBhIGZpbGUgZXh0ZW5zaW9uIGluIHRoZSBsYXN0IHNlZ21lbnQpLlxuICAnIS8qKi8qX18qJywgICAgIC8vIEV4Y2x1ZGUgVVJMcyBjb250YWluaW5nIGBfX2AgaW4gdGhlIGxhc3Qgc2VnbWVudC5cbiAgJyEvKiovKl9fKi8qKicsICAvLyBFeGNsdWRlIFVSTHMgY29udGFpbmluZyBgX19gIGluIGFueSBvdGhlciBzZWdtZW50LlxuXTtcblxuLyoqXG4gKiBDb25zdW1lcyBzZXJ2aWNlIHdvcmtlciBjb25maWd1cmF0aW9uIGZpbGVzIGFuZCBwcm9jZXNzZXMgdGhlbSBpbnRvIGNvbnRyb2wgZmlsZXMuXG4gKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZnM6IEZpbGVzeXN0ZW0sIHByaXZhdGUgYmFzZUhyZWY6IHN0cmluZykge31cblxuICBhc3luYyBwcm9jZXNzKGNvbmZpZzogQ29uZmlnKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICBjb25zdCB1bm9yZGVyZWRIYXNoVGFibGUgPSB7fTtcbiAgICBjb25zdCBhc3NldEdyb3VwcyA9IGF3YWl0IHRoaXMucHJvY2Vzc0Fzc2V0R3JvdXBzKGNvbmZpZywgdW5vcmRlcmVkSGFzaFRhYmxlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWdWZXJzaW9uOiAxLFxuICAgICAgYXBwRGF0YTogY29uZmlnLmFwcERhdGEsXG4gICAgICBpbmRleDogam9pblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLmluZGV4KSwgYXNzZXRHcm91cHMsXG4gICAgICBkYXRhR3JvdXBzOiB0aGlzLnByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZyksXG4gICAgICBoYXNoVGFibGU6IHdpdGhPcmRlcmVkS2V5cyh1bm9yZGVyZWRIYXNoVGFibGUpLFxuICAgICAgbmF2aWdhdGlvblVybHM6IHByb2Nlc3NOYXZpZ2F0aW9uVXJscyh0aGlzLmJhc2VIcmVmLCBjb25maWcubmF2aWdhdGlvblVybHMpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHByb2Nlc3NBc3NldEdyb3Vwcyhjb25maWc6IENvbmZpZywgaGFzaFRhYmxlOiB7W2ZpbGU6IHN0cmluZ106IHN0cmluZyB8IHVuZGVmaW5lZH0pOlxuICAgICAgUHJvbWlzZTxPYmplY3RbXT4ge1xuICAgIGNvbnN0IHNlZW5NYXAgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoKGNvbmZpZy5hc3NldEdyb3VwcyB8fCBbXSkubWFwKGFzeW5jKGdyb3VwKSA9PiB7XG4gICAgICBpZiAoZ3JvdXAucmVzb3VyY2VzLnZlcnNpb25lZEZpbGVzKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBBc3NldC1ncm91cCAnJHtncm91cC5uYW1lfScgaW4gJ25nc3ctY29uZmlnLmpzb24nIHVzZXMgdGhlICd2ZXJzaW9uZWRGaWxlcycgb3B0aW9uLlxcbmAgK1xuICAgICAgICAgICAgJ0FzIG9mIHY2IFxcJ3ZlcnNpb25lZEZpbGVzXFwnIGFuZCBcXCdmaWxlc1xcJyBvcHRpb25zIGhhdmUgdGhlIHNhbWUgYmVoYXZpb3IuICcgK1xuICAgICAgICAgICAgJ1VzZSBcXCdmaWxlc1xcJyBpbnN0ZWFkLicpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlTWF0Y2hlciA9IGdsb2JMaXN0VG9NYXRjaGVyKGdyb3VwLnJlc291cmNlcy5maWxlcyB8fCBbXSk7XG4gICAgICBjb25zdCB2ZXJzaW9uZWRNYXRjaGVyID0gZ2xvYkxpc3RUb01hdGNoZXIoZ3JvdXAucmVzb3VyY2VzLnZlcnNpb25lZEZpbGVzIHx8IFtdKTtcblxuICAgICAgY29uc3QgYWxsRmlsZXMgPSBhd2FpdCB0aGlzLmZzLmxpc3QoJy8nKTtcblxuICAgICAgY29uc3QgcGxhaW5GaWxlcyA9IGFsbEZpbGVzLmZpbHRlcihmaWxlTWF0Y2hlcikuZmlsdGVyKGZpbGUgPT4gIXNlZW5NYXAuaGFzKGZpbGUpKTtcbiAgICAgIHBsYWluRmlsZXMuZm9yRWFjaChmaWxlID0+IHNlZW5NYXAuYWRkKGZpbGUpKTtcblxuICAgICAgY29uc3QgdmVyc2lvbmVkRmlsZXMgPSBhbGxGaWxlcy5maWx0ZXIodmVyc2lvbmVkTWF0Y2hlcikuZmlsdGVyKGZpbGUgPT4gIXNlZW5NYXAuaGFzKGZpbGUpKTtcbiAgICAgIHZlcnNpb25lZEZpbGVzLmZvckVhY2goZmlsZSA9PiBzZWVuTWFwLmFkZChmaWxlKSk7XG5cbiAgICAgIC8vIEFkZCB0aGUgaGFzaGVzLlxuICAgICAgY29uc3QgbWF0Y2hlZEZpbGVzID0gWy4uLnBsYWluRmlsZXMsIC4uLnZlcnNpb25lZEZpbGVzXS5zb3J0KCk7XG4gICAgICBhd2FpdCBtYXRjaGVkRmlsZXMucmVkdWNlKGFzeW5jKHByZXZpb3VzLCBmaWxlKSA9PiB7XG4gICAgICAgIGF3YWl0IHByZXZpb3VzO1xuICAgICAgICBjb25zdCBoYXNoID0gYXdhaXQgdGhpcy5mcy5oYXNoKGZpbGUpO1xuICAgICAgICBoYXNoVGFibGVbam9pblVybHModGhpcy5iYXNlSHJlZiwgZmlsZSldID0gaGFzaDtcbiAgICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZ3JvdXAubmFtZSxcbiAgICAgICAgaW5zdGFsbE1vZGU6IGdyb3VwLmluc3RhbGxNb2RlIHx8ICdwcmVmZXRjaCcsXG4gICAgICAgIHVwZGF0ZU1vZGU6IGdyb3VwLnVwZGF0ZU1vZGUgfHwgZ3JvdXAuaW5zdGFsbE1vZGUgfHwgJ3ByZWZldGNoJyxcbiAgICAgICAgdXJsczogbWF0Y2hlZEZpbGVzLm1hcCh1cmwgPT4gam9pblVybHModGhpcy5iYXNlSHJlZiwgdXJsKSksXG4gICAgICAgIHBhdHRlcm5zOiAoZ3JvdXAucmVzb3VyY2VzLnVybHMgfHwgW10pLm1hcCh1cmwgPT4gdXJsVG9SZWdleCh1cmwsIHRoaXMuYmFzZUhyZWYpKSxcbiAgICAgIH07XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzRGF0YUdyb3Vwcyhjb25maWc6IENvbmZpZyk6IE9iamVjdFtdIHtcbiAgICByZXR1cm4gKGNvbmZpZy5kYXRhR3JvdXBzIHx8IFtdKS5tYXAoZ3JvdXAgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZ3JvdXAubmFtZSxcbiAgICAgICAgcGF0dGVybnM6IGdyb3VwLnVybHMubWFwKHVybCA9PiB1cmxUb1JlZ2V4KHVybCwgdGhpcy5iYXNlSHJlZikpLFxuICAgICAgICBzdHJhdGVneTogZ3JvdXAuY2FjaGVDb25maWcuc3RyYXRlZ3kgfHwgJ3BlcmZvcm1hbmNlJyxcbiAgICAgICAgbWF4U2l6ZTogZ3JvdXAuY2FjaGVDb25maWcubWF4U2l6ZSxcbiAgICAgICAgbWF4QWdlOiBwYXJzZUR1cmF0aW9uVG9Ncyhncm91cC5jYWNoZUNvbmZpZy5tYXhBZ2UpLFxuICAgICAgICB0aW1lb3V0TXM6IGdyb3VwLmNhY2hlQ29uZmlnLnRpbWVvdXQgJiYgcGFyc2VEdXJhdGlvblRvTXMoZ3JvdXAuY2FjaGVDb25maWcudGltZW91dCksXG4gICAgICAgIHZlcnNpb246IGdyb3VwLnZlcnNpb24gIT09IHVuZGVmaW5lZCA/IGdyb3VwLnZlcnNpb24gOiAxLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc05hdmlnYXRpb25VcmxzKFxuICAgIGJhc2VIcmVmOiBzdHJpbmcsIHVybHMgPSBERUZBVUxUX05BVklHQVRJT05fVVJMUyk6IHtwb3NpdGl2ZTogYm9vbGVhbiwgcmVnZXg6IHN0cmluZ31bXSB7XG4gIHJldHVybiB1cmxzLm1hcCh1cmwgPT4ge1xuICAgIGNvbnN0IHBvc2l0aXZlID0gIXVybC5zdGFydHNXaXRoKCchJyk7XG4gICAgdXJsID0gcG9zaXRpdmUgPyB1cmwgOiB1cmwuc3Vic3RyKDEpO1xuICAgIHJldHVybiB7cG9zaXRpdmUsIHJlZ2V4OiBgXiR7dXJsVG9SZWdleCh1cmwsIGJhc2VIcmVmKX0kYH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnbG9iTGlzdFRvTWF0Y2hlcihnbG9iczogc3RyaW5nW10pOiAoZmlsZTogc3RyaW5nKSA9PiBib29sZWFuIHtcbiAgY29uc3QgcGF0dGVybnMgPSBnbG9icy5tYXAocGF0dGVybiA9PiB7XG4gICAgaWYgKHBhdHRlcm4uc3RhcnRzV2l0aCgnIScpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGl2ZTogZmFsc2UsXG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKCdeJyArIGdsb2JUb1JlZ2V4KHBhdHRlcm4uc3Vic3RyKDEpKSArICckJyksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGl2ZTogdHJ1ZSxcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAoJ14nICsgZ2xvYlRvUmVnZXgocGF0dGVybikgKyAnJCcpLFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKGZpbGU6IHN0cmluZykgPT4gbWF0Y2hlcyhmaWxlLCBwYXR0ZXJucyk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMoZmlsZTogc3RyaW5nLCBwYXR0ZXJuczoge3Bvc2l0aXZlOiBib29sZWFuLCByZWdleDogUmVnRXhwfVtdKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlcyA9IHBhdHRlcm5zLnJlZHVjZSgoaXNNYXRjaCwgcGF0dGVybikgPT4ge1xuICAgIGlmIChwYXR0ZXJuLnBvc2l0aXZlKSB7XG4gICAgICByZXR1cm4gaXNNYXRjaCB8fCBwYXR0ZXJuLnJlZ2V4LnRlc3QoZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc01hdGNoICYmICFwYXR0ZXJuLnJlZ2V4LnRlc3QoZmlsZSk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHVybFRvUmVnZXgodXJsOiBzdHJpbmcsIGJhc2VIcmVmOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoIXVybC5zdGFydHNXaXRoKCcvJykgJiYgdXJsLmluZGV4T2YoJzovLycpID09PSAtMSkge1xuICAgIHVybCA9IGpvaW5VcmxzKGJhc2VIcmVmLCB1cmwpO1xuICB9XG5cbiAgcmV0dXJuIGdsb2JUb1JlZ2V4KHVybCk7XG59XG5cbmZ1bmN0aW9uIGpvaW5VcmxzKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGEuZW5kc1dpdGgoJy8nKSAmJiBiLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiBhICsgYi5zdWJzdHIoMSk7XG4gIH0gZWxzZSBpZiAoIWEuZW5kc1dpdGgoJy8nKSAmJiAhYi5zdGFydHNXaXRoKCcvJykpIHtcbiAgICByZXR1cm4gYSArICcvJyArIGI7XG4gIH1cbiAgcmV0dXJuIGEgKyBiO1xufVxuXG5mdW5jdGlvbiB3aXRoT3JkZXJlZEtleXM8VCBleHRlbmRze1trZXk6IHN0cmluZ106IGFueX0+KHVub3JkZXJlZE9iajogVCk6IFQge1xuICBjb25zdCBvcmRlcmVkT2JqID0ge30gYXMgVDtcbiAgT2JqZWN0LmtleXModW5vcmRlcmVkT2JqKS5zb3J0KCkuZm9yRWFjaChrZXkgPT4gb3JkZXJlZE9ialtrZXldID0gdW5vcmRlcmVkT2JqW2tleV0pO1xuICByZXR1cm4gb3JkZXJlZE9iajtcbn1cbiJdfQ==