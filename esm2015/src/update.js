import { Injectable } from '@angular/core';
import { NEVER } from 'rxjs';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
import * as i0 from "@angular/core";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
 */
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
SwUpdate.ngInjectableDef = i0.defineInjectable({ token: SwUpdate, factory: function SwUpdate_Factory(t) { return new (t || SwUpdate)(i0.inject(NgswCommChannel)); }, providedIn: null });
/*@__PURE__*/ i0.ɵsetClassMetadata(SwUpdate, [{
        type: Injectable
    }], function () { return [{
        type: NgswCommChannel
    }]; }, null);
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
    /** @type {?} */
    SwUpdate.prototype.sw;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFRQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFFdkMsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGVBQWUsRUFBNkMsTUFBTSxhQUFhLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFXOUcsTUFBTSxPQUFPLFFBQVE7Ozs7SUFpQm5CLFlBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBQ3JDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQXVCLGtCQUFrQixDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBdUIsa0JBQWtCLENBQUMsQ0FBQztJQUNsRixDQUFDOzs7Ozs7SUFWRCxJQUFJLFNBQVMsS0FBYyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7OztJQVl0RCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7O2NBQ0ssV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFO1FBQzNDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRSxFQUFDLFdBQVcsRUFBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7Ozs7SUFFRCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7O2NBQ0ssV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFO1FBQzNDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRSxFQUFDLFdBQVcsRUFBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7OztZQTFDRixVQUFVOzs7O1lBVm1CLGVBQWU7O3dEQVdoQyxRQUFRLDJEQUFSLFFBQVEsWUFpQkssZUFBZTttQ0FqQjVCLFFBQVE7Y0FEcEIsVUFBVTs7Y0FrQmUsZUFBZTs7Ozs7OztJQWJ2Qyw2QkFBcUQ7Ozs7O0lBS3JELDZCQUFxRDs7SUFRekMsc0JBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtORVZFUiwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7RVJSX1NXX05PVF9TVVBQT1JURUQsIE5nc3dDb21tQ2hhbm5lbCwgVXBkYXRlQWN0aXZhdGVkRXZlbnQsIFVwZGF0ZUF2YWlsYWJsZUV2ZW50fSBmcm9tICcuL2xvd19sZXZlbCc7XG5cblxuXG4vKipcbiAqIFN1YnNjcmliZSB0byB1cGRhdGUgbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBTZXJ2aWNlIFdvcmtlciwgdHJpZ2dlciB1cGRhdGVcbiAqIGNoZWNrcywgYW5kIGZvcmNpYmx5IGFjdGl2YXRlIHVwZGF0ZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dVcGRhdGUge1xuICAvKipcbiAgICogRW1pdHMgYW4gYFVwZGF0ZUF2YWlsYWJsZUV2ZW50YCBldmVudCB3aGVuZXZlciBhIG5ldyBhcHAgdmVyc2lvbiBpcyBhdmFpbGFibGUuXG4gICAqL1xuICByZWFkb25seSBhdmFpbGFibGU6IE9ic2VydmFibGU8VXBkYXRlQXZhaWxhYmxlRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVXBkYXRlQWN0aXZhdGVkRXZlbnRgIGV2ZW50IHdoZW5ldmVyIHRoZSBhcHAgaGFzIGJlZW4gdXBkYXRlZCB0byBhIG5ldyB2ZXJzaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aXZhdGVkOiBPYnNlcnZhYmxlPFVwZGF0ZUFjdGl2YXRlZEV2ZW50PjtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgU2VydmljZSBXb3JrZXIgaXMgZW5hYmxlZCAoc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIGFuZCBlbmFibGVkIHZpYVxuICAgKiBgU2VydmljZVdvcmtlck1vZHVsZWApLlxuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3cuaXNFbmFibGVkOyB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdzogTmdzd0NvbW1DaGFubmVsKSB7XG4gICAgaWYgKCFzdy5pc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMuYXZhaWxhYmxlID0gTkVWRVI7XG4gICAgICB0aGlzLmFjdGl2YXRlZCA9IE5FVkVSO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFVwZGF0ZUF2YWlsYWJsZUV2ZW50PignVVBEQVRFX0FWQUlMQUJMRScpO1xuICAgIHRoaXMuYWN0aXZhdGVkID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VXBkYXRlQWN0aXZhdGVkRXZlbnQ+KCdVUERBVEVfQUNUSVZBVEVEJyk7XG4gIH1cblxuICBjaGVja0ZvclVwZGF0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IHN0YXR1c05vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoU3RhdHVzKCdDSEVDS19GT1JfVVBEQVRFUycsIHtzdGF0dXNOb25jZX0sIHN0YXR1c05vbmNlKTtcbiAgfVxuXG4gIGFjdGl2YXRlVXBkYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgc3RhdHVzTm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhTdGF0dXMoJ0FDVElWQVRFX1VQREFURScsIHtzdGF0dXNOb25jZX0sIHN0YXR1c05vbmNlKTtcbiAgfVxufVxuIl19