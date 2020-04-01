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
/** @nocollapse */ SwUpdate.ɵprov = i0.ɵɵdefineInjectable({ token: SwUpdate, factory: SwUpdate.ɵfac });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBYSxNQUFNLE1BQU0sQ0FBQztBQUV2QyxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUE2QyxNQUFNLGFBQWEsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQVc5RyxNQUFNLE9BQU8sUUFBUTs7OztJQWlCbkIsWUFBb0IsRUFBbUI7UUFBbkIsT0FBRSxHQUFGLEVBQUUsQ0FBaUI7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBdUIsa0JBQWtCLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUF1QixrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7Ozs7OztJQVZELElBQUksU0FBUyxLQUFjLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7O0lBWXRELGNBQWM7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN4RDs7Y0FDSyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7UUFDM0MsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLG1CQUFtQixFQUFFLEVBQUMsV0FBVyxFQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDeEYsQ0FBQzs7OztJQUVELGNBQWM7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN4RDs7Y0FDSyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUU7UUFDM0MsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFLEVBQUMsV0FBVyxFQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEYsQ0FBQzs7O1lBMUNGLFVBQVU7Ozs7WUFWbUIsZUFBZTs7bUZBV2hDLFFBQVE7bUVBQVIsUUFBUSxXQUFSLFFBQVE7a0RBQVIsUUFBUTtjQURwQixVQUFVOzs7Ozs7O0lBS1QsNkJBQXFEOzs7OztJQUtyRCw2QkFBcUQ7Ozs7O0lBUXpDLHNCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkVWRVIsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0VSUl9TV19OT1RfU1VQUE9SVEVELCBOZ3N3Q29tbUNoYW5uZWwsIFVwZGF0ZUFjdGl2YXRlZEV2ZW50LCBVcGRhdGVBdmFpbGFibGVFdmVudH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuXG5cblxuLyoqXG4gKiBTdWJzY3JpYmUgdG8gdXBkYXRlIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgU2VydmljZSBXb3JrZXIsIHRyaWdnZXIgdXBkYXRlXG4gKiBjaGVja3MsIGFuZCBmb3JjaWJseSBhY3RpdmF0ZSB1cGRhdGVzLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN3VXBkYXRlIHtcbiAgLyoqXG4gICAqIEVtaXRzIGFuIGBVcGRhdGVBdmFpbGFibGVFdmVudGAgZXZlbnQgd2hlbmV2ZXIgYSBuZXcgYXBwIHZlcnNpb24gaXMgYXZhaWxhYmxlLlxuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmxlOiBPYnNlcnZhYmxlPFVwZGF0ZUF2YWlsYWJsZUV2ZW50PjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gYFVwZGF0ZUFjdGl2YXRlZEV2ZW50YCBldmVudCB3aGVuZXZlciB0aGUgYXBwIGhhcyBiZWVuIHVwZGF0ZWQgdG8gYSBuZXcgdmVyc2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFjdGl2YXRlZDogT2JzZXJ2YWJsZTxVcGRhdGVBY3RpdmF0ZWRFdmVudD47XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIFNlcnZpY2UgV29ya2VyIGlzIGVuYWJsZWQgKHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBhbmQgZW5hYmxlZCB2aWFcbiAgICogYFNlcnZpY2VXb3JrZXJNb2R1bGVgKS5cbiAgICovXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN3LmlzRW5hYmxlZDsgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3c6IE5nc3dDb21tQ2hhbm5lbCkge1xuICAgIGlmICghc3cuaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLmF2YWlsYWJsZSA9IE5FVkVSO1xuICAgICAgdGhpcy5hY3RpdmF0ZWQgPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5hdmFpbGFibGUgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxVcGRhdGVBdmFpbGFibGVFdmVudD4oJ1VQREFURV9BVkFJTEFCTEUnKTtcbiAgICB0aGlzLmFjdGl2YXRlZCA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFVwZGF0ZUFjdGl2YXRlZEV2ZW50PignVVBEQVRFX0FDVElWQVRFRCcpO1xuICB9XG5cbiAgY2hlY2tGb3JVcGRhdGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBzdGF0dXNOb25jZSA9IHRoaXMuc3cuZ2VuZXJhdGVOb25jZSgpO1xuICAgIHJldHVybiB0aGlzLnN3LnBvc3RNZXNzYWdlV2l0aFN0YXR1cygnQ0hFQ0tfRk9SX1VQREFURVMnLCB7c3RhdHVzTm9uY2V9LCBzdGF0dXNOb25jZSk7XG4gIH1cblxuICBhY3RpdmF0ZVVwZGF0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IHN0YXR1c05vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoU3RhdHVzKCdBQ1RJVkFURV9VUERBVEUnLCB7c3RhdHVzTm9uY2V9LCBzdGF0dXNOb25jZSk7XG4gIH1cbn1cbiJdfQ==