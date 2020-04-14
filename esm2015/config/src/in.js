/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/config/src/in.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSw0QkFNQzs7O0lBTEMseUJBQWE7O0lBQ2IsdUJBQWM7O0lBQ2QsNkJBQTJCOztJQUMzQiw0QkFBeUI7O0lBQ3pCLGdDQUEwQjs7Ozs7Ozs7QUFRNUIsZ0NBS0M7OztJQUpDLDBCQUFhOztJQUNiLGlDQUFnQzs7SUFDaEMsZ0NBQStCOztJQUMvQiwrQkFBNEM7Ozs7Ozs7O0FBUTlDLCtCQVNDOzs7SUFSQyx5QkFBYTs7SUFDYix5QkFBYTs7SUFDYiw0QkFBaUI7O0lBQ2pCLGdDQUlFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgR2xvYiA9IHN0cmluZztcblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCB0eXBlIER1cmF0aW9uID0gc3RyaW5nO1xuXG4vKipcbiAqIEEgdG9wLWxldmVsIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZyB7XG4gIGFwcERhdGE/OiB7fTtcbiAgaW5kZXg6IHN0cmluZztcbiAgYXNzZXRHcm91cHM/OiBBc3NldEdyb3VwW107XG4gIGRhdGFHcm91cHM/OiBEYXRhR3JvdXBbXTtcbiAgbmF2aWdhdGlvblVybHM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBhIHBhcnRpY3VsYXIgZ3JvdXAgb2YgYXNzZXRzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBc3NldEdyb3VwIHtcbiAgbmFtZTogc3RyaW5nO1xuICBpbnN0YWxsTW9kZT86ICdwcmVmZXRjaCd8J2xhenknO1xuICB1cGRhdGVNb2RlPzogJ3ByZWZldGNoJ3wnbGF6eSc7XG4gIHJlc291cmNlczoge2ZpbGVzPzogR2xvYltdOyB1cmxzPzogR2xvYltdO307XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgYSBwYXJ0aWN1bGFyIGdyb3VwIG9mIGR5bmFtaWMgVVJMcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGF0YUdyb3VwIHtcbiAgbmFtZTogc3RyaW5nO1xuICB1cmxzOiBHbG9iW107XG4gIHZlcnNpb24/OiBudW1iZXI7XG4gIGNhY2hlQ29uZmlnOiB7XG4gICAgbWF4U2l6ZTogbnVtYmVyOyBtYXhBZ2U6IER1cmF0aW9uO1xuICAgIHRpbWVvdXQ/OiBEdXJhdGlvbjtcbiAgICBzdHJhdGVneT86ICdmcmVzaG5lc3MnIHwgJ3BlcmZvcm1hbmNlJztcbiAgfTtcbn1cbiJdfQ==