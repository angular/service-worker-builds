/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { NEVER } from 'rxjs';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @publicApi
 */
var SwUpdate = /** @class */ (function () {
    function SwUpdate(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.available = NEVER;
            this.activated = NEVER;
            return;
        }
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
    }
    Object.defineProperty(SwUpdate.prototype, "isEnabled", {
        /**
         * True if the Service Worker is enabled (supported by the browser and enabled via
         * `ServiceWorkerModule`).
         */
        get: function () {
            return this.sw.isEnabled;
        },
        enumerable: true,
        configurable: true
    });
    SwUpdate.prototype.checkForUpdate = function () {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce: statusNonce }, statusNonce);
    };
    SwUpdate.prototype.activateUpdate = function () {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce: statusNonce }, statusNonce);
    };
    SwUpdate = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [NgswCommChannel])
    ], SwUpdate);
    return SwUpdate;
}());
export { SwUpdate };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsS0FBSyxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBRXZDLE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxlQUFlLEVBQTZDLE1BQU0sYUFBYSxDQUFDO0FBSTlHOzs7OztHQUtHO0FBRUg7SUFtQkUsa0JBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBQ3JDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQXVCLGtCQUFrQixDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBdUIsa0JBQWtCLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBWkQsc0JBQUksK0JBQVM7UUFKYjs7O1dBR0c7YUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFDM0IsQ0FBQzs7O09BQUE7SUFZRCxpQ0FBYyxHQUFkO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzVDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRSxFQUFDLFdBQVcsYUFBQSxFQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVELGlDQUFjLEdBQWQ7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDNUMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHFCQUFxQixDQUFDLGlCQUFpQixFQUFFLEVBQUMsV0FBVyxhQUFBLEVBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBM0NVLFFBQVE7UUFEcEIsVUFBVSxFQUFFO3lDQW9CYSxlQUFlO09BbkI1QixRQUFRLENBNENwQjtJQUFELGVBQUM7Q0FBQSxBQTVDRCxJQTRDQztTQTVDWSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtORVZFUiwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7RVJSX1NXX05PVF9TVVBQT1JURUQsIE5nc3dDb21tQ2hhbm5lbCwgVXBkYXRlQWN0aXZhdGVkRXZlbnQsIFVwZGF0ZUF2YWlsYWJsZUV2ZW50fSBmcm9tICcuL2xvd19sZXZlbCc7XG5cblxuXG4vKipcbiAqIFN1YnNjcmliZSB0byB1cGRhdGUgbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBTZXJ2aWNlIFdvcmtlciwgdHJpZ2dlciB1cGRhdGVcbiAqIGNoZWNrcywgYW5kIGZvcmNpYmx5IGFjdGl2YXRlIHVwZGF0ZXMuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dVcGRhdGUge1xuICAvKipcbiAgICogRW1pdHMgYW4gYFVwZGF0ZUF2YWlsYWJsZUV2ZW50YCBldmVudCB3aGVuZXZlciBhIG5ldyBhcHAgdmVyc2lvbiBpcyBhdmFpbGFibGUuXG4gICAqL1xuICByZWFkb25seSBhdmFpbGFibGU6IE9ic2VydmFibGU8VXBkYXRlQXZhaWxhYmxlRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVXBkYXRlQWN0aXZhdGVkRXZlbnRgIGV2ZW50IHdoZW5ldmVyIHRoZSBhcHAgaGFzIGJlZW4gdXBkYXRlZCB0byBhIG5ldyB2ZXJzaW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aXZhdGVkOiBPYnNlcnZhYmxlPFVwZGF0ZUFjdGl2YXRlZEV2ZW50PjtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgU2VydmljZSBXb3JrZXIgaXMgZW5hYmxlZCAoc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIGFuZCBlbmFibGVkIHZpYVxuICAgKiBgU2VydmljZVdvcmtlck1vZHVsZWApLlxuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdy5pc0VuYWJsZWQ7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN3OiBOZ3N3Q29tbUNoYW5uZWwpIHtcbiAgICBpZiAoIXN3LmlzRW5hYmxlZCkge1xuICAgICAgdGhpcy5hdmFpbGFibGUgPSBORVZFUjtcbiAgICAgIHRoaXMuYWN0aXZhdGVkID0gTkVWRVI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuYXZhaWxhYmxlID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VXBkYXRlQXZhaWxhYmxlRXZlbnQ+KCdVUERBVEVfQVZBSUxBQkxFJyk7XG4gICAgdGhpcy5hY3RpdmF0ZWQgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxVcGRhdGVBY3RpdmF0ZWRFdmVudD4oJ1VQREFURV9BQ1RJVkFURUQnKTtcbiAgfVxuXG4gIGNoZWNrRm9yVXBkYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgc3RhdHVzTm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhTdGF0dXMoJ0NIRUNLX0ZPUl9VUERBVEVTJywge3N0YXR1c05vbmNlfSwgc3RhdHVzTm9uY2UpO1xuICB9XG5cbiAgYWN0aXZhdGVVcGRhdGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBzdGF0dXNOb25jZSA9IHRoaXMuc3cuZ2VuZXJhdGVOb25jZSgpO1xuICAgIHJldHVybiB0aGlzLnN3LnBvc3RNZXNzYWdlV2l0aFN0YXR1cygnQUNUSVZBVEVfVVBEQVRFJywge3N0YXR1c05vbmNlfSwgc3RhdHVzTm9uY2UpO1xuICB9XG59XG4iXX0=