/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/update.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { NEVER } from 'rxjs';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
import * as i0 from "@angular/core";
import * as i1 from "./low_level";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * \@publicApi
 */
export class SwUpdate {
    /**
     * @param {?} sw
     */
    constructor(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.available = NEVER;
            this.activated = NEVER;
            return;
        }
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
    }
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     * @return {?}
     */
    get isEnabled() { return this.sw.isEnabled; }
    /**
     * @return {?}
     */
    checkForUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        const statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce }, statusNonce);
    }
    /**
     * @return {?}
     */
    activateUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        const statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce }, statusNonce);
    }
}
SwUpdate.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SwUpdate.ctorParameters = () => [
    { type: NgswCommChannel }
];
/** @nocollapse */ SwUpdate.ɵfac = function SwUpdate_Factory(t) { return new (t || SwUpdate)(i0.ɵɵinject(i1.NgswCommChannel)); };
/** @nocollapse */ SwUpdate.ɵprov = i0.ɵɵdefineInjectable({ token: SwUpdate, factory: function (t) { return SwUpdate.ɵfac(t); }, providedIn: null });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(SwUpdate, [{
        type: Injectable
    }], function () { return [{ type: i1.NgswCommChannel }]; }, null); })();
if (false) {
    /**
     * Emits an `UpdateAvailableEvent` event whenever a new app version is available.
     * @type {?}
     */
    SwUpdate.prototype.available;
    /**
     * Emits an `UpdateActivatedEvent` event whenever the app has been updated to a new version.
     * @type {?}
     */
    SwUpdate.prototype.activated;
    /**
     * @type {?}
     * @private
     */
    SwUpdate.prototype.sw;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUV2QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUE2QyxNQUFNLGFBQWEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQVc5RyxNQUFNLE9BQU8sUUFBUTs7OztJQWlCbkIsWUFBb0IsRUFBbUI7UUFBbkIsT0FBRSxHQUFGLEVBQUUsQ0FBaUI7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBdUIsa0JBQWtCLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUF1QixrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7Ozs7OztJQVZELElBQUksU0FBUyxLQUFjLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7O0lBWXRELGNBQWM7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN4RDs7Y0FDSyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7UUFDM0MsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFLEVBQUMsV0FBVyxFQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDeEYsQ0FBQzs7OztJQUVELGNBQWM7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN4RDs7Y0FDSyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7UUFDM0MsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFLEVBQUMsV0FBVyxFQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEYsQ0FBQzs7O1lBMUNGLFVBQVU7Ozs7WUFWbUIsZUFBZTs7Z0VBV2hDLFFBQVE7Z0RBQVIsUUFBUSxpQ0FBUixRQUFRO2tEQUFSLFFBQVE7Y0FEcEIsVUFBVTs7Ozs7OztJQUtULDZCQUFxRDs7Ozs7SUFLckQsNkJBQXFEOzs7OztJQVF6QyxzQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05FVkVSLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsLCBVcGRhdGVBY3RpdmF0ZWRFdmVudCwgVXBkYXRlQXZhaWxhYmxlRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuXG5cbi8qKlxuICogU3Vic2NyaWJlIHRvIHVwZGF0ZSBub3RpZmljYXRpb25zIGZyb20gdGhlIFNlcnZpY2UgV29ya2VyLCB0cmlnZ2VyIHVwZGF0ZVxuICogY2hlY2tzLCBhbmQgZm9yY2libHkgYWN0aXZhdGUgdXBkYXRlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTd1VwZGF0ZSB7XG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVXBkYXRlQXZhaWxhYmxlRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IGFwcCB2ZXJzaW9uIGlzIGF2YWlsYWJsZS5cbiAgICovXG4gIHJlYWRvbmx5IGF2YWlsYWJsZTogT2JzZXJ2YWJsZTxVcGRhdGVBdmFpbGFibGVFdmVudD47XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGBVcGRhdGVBY3RpdmF0ZWRFdmVudGAgZXZlbnQgd2hlbmV2ZXIgdGhlIGFwcCBoYXMgYmVlbiB1cGRhdGVkIHRvIGEgbmV3IHZlcnNpb24uXG4gICAqL1xuICByZWFkb25seSBhY3RpdmF0ZWQ6IE9ic2VydmFibGU8VXBkYXRlQWN0aXZhdGVkRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdy5pc0VuYWJsZWQ7IH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN3OiBOZ3N3Q29tbUNoYW5uZWwpIHtcbiAgICBpZiAoIXN3LmlzRW5hYmxlZCkge1xuICAgICAgdGhpcy5hdmFpbGFibGUgPSBORVZFUjtcbiAgICAgIHRoaXMuYWN0aXZhdGVkID0gTkVWRVI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuYXZhaWxhYmxlID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VXBkYXRlQXZhaWxhYmxlRXZlbnQ+KCdVUERBVEVfQVZBSUxBQkxFJyk7XG4gICAgdGhpcy5hY3RpdmF0ZWQgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxVcGRhdGVBY3RpdmF0ZWRFdmVudD4oJ1VQREFURV9BQ1RJVkFURUQnKTtcbiAgfVxuXG4gIGNoZWNrRm9yVXBkYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgc3RhdHVzTm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhTdGF0dXMoJ0NIRUNLX0ZPUl9VUERBVEVTJywge3N0YXR1c05vbmNlfSwgc3RhdHVzTm9uY2UpO1xuICB9XG5cbiAgYWN0aXZhdGVVcGRhdGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBzdGF0dXNOb25jZSA9IHRoaXMuc3cuZ2VuZXJhdGVOb25jZSgpO1xuICAgIHJldHVybiB0aGlzLnN3LnBvc3RNZXNzYWdlV2l0aFN0YXR1cygnQUNUSVZBVEVfVVBEQVRFJywge3N0YXR1c05vbmNlfSwgc3RhdHVzTm9uY2UpO1xuICB9XG59XG4iXX0=