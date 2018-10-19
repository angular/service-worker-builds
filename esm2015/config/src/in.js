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
/** @typedef {?} */
var Glob;
export { Glob };
/** @typedef {?} */
var Duration;
export { Duration };
/**
 * A top-level Angular Service Worker configuration object.
 *
 * \@publicApi
 * @record
 */
export function Config() { }
/** @type {?|undefined} */
Config.prototype.appData;
/** @type {?} */
Config.prototype.index;
/** @type {?|undefined} */
Config.prototype.assetGroups;
/** @type {?|undefined} */
Config.prototype.dataGroups;
/** @type {?|undefined} */
Config.prototype.navigationUrls;
/**
 * Configuration for a particular group of assets.
 *
 * \@publicApi
 * @record
 */
export function AssetGroup() { }
/** @type {?} */
AssetGroup.prototype.name;
/** @type {?|undefined} */
AssetGroup.prototype.installMode;
/** @type {?|undefined} */
AssetGroup.prototype.updateMode;
/** @type {?} */
AssetGroup.prototype.resources;
/**
 * Configuration for a particular group of dynamic URLs.
 *
 * \@publicApi
 * @record
 */
export function DataGroup() { }
/** @type {?} */
DataGroup.prototype.name;
/** @type {?} */
DataGroup.prototype.urls;
/** @type {?|undefined} */
DataGroup.prototype.version;
/** @type {?} */
DataGroup.prototype.cacheConfig;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBHbG9iID0gc3RyaW5nO1xuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgRHVyYXRpb24gPSBzdHJpbmc7XG5cbi8qKlxuICogQSB0b3AtbGV2ZWwgQW5ndWxhciBTZXJ2aWNlIFdvcmtlciBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgYXBwRGF0YT86IHt9O1xuICBpbmRleDogc3RyaW5nO1xuICBhc3NldEdyb3Vwcz86IEFzc2V0R3JvdXBbXTtcbiAgZGF0YUdyb3Vwcz86IERhdGFHcm91cFtdO1xuICBuYXZpZ2F0aW9uVXJscz86IHN0cmluZ1tdO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIGEgcGFydGljdWxhciBncm91cCBvZiBhc3NldHMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFzc2V0R3JvdXAge1xuICBuYW1lOiBzdHJpbmc7XG4gIGluc3RhbGxNb2RlPzogJ3ByZWZldGNoJ3wnbGF6eSc7XG4gIHVwZGF0ZU1vZGU/OiAncHJlZmV0Y2gnfCdsYXp5JztcbiAgcmVzb3VyY2VzOiB7XG4gICAgZmlsZXM/OiBHbG9iW107XG4gICAgLyoqIEBkZXByZWNhdGVkIEFzIG9mIHY2IGB2ZXJzaW9uZWRGaWxlc2AgYW5kIGBmaWxlc2Agb3B0aW9ucyBoYXZlIHRoZSBzYW1lIGJlaGF2aW9yLiBVc2VcbiAgICAgICBgZmlsZXNgIGluc3RlYWQuICovXG4gICAgdmVyc2lvbmVkRmlsZXM/OiBHbG9iW107XG4gICAgdXJscz86IEdsb2JbXTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBhIHBhcnRpY3VsYXIgZ3JvdXAgb2YgZHluYW1pYyBVUkxzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEYXRhR3JvdXAge1xuICBuYW1lOiBzdHJpbmc7XG4gIHVybHM6IEdsb2JbXTtcbiAgdmVyc2lvbj86IG51bWJlcjtcbiAgY2FjaGVDb25maWc6IHtcbiAgICBtYXhTaXplOiBudW1iZXI7IG1heEFnZTogRHVyYXRpb247IHRpbWVvdXQ/OiBEdXJhdGlvbjsgc3RyYXRlZ3k/OiAnZnJlc2huZXNzJyB8ICdwZXJmb3JtYW5jZSc7XG4gIH07XG59XG4iXX0=