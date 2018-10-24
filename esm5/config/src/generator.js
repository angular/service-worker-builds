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
 * @publicApi
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUU3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBR25DLElBQU0sdUJBQXVCLEdBQUc7SUFDOUIsS0FBSztJQUNMLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztDQUNmLENBQUM7QUFFRjs7OztHQUlHO0FBQ0g7SUFDRSxtQkFBcUIsRUFBYyxFQUFVLFFBQWdCO1FBQXhDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztJQUUzRCwyQkFBTyxHQUFiLFVBQWMsTUFBYzs7Ozs7O3dCQUNwQixrQkFBa0IsR0FBRyxFQUFFLENBQUM7d0JBQ1YscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxFQUFBOzt3QkFBdkUsV0FBVyxHQUFHLFNBQXlEO3dCQUU3RSxzQkFBTztnQ0FDTCxhQUFhLEVBQUUsQ0FBQztnQ0FDaEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO2dDQUN2QixLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsYUFBQTtnQ0FDekQsVUFBVSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7Z0NBQzFDLFNBQVMsRUFBRSxlQUFlLENBQUMsa0JBQWtCLENBQUM7Z0NBQzlDLGNBQWMsRUFBRSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUM7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O0lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQyxDQUFDO0lBQ3JGLE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGFyc2VEdXJhdGlvblRvTXN9IGZyb20gJy4vZHVyYXRpb24nO1xuaW1wb3J0IHtGaWxlc3lzdGVtfSBmcm9tICcuL2ZpbGVzeXN0ZW0nO1xuaW1wb3J0IHtnbG9iVG9SZWdleH0gZnJvbSAnLi9nbG9iJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuL2luJztcblxuY29uc3QgREVGQVVMVF9OQVZJR0FUSU9OX1VSTFMgPSBbXG4gICcvKionLCAgICAgICAgICAgLy8gSW5jbHVkZSBhbGwgVVJMcy5cbiAgJyEvKiovKi4qJywgICAgICAvLyBFeGNsdWRlIFVSTHMgdG8gZmlsZXMgKGNvbnRhaW5pbmcgYSBmaWxlIGV4dGVuc2lvbiBpbiB0aGUgbGFzdCBzZWdtZW50KS5cbiAgJyEvKiovKl9fKicsICAgICAvLyBFeGNsdWRlIFVSTHMgY29udGFpbmluZyBgX19gIGluIHRoZSBsYXN0IHNlZ21lbnQuXG4gICchLyoqLypfXyovKionLCAgLy8gRXhjbHVkZSBVUkxzIGNvbnRhaW5pbmcgYF9fYCBpbiBhbnkgb3RoZXIgc2VnbWVudC5cbl07XG5cbi8qKlxuICogQ29uc3VtZXMgc2VydmljZSB3b3JrZXIgY29uZmlndXJhdGlvbiBmaWxlcyBhbmQgcHJvY2Vzc2VzIHRoZW0gaW50byBjb250cm9sIGZpbGVzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyYXRvciB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGZzOiBGaWxlc3lzdGVtLCBwcml2YXRlIGJhc2VIcmVmOiBzdHJpbmcpIHt9XG5cbiAgYXN5bmMgcHJvY2Vzcyhjb25maWc6IENvbmZpZyk6IFByb21pc2U8T2JqZWN0PiB7XG4gICAgY29uc3QgdW5vcmRlcmVkSGFzaFRhYmxlID0ge307XG4gICAgY29uc3QgYXNzZXRHcm91cHMgPSBhd2FpdCB0aGlzLnByb2Nlc3NBc3NldEdyb3Vwcyhjb25maWcsIHVub3JkZXJlZEhhc2hUYWJsZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgY29uZmlnVmVyc2lvbjogMSxcbiAgICAgIGFwcERhdGE6IGNvbmZpZy5hcHBEYXRhLFxuICAgICAgaW5kZXg6IGpvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIGNvbmZpZy5pbmRleCksIGFzc2V0R3JvdXBzLFxuICAgICAgZGF0YUdyb3VwczogdGhpcy5wcm9jZXNzRGF0YUdyb3Vwcyhjb25maWcpLFxuICAgICAgaGFzaFRhYmxlOiB3aXRoT3JkZXJlZEtleXModW5vcmRlcmVkSGFzaFRhYmxlKSxcbiAgICAgIG5hdmlnYXRpb25VcmxzOiBwcm9jZXNzTmF2aWdhdGlvblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLm5hdmlnYXRpb25VcmxzKSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzQXNzZXRHcm91cHMoY29uZmlnOiBDb25maWcsIGhhc2hUYWJsZToge1tmaWxlOiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWR9KTpcbiAgICAgIFByb21pc2U8T2JqZWN0W10+IHtcbiAgICBjb25zdCBzZWVuTWFwID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKChjb25maWcuYXNzZXRHcm91cHMgfHwgW10pLm1hcChhc3luYyhncm91cCkgPT4ge1xuICAgICAgaWYgKGdyb3VwLnJlc291cmNlcy52ZXJzaW9uZWRGaWxlcykge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBgQXNzZXQtZ3JvdXAgJyR7Z3JvdXAubmFtZX0nIGluICduZ3N3LWNvbmZpZy5qc29uJyB1c2VzIHRoZSAndmVyc2lvbmVkRmlsZXMnIG9wdGlvbi5cXG5gICtcbiAgICAgICAgICAgICdBcyBvZiB2NiBcXCd2ZXJzaW9uZWRGaWxlc1xcJyBhbmQgXFwnZmlsZXNcXCcgb3B0aW9ucyBoYXZlIHRoZSBzYW1lIGJlaGF2aW9yLiAnICtcbiAgICAgICAgICAgICdVc2UgXFwnZmlsZXNcXCcgaW5zdGVhZC4nKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsZU1hdGNoZXIgPSBnbG9iTGlzdFRvTWF0Y2hlcihncm91cC5yZXNvdXJjZXMuZmlsZXMgfHwgW10pO1xuICAgICAgY29uc3QgdmVyc2lvbmVkTWF0Y2hlciA9IGdsb2JMaXN0VG9NYXRjaGVyKGdyb3VwLnJlc291cmNlcy52ZXJzaW9uZWRGaWxlcyB8fCBbXSk7XG5cbiAgICAgIGNvbnN0IGFsbEZpbGVzID0gYXdhaXQgdGhpcy5mcy5saXN0KCcvJyk7XG5cbiAgICAgIGNvbnN0IHBsYWluRmlsZXMgPSBhbGxGaWxlcy5maWx0ZXIoZmlsZU1hdGNoZXIpLmZpbHRlcihmaWxlID0+ICFzZWVuTWFwLmhhcyhmaWxlKSk7XG4gICAgICBwbGFpbkZpbGVzLmZvckVhY2goZmlsZSA9PiBzZWVuTWFwLmFkZChmaWxlKSk7XG5cbiAgICAgIGNvbnN0IHZlcnNpb25lZEZpbGVzID0gYWxsRmlsZXMuZmlsdGVyKHZlcnNpb25lZE1hdGNoZXIpLmZpbHRlcihmaWxlID0+ICFzZWVuTWFwLmhhcyhmaWxlKSk7XG4gICAgICB2ZXJzaW9uZWRGaWxlcy5mb3JFYWNoKGZpbGUgPT4gc2Vlbk1hcC5hZGQoZmlsZSkpO1xuXG4gICAgICAvLyBBZGQgdGhlIGhhc2hlcy5cbiAgICAgIGNvbnN0IG1hdGNoZWRGaWxlcyA9IFsuLi5wbGFpbkZpbGVzLCAuLi52ZXJzaW9uZWRGaWxlc10uc29ydCgpO1xuICAgICAgYXdhaXQgbWF0Y2hlZEZpbGVzLnJlZHVjZShhc3luYyhwcmV2aW91cywgZmlsZSkgPT4ge1xuICAgICAgICBhd2FpdCBwcmV2aW91cztcbiAgICAgICAgY29uc3QgaGFzaCA9IGF3YWl0IHRoaXMuZnMuaGFzaChmaWxlKTtcbiAgICAgICAgaGFzaFRhYmxlW2pvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIGZpbGUpXSA9IGhhc2g7XG4gICAgICB9LCBQcm9taXNlLnJlc29sdmUoKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGdyb3VwLm5hbWUsXG4gICAgICAgIGluc3RhbGxNb2RlOiBncm91cC5pbnN0YWxsTW9kZSB8fCAncHJlZmV0Y2gnLFxuICAgICAgICB1cGRhdGVNb2RlOiBncm91cC51cGRhdGVNb2RlIHx8IGdyb3VwLmluc3RhbGxNb2RlIHx8ICdwcmVmZXRjaCcsXG4gICAgICAgIHVybHM6IG1hdGNoZWRGaWxlcy5tYXAodXJsID0+IGpvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIHVybCkpLFxuICAgICAgICBwYXR0ZXJuczogKGdyb3VwLnJlc291cmNlcy51cmxzIHx8IFtdKS5tYXAodXJsID0+IHVybFRvUmVnZXgodXJsLCB0aGlzLmJhc2VIcmVmLCB0cnVlKSksXG4gICAgICB9O1xuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgcHJvY2Vzc0RhdGFHcm91cHMoY29uZmlnOiBDb25maWcpOiBPYmplY3RbXSB7XG4gICAgcmV0dXJuIChjb25maWcuZGF0YUdyb3VwcyB8fCBbXSkubWFwKGdyb3VwID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGdyb3VwLm5hbWUsXG4gICAgICAgIHBhdHRlcm5zOiBncm91cC51cmxzLm1hcCh1cmwgPT4gdXJsVG9SZWdleCh1cmwsIHRoaXMuYmFzZUhyZWYsIHRydWUpKSxcbiAgICAgICAgc3RyYXRlZ3k6IGdyb3VwLmNhY2hlQ29uZmlnLnN0cmF0ZWd5IHx8ICdwZXJmb3JtYW5jZScsXG4gICAgICAgIG1heFNpemU6IGdyb3VwLmNhY2hlQ29uZmlnLm1heFNpemUsXG4gICAgICAgIG1heEFnZTogcGFyc2VEdXJhdGlvblRvTXMoZ3JvdXAuY2FjaGVDb25maWcubWF4QWdlKSxcbiAgICAgICAgdGltZW91dE1zOiBncm91cC5jYWNoZUNvbmZpZy50aW1lb3V0ICYmIHBhcnNlRHVyYXRpb25Ub01zKGdyb3VwLmNhY2hlQ29uZmlnLnRpbWVvdXQpLFxuICAgICAgICB2ZXJzaW9uOiBncm91cC52ZXJzaW9uICE9PSB1bmRlZmluZWQgPyBncm91cC52ZXJzaW9uIDogMSxcbiAgICAgIH07XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb2Nlc3NOYXZpZ2F0aW9uVXJscyhcbiAgICBiYXNlSHJlZjogc3RyaW5nLCB1cmxzID0gREVGQVVMVF9OQVZJR0FUSU9OX1VSTFMpOiB7cG9zaXRpdmU6IGJvb2xlYW4sIHJlZ2V4OiBzdHJpbmd9W10ge1xuICByZXR1cm4gdXJscy5tYXAodXJsID0+IHtcbiAgICBjb25zdCBwb3NpdGl2ZSA9ICF1cmwuc3RhcnRzV2l0aCgnIScpO1xuICAgIHVybCA9IHBvc2l0aXZlID8gdXJsIDogdXJsLnN1YnN0cigxKTtcbiAgICByZXR1cm4ge3Bvc2l0aXZlLCByZWdleDogYF4ke3VybFRvUmVnZXgodXJsLCBiYXNlSHJlZil9JGB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2xvYkxpc3RUb01hdGNoZXIoZ2xvYnM6IHN0cmluZ1tdKTogKGZpbGU6IHN0cmluZykgPT4gYm9vbGVhbiB7XG4gIGNvbnN0IHBhdHRlcm5zID0gZ2xvYnMubWFwKHBhdHRlcm4gPT4ge1xuICAgIGlmIChwYXR0ZXJuLnN0YXJ0c1dpdGgoJyEnKSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpdmU6IGZhbHNlLFxuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCgnXicgKyBnbG9iVG9SZWdleChwYXR0ZXJuLnN1YnN0cigxKSkgKyAnJCcpLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpdmU6IHRydWUsXG4gICAgICAgIHJlZ2V4OiBuZXcgUmVnRXhwKCdeJyArIGdsb2JUb1JlZ2V4KHBhdHRlcm4pICsgJyQnKSxcbiAgICAgIH07XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIChmaWxlOiBzdHJpbmcpID0+IG1hdGNoZXMoZmlsZSwgcGF0dGVybnMpO1xufVxuXG5mdW5jdGlvbiBtYXRjaGVzKGZpbGU6IHN0cmluZywgcGF0dGVybnM6IHtwb3NpdGl2ZTogYm9vbGVhbiwgcmVnZXg6IFJlZ0V4cH1bXSk6IGJvb2xlYW4ge1xuICBjb25zdCByZXMgPSBwYXR0ZXJucy5yZWR1Y2UoKGlzTWF0Y2gsIHBhdHRlcm4pID0+IHtcbiAgICBpZiAocGF0dGVybi5wb3NpdGl2ZSkge1xuICAgICAgcmV0dXJuIGlzTWF0Y2ggfHwgcGF0dGVybi5yZWdleC50ZXN0KGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXNNYXRjaCAmJiAhcGF0dGVybi5yZWdleC50ZXN0KGZpbGUpO1xuICAgIH1cbiAgfSwgZmFsc2UpO1xuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiB1cmxUb1JlZ2V4KHVybDogc3RyaW5nLCBiYXNlSHJlZjogc3RyaW5nLCBsaXRlcmFsUXVlc3Rpb25NYXJrPzogYm9vbGVhbik6IHN0cmluZyB7XG4gIGlmICghdXJsLnN0YXJ0c1dpdGgoJy8nKSAmJiB1cmwuaW5kZXhPZignOi8vJykgPT09IC0xKSB7XG4gICAgdXJsID0gam9pblVybHMoYmFzZUhyZWYsIHVybCk7XG4gIH1cblxuICByZXR1cm4gZ2xvYlRvUmVnZXgodXJsLCBsaXRlcmFsUXVlc3Rpb25NYXJrKTtcbn1cblxuZnVuY3Rpb24gam9pblVybHMoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoYS5lbmRzV2l0aCgnLycpICYmIGIuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIGEgKyBiLnN1YnN0cigxKTtcbiAgfSBlbHNlIGlmICghYS5lbmRzV2l0aCgnLycpICYmICFiLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiBhICsgJy8nICsgYjtcbiAgfVxuICByZXR1cm4gYSArIGI7XG59XG5cbmZ1bmN0aW9uIHdpdGhPcmRlcmVkS2V5czxUIGV4dGVuZHN7W2tleTogc3RyaW5nXTogYW55fT4odW5vcmRlcmVkT2JqOiBUKTogVCB7XG4gIGNvbnN0IG9yZGVyZWRPYmogPSB7fSBhcyBUO1xuICBPYmplY3Qua2V5cyh1bm9yZGVyZWRPYmopLnNvcnQoKS5mb3JFYWNoKGtleSA9PiBvcmRlcmVkT2JqW2tleV0gPSB1bm9yZGVyZWRPYmpba2V5XSk7XG4gIHJldHVybiBvcmRlcmVkT2JqO1xufVxuIl19