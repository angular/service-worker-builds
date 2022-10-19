/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { NEVER } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
            this.versionUpdates = NEVER;
            this.available = NEVER;
            this.activated = NEVER;
            this.unrecoverable = NEVER;
            return;
        }
        this.versionUpdates = this.sw.eventsOfType([
            'VERSION_DETECTED',
            'VERSION_INSTALLATION_FAILED',
            'VERSION_READY',
            'NO_NEW_VERSION_DETECTED',
        ]);
        this.available = this.versionUpdates.pipe(filter((evt) => evt.type === 'VERSION_READY'), map(evt => ({
            type: 'UPDATE_AVAILABLE',
            current: evt.currentVersion,
            available: evt.latestVersion,
        })));
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
    /**
     * Checks for an update and waits until the new version is downloaded from the server and ready
     * for activation.
     *
     * @returns a promise that
     * - resolves to `true` if a new version was found and is ready to be activated.
     * - resolves to `false` if no new version was found
     * - rejects if any error occurs
     */
    checkForUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const nonce = this.sw.generateNonce();
        return this.sw.postMessageWithOperation('CHECK_FOR_UPDATES', { nonce }, nonce);
    }
    /**
     * Updates the current client (i.e. browser tab) to the latest version that is ready for
     * activation.
     *
     * In most cases, you should not use this method and instead should update a client by reloading
     * the page.
     *
     * <div class="alert is-important">
     *
     * Updating a client without reloading can easily result in a broken application due to a version
     * mismatch between the [application shell](guide/glossary#app-shell) and other page resources,
     * such as [lazy-loaded chunks](guide/glossary#lazy-loading), whose filenames may change between
     * versions.
     *
     * Only use this method, if you are certain it is safe for your specific use case.
     *
     * </div>
     *
     * @returns a promise that
     *  - resolves to `true` if an update was activated successfully
     *  - resolves to `false` if no update was available (for example, the client was already on the
     *    latest version).
     *  - rejects if any error occurs
     */
    activateUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const nonce = this.sw.generateNonce();
        return this.sw.postMessageWithOperation('ACTIVATE_UPDATE', { nonce }, nonce);
    }
}
SwUpdate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-b136e9e", ngImport: i0, type: SwUpdate, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable });
SwUpdate.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-b136e9e", ngImport: i0, type: SwUpdate });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0-next.0+sha-b136e9e", ngImport: i0, type: SwUpdate, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgswCommChannel }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDdkMsT0FBTyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUF1RyxNQUFNLGFBQWEsQ0FBQzs7O0FBSXhLOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sUUFBUTtJQWdEbkIsWUFBb0IsRUFBbUI7UUFBbkIsT0FBRSxHQUFGLEVBQUUsQ0FBaUI7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDM0IsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBZTtZQUN2RCxrQkFBa0I7WUFDbEIsNkJBQTZCO1lBQzdCLGVBQWU7WUFDZix5QkFBeUI7U0FDMUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FDckMsTUFBTSxDQUFDLENBQUMsR0FBaUIsRUFBNEIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLEVBQ3JGLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDTixJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLE9BQU8sRUFBRSxHQUFHLENBQUMsY0FBYztZQUMzQixTQUFTLEVBQUUsR0FBRyxDQUFDLGFBQWE7U0FDN0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQXVCLGtCQUFrQixDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBMEIscUJBQXFCLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBL0JEOzs7T0FHRztJQUNILElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7SUFDM0IsQ0FBQztJQTJCRDs7Ozs7Ozs7T0FRRztJQUNILGNBQWM7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN4RDtRQUNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLG1CQUFtQixFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXVCRztJQUNILGNBQWM7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN4RDtRQUNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLGlCQUFpQixFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0UsQ0FBQzs7Z0hBeEhVLFFBQVE7b0hBQVIsUUFBUTtzR0FBUixRQUFRO2tCQURwQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05FVkVSLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsLCBVbnJlY292ZXJhYmxlU3RhdGVFdmVudCwgVXBkYXRlQWN0aXZhdGVkRXZlbnQsIFVwZGF0ZUF2YWlsYWJsZUV2ZW50LCBWZXJzaW9uRXZlbnQsIFZlcnNpb25SZWFkeUV2ZW50fSBmcm9tICcuL2xvd19sZXZlbCc7XG5cblxuXG4vKipcbiAqIFN1YnNjcmliZSB0byB1cGRhdGUgbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBTZXJ2aWNlIFdvcmtlciwgdHJpZ2dlciB1cGRhdGVcbiAqIGNoZWNrcywgYW5kIGZvcmNpYmx5IGFjdGl2YXRlIHVwZGF0ZXMuXG4gKlxuICogQHNlZSB7QGxpbmsgZ3VpZGUvc2VydmljZS13b3JrZXItY29tbXVuaWNhdGlvbnMgU2VydmljZSB3b3JrZXIgY29tbXVuaWNhdGlvbiBndWlkZX1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTd1VwZGF0ZSB7XG4gIC8qKlxuICAgKiBFbWl0cyBhIGBWZXJzaW9uRGV0ZWN0ZWRFdmVudGAgZXZlbnQgd2hlbmV2ZXIgYSBuZXcgdmVyc2lvbiBpcyBkZXRlY3RlZCBvbiB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBFbWl0cyBhIGBWZXJzaW9uSW5zdGFsbGF0aW9uRmFpbGVkRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGNoZWNraW5nIGZvciBvciBkb3dubG9hZGluZyBhIG5ld1xuICAgKiB2ZXJzaW9uIGZhaWxzLlxuICAgKlxuICAgKiBFbWl0cyBhIGBWZXJzaW9uUmVhZHlFdmVudGAgZXZlbnQgd2hlbmV2ZXIgYSBuZXcgdmVyc2lvbiBoYXMgYmVlbiBkb3dubG9hZGVkIGFuZCBpcyByZWFkeSBmb3JcbiAgICogYWN0aXZhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25VcGRhdGVzOiBPYnNlcnZhYmxlPFZlcnNpb25FdmVudD47XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGBVcGRhdGVBdmFpbGFibGVFdmVudGAgZXZlbnQgd2hlbmV2ZXIgYSBuZXcgYXBwIHZlcnNpb24gaXMgYXZhaWxhYmxlLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIHZlcnNpb25VcGRhdGVzfSBpbnN0ZWFkLlxuICAgKlxuICAgKiBUaGUgYmVoYXZpb3Igb2YgYGF2YWlsYWJsZWAgY2FuIGJlIHJlcGxpY2F0ZWQgYnkgdXNpbmcgYHZlcnNpb25VcGRhdGVzYCBieSBmaWx0ZXJpbmcgZm9yIHRoZVxuICAgKiBgVmVyc2lvblJlYWR5RXZlbnRgOlxuICAgKlxuICAgKiB7QGV4YW1wbGUgc2VydmljZS13b3JrZXItZ2V0dGluZy1zdGFydGVkL3NyYy9hcHAvcHJvbXB0LXVwZGF0ZS5zZXJ2aWNlLnRzXG4gICAqIHJlZ2lvbj0nc3ctcmVwbGljYXRlLWF2YWlsYWJsZSd9XG4gICAqL1xuICByZWFkb25seSBhdmFpbGFibGU6IE9ic2VydmFibGU8VXBkYXRlQXZhaWxhYmxlRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVXBkYXRlQWN0aXZhdGVkRXZlbnRgIGV2ZW50IHdoZW5ldmVyIHRoZSBhcHAgaGFzIGJlZW4gdXBkYXRlZCB0byBhIG5ldyB2ZXJzaW9uLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIHJldHVybiB2YWx1ZSBvZiB7QGxpbmsgU3dVcGRhdGUjYWN0aXZhdGVVcGRhdGV9IGluc3RlYWQuXG4gICAqXG4gICAqL1xuICByZWFkb25seSBhY3RpdmF0ZWQ6IE9ic2VydmFibGU8VXBkYXRlQWN0aXZhdGVkRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVW5yZWNvdmVyYWJsZVN0YXRlRXZlbnRgIGV2ZW50IHdoZW5ldmVyIHRoZSB2ZXJzaW9uIG9mIHRoZSBhcHAgdXNlZCBieSB0aGUgc2VydmljZVxuICAgKiB3b3JrZXIgdG8gc2VydmUgdGhpcyBjbGllbnQgaXMgaW4gYSBicm9rZW4gc3RhdGUgdGhhdCBjYW5ub3QgYmUgcmVjb3ZlcmVkIGZyb20gd2l0aG91dCBhIGZ1bGxcbiAgICogcGFnZSByZWxvYWQuXG4gICAqL1xuICByZWFkb25seSB1bnJlY292ZXJhYmxlOiBPYnNlcnZhYmxlPFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50PjtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgU2VydmljZSBXb3JrZXIgaXMgZW5hYmxlZCAoc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIGFuZCBlbmFibGVkIHZpYVxuICAgKiBgU2VydmljZVdvcmtlck1vZHVsZWApLlxuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdy5pc0VuYWJsZWQ7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN3OiBOZ3N3Q29tbUNoYW5uZWwpIHtcbiAgICBpZiAoIXN3LmlzRW5hYmxlZCkge1xuICAgICAgdGhpcy52ZXJzaW9uVXBkYXRlcyA9IE5FVkVSO1xuICAgICAgdGhpcy5hdmFpbGFibGUgPSBORVZFUjtcbiAgICAgIHRoaXMuYWN0aXZhdGVkID0gTkVWRVI7XG4gICAgICB0aGlzLnVucmVjb3ZlcmFibGUgPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy52ZXJzaW9uVXBkYXRlcyA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFZlcnNpb25FdmVudD4oW1xuICAgICAgJ1ZFUlNJT05fREVURUNURUQnLFxuICAgICAgJ1ZFUlNJT05fSU5TVEFMTEFUSU9OX0ZBSUxFRCcsXG4gICAgICAnVkVSU0lPTl9SRUFEWScsXG4gICAgICAnTk9fTkVXX1ZFUlNJT05fREVURUNURUQnLFxuICAgIF0pO1xuICAgIHRoaXMuYXZhaWxhYmxlID0gdGhpcy52ZXJzaW9uVXBkYXRlcy5waXBlKFxuICAgICAgICBmaWx0ZXIoKGV2dDogVmVyc2lvbkV2ZW50KTogZXZ0IGlzIFZlcnNpb25SZWFkeUV2ZW50ID0+IGV2dC50eXBlID09PSAnVkVSU0lPTl9SRUFEWScpLFxuICAgICAgICBtYXAoZXZ0ID0+ICh7XG4gICAgICAgICAgICAgIHR5cGU6ICdVUERBVEVfQVZBSUxBQkxFJyxcbiAgICAgICAgICAgICAgY3VycmVudDogZXZ0LmN1cnJlbnRWZXJzaW9uLFxuICAgICAgICAgICAgICBhdmFpbGFibGU6IGV2dC5sYXRlc3RWZXJzaW9uLFxuICAgICAgICAgICAgfSkpKTtcbiAgICB0aGlzLmFjdGl2YXRlZCA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFVwZGF0ZUFjdGl2YXRlZEV2ZW50PignVVBEQVRFX0FDVElWQVRFRCcpO1xuICAgIHRoaXMudW5yZWNvdmVyYWJsZSA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50PignVU5SRUNPVkVSQUJMRV9TVEFURScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBmb3IgYW4gdXBkYXRlIGFuZCB3YWl0cyB1bnRpbCB0aGUgbmV3IHZlcnNpb24gaXMgZG93bmxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHJlYWR5XG4gICAqIGZvciBhY3RpdmF0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICAgKiAtIHJlc29sdmVzIHRvIGB0cnVlYCBpZiBhIG5ldyB2ZXJzaW9uIHdhcyBmb3VuZCBhbmQgaXMgcmVhZHkgdG8gYmUgYWN0aXZhdGVkLlxuICAgKiAtIHJlc29sdmVzIHRvIGBmYWxzZWAgaWYgbm8gbmV3IHZlcnNpb24gd2FzIGZvdW5kXG4gICAqIC0gcmVqZWN0cyBpZiBhbnkgZXJyb3Igb2NjdXJzXG4gICAqL1xuICBjaGVja0ZvclVwZGF0ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IG5vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoT3BlcmF0aW9uKCdDSEVDS19GT1JfVVBEQVRFUycsIHtub25jZX0sIG5vbmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjdXJyZW50IGNsaWVudCAoaS5lLiBicm93c2VyIHRhYikgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIHRoYXQgaXMgcmVhZHkgZm9yXG4gICAqIGFjdGl2YXRpb24uXG4gICAqXG4gICAqIEluIG1vc3QgY2FzZXMsIHlvdSBzaG91bGQgbm90IHVzZSB0aGlzIG1ldGhvZCBhbmQgaW5zdGVhZCBzaG91bGQgdXBkYXRlIGEgY2xpZW50IGJ5IHJlbG9hZGluZ1xuICAgKiB0aGUgcGFnZS5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cImFsZXJ0IGlzLWltcG9ydGFudFwiPlxuICAgKlxuICAgKiBVcGRhdGluZyBhIGNsaWVudCB3aXRob3V0IHJlbG9hZGluZyBjYW4gZWFzaWx5IHJlc3VsdCBpbiBhIGJyb2tlbiBhcHBsaWNhdGlvbiBkdWUgdG8gYSB2ZXJzaW9uXG4gICAqIG1pc21hdGNoIGJldHdlZW4gdGhlIFthcHBsaWNhdGlvbiBzaGVsbF0oZ3VpZGUvZ2xvc3NhcnkjYXBwLXNoZWxsKSBhbmQgb3RoZXIgcGFnZSByZXNvdXJjZXMsXG4gICAqIHN1Y2ggYXMgW2xhenktbG9hZGVkIGNodW5rc10oZ3VpZGUvZ2xvc3NhcnkjbGF6eS1sb2FkaW5nKSwgd2hvc2UgZmlsZW5hbWVzIG1heSBjaGFuZ2UgYmV0d2VlblxuICAgKiB2ZXJzaW9ucy5cbiAgICpcbiAgICogT25seSB1c2UgdGhpcyBtZXRob2QsIGlmIHlvdSBhcmUgY2VydGFpbiBpdCBpcyBzYWZlIGZvciB5b3VyIHNwZWNpZmljIHVzZSBjYXNlLlxuICAgKlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogQHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogIC0gcmVzb2x2ZXMgdG8gYHRydWVgIGlmIGFuIHVwZGF0ZSB3YXMgYWN0aXZhdGVkIHN1Y2Nlc3NmdWxseVxuICAgKiAgLSByZXNvbHZlcyB0byBgZmFsc2VgIGlmIG5vIHVwZGF0ZSB3YXMgYXZhaWxhYmxlIChmb3IgZXhhbXBsZSwgdGhlIGNsaWVudCB3YXMgYWxyZWFkeSBvbiB0aGVcbiAgICogICAgbGF0ZXN0IHZlcnNpb24pLlxuICAgKiAgLSByZWplY3RzIGlmIGFueSBlcnJvciBvY2N1cnNcbiAgICovXG4gIGFjdGl2YXRlVXBkYXRlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhPcGVyYXRpb24oJ0FDVElWQVRFX1VQREFURScsIHtub25jZX0sIG5vbmNlKTtcbiAgfVxufVxuIl19