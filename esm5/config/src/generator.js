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
var Generator = /** @class */ (function () {
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
            var seenMap;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                seenMap = new Set();
                return [2 /*return*/, Promise.all((config.assetGroups || []).map(function (group) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var fileMatcher, versionedMatcher, allFiles, plainFiles, versionedFiles, matchedFiles;
                        var _this = this;
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
                                            patterns: (group.resources.urls || []).map(function (url) { return urlToRegex(url, _this.baseHref, true); }),
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
                patterns: group.urls.map(function (url) { return urlToRegex(url, _this.baseHref, true); }),
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
function urlToRegex(url, baseHref, literalQuestionMark) {
    if (!url.startsWith('/') && url.indexOf('://') === -1) {
        url = joinUrls(baseHref, url);
    }
    return globToRegex(url, literalQuestionMark);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUU3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBR25DLElBQU0sdUJBQXVCLEdBQUc7SUFDOUIsS0FBSztJQUNMLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztDQUNmLENBQUM7QUFFRjs7OztHQUlHO0FBQ0g7SUFDRSxtQkFBcUIsRUFBYyxFQUFVLFFBQWdCO1FBQXhDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztJQUUzRCwyQkFBTyxHQUFiLFVBQWMsTUFBYzs7Ozs7O3dCQUNwQixrQkFBa0IsR0FBRyxFQUFFLENBQUM7d0JBQ1YscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxFQUFBOzt3QkFBdkUsV0FBVyxHQUFHLFNBQXlEO3dCQUU3RSxzQkFBTztnQ0FDTCxhQUFhLEVBQUUsQ0FBQztnQ0FDaEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dDQUN2QixLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsYUFBQTtnQ0FDekQsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7Z0NBQzFDLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUM7Z0NBQzlDLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUM7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QyxPQUFPLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUM7SUFDckYsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtwYXJzZUR1cmF0aW9uVG9Nc30gZnJvbSAnLi9kdXJhdGlvbic7XG5pbXBvcnQge0ZpbGVzeXN0ZW19IGZyb20gJy4vZmlsZXN5c3RlbSc7XG5pbXBvcnQge2dsb2JUb1JlZ2V4fSBmcm9tICcuL2dsb2InO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4vaW4nO1xuXG5jb25zdCBERUZBVUxUX05BVklHQVRJT05fVVJMUyA9IFtcbiAgJy8qKicsICAgICAgICAgICAvLyBJbmNsdWRlIGFsbCBVUkxzLlxuICAnIS8qKi8qLionLCAgICAgIC8vIEV4Y2x1ZGUgVVJMcyB0byBmaWxlcyAoY29udGFpbmluZyBhIGZpbGUgZXh0ZW5zaW9uIGluIHRoZSBsYXN0IHNlZ21lbnQpLlxuICAnIS8qKi8qX18qJywgICAgIC8vIEV4Y2x1ZGUgVVJMcyBjb250YWluaW5nIGBfX2AgaW4gdGhlIGxhc3Qgc2VnbWVudC5cbiAgJyEvKiovKl9fKi8qKicsICAvLyBFeGNsdWRlIFVSTHMgY29udGFpbmluZyBgX19gIGluIGFueSBvdGhlciBzZWdtZW50LlxuXTtcblxuLyoqXG4gKiBDb25zdW1lcyBzZXJ2aWNlIHdvcmtlciBjb25maWd1cmF0aW9uIGZpbGVzIGFuZCBwcm9jZXNzZXMgdGhlbSBpbnRvIGNvbnRyb2wgZmlsZXMuXG4gKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5leHBvcnQgY2xhc3MgR2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3IocmVhZG9ubHkgZnM6IEZpbGVzeXN0ZW0sIHByaXZhdGUgYmFzZUhyZWY6IHN0cmluZykge31cblxuICBhc3luYyBwcm9jZXNzKGNvbmZpZzogQ29uZmlnKTogUHJvbWlzZTxPYmplY3Q+IHtcbiAgICBjb25zdCB1bm9yZGVyZWRIYXNoVGFibGUgPSB7fTtcbiAgICBjb25zdCBhc3NldEdyb3VwcyA9IGF3YWl0IHRoaXMucHJvY2Vzc0Fzc2V0R3JvdXBzKGNvbmZpZywgdW5vcmRlcmVkSGFzaFRhYmxlKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWdWZXJzaW9uOiAxLFxuICAgICAgYXBwRGF0YTogY29uZmlnLmFwcERhdGEsXG4gICAgICBpbmRleDogam9pblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLmluZGV4KSwgYXNzZXRHcm91cHMsXG4gICAgICBkYXRhR3JvdXBzOiB0aGlzLnByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZyksXG4gICAgICBoYXNoVGFibGU6IHdpdGhPcmRlcmVkS2V5cyh1bm9yZGVyZWRIYXNoVGFibGUpLFxuICAgICAgbmF2aWdhdGlvblVybHM6IHByb2Nlc3NOYXZpZ2F0aW9uVXJscyh0aGlzLmJhc2VIcmVmLCBjb25maWcubmF2aWdhdGlvblVybHMpLFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHByb2Nlc3NBc3NldEdyb3Vwcyhjb25maWc6IENvbmZpZywgaGFzaFRhYmxlOiB7W2ZpbGU6IHN0cmluZ106IHN0cmluZyB8IHVuZGVmaW5lZH0pOlxuICAgICAgUHJvbWlzZTxPYmplY3RbXT4ge1xuICAgIGNvbnN0IHNlZW5NYXAgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoKGNvbmZpZy5hc3NldEdyb3VwcyB8fCBbXSkubWFwKGFzeW5jKGdyb3VwKSA9PiB7XG4gICAgICBpZiAoZ3JvdXAucmVzb3VyY2VzLnZlcnNpb25lZEZpbGVzKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIGBBc3NldC1ncm91cCAnJHtncm91cC5uYW1lfScgaW4gJ25nc3ctY29uZmlnLmpzb24nIHVzZXMgdGhlICd2ZXJzaW9uZWRGaWxlcycgb3B0aW9uLlxcbmAgK1xuICAgICAgICAgICAgJ0FzIG9mIHY2IFxcJ3ZlcnNpb25lZEZpbGVzXFwnIGFuZCBcXCdmaWxlc1xcJyBvcHRpb25zIGhhdmUgdGhlIHNhbWUgYmVoYXZpb3IuICcgK1xuICAgICAgICAgICAgJ1VzZSBcXCdmaWxlc1xcJyBpbnN0ZWFkLicpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaWxlTWF0Y2hlciA9IGdsb2JMaXN0VG9NYXRjaGVyKGdyb3VwLnJlc291cmNlcy5maWxlcyB8fCBbXSk7XG4gICAgICBjb25zdCB2ZXJzaW9uZWRNYXRjaGVyID0gZ2xvYkxpc3RUb01hdGNoZXIoZ3JvdXAucmVzb3VyY2VzLnZlcnNpb25lZEZpbGVzIHx8IFtdKTtcblxuICAgICAgY29uc3QgYWxsRmlsZXMgPSBhd2FpdCB0aGlzLmZzLmxpc3QoJy8nKTtcblxuICAgICAgY29uc3QgcGxhaW5GaWxlcyA9IGFsbEZpbGVzLmZpbHRlcihmaWxlTWF0Y2hlcikuZmlsdGVyKGZpbGUgPT4gIXNlZW5NYXAuaGFzKGZpbGUpKTtcbiAgICAgIHBsYWluRmlsZXMuZm9yRWFjaChmaWxlID0+IHNlZW5NYXAuYWRkKGZpbGUpKTtcblxuICAgICAgY29uc3QgdmVyc2lvbmVkRmlsZXMgPSBhbGxGaWxlcy5maWx0ZXIodmVyc2lvbmVkTWF0Y2hlcikuZmlsdGVyKGZpbGUgPT4gIXNlZW5NYXAuaGFzKGZpbGUpKTtcbiAgICAgIHZlcnNpb25lZEZpbGVzLmZvckVhY2goZmlsZSA9PiBzZWVuTWFwLmFkZChmaWxlKSk7XG5cbiAgICAgIC8vIEFkZCB0aGUgaGFzaGVzLlxuICAgICAgY29uc3QgbWF0Y2hlZEZpbGVzID0gWy4uLnBsYWluRmlsZXMsIC4uLnZlcnNpb25lZEZpbGVzXS5zb3J0KCk7XG4gICAgICBhd2FpdCBtYXRjaGVkRmlsZXMucmVkdWNlKGFzeW5jKHByZXZpb3VzLCBmaWxlKSA9PiB7XG4gICAgICAgIGF3YWl0IHByZXZpb3VzO1xuICAgICAgICBjb25zdCBoYXNoID0gYXdhaXQgdGhpcy5mcy5oYXNoKGZpbGUpO1xuICAgICAgICBoYXNoVGFibGVbam9pblVybHModGhpcy5iYXNlSHJlZiwgZmlsZSldID0gaGFzaDtcbiAgICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZ3JvdXAubmFtZSxcbiAgICAgICAgaW5zdGFsbE1vZGU6IGdyb3VwLmluc3RhbGxNb2RlIHx8ICdwcmVmZXRjaCcsXG4gICAgICAgIHVwZGF0ZU1vZGU6IGdyb3VwLnVwZGF0ZU1vZGUgfHwgZ3JvdXAuaW5zdGFsbE1vZGUgfHwgJ3ByZWZldGNoJyxcbiAgICAgICAgdXJsczogbWF0Y2hlZEZpbGVzLm1hcCh1cmwgPT4gam9pblVybHModGhpcy5iYXNlSHJlZiwgdXJsKSksXG4gICAgICAgIHBhdHRlcm5zOiAoZ3JvdXAucmVzb3VyY2VzLnVybHMgfHwgW10pLm1hcCh1cmwgPT4gdXJsVG9SZWdleCh1cmwsIHRoaXMuYmFzZUhyZWYsIHRydWUpKSxcbiAgICAgIH07XG4gICAgfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9jZXNzRGF0YUdyb3Vwcyhjb25maWc6IENvbmZpZyk6IE9iamVjdFtdIHtcbiAgICByZXR1cm4gKGNvbmZpZy5kYXRhR3JvdXBzIHx8IFtdKS5tYXAoZ3JvdXAgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogZ3JvdXAubmFtZSxcbiAgICAgICAgcGF0dGVybnM6IGdyb3VwLnVybHMubWFwKHVybCA9PiB1cmxUb1JlZ2V4KHVybCwgdGhpcy5iYXNlSHJlZiwgdHJ1ZSkpLFxuICAgICAgICBzdHJhdGVneTogZ3JvdXAuY2FjaGVDb25maWcuc3RyYXRlZ3kgfHwgJ3BlcmZvcm1hbmNlJyxcbiAgICAgICAgbWF4U2l6ZTogZ3JvdXAuY2FjaGVDb25maWcubWF4U2l6ZSxcbiAgICAgICAgbWF4QWdlOiBwYXJzZUR1cmF0aW9uVG9Ncyhncm91cC5jYWNoZUNvbmZpZy5tYXhBZ2UpLFxuICAgICAgICB0aW1lb3V0TXM6IGdyb3VwLmNhY2hlQ29uZmlnLnRpbWVvdXQgJiYgcGFyc2VEdXJhdGlvblRvTXMoZ3JvdXAuY2FjaGVDb25maWcudGltZW91dCksXG4gICAgICAgIHZlcnNpb246IGdyb3VwLnZlcnNpb24gIT09IHVuZGVmaW5lZCA/IGdyb3VwLnZlcnNpb24gOiAxLFxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvY2Vzc05hdmlnYXRpb25VcmxzKFxuICAgIGJhc2VIcmVmOiBzdHJpbmcsIHVybHMgPSBERUZBVUxUX05BVklHQVRJT05fVVJMUyk6IHtwb3NpdGl2ZTogYm9vbGVhbiwgcmVnZXg6IHN0cmluZ31bXSB7XG4gIHJldHVybiB1cmxzLm1hcCh1cmwgPT4ge1xuICAgIGNvbnN0IHBvc2l0aXZlID0gIXVybC5zdGFydHNXaXRoKCchJyk7XG4gICAgdXJsID0gcG9zaXRpdmUgPyB1cmwgOiB1cmwuc3Vic3RyKDEpO1xuICAgIHJldHVybiB7cG9zaXRpdmUsIHJlZ2V4OiBgXiR7dXJsVG9SZWdleCh1cmwsIGJhc2VIcmVmKX0kYH07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnbG9iTGlzdFRvTWF0Y2hlcihnbG9iczogc3RyaW5nW10pOiAoZmlsZTogc3RyaW5nKSA9PiBib29sZWFuIHtcbiAgY29uc3QgcGF0dGVybnMgPSBnbG9icy5tYXAocGF0dGVybiA9PiB7XG4gICAgaWYgKHBhdHRlcm4uc3RhcnRzV2l0aCgnIScpKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGl2ZTogZmFsc2UsXG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKCdeJyArIGdsb2JUb1JlZ2V4KHBhdHRlcm4uc3Vic3RyKDEpKSArICckJyksXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGl2ZTogdHJ1ZSxcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAoJ14nICsgZ2xvYlRvUmVnZXgocGF0dGVybikgKyAnJCcpLFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gKGZpbGU6IHN0cmluZykgPT4gbWF0Y2hlcyhmaWxlLCBwYXR0ZXJucyk7XG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMoZmlsZTogc3RyaW5nLCBwYXR0ZXJuczoge3Bvc2l0aXZlOiBib29sZWFuLCByZWdleDogUmVnRXhwfVtdKTogYm9vbGVhbiB7XG4gIGNvbnN0IHJlcyA9IHBhdHRlcm5zLnJlZHVjZSgoaXNNYXRjaCwgcGF0dGVybikgPT4ge1xuICAgIGlmIChwYXR0ZXJuLnBvc2l0aXZlKSB7XG4gICAgICByZXR1cm4gaXNNYXRjaCB8fCBwYXR0ZXJuLnJlZ2V4LnRlc3QoZmlsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc01hdGNoICYmICFwYXR0ZXJuLnJlZ2V4LnRlc3QoZmlsZSk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIHVybFRvUmVnZXgodXJsOiBzdHJpbmcsIGJhc2VIcmVmOiBzdHJpbmcsIGxpdGVyYWxRdWVzdGlvbk1hcms/OiBib29sZWFuKTogc3RyaW5nIHtcbiAgaWYgKCF1cmwuc3RhcnRzV2l0aCgnLycpICYmIHVybC5pbmRleE9mKCc6Ly8nKSA9PT0gLTEpIHtcbiAgICB1cmwgPSBqb2luVXJscyhiYXNlSHJlZiwgdXJsKTtcbiAgfVxuXG4gIHJldHVybiBnbG9iVG9SZWdleCh1cmwsIGxpdGVyYWxRdWVzdGlvbk1hcmspO1xufVxuXG5mdW5jdGlvbiBqb2luVXJscyhhOiBzdHJpbmcsIGI6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChhLmVuZHNXaXRoKCcvJykgJiYgYi5zdGFydHNXaXRoKCcvJykpIHtcbiAgICByZXR1cm4gYSArIGIuc3Vic3RyKDEpO1xuICB9IGVsc2UgaWYgKCFhLmVuZHNXaXRoKCcvJykgJiYgIWIuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIGEgKyAnLycgKyBiO1xuICB9XG4gIHJldHVybiBhICsgYjtcbn1cblxuZnVuY3Rpb24gd2l0aE9yZGVyZWRLZXlzPFQgZXh0ZW5kc3tba2V5OiBzdHJpbmddOiBhbnl9Pih1bm9yZGVyZWRPYmo6IFQpOiBUIHtcbiAgY29uc3Qgb3JkZXJlZE9iaiA9IHt9IGFzIFQ7XG4gIE9iamVjdC5rZXlzKHVub3JkZXJlZE9iaikuc29ydCgpLmZvckVhY2goa2V5ID0+IG9yZGVyZWRPYmpba2V5XSA9IHVub3JkZXJlZE9ialtrZXldKTtcbiAgcmV0dXJuIG9yZGVyZWRPYmo7XG59XG4iXX0=