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
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    get isEnabled() {
        return this.sw.isEnabled;
    }
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
SwUpdate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-next.0+sha-d887d69", ngImport: i0, type: SwUpdate, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable });
SwUpdate.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.0-next.0+sha-d887d69", ngImport: i0, type: SwUpdate });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-next.0+sha-d887d69", ngImport: i0, type: SwUpdate, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgswCommChannel }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDdkMsT0FBTyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUF1RyxNQUFNLGFBQWEsQ0FBQzs7O0FBSXhLOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sUUFBUTtJQXdDbkI7OztPQUdHO0lBQ0gsSUFBSSxTQUFTO1FBQ1gsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQztJQUMzQixDQUFDO0lBRUQsWUFBb0IsRUFBbUI7UUFBbkIsT0FBRSxHQUFGLEVBQUUsQ0FBaUI7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDM0IsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBZTtZQUN2RCxrQkFBa0I7WUFDbEIsNkJBQTZCO1lBQzdCLGVBQWU7WUFDZix5QkFBeUI7U0FDMUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FDckMsTUFBTSxDQUFDLENBQUMsR0FBaUIsRUFBNEIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLEVBQ3JGLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDTixJQUFJLEVBQUUsa0JBQWtCO1lBQ3hCLE9BQU8sRUFBRSxHQUFHLENBQUMsY0FBYztZQUMzQixTQUFTLEVBQUUsR0FBRyxDQUFDLGFBQWE7U0FDN0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQXVCLGtCQUFrQixDQUFDLENBQUM7UUFDaEYsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBMEIscUJBQXFCLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxtQkFBbUIsRUFBRSxFQUFDLEtBQUssRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1Qkc7SUFDSCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxpQkFBaUIsRUFBRSxFQUFDLEtBQUssRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdFLENBQUM7O2dIQXhIVSxRQUFRO29IQUFSLFFBQVE7c0dBQVIsUUFBUTtrQkFEcEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtORVZFUiwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7RVJSX1NXX05PVF9TVVBQT1JURUQsIE5nc3dDb21tQ2hhbm5lbCwgVW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQsIFVwZGF0ZUFjdGl2YXRlZEV2ZW50LCBVcGRhdGVBdmFpbGFibGVFdmVudCwgVmVyc2lvbkV2ZW50LCBWZXJzaW9uUmVhZHlFdmVudH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuXG5cblxuLyoqXG4gKiBTdWJzY3JpYmUgdG8gdXBkYXRlIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgU2VydmljZSBXb3JrZXIsIHRyaWdnZXIgdXBkYXRlXG4gKiBjaGVja3MsIGFuZCBmb3JjaWJseSBhY3RpdmF0ZSB1cGRhdGVzLlxuICpcbiAqIEBzZWUge0BsaW5rIGd1aWRlL3NlcnZpY2Utd29ya2VyLWNvbW11bmljYXRpb25zIFNlcnZpY2Ugd29ya2VyIGNvbW11bmljYXRpb24gZ3VpZGV9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dVcGRhdGUge1xuICAvKipcbiAgICogRW1pdHMgYSBgVmVyc2lvbkRldGVjdGVkRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaXMgZGV0ZWN0ZWQgb24gdGhlIHNlcnZlci5cbiAgICpcbiAgICogRW1pdHMgYSBgVmVyc2lvbkluc3RhbGxhdGlvbkZhaWxlZEV2ZW50YCBldmVudCB3aGVuZXZlciBjaGVja2luZyBmb3Igb3IgZG93bmxvYWRpbmcgYSBuZXdcbiAgICogdmVyc2lvbiBmYWlscy5cbiAgICpcbiAgICogRW1pdHMgYSBgVmVyc2lvblJlYWR5RXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaGFzIGJlZW4gZG93bmxvYWRlZCBhbmQgaXMgcmVhZHkgZm9yXG4gICAqIGFjdGl2YXRpb24uXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uVXBkYXRlczogT2JzZXJ2YWJsZTxWZXJzaW9uRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVXBkYXRlQXZhaWxhYmxlRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IGFwcCB2ZXJzaW9uIGlzIGF2YWlsYWJsZS5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHtAbGluayB2ZXJzaW9uVXBkYXRlc30gaW5zdGVhZC5cbiAgICpcbiAgICogVGhlIGJlaGF2aW9yIG9mIGBhdmFpbGFibGVgIGNhbiBiZSByZXBsaWNhdGVkIGJ5IHVzaW5nIGB2ZXJzaW9uVXBkYXRlc2AgYnkgZmlsdGVyaW5nIGZvciB0aGVcbiAgICogYFZlcnNpb25SZWFkeUV2ZW50YDpcbiAgICpcbiAgICoge0BleGFtcGxlIHNlcnZpY2Utd29ya2VyLWdldHRpbmctc3RhcnRlZC9zcmMvYXBwL3Byb21wdC11cGRhdGUuc2VydmljZS50c1xuICAgKiByZWdpb249J3N3LXJlcGxpY2F0ZS1hdmFpbGFibGUnfVxuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmxlOiBPYnNlcnZhYmxlPFVwZGF0ZUF2YWlsYWJsZUV2ZW50PjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gYFVwZGF0ZUFjdGl2YXRlZEV2ZW50YCBldmVudCB3aGVuZXZlciB0aGUgYXBwIGhhcyBiZWVuIHVwZGF0ZWQgdG8gYSBuZXcgdmVyc2lvbi5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSByZXR1cm4gdmFsdWUgb2Yge0BsaW5rIFN3VXBkYXRlI2FjdGl2YXRlVXBkYXRlfSBpbnN0ZWFkLlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aXZhdGVkOiBPYnNlcnZhYmxlPFVwZGF0ZUFjdGl2YXRlZEV2ZW50PjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gYFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50YCBldmVudCB3aGVuZXZlciB0aGUgdmVyc2lvbiBvZiB0aGUgYXBwIHVzZWQgYnkgdGhlIHNlcnZpY2VcbiAgICogd29ya2VyIHRvIHNlcnZlIHRoaXMgY2xpZW50IGlzIGluIGEgYnJva2VuIHN0YXRlIHRoYXQgY2Fubm90IGJlIHJlY292ZXJlZCBmcm9tIHdpdGhvdXQgYSBmdWxsXG4gICAqIHBhZ2UgcmVsb2FkLlxuICAgKi9cbiAgcmVhZG9ubHkgdW5yZWNvdmVyYWJsZTogT2JzZXJ2YWJsZTxVbnJlY292ZXJhYmxlU3RhdGVFdmVudD47XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIFNlcnZpY2UgV29ya2VyIGlzIGVuYWJsZWQgKHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBhbmQgZW5hYmxlZCB2aWFcbiAgICogYFNlcnZpY2VXb3JrZXJNb2R1bGVgKS5cbiAgICovXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3cuaXNFbmFibGVkO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdzogTmdzd0NvbW1DaGFubmVsKSB7XG4gICAgaWYgKCFzdy5pc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMudmVyc2lvblVwZGF0ZXMgPSBORVZFUjtcbiAgICAgIHRoaXMuYXZhaWxhYmxlID0gTkVWRVI7XG4gICAgICB0aGlzLmFjdGl2YXRlZCA9IE5FVkVSO1xuICAgICAgdGhpcy51bnJlY292ZXJhYmxlID0gTkVWRVI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudmVyc2lvblVwZGF0ZXMgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxWZXJzaW9uRXZlbnQ+KFtcbiAgICAgICdWRVJTSU9OX0RFVEVDVEVEJyxcbiAgICAgICdWRVJTSU9OX0lOU1RBTExBVElPTl9GQUlMRUQnLFxuICAgICAgJ1ZFUlNJT05fUkVBRFknLFxuICAgICAgJ05PX05FV19WRVJTSU9OX0RFVEVDVEVEJyxcbiAgICBdKTtcbiAgICB0aGlzLmF2YWlsYWJsZSA9IHRoaXMudmVyc2lvblVwZGF0ZXMucGlwZShcbiAgICAgICAgZmlsdGVyKChldnQ6IFZlcnNpb25FdmVudCk6IGV2dCBpcyBWZXJzaW9uUmVhZHlFdmVudCA9PiBldnQudHlwZSA9PT0gJ1ZFUlNJT05fUkVBRFknKSxcbiAgICAgICAgbWFwKGV2dCA9PiAoe1xuICAgICAgICAgICAgICB0eXBlOiAnVVBEQVRFX0FWQUlMQUJMRScsXG4gICAgICAgICAgICAgIGN1cnJlbnQ6IGV2dC5jdXJyZW50VmVyc2lvbixcbiAgICAgICAgICAgICAgYXZhaWxhYmxlOiBldnQubGF0ZXN0VmVyc2lvbixcbiAgICAgICAgICAgIH0pKSk7XG4gICAgdGhpcy5hY3RpdmF0ZWQgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxVcGRhdGVBY3RpdmF0ZWRFdmVudD4oJ1VQREFURV9BQ1RJVkFURUQnKTtcbiAgICB0aGlzLnVucmVjb3ZlcmFibGUgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxVbnJlY292ZXJhYmxlU3RhdGVFdmVudD4oJ1VOUkVDT1ZFUkFCTEVfU1RBVEUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIGFuIHVwZGF0ZSBhbmQgd2FpdHMgdW50aWwgdGhlIG5ldyB2ZXJzaW9uIGlzIGRvd25sb2FkZWQgZnJvbSB0aGUgc2VydmVyIGFuZCByZWFkeVxuICAgKiBmb3IgYWN0aXZhdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogLSByZXNvbHZlcyB0byBgdHJ1ZWAgaWYgYSBuZXcgdmVyc2lvbiB3YXMgZm91bmQgYW5kIGlzIHJlYWR5IHRvIGJlIGFjdGl2YXRlZC5cbiAgICogLSByZXNvbHZlcyB0byBgZmFsc2VgIGlmIG5vIG5ldyB2ZXJzaW9uIHdhcyBmb3VuZFxuICAgKiAtIHJlamVjdHMgaWYgYW55IGVycm9yIG9jY3Vyc1xuICAgKi9cbiAgY2hlY2tGb3JVcGRhdGUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBub25jZSA9IHRoaXMuc3cuZ2VuZXJhdGVOb25jZSgpO1xuICAgIHJldHVybiB0aGlzLnN3LnBvc3RNZXNzYWdlV2l0aE9wZXJhdGlvbignQ0hFQ0tfRk9SX1VQREFURVMnLCB7bm9uY2V9LCBub25jZSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY3VycmVudCBjbGllbnQgKGkuZS4gYnJvd3NlciB0YWIpIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiB0aGF0IGlzIHJlYWR5IGZvclxuICAgKiBhY3RpdmF0aW9uLlxuICAgKlxuICAgKiBJbiBtb3N0IGNhc2VzLCB5b3Ugc2hvdWxkIG5vdCB1c2UgdGhpcyBtZXRob2QgYW5kIGluc3RlYWQgc2hvdWxkIHVwZGF0ZSBhIGNsaWVudCBieSByZWxvYWRpbmdcbiAgICogdGhlIHBhZ2UuXG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJhbGVydCBpcy1pbXBvcnRhbnRcIj5cbiAgICpcbiAgICogVXBkYXRpbmcgYSBjbGllbnQgd2l0aG91dCByZWxvYWRpbmcgY2FuIGVhc2lseSByZXN1bHQgaW4gYSBicm9rZW4gYXBwbGljYXRpb24gZHVlIHRvIGEgdmVyc2lvblxuICAgKiBtaXNtYXRjaCBiZXR3ZWVuIHRoZSBbYXBwbGljYXRpb24gc2hlbGxdKGd1aWRlL2dsb3NzYXJ5I2FwcC1zaGVsbCkgYW5kIG90aGVyIHBhZ2UgcmVzb3VyY2VzLFxuICAgKiBzdWNoIGFzIFtsYXp5LWxvYWRlZCBjaHVua3NdKGd1aWRlL2dsb3NzYXJ5I2xhenktbG9hZGluZyksIHdob3NlIGZpbGVuYW1lcyBtYXkgY2hhbmdlIGJldHdlZW5cbiAgICogdmVyc2lvbnMuXG4gICAqXG4gICAqIE9ubHkgdXNlIHRoaXMgbWV0aG9kLCBpZiB5b3UgYXJlIGNlcnRhaW4gaXQgaXMgc2FmZSBmb3IgeW91ciBzcGVjaWZpYyB1c2UgY2FzZS5cbiAgICpcbiAgICogPC9kaXY+XG4gICAqXG4gICAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqICAtIHJlc29sdmVzIHRvIGB0cnVlYCBpZiBhbiB1cGRhdGUgd2FzIGFjdGl2YXRlZCBzdWNjZXNzZnVsbHlcbiAgICogIC0gcmVzb2x2ZXMgdG8gYGZhbHNlYCBpZiBubyB1cGRhdGUgd2FzIGF2YWlsYWJsZSAoZm9yIGV4YW1wbGUsIHRoZSBjbGllbnQgd2FzIGFscmVhZHkgb24gdGhlXG4gICAqICAgIGxhdGVzdCB2ZXJzaW9uKS5cbiAgICogIC0gcmVqZWN0cyBpZiBhbnkgZXJyb3Igb2NjdXJzXG4gICAqL1xuICBhY3RpdmF0ZVVwZGF0ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IG5vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoT3BlcmF0aW9uKCdBQ1RJVkFURV9VUERBVEUnLCB7bm9uY2V9LCBub25jZSk7XG4gIH1cbn1cbiJdfQ==