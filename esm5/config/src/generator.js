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
                                timestamp: Date.now(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUU3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBR25DLElBQU0sdUJBQXVCLEdBQUc7SUFDOUIsS0FBSztJQUNMLFVBQVU7SUFDVixXQUFXO0lBQ1gsY0FBYztDQUNmLENBQUM7QUFFRjs7OztHQUlHO0FBQ0g7SUFDRSxtQkFBcUIsRUFBYyxFQUFVLFFBQWdCO1FBQXhDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztJQUUzRCwyQkFBTyxHQUFiLFVBQWMsTUFBYzs7Ozs7O3dCQUNwQixrQkFBa0IsR0FBRyxFQUFFLENBQUM7d0JBQ1YscUJBQU0sSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxFQUFBOzt3QkFBdkUsV0FBVyxHQUFHLFNBQXlEO3dCQUU3RSxzQkFBTztnQ0FDTCxhQUFhLEVBQUUsQ0FBQztnQ0FDaEIsU0FBUyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0NBQ3JCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTztnQ0FDdkIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxXQUFXLGFBQUE7Z0NBQ3pELFVBQVUsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDO2dDQUMxQyxTQUFTLEVBQUUsZUFBZSxDQUFDLGtCQUFrQixDQUFDO2dDQUM5QyxjQUFjLEVBQUUscUJBQXFCLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsY0FBYyxDQUFDOzZCQUM1RSxFQUFDOzs7O0tBQ0g7SUFFYSxzQ0FBa0IsR0FBaEMsVUFBaUMsTUFBYyxFQUFFLFNBQStDOzs7OztnQkFFeEYsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFVLENBQUM7Z0JBQ2xDLHNCQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFNLEtBQUs7Ozs7OztvQ0FDM0QsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRTt3Q0FDbEMsT0FBTyxDQUFDLElBQUksQ0FDUixrQkFBZ0IsS0FBSyxDQUFDLElBQUksZ0VBQTZEOzRDQUN2Riw0RUFBNEU7NENBQzVFLHdCQUF3QixDQUFDLENBQUM7cUNBQy9CO29DQUVLLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztvQ0FDN0QsZ0JBQWdCLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLElBQUksRUFBRSxDQUFDLENBQUM7b0NBRWhFLHFCQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFBOztvQ0FBbEMsUUFBUSxHQUFHLFNBQXVCO29DQUVsQyxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQztvQ0FDbkYsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQztvQ0FFeEMsY0FBYyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQWxCLENBQWtCLENBQUMsQ0FBQztvQ0FDNUYsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQztvQ0FHNUMsWUFBWSxHQUFHLGlCQUFJLFVBQVUsRUFBSyxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUM7b0NBQy9ELHFCQUFNLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBTSxRQUFRLEVBQUUsSUFBSTs7Ozs0REFDNUMscUJBQU0sUUFBUSxFQUFBOzt3REFBZCxTQUFjLENBQUM7d0RBQ0YscUJBQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUE7O3dEQUEvQixJQUFJLEdBQUcsU0FBd0I7d0RBQ3JDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzs7Ozs2Q0FDakQsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBQTs7b0NBSnJCLFNBSXFCLENBQUM7b0NBRXRCLHNCQUFPOzRDQUNMLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTs0Q0FDaEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLElBQUksVUFBVTs0Q0FDNUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxVQUFVOzRDQUMvRCxJQUFJLEVBQUUsWUFBWSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLFFBQVEsQ0FBQyxLQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUE1QixDQUE0QixDQUFDOzRDQUMzRCxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxVQUFVLENBQUMsR0FBRyxFQUFFLEtBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQXBDLENBQW9DLENBQUM7eUNBQ3hGLEVBQUM7Ozt5QkFDSCxDQUFDLENBQUMsRUFBQzs7O0tBQ0w7SUFFTyxxQ0FBaUIsR0FBekIsVUFBMEIsTUFBYztRQUF4QyxpQkFZQztRQVhDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7WUFDeEMsT0FBTztnQkFDTCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLFFBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLFVBQVUsQ0FBQyxHQUFHLEVBQUUsS0FBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsRUFBcEMsQ0FBb0MsQ0FBQztnQkFDckUsUUFBUSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxJQUFJLGFBQWE7Z0JBQ3JELE9BQU8sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU87Z0JBQ2xDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztnQkFDbkQsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxJQUFJLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDO2dCQUNwRixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekQsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXZFRCxJQXVFQzs7QUFFRCxNQUFNLFVBQVUscUJBQXFCLENBQ2pDLFFBQWdCLEVBQUUsSUFBOEI7SUFBOUIscUJBQUEsRUFBQSw4QkFBOEI7SUFDbEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsR0FBRztRQUNqQixJQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sRUFBQyxRQUFRLFVBQUEsRUFBRSxLQUFLLEVBQUUsTUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFHLEVBQUMsQ0FBQztJQUM3RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLGlCQUFpQixDQUFDLEtBQWU7SUFDeEMsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE9BQU87UUFDaEMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzNCLE9BQU87Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsS0FBSyxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUM5RCxDQUFDO1NBQ0g7YUFBTTtZQUNMLE9BQU87Z0JBQ0wsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsS0FBSyxFQUFFLElBQUksTUFBTSxDQUFDLEdBQUcsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ3BELENBQUM7U0FDSDtJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxVQUFDLElBQVksSUFBSyxPQUFBLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLEVBQXZCLENBQXVCLENBQUM7QUFDbkQsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLElBQVksRUFBRSxRQUE4QztJQUMzRSxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBTyxFQUFFLE9BQU87UUFDM0MsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1lBQ3BCLE9BQU8sT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVDO2FBQU07WUFDTCxPQUFPLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdDO0lBQ0gsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ1YsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsR0FBVyxFQUFFLFFBQWdCLEVBQUUsbUJBQTZCO0lBQzlFLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7UUFDckQsR0FBRyxHQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDL0I7SUFFRCxPQUFPLFdBQVcsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRUQsU0FBUyxRQUFRLENBQUMsQ0FBUyxFQUFFLENBQVM7SUFDcEMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QjtTQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNqRCxPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsZUFBZSxDQUFnQyxZQUFlO0lBQ3JFLElBQU0sVUFBVSxHQUFHLEVBQU8sQ0FBQztJQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQW5DLENBQW1DLENBQUMsQ0FBQztJQUNyRixPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhcnNlRHVyYXRpb25Ub01zfSBmcm9tICcuL2R1cmF0aW9uJztcbmltcG9ydCB7RmlsZXN5c3RlbX0gZnJvbSAnLi9maWxlc3lzdGVtJztcbmltcG9ydCB7Z2xvYlRvUmVnZXh9IGZyb20gJy4vZ2xvYic7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi9pbic7XG5cbmNvbnN0IERFRkFVTFRfTkFWSUdBVElPTl9VUkxTID0gW1xuICAnLyoqJywgICAgICAgICAgIC8vIEluY2x1ZGUgYWxsIFVSTHMuXG4gICchLyoqLyouKicsICAgICAgLy8gRXhjbHVkZSBVUkxzIHRvIGZpbGVzIChjb250YWluaW5nIGEgZmlsZSBleHRlbnNpb24gaW4gdGhlIGxhc3Qgc2VnbWVudCkuXG4gICchLyoqLypfXyonLCAgICAgLy8gRXhjbHVkZSBVUkxzIGNvbnRhaW5pbmcgYF9fYCBpbiB0aGUgbGFzdCBzZWdtZW50LlxuICAnIS8qKi8qX18qLyoqJywgIC8vIEV4Y2x1ZGUgVVJMcyBjb250YWluaW5nIGBfX2AgaW4gYW55IG90aGVyIHNlZ21lbnQuXG5dO1xuXG4vKipcbiAqIENvbnN1bWVzIHNlcnZpY2Ugd29ya2VyIGNvbmZpZ3VyYXRpb24gZmlsZXMgYW5kIHByb2Nlc3NlcyB0aGVtIGludG8gY29udHJvbCBmaWxlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBHZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBmczogRmlsZXN5c3RlbSwgcHJpdmF0ZSBiYXNlSHJlZjogc3RyaW5nKSB7fVxuXG4gIGFzeW5jIHByb2Nlc3MoY29uZmlnOiBDb25maWcpOiBQcm9taXNlPE9iamVjdD4ge1xuICAgIGNvbnN0IHVub3JkZXJlZEhhc2hUYWJsZSA9IHt9O1xuICAgIGNvbnN0IGFzc2V0R3JvdXBzID0gYXdhaXQgdGhpcy5wcm9jZXNzQXNzZXRHcm91cHMoY29uZmlnLCB1bm9yZGVyZWRIYXNoVGFibGUpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ1ZlcnNpb246IDEsXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICBhcHBEYXRhOiBjb25maWcuYXBwRGF0YSxcbiAgICAgIGluZGV4OiBqb2luVXJscyh0aGlzLmJhc2VIcmVmLCBjb25maWcuaW5kZXgpLCBhc3NldEdyb3VwcyxcbiAgICAgIGRhdGFHcm91cHM6IHRoaXMucHJvY2Vzc0RhdGFHcm91cHMoY29uZmlnKSxcbiAgICAgIGhhc2hUYWJsZTogd2l0aE9yZGVyZWRLZXlzKHVub3JkZXJlZEhhc2hUYWJsZSksXG4gICAgICBuYXZpZ2F0aW9uVXJsczogcHJvY2Vzc05hdmlnYXRpb25VcmxzKHRoaXMuYmFzZUhyZWYsIGNvbmZpZy5uYXZpZ2F0aW9uVXJscyksXG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgcHJvY2Vzc0Fzc2V0R3JvdXBzKGNvbmZpZzogQ29uZmlnLCBoYXNoVGFibGU6IHtbZmlsZTogc3RyaW5nXTogc3RyaW5nIHwgdW5kZWZpbmVkfSk6XG4gICAgICBQcm9taXNlPE9iamVjdFtdPiB7XG4gICAgY29uc3Qgc2Vlbk1hcCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbCgoY29uZmlnLmFzc2V0R3JvdXBzIHx8IFtdKS5tYXAoYXN5bmMoZ3JvdXApID0+IHtcbiAgICAgIGlmIChncm91cC5yZXNvdXJjZXMudmVyc2lvbmVkRmlsZXMpIHtcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgYEFzc2V0LWdyb3VwICcke2dyb3VwLm5hbWV9JyBpbiAnbmdzdy1jb25maWcuanNvbicgdXNlcyB0aGUgJ3ZlcnNpb25lZEZpbGVzJyBvcHRpb24uXFxuYCArXG4gICAgICAgICAgICAnQXMgb2YgdjYgXFwndmVyc2lvbmVkRmlsZXNcXCcgYW5kIFxcJ2ZpbGVzXFwnIG9wdGlvbnMgaGF2ZSB0aGUgc2FtZSBiZWhhdmlvci4gJyArXG4gICAgICAgICAgICAnVXNlIFxcJ2ZpbGVzXFwnIGluc3RlYWQuJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpbGVNYXRjaGVyID0gZ2xvYkxpc3RUb01hdGNoZXIoZ3JvdXAucmVzb3VyY2VzLmZpbGVzIHx8IFtdKTtcbiAgICAgIGNvbnN0IHZlcnNpb25lZE1hdGNoZXIgPSBnbG9iTGlzdFRvTWF0Y2hlcihncm91cC5yZXNvdXJjZXMudmVyc2lvbmVkRmlsZXMgfHwgW10pO1xuXG4gICAgICBjb25zdCBhbGxGaWxlcyA9IGF3YWl0IHRoaXMuZnMubGlzdCgnLycpO1xuXG4gICAgICBjb25zdCBwbGFpbkZpbGVzID0gYWxsRmlsZXMuZmlsdGVyKGZpbGVNYXRjaGVyKS5maWx0ZXIoZmlsZSA9PiAhc2Vlbk1hcC5oYXMoZmlsZSkpO1xuICAgICAgcGxhaW5GaWxlcy5mb3JFYWNoKGZpbGUgPT4gc2Vlbk1hcC5hZGQoZmlsZSkpO1xuXG4gICAgICBjb25zdCB2ZXJzaW9uZWRGaWxlcyA9IGFsbEZpbGVzLmZpbHRlcih2ZXJzaW9uZWRNYXRjaGVyKS5maWx0ZXIoZmlsZSA9PiAhc2Vlbk1hcC5oYXMoZmlsZSkpO1xuICAgICAgdmVyc2lvbmVkRmlsZXMuZm9yRWFjaChmaWxlID0+IHNlZW5NYXAuYWRkKGZpbGUpKTtcblxuICAgICAgLy8gQWRkIHRoZSBoYXNoZXMuXG4gICAgICBjb25zdCBtYXRjaGVkRmlsZXMgPSBbLi4ucGxhaW5GaWxlcywgLi4udmVyc2lvbmVkRmlsZXNdLnNvcnQoKTtcbiAgICAgIGF3YWl0IG1hdGNoZWRGaWxlcy5yZWR1Y2UoYXN5bmMocHJldmlvdXMsIGZpbGUpID0+IHtcbiAgICAgICAgYXdhaXQgcHJldmlvdXM7XG4gICAgICAgIGNvbnN0IGhhc2ggPSBhd2FpdCB0aGlzLmZzLmhhc2goZmlsZSk7XG4gICAgICAgIGhhc2hUYWJsZVtqb2luVXJscyh0aGlzLmJhc2VIcmVmLCBmaWxlKV0gPSBoYXNoO1xuICAgICAgfSwgUHJvbWlzZS5yZXNvbHZlKCkpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBncm91cC5uYW1lLFxuICAgICAgICBpbnN0YWxsTW9kZTogZ3JvdXAuaW5zdGFsbE1vZGUgfHwgJ3ByZWZldGNoJyxcbiAgICAgICAgdXBkYXRlTW9kZTogZ3JvdXAudXBkYXRlTW9kZSB8fCBncm91cC5pbnN0YWxsTW9kZSB8fCAncHJlZmV0Y2gnLFxuICAgICAgICB1cmxzOiBtYXRjaGVkRmlsZXMubWFwKHVybCA9PiBqb2luVXJscyh0aGlzLmJhc2VIcmVmLCB1cmwpKSxcbiAgICAgICAgcGF0dGVybnM6IChncm91cC5yZXNvdXJjZXMudXJscyB8fCBbXSkubWFwKHVybCA9PiB1cmxUb1JlZ2V4KHVybCwgdGhpcy5iYXNlSHJlZiwgdHJ1ZSkpLFxuICAgICAgfTtcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZzogQ29uZmlnKTogT2JqZWN0W10ge1xuICAgIHJldHVybiAoY29uZmlnLmRhdGFHcm91cHMgfHwgW10pLm1hcChncm91cCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBncm91cC5uYW1lLFxuICAgICAgICBwYXR0ZXJuczogZ3JvdXAudXJscy5tYXAodXJsID0+IHVybFRvUmVnZXgodXJsLCB0aGlzLmJhc2VIcmVmLCB0cnVlKSksXG4gICAgICAgIHN0cmF0ZWd5OiBncm91cC5jYWNoZUNvbmZpZy5zdHJhdGVneSB8fCAncGVyZm9ybWFuY2UnLFxuICAgICAgICBtYXhTaXplOiBncm91cC5jYWNoZUNvbmZpZy5tYXhTaXplLFxuICAgICAgICBtYXhBZ2U6IHBhcnNlRHVyYXRpb25Ub01zKGdyb3VwLmNhY2hlQ29uZmlnLm1heEFnZSksXG4gICAgICAgIHRpbWVvdXRNczogZ3JvdXAuY2FjaGVDb25maWcudGltZW91dCAmJiBwYXJzZUR1cmF0aW9uVG9Ncyhncm91cC5jYWNoZUNvbmZpZy50aW1lb3V0KSxcbiAgICAgICAgdmVyc2lvbjogZ3JvdXAudmVyc2lvbiAhPT0gdW5kZWZpbmVkID8gZ3JvdXAudmVyc2lvbiA6IDEsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzTmF2aWdhdGlvblVybHMoXG4gICAgYmFzZUhyZWY6IHN0cmluZywgdXJscyA9IERFRkFVTFRfTkFWSUdBVElPTl9VUkxTKToge3Bvc2l0aXZlOiBib29sZWFuLCByZWdleDogc3RyaW5nfVtdIHtcbiAgcmV0dXJuIHVybHMubWFwKHVybCA9PiB7XG4gICAgY29uc3QgcG9zaXRpdmUgPSAhdXJsLnN0YXJ0c1dpdGgoJyEnKTtcbiAgICB1cmwgPSBwb3NpdGl2ZSA/IHVybCA6IHVybC5zdWJzdHIoMSk7XG4gICAgcmV0dXJuIHtwb3NpdGl2ZSwgcmVnZXg6IGBeJHt1cmxUb1JlZ2V4KHVybCwgYmFzZUhyZWYpfSRgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdsb2JMaXN0VG9NYXRjaGVyKGdsb2JzOiBzdHJpbmdbXSk6IChmaWxlOiBzdHJpbmcpID0+IGJvb2xlYW4ge1xuICBjb25zdCBwYXR0ZXJucyA9IGdsb2JzLm1hcChwYXR0ZXJuID0+IHtcbiAgICBpZiAocGF0dGVybi5zdGFydHNXaXRoKCchJykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aXZlOiBmYWxzZSxcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAoJ14nICsgZ2xvYlRvUmVnZXgocGF0dGVybi5zdWJzdHIoMSkpICsgJyQnKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aXZlOiB0cnVlLFxuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCgnXicgKyBnbG9iVG9SZWdleChwYXR0ZXJuKSArICckJyksXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoZmlsZTogc3RyaW5nKSA9PiBtYXRjaGVzKGZpbGUsIHBhdHRlcm5zKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyhmaWxlOiBzdHJpbmcsIHBhdHRlcm5zOiB7cG9zaXRpdmU6IGJvb2xlYW4sIHJlZ2V4OiBSZWdFeHB9W10pOiBib29sZWFuIHtcbiAgY29uc3QgcmVzID0gcGF0dGVybnMucmVkdWNlKChpc01hdGNoLCBwYXR0ZXJuKSA9PiB7XG4gICAgaWYgKHBhdHRlcm4ucG9zaXRpdmUpIHtcbiAgICAgIHJldHVybiBpc01hdGNoIHx8IHBhdHRlcm4ucmVnZXgudGVzdChmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlzTWF0Y2ggJiYgIXBhdHRlcm4ucmVnZXgudGVzdChmaWxlKTtcbiAgICB9XG4gIH0sIGZhbHNlKTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gdXJsVG9SZWdleCh1cmw6IHN0cmluZywgYmFzZUhyZWY6IHN0cmluZywgbGl0ZXJhbFF1ZXN0aW9uTWFyaz86IGJvb2xlYW4pOiBzdHJpbmcge1xuICBpZiAoIXVybC5zdGFydHNXaXRoKCcvJykgJiYgdXJsLmluZGV4T2YoJzovLycpID09PSAtMSkge1xuICAgIHVybCA9IGpvaW5VcmxzKGJhc2VIcmVmLCB1cmwpO1xuICB9XG5cbiAgcmV0dXJuIGdsb2JUb1JlZ2V4KHVybCwgbGl0ZXJhbFF1ZXN0aW9uTWFyayk7XG59XG5cbmZ1bmN0aW9uIGpvaW5VcmxzKGE6IHN0cmluZywgYjogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGEuZW5kc1dpdGgoJy8nKSAmJiBiLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiBhICsgYi5zdWJzdHIoMSk7XG4gIH0gZWxzZSBpZiAoIWEuZW5kc1dpdGgoJy8nKSAmJiAhYi5zdGFydHNXaXRoKCcvJykpIHtcbiAgICByZXR1cm4gYSArICcvJyArIGI7XG4gIH1cbiAgcmV0dXJuIGEgKyBiO1xufVxuXG5mdW5jdGlvbiB3aXRoT3JkZXJlZEtleXM8VCBleHRlbmRze1trZXk6IHN0cmluZ106IGFueX0+KHVub3JkZXJlZE9iajogVCk6IFQge1xuICBjb25zdCBvcmRlcmVkT2JqID0ge30gYXMgVDtcbiAgT2JqZWN0LmtleXModW5vcmRlcmVkT2JqKS5zb3J0KCkuZm9yRWFjaChrZXkgPT4gb3JkZXJlZE9ialtrZXldID0gdW5vcmRlcmVkT2JqW2tleV0pO1xuICByZXR1cm4gb3JkZXJlZE9iajtcbn1cbiJdfQ==