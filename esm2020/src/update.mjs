/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { NEVER } from 'rxjs';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
import * as i0 from "@angular/core";
import * as i1 from "./low_level";
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @see {@link guide/service-worker-communications Service worker communication guide}
 *
 * @publicApi
 */
export class SwUpdate {
    constructor(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.available = NEVER;
            this.activated = NEVER;
            this.unrecoverable = NEVER;
            return;
        }
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
        this.unrecoverable = this.sw.eventsOfType('UNRECOVERABLE_STATE');
    }
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    get isEnabled() {
        return this.sw.isEnabled;
    }
    checkForUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce }, statusNonce);
    }
    activateUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce }, statusNonce);
    }
}
SwUpdate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.10+9.sha-a268c44.with-local-changes", ngImport: i0, type: SwUpdate, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable });
SwUpdate.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.0.0-next.10+9.sha-a268c44.with-local-changes", ngImport: i0, type: SwUpdate });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.10+9.sha-a268c44.with-local-changes", ngImport: i0, type: SwUpdate, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgswCommChannel }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFFdkMsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGVBQWUsRUFBc0UsTUFBTSxhQUFhLENBQUM7OztBQUl2STs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLFFBQVE7SUEwQm5CLFlBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBQ3JDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQzNCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQXVCLGtCQUFrQixDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBdUIsa0JBQWtCLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUEwQixxQkFBcUIsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFsQkQ7OztPQUdHO0lBQ0gsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQztJQUMzQixDQUFDO0lBY0QsY0FBYztRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM1QyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUUsRUFBQyxXQUFXLEVBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBRUQsY0FBYztRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM1QyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMscUJBQXFCLENBQUMsaUJBQWlCLEVBQUUsRUFBQyxXQUFXLEVBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN0RixDQUFDOztnSEFwRFUsUUFBUTtvSEFBUixRQUFRO3NHQUFSLFFBQVE7a0JBRHBCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkVWRVIsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0VSUl9TV19OT1RfU1VQUE9SVEVELCBOZ3N3Q29tbUNoYW5uZWwsIFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50LCBVcGRhdGVBY3RpdmF0ZWRFdmVudCwgVXBkYXRlQXZhaWxhYmxlRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuXG5cbi8qKlxuICogU3Vic2NyaWJlIHRvIHVwZGF0ZSBub3RpZmljYXRpb25zIGZyb20gdGhlIFNlcnZpY2UgV29ya2VyLCB0cmlnZ2VyIHVwZGF0ZVxuICogY2hlY2tzLCBhbmQgZm9yY2libHkgYWN0aXZhdGUgdXBkYXRlcy5cbiAqXG4gKiBAc2VlIHtAbGluayBndWlkZS9zZXJ2aWNlLXdvcmtlci1jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN3VXBkYXRlIHtcbiAgLyoqXG4gICAqIEVtaXRzIGFuIGBVcGRhdGVBdmFpbGFibGVFdmVudGAgZXZlbnQgd2hlbmV2ZXIgYSBuZXcgYXBwIHZlcnNpb24gaXMgYXZhaWxhYmxlLlxuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmxlOiBPYnNlcnZhYmxlPFVwZGF0ZUF2YWlsYWJsZUV2ZW50PjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gYFVwZGF0ZUFjdGl2YXRlZEV2ZW50YCBldmVudCB3aGVuZXZlciB0aGUgYXBwIGhhcyBiZWVuIHVwZGF0ZWQgdG8gYSBuZXcgdmVyc2lvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFjdGl2YXRlZDogT2JzZXJ2YWJsZTxVcGRhdGVBY3RpdmF0ZWRFdmVudD47XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGBVbnJlY292ZXJhYmxlU3RhdGVFdmVudGAgZXZlbnQgd2hlbmV2ZXIgdGhlIHZlcnNpb24gb2YgdGhlIGFwcCB1c2VkIGJ5IHRoZSBzZXJ2aWNlXG4gICAqIHdvcmtlciB0byBzZXJ2ZSB0aGlzIGNsaWVudCBpcyBpbiBhIGJyb2tlbiBzdGF0ZSB0aGF0IGNhbm5vdCBiZSByZWNvdmVyZWQgZnJvbSB3aXRob3V0IGEgZnVsbFxuICAgKiBwYWdlIHJlbG9hZC5cbiAgICovXG4gIHJlYWRvbmx5IHVucmVjb3ZlcmFibGU6IE9ic2VydmFibGU8VW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN3LmlzRW5hYmxlZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3c6IE5nc3dDb21tQ2hhbm5lbCkge1xuICAgIGlmICghc3cuaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLmF2YWlsYWJsZSA9IE5FVkVSO1xuICAgICAgdGhpcy5hY3RpdmF0ZWQgPSBORVZFUjtcbiAgICAgIHRoaXMudW5yZWNvdmVyYWJsZSA9IE5FVkVSO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFVwZGF0ZUF2YWlsYWJsZUV2ZW50PignVVBEQVRFX0FWQUlMQUJMRScpO1xuICAgIHRoaXMuYWN0aXZhdGVkID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VXBkYXRlQWN0aXZhdGVkRXZlbnQ+KCdVUERBVEVfQUNUSVZBVEVEJyk7XG4gICAgdGhpcy51bnJlY292ZXJhYmxlID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQ+KCdVTlJFQ09WRVJBQkxFX1NUQVRFJyk7XG4gIH1cblxuICBjaGVja0ZvclVwZGF0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IHN0YXR1c05vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoU3RhdHVzKCdDSEVDS19GT1JfVVBEQVRFUycsIHtzdGF0dXNOb25jZX0sIHN0YXR1c05vbmNlKTtcbiAgfVxuXG4gIGFjdGl2YXRlVXBkYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgc3RhdHVzTm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhTdGF0dXMoJ0FDVElWQVRFX1VQREFURScsIHtzdGF0dXNOb25jZX0sIHN0YXR1c05vbmNlKTtcbiAgfVxufVxuIl19