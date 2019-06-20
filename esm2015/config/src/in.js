/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A top-level Angular Service Worker configuration object.
 *
 * \@publicApi
 * @record
 */
export function Config() { }
if (false) {
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
}
/**
 * Configuration for a particular group of assets.
 *
 * \@publicApi
 * @record
 */
export function AssetGroup() { }
if (false) {
    /** @type {?} */
    AssetGroup.prototype.name;
    /** @type {?|undefined} */
    AssetGroup.prototype.installMode;
    /** @type {?|undefined} */
    AssetGroup.prototype.updateMode;
    /** @type {?} */
    AssetGroup.prototype.resources;
}
/**
 * Configuration for a particular group of dynamic URLs.
 *
 * \@publicApi
 * @record
 */
export function DataGroup() { }
if (false) {
    /** @type {?} */
    DataGroup.prototype.name;
    /** @type {?} */
    DataGroup.prototype.urls;
    /** @type {?|undefined} */
    DataGroup.prototype.version;
    /** @type {?} */
    DataGroup.prototype.cacheConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLDRCQU1DOzs7SUFMQyx5QkFBYTs7SUFDYix1QkFBYzs7SUFDZCw2QkFBMkI7O0lBQzNCLDRCQUF5Qjs7SUFDekIsZ0NBQTBCOzs7Ozs7OztBQVE1QixnQ0FXQzs7O0lBVkMsMEJBQWE7O0lBQ2IsaUNBQWdDOztJQUNoQyxnQ0FBK0I7O0lBQy9CLCtCQU1FOzs7Ozs7OztBQVFKLCtCQU9DOzs7SUFOQyx5QkFBYTs7SUFDYix5QkFBYTs7SUFDYiw0QkFBaUI7O0lBQ2pCLGdDQUVFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgR2xvYiA9IHN0cmluZztcblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIER1cmF0aW9uID0gc3RyaW5nO1xuXG4vKipcbiAqIEEgdG9wLWxldmVsIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIGFwcERhdGE/OiB7fTtcbiAgaW5kZXg6IHN0cmluZztcbiAgYXNzZXRHcm91cHM/OiBBc3NldEdyb3VwW107XG4gIGRhdGFHcm91cHM/OiBEYXRhR3JvdXBbXTtcbiAgbmF2aWdhdGlvblVybHM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBhIHBhcnRpY3VsYXIgZ3JvdXAgb2YgYXNzZXRzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3NldEdyb3VwIHtcbiAgbmFtZTogc3RyaW5nO1xuICBpbnN0YWxsTW9kZT86ICdwcmVmZXRjaCd8J2xhenknO1xuICB1cGRhdGVNb2RlPzogJ3ByZWZldGNoJ3wnbGF6eSc7XG4gIHJlc291cmNlczoge1xuICAgIGZpbGVzPzogR2xvYltdO1xuICAgIC8qKiBAZGVwcmVjYXRlZCBBcyBvZiB2NiBgdmVyc2lvbmVkRmlsZXNgIGFuZCBgZmlsZXNgIG9wdGlvbnMgaGF2ZSB0aGUgc2FtZSBiZWhhdmlvci4gVXNlXG4gICAgICAgYGZpbGVzYCBpbnN0ZWFkLiAqL1xuICAgIHZlcnNpb25lZEZpbGVzPzogR2xvYltdO1xuICAgIHVybHM/OiBHbG9iW107XG4gIH07XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgYSBwYXJ0aWN1bGFyIGdyb3VwIG9mIGR5bmFtaWMgVVJMcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGF0YUdyb3VwIHtcbiAgbmFtZTogc3RyaW5nO1xuICB1cmxzOiBHbG9iW107XG4gIHZlcnNpb24/OiBudW1iZXI7XG4gIGNhY2hlQ29uZmlnOiB7XG4gICAgbWF4U2l6ZTogbnVtYmVyOyBtYXhBZ2U6IER1cmF0aW9uOyB0aW1lb3V0PzogRHVyYXRpb247IHN0cmF0ZWd5PzogJ2ZyZXNobmVzcycgfCAncGVyZm9ybWFuY2UnO1xuICB9O1xufVxuIl19