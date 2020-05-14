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
let SwUpdate = /** @class */ (() => {
    /**
     * Subscribe to update notifications from the Service Worker, trigger update
     * checks, and forcibly activate updates.
     *
     * \@publicApi
     */
    class SwUpdate {
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
        get isEnabled() {
            return this.sw.isEnabled;
        }
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
    /** @nocollapse */ SwUpdate.ɵprov = i0.ɵɵdefineInjectable({ token: SwUpdate, factory: SwUpdate.ɵfac });
    return SwUpdate;
})();
export { SwUpdate };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUV2QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUE2QyxNQUFNLGFBQWEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQVU5Rzs7Ozs7OztJQUFBLE1BQ2EsUUFBUTs7OztRQW1CbkIsWUFBb0IsRUFBbUI7WUFBbkIsT0FBRSxHQUFGLEVBQUUsQ0FBaUI7WUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBdUIsa0JBQWtCLENBQUMsQ0FBQztZQUNoRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUF1QixrQkFBa0IsQ0FBQyxDQUFDO1FBQ2xGLENBQUM7Ozs7OztRQVpELElBQUksU0FBUztZQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFDM0IsQ0FBQzs7OztRQVlELGNBQWM7WUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7O2tCQUNLLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRTtZQUMzQyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUUsRUFBQyxXQUFXLEVBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUN4RixDQUFDOzs7O1FBRUQsY0FBYztZQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtnQkFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQzthQUN4RDs7a0JBQ0ssV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFO1lBQzNDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRSxFQUFDLFdBQVcsRUFBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7OztnQkE1Q0YsVUFBVTs7OztnQkFWbUIsZUFBZTs7dUZBV2hDLFFBQVE7dUVBQVIsUUFBUSxXQUFSLFFBQVE7bUJBdEJyQjtLQWtFQztTQTVDWSxRQUFRO2tEQUFSLFFBQVE7Y0FEcEIsVUFBVTs7Ozs7OztJQUtULDZCQUFxRDs7Ozs7SUFLckQsNkJBQXFEOzs7OztJQVV6QyxzQkFBMkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05FVkVSLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsLCBVcGRhdGVBY3RpdmF0ZWRFdmVudCwgVXBkYXRlQXZhaWxhYmxlRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuXG5cbi8qKlxuICogU3Vic2NyaWJlIHRvIHVwZGF0ZSBub3RpZmljYXRpb25zIGZyb20gdGhlIFNlcnZpY2UgV29ya2VyLCB0cmlnZ2VyIHVwZGF0ZVxuICogY2hlY2tzLCBhbmQgZm9yY2libHkgYWN0aXZhdGUgdXBkYXRlcy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTd1VwZGF0ZSB7XG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVXBkYXRlQXZhaWxhYmxlRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IGFwcCB2ZXJzaW9uIGlzIGF2YWlsYWJsZS5cbiAgICovXG4gIHJlYWRvbmx5IGF2YWlsYWJsZTogT2JzZXJ2YWJsZTxVcGRhdGVBdmFpbGFibGVFdmVudD47XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGBVcGRhdGVBY3RpdmF0ZWRFdmVudGAgZXZlbnQgd2hlbmV2ZXIgdGhlIGFwcCBoYXMgYmVlbiB1cGRhdGVkIHRvIGEgbmV3IHZlcnNpb24uXG4gICAqL1xuICByZWFkb25seSBhY3RpdmF0ZWQ6IE9ic2VydmFibGU8VXBkYXRlQWN0aXZhdGVkRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN3LmlzRW5hYmxlZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3c6IE5nc3dDb21tQ2hhbm5lbCkge1xuICAgIGlmICghc3cuaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLmF2YWlsYWJsZSA9IE5FVkVSO1xuICAgICAgdGhpcy5hY3RpdmF0ZWQgPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5hdmFpbGFibGUgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxVcGRhdGVBdmFpbGFibGVFdmVudD4oJ1VQREFURV9BVkFJTEFCTEUnKTtcbiAgICB0aGlzLmFjdGl2YXRlZCA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFVwZGF0ZUFjdGl2YXRlZEV2ZW50PignVVBEQVRFX0FDVElWQVRFRCcpO1xuICB9XG5cbiAgY2hlY2tGb3JVcGRhdGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBzdGF0dXNOb25jZSA9IHRoaXMuc3cuZ2VuZXJhdGVOb25jZSgpO1xuICAgIHJldHVybiB0aGlzLnN3LnBvc3RNZXNzYWdlV2l0aFN0YXR1cygnQ0hFQ0tfRk9SX1VQREFURVMnLCB7c3RhdHVzTm9uY2V9LCBzdGF0dXNOb25jZSk7XG4gIH1cblxuICBhY3RpdmF0ZVVwZGF0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IHN0YXR1c05vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoU3RhdHVzKCdBQ1RJVkFURV9VUERBVEUnLCB7c3RhdHVzTm9uY2V9LCBzdGF0dXNOb25jZSk7XG4gIH1cbn1cbiJdfQ==