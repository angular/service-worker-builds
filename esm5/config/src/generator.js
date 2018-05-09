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
            var hashTable, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        hashTable = {};
                        _a = {
                            configVersion: 1,
                            appData: config.appData,
                            index: joinUrls(this.baseHref, config.index)
                        };
                        return [4 /*yield*/, this.processAssetGroups(config, hashTable)];
                    case 1: return [2 /*return*/, (_a.assetGroups = _b.sent(),
                            _a.dataGroups = this.processDataGroups(config),
                            _a.hashTable = hashTable,
                            _a.navigationUrls = processNavigationUrls(this.baseHref, config.navigationUrls),
                            _a)];
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
                        var fileMatcher, versionedMatcher, allFiles, versionedFiles, plainFiles;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    fileMatcher = globListToMatcher(group.resources.files || []);
                                    versionedMatcher = globListToMatcher(group.resources.versionedFiles || []);
                                    return [4 /*yield*/, this.fs.list('/')];
                                case 1:
                                    allFiles = (_a.sent());
                                    versionedFiles = allFiles.filter(versionedMatcher).filter(function (file) { return !seenMap.has(file); });
                                    versionedFiles.forEach(function (file) { return seenMap.add(file); });
                                    plainFiles = allFiles.filter(fileMatcher).filter(function (file) { return !seenMap.has(file); });
                                    plainFiles.forEach(function (file) { return seenMap.add(file); });
                                    // Add the hashes.
                                    return [4 /*yield*/, tslib_1.__spread(versionedFiles, plainFiles).reduce(function (previous, file) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
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
                                    // Add the hashes.
                                    // Add the hashes.
                                    _a.sent();
                                    return [2 /*return*/, {
                                            name: group.name,
                                            installMode: group.installMode || 'prefetch',
                                            updateMode: group.updateMode || group.installMode || 'prefetch',
                                            urls: []
                                                .concat(plainFiles)
                                                .concat(versionedFiles)
                                                .map(function (url) { return joinUrls(_this.baseHref, url); }),
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvY29uZmlnL3NyYy9nZW5lcmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFN0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUduQyxJQUFNLHVCQUF1QixHQUFHO0lBQzlCLEtBQUs7SUFDTCxVQUFVO0lBQ1YsV0FBVztJQUNYLGNBQWM7Q0FDZixDQUFDOzs7Ozs7QUFPRjs7Ozs7QUFBQTtJQUNFLG1CQUFxQixFQUFjLEVBQVUsUUFBZ0I7UUFBeEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVE7S0FBSTtJQUUzRCwyQkFBTyxHQUFiLFVBQWMsTUFBYzs7Ozs7O3dCQUNwQixTQUFTLEdBQUcsRUFBRSxDQUFDOzs0QkFFbkIsYUFBYSxFQUFFLENBQUM7NEJBQ2hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTzs0QkFDdkIsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUM7O3dCQUMvQixxQkFBTSxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxFQUFBOzRCQUovRCx1QkFJRSxjQUFXLEdBQUUsU0FBZ0Q7NEJBQzdELGFBQVUsR0FBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDOzRCQUFFLFlBQVMsWUFBQTs0QkFDckQsaUJBQWMsR0FBRSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxjQUFjLENBQUM7aUNBQzNFOzs7O0tBQ0g7SUFFYSxzQ0FBa0IsR0FBaEMsVUFBaUMsTUFBYyxFQUFFLFNBQStDOzs7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QUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdDO0tBQ0YsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUM7Q0FDWjtBQUVELG9CQUFvQixHQUFXLEVBQUUsUUFBZ0I7SUFDL0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQy9CO0lBRUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUN6QjtBQUVELGtCQUFrQixDQUFTLEVBQUUsQ0FBUztJQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QjtJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDcEI7SUFDRCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNkIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhcnNlRHVyYXRpb25Ub01zfSBmcm9tICcuL2R1cmF0aW9uJztcbmltcG9ydCB7RmlsZXN5c3RlbX0gZnJvbSAnLi9maWxlc3lzdGVtJztcbmltcG9ydCB7Z2xvYlRvUmVnZXh9IGZyb20gJy4vZ2xvYic7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi9pbic7XG5cbmNvbnN0IERFRkFVTFRfTkFWSUdBVElPTl9VUkxTID0gW1xuICAnLyoqJywgICAgICAgICAgIC8vIEluY2x1ZGUgYWxsIFVSTHMuXG4gICchLyoqLyouKicsICAgICAgLy8gRXhjbHVkZSBVUkxzIHRvIGZpbGVzIChjb250YWluaW5nIGEgZmlsZSBleHRlbnNpb24gaW4gdGhlIGxhc3Qgc2VnbWVudCkuXG4gICchLyoqLypfXyonLCAgICAgLy8gRXhjbHVkZSBVUkxzIGNvbnRhaW5pbmcgYF9fYCBpbiB0aGUgbGFzdCBzZWdtZW50LlxuICAnIS8qKi8qX18qLyoqJywgIC8vIEV4Y2x1ZGUgVVJMcyBjb250YWluaW5nIGBfX2AgaW4gYW55IG90aGVyIHNlZ21lbnQuXG5dO1xuXG4vKipcbiAqIENvbnN1bWVzIHNlcnZpY2Ugd29ya2VyIGNvbmZpZ3VyYXRpb24gZmlsZXMgYW5kIHByb2Nlc3NlcyB0aGVtIGludG8gY29udHJvbCBmaWxlcy5cbiAqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBjbGFzcyBHZW5lcmF0b3Ige1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBmczogRmlsZXN5c3RlbSwgcHJpdmF0ZSBiYXNlSHJlZjogc3RyaW5nKSB7fVxuXG4gIGFzeW5jIHByb2Nlc3MoY29uZmlnOiBDb25maWcpOiBQcm9taXNlPE9iamVjdD4ge1xuICAgIGNvbnN0IGhhc2hUYWJsZSA9IHt9O1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWdWZXJzaW9uOiAxLFxuICAgICAgYXBwRGF0YTogY29uZmlnLmFwcERhdGEsXG4gICAgICBpbmRleDogam9pblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLmluZGV4KSxcbiAgICAgIGFzc2V0R3JvdXBzOiBhd2FpdCB0aGlzLnByb2Nlc3NBc3NldEdyb3Vwcyhjb25maWcsIGhhc2hUYWJsZSksXG4gICAgICBkYXRhR3JvdXBzOiB0aGlzLnByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZyksIGhhc2hUYWJsZSxcbiAgICAgIG5hdmlnYXRpb25VcmxzOiBwcm9jZXNzTmF2aWdhdGlvblVybHModGhpcy5iYXNlSHJlZiwgY29uZmlnLm5hdmlnYXRpb25VcmxzKSxcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBwcm9jZXNzQXNzZXRHcm91cHMoY29uZmlnOiBDb25maWcsIGhhc2hUYWJsZToge1tmaWxlOiBzdHJpbmddOiBzdHJpbmcgfCB1bmRlZmluZWR9KTpcbiAgICAgIFByb21pc2U8T2JqZWN0W10+IHtcbiAgICBjb25zdCBzZWVuTWFwID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKChjb25maWcuYXNzZXRHcm91cHMgfHwgW10pLm1hcChhc3luYyhncm91cCkgPT4ge1xuICAgICAgY29uc3QgZmlsZU1hdGNoZXIgPSBnbG9iTGlzdFRvTWF0Y2hlcihncm91cC5yZXNvdXJjZXMuZmlsZXMgfHwgW10pO1xuICAgICAgY29uc3QgdmVyc2lvbmVkTWF0Y2hlciA9IGdsb2JMaXN0VG9NYXRjaGVyKGdyb3VwLnJlc291cmNlcy52ZXJzaW9uZWRGaWxlcyB8fCBbXSk7XG5cbiAgICAgIGNvbnN0IGFsbEZpbGVzID0gKGF3YWl0IHRoaXMuZnMubGlzdCgnLycpKTtcblxuICAgICAgY29uc3QgdmVyc2lvbmVkRmlsZXMgPSBhbGxGaWxlcy5maWx0ZXIodmVyc2lvbmVkTWF0Y2hlcikuZmlsdGVyKGZpbGUgPT4gIXNlZW5NYXAuaGFzKGZpbGUpKTtcbiAgICAgIHZlcnNpb25lZEZpbGVzLmZvckVhY2goZmlsZSA9PiBzZWVuTWFwLmFkZChmaWxlKSk7XG5cbiAgICAgIGNvbnN0IHBsYWluRmlsZXMgPSBhbGxGaWxlcy5maWx0ZXIoZmlsZU1hdGNoZXIpLmZpbHRlcihmaWxlID0+ICFzZWVuTWFwLmhhcyhmaWxlKSk7XG4gICAgICBwbGFpbkZpbGVzLmZvckVhY2goZmlsZSA9PiBzZWVuTWFwLmFkZChmaWxlKSk7XG5cbiAgICAgIC8vIEFkZCB0aGUgaGFzaGVzLlxuICAgICAgYXdhaXRbLi4udmVyc2lvbmVkRmlsZXMsIC4uLnBsYWluRmlsZXNdLnJlZHVjZShhc3luYyhwcmV2aW91cywgZmlsZSkgPT4ge1xuICAgICAgICBhd2FpdCBwcmV2aW91cztcbiAgICAgICAgY29uc3QgaGFzaCA9IGF3YWl0IHRoaXMuZnMuaGFzaChmaWxlKTtcbiAgICAgICAgaGFzaFRhYmxlW2pvaW5VcmxzKHRoaXMuYmFzZUhyZWYsIGZpbGUpXSA9IGhhc2g7XG4gICAgICB9LCBQcm9taXNlLnJlc29sdmUoKSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IGdyb3VwLm5hbWUsXG4gICAgICAgIGluc3RhbGxNb2RlOiBncm91cC5pbnN0YWxsTW9kZSB8fCAncHJlZmV0Y2gnLFxuICAgICAgICB1cGRhdGVNb2RlOiBncm91cC51cGRhdGVNb2RlIHx8IGdyb3VwLmluc3RhbGxNb2RlIHx8ICdwcmVmZXRjaCcsXG4gICAgICAgIHVybHM6IChbXSBhcyBzdHJpbmdbXSlcbiAgICAgICAgICAgICAgICAgIC5jb25jYXQocGxhaW5GaWxlcylcbiAgICAgICAgICAgICAgICAgIC5jb25jYXQodmVyc2lvbmVkRmlsZXMpXG4gICAgICAgICAgICAgICAgICAubWFwKHVybCA9PiBqb2luVXJscyh0aGlzLmJhc2VIcmVmLCB1cmwpKSxcbiAgICAgICAgcGF0dGVybnM6IChncm91cC5yZXNvdXJjZXMudXJscyB8fCBbXSkubWFwKHVybCA9PiB1cmxUb1JlZ2V4KHVybCwgdGhpcy5iYXNlSHJlZikpLFxuICAgICAgfTtcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIHByb2Nlc3NEYXRhR3JvdXBzKGNvbmZpZzogQ29uZmlnKTogT2JqZWN0W10ge1xuICAgIHJldHVybiAoY29uZmlnLmRhdGFHcm91cHMgfHwgW10pLm1hcChncm91cCA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBncm91cC5uYW1lLFxuICAgICAgICBwYXR0ZXJuczogZ3JvdXAudXJscy5tYXAodXJsID0+IHVybFRvUmVnZXgodXJsLCB0aGlzLmJhc2VIcmVmKSksXG4gICAgICAgIHN0cmF0ZWd5OiBncm91cC5jYWNoZUNvbmZpZy5zdHJhdGVneSB8fCAncGVyZm9ybWFuY2UnLFxuICAgICAgICBtYXhTaXplOiBncm91cC5jYWNoZUNvbmZpZy5tYXhTaXplLFxuICAgICAgICBtYXhBZ2U6IHBhcnNlRHVyYXRpb25Ub01zKGdyb3VwLmNhY2hlQ29uZmlnLm1heEFnZSksXG4gICAgICAgIHRpbWVvdXRNczogZ3JvdXAuY2FjaGVDb25maWcudGltZW91dCAmJiBwYXJzZUR1cmF0aW9uVG9Ncyhncm91cC5jYWNoZUNvbmZpZy50aW1lb3V0KSxcbiAgICAgICAgdmVyc2lvbjogZ3JvdXAudmVyc2lvbiAhPT0gdW5kZWZpbmVkID8gZ3JvdXAudmVyc2lvbiA6IDEsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzTmF2aWdhdGlvblVybHMoXG4gICAgYmFzZUhyZWY6IHN0cmluZywgdXJscyA9IERFRkFVTFRfTkFWSUdBVElPTl9VUkxTKToge3Bvc2l0aXZlOiBib29sZWFuLCByZWdleDogc3RyaW5nfVtdIHtcbiAgcmV0dXJuIHVybHMubWFwKHVybCA9PiB7XG4gICAgY29uc3QgcG9zaXRpdmUgPSAhdXJsLnN0YXJ0c1dpdGgoJyEnKTtcbiAgICB1cmwgPSBwb3NpdGl2ZSA/IHVybCA6IHVybC5zdWJzdHIoMSk7XG4gICAgcmV0dXJuIHtwb3NpdGl2ZSwgcmVnZXg6IGBeJHt1cmxUb1JlZ2V4KHVybCwgYmFzZUhyZWYpfSRgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdsb2JMaXN0VG9NYXRjaGVyKGdsb2JzOiBzdHJpbmdbXSk6IChmaWxlOiBzdHJpbmcpID0+IGJvb2xlYW4ge1xuICBjb25zdCBwYXR0ZXJucyA9IGdsb2JzLm1hcChwYXR0ZXJuID0+IHtcbiAgICBpZiAocGF0dGVybi5zdGFydHNXaXRoKCchJykpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aXZlOiBmYWxzZSxcbiAgICAgICAgcmVnZXg6IG5ldyBSZWdFeHAoJ14nICsgZ2xvYlRvUmVnZXgocGF0dGVybi5zdWJzdHIoMSkpICsgJyQnKSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aXZlOiB0cnVlLFxuICAgICAgICByZWdleDogbmV3IFJlZ0V4cCgnXicgKyBnbG9iVG9SZWdleChwYXR0ZXJuKSArICckJyksXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiAoZmlsZTogc3RyaW5nKSA9PiBtYXRjaGVzKGZpbGUsIHBhdHRlcm5zKTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyhmaWxlOiBzdHJpbmcsIHBhdHRlcm5zOiB7cG9zaXRpdmU6IGJvb2xlYW4sIHJlZ2V4OiBSZWdFeHB9W10pOiBib29sZWFuIHtcbiAgY29uc3QgcmVzID0gcGF0dGVybnMucmVkdWNlKChpc01hdGNoLCBwYXR0ZXJuKSA9PiB7XG4gICAgaWYgKHBhdHRlcm4ucG9zaXRpdmUpIHtcbiAgICAgIHJldHVybiBpc01hdGNoIHx8IHBhdHRlcm4ucmVnZXgudGVzdChmaWxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlzTWF0Y2ggJiYgIXBhdHRlcm4ucmVnZXgudGVzdChmaWxlKTtcbiAgICB9XG4gIH0sIGZhbHNlKTtcbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gdXJsVG9SZWdleCh1cmw6IHN0cmluZywgYmFzZUhyZWY6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmICghdXJsLnN0YXJ0c1dpdGgoJy8nKSAmJiB1cmwuaW5kZXhPZignOi8vJykgPT09IC0xKSB7XG4gICAgdXJsID0gam9pblVybHMoYmFzZUhyZWYsIHVybCk7XG4gIH1cblxuICByZXR1cm4gZ2xvYlRvUmVnZXgodXJsKTtcbn1cblxuZnVuY3Rpb24gam9pblVybHMoYTogc3RyaW5nLCBiOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAoYS5lbmRzV2l0aCgnLycpICYmIGIuc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIGEgKyBiLnN1YnN0cigxKTtcbiAgfSBlbHNlIGlmICghYS5lbmRzV2l0aCgnLycpICYmICFiLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgIHJldHVybiBhICsgJy8nICsgYjtcbiAgfVxuICByZXR1cm4gYSArIGI7XG59XG4iXX0=