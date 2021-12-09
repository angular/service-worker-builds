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
        this.versionUpdates = this.sw.eventsOfType(['VERSION_DETECTED', 'VERSION_INSTALLATION_FAILED', 'VERSION_READY']);
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
SwUpdate.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.1.0-next.3+24.sha-08694e3.with-local-changes", ngImport: i0, type: SwUpdate, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable });
SwUpdate.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.1.0-next.3+24.sha-08694e3.with-local-changes", ngImport: i0, type: SwUpdate });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.1.0-next.3+24.sha-08694e3.with-local-changes", ngImport: i0, type: SwUpdate, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.NgswCommChannel }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFDdkMsT0FBTyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUF1RyxNQUFNLGFBQWEsQ0FBQzs7O0FBSXhLOzs7Ozs7O0dBT0c7QUFFSCxNQUFNLE9BQU8sUUFBUTtJQXVEbkIsWUFBb0IsRUFBbUI7UUFBbkIsT0FBRSxHQUFGLEVBQUUsQ0FBaUI7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDM0IsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FDdEMsQ0FBQyxrQkFBa0IsRUFBRSw2QkFBNkIsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQzFFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQ3JDLE1BQU0sQ0FBQyxDQUFDLEdBQWlCLEVBQTRCLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLGVBQWUsQ0FBQyxFQUNyRixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ04sSUFBSSxFQUFFLGtCQUFrQjtZQUN4QixPQUFPLEVBQUUsR0FBRyxDQUFDLGNBQWM7WUFDM0IsU0FBUyxFQUFFLEdBQUcsQ0FBQyxhQUFhO1NBQzdCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUF1QixrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQTBCLHFCQUFxQixDQUFDLENBQUM7SUFDNUYsQ0FBQztJQTNCRDs7O09BR0c7SUFDSCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDO0lBQzNCLENBQUM7SUF1QkQ7Ozs7Ozs7O09BUUc7SUFDSCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxtQkFBbUIsRUFBRSxFQUFDLEtBQUssRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDSCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7U0FDeEQ7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxpQkFBaUIsRUFBRSxFQUFDLEtBQUssRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdFLENBQUM7O2dIQTdHVSxRQUFRO29IQUFSLFFBQVE7c0dBQVIsUUFBUTtrQkFEcEIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtORVZFUiwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7RVJSX1NXX05PVF9TVVBQT1JURUQsIE5nc3dDb21tQ2hhbm5lbCwgVW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQsIFVwZGF0ZUFjdGl2YXRlZEV2ZW50LCBVcGRhdGVBdmFpbGFibGVFdmVudCwgVmVyc2lvbkV2ZW50LCBWZXJzaW9uUmVhZHlFdmVudH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuXG5cblxuLyoqXG4gKiBTdWJzY3JpYmUgdG8gdXBkYXRlIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgU2VydmljZSBXb3JrZXIsIHRyaWdnZXIgdXBkYXRlXG4gKiBjaGVja3MsIGFuZCBmb3JjaWJseSBhY3RpdmF0ZSB1cGRhdGVzLlxuICpcbiAqIEBzZWUge0BsaW5rIGd1aWRlL3NlcnZpY2Utd29ya2VyLWNvbW11bmljYXRpb25zIFNlcnZpY2Ugd29ya2VyIGNvbW11bmljYXRpb24gZ3VpZGV9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dVcGRhdGUge1xuICAvKipcbiAgICogRW1pdHMgYSBgVmVyc2lvbkRldGVjdGVkRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaXMgZGV0ZWN0ZWQgb24gdGhlIHNlcnZlci5cbiAgICpcbiAgICogRW1pdHMgYSBgVmVyc2lvbkluc3RhbGxhdGlvbkZhaWxlZEV2ZW50YCBldmVudCB3aGVuZXZlciBjaGVja2luZyBmb3Igb3IgZG93bmxvYWRpbmcgYSBuZXdcbiAgICogdmVyc2lvbiBmYWlscy5cbiAgICpcbiAgICogRW1pdHMgYSBgVmVyc2lvblJlYWR5RXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaGFzIGJlZW4gZG93bmxvYWRlZCBhbmQgaXMgcmVhZHkgZm9yXG4gICAqIGFjdGl2YXRpb24uXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uVXBkYXRlczogT2JzZXJ2YWJsZTxWZXJzaW9uRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVXBkYXRlQXZhaWxhYmxlRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IGFwcCB2ZXJzaW9uIGlzIGF2YWlsYWJsZS5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHtAbGluayB2ZXJzaW9uVXBkYXRlc30gaW5zdGVhZC5cbiAgICpcbiAgICogVGhlIG9mIGJlaGF2aW9yIGBhdmFpbGFibGVgIGNhbiBiZSByZWJ1aWxkIGJ5IGZpbHRlcmluZyBmb3IgdGhlIGBWZXJzaW9uUmVhZHlFdmVudGA6XG4gICAqIGBgYFxuICAgKiBpbXBvcnQge2ZpbHRlciwgbWFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gICAqIC8vIC4uLlxuICAgKiBjb25zdCB1cGRhdGVzQXZhaWxhYmxlID0gc3dVcGRhdGUudmVyc2lvblVwZGF0ZXMucGlwZShcbiAgICogICBmaWx0ZXIoKGV2dCk6IGV2dCBpcyBWZXJzaW9uUmVhZHlFdmVudCA9PiBldnQudHlwZSA9PT0gJ1ZFUlNJT05fUkVBRFknKSxcbiAgICogICBtYXAoZXZ0ID0+ICh7XG4gICAqICAgICB0eXBlOiAnVVBEQVRFX0FWQUlMQUJMRScsXG4gICAqICAgICBjdXJyZW50OiBldnQuY3VycmVudFZlcnNpb24sXG4gICAqICAgICBhdmFpbGFibGU6IGV2dC5sYXRlc3RWZXJzaW9uLFxuICAgKiAgIH0pKSk7XG4gICAqIGBgYFxuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmxlOiBPYnNlcnZhYmxlPFVwZGF0ZUF2YWlsYWJsZUV2ZW50PjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gYFVwZGF0ZUFjdGl2YXRlZEV2ZW50YCBldmVudCB3aGVuZXZlciB0aGUgYXBwIGhhcyBiZWVuIHVwZGF0ZWQgdG8gYSBuZXcgdmVyc2lvbi5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSByZXR1cm4gdmFsdWUgb2Yge0BsaW5rIFN3VXBkYXRlI2FjdGl2YXRlVXBkYXRlfSBpbnN0ZWFkLlxuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aXZhdGVkOiBPYnNlcnZhYmxlPFVwZGF0ZUFjdGl2YXRlZEV2ZW50PjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gYFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50YCBldmVudCB3aGVuZXZlciB0aGUgdmVyc2lvbiBvZiB0aGUgYXBwIHVzZWQgYnkgdGhlIHNlcnZpY2VcbiAgICogd29ya2VyIHRvIHNlcnZlIHRoaXMgY2xpZW50IGlzIGluIGEgYnJva2VuIHN0YXRlIHRoYXQgY2Fubm90IGJlIHJlY292ZXJlZCBmcm9tIHdpdGhvdXQgYSBmdWxsXG4gICAqIHBhZ2UgcmVsb2FkLlxuICAgKi9cbiAgcmVhZG9ubHkgdW5yZWNvdmVyYWJsZTogT2JzZXJ2YWJsZTxVbnJlY292ZXJhYmxlU3RhdGVFdmVudD47XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIFNlcnZpY2UgV29ya2VyIGlzIGVuYWJsZWQgKHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBhbmQgZW5hYmxlZCB2aWFcbiAgICogYFNlcnZpY2VXb3JrZXJNb2R1bGVgKS5cbiAgICovXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3cuaXNFbmFibGVkO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdzogTmdzd0NvbW1DaGFubmVsKSB7XG4gICAgaWYgKCFzdy5pc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMudmVyc2lvblVwZGF0ZXMgPSBORVZFUjtcbiAgICAgIHRoaXMuYXZhaWxhYmxlID0gTkVWRVI7XG4gICAgICB0aGlzLmFjdGl2YXRlZCA9IE5FVkVSO1xuICAgICAgdGhpcy51bnJlY292ZXJhYmxlID0gTkVWRVI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudmVyc2lvblVwZGF0ZXMgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxWZXJzaW9uRXZlbnQ+KFxuICAgICAgICBbJ1ZFUlNJT05fREVURUNURUQnLCAnVkVSU0lPTl9JTlNUQUxMQVRJT05fRkFJTEVEJywgJ1ZFUlNJT05fUkVBRFknXSk7XG4gICAgdGhpcy5hdmFpbGFibGUgPSB0aGlzLnZlcnNpb25VcGRhdGVzLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZXZ0OiBWZXJzaW9uRXZlbnQpOiBldnQgaXMgVmVyc2lvblJlYWR5RXZlbnQgPT4gZXZ0LnR5cGUgPT09ICdWRVJTSU9OX1JFQURZJyksXG4gICAgICAgIG1hcChldnQgPT4gKHtcbiAgICAgICAgICAgICAgdHlwZTogJ1VQREFURV9BVkFJTEFCTEUnLFxuICAgICAgICAgICAgICBjdXJyZW50OiBldnQuY3VycmVudFZlcnNpb24sXG4gICAgICAgICAgICAgIGF2YWlsYWJsZTogZXZ0LmxhdGVzdFZlcnNpb24sXG4gICAgICAgICAgICB9KSkpO1xuICAgIHRoaXMuYWN0aXZhdGVkID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VXBkYXRlQWN0aXZhdGVkRXZlbnQ+KCdVUERBVEVfQUNUSVZBVEVEJyk7XG4gICAgdGhpcy51bnJlY292ZXJhYmxlID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQ+KCdVTlJFQ09WRVJBQkxFX1NUQVRFJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBhbiB1cGRhdGUgYW5kIHdhaXRzIHVudGlsIHRoZSBuZXcgdmVyc2lvbiBpcyBkb3dubG9hZGVkIGZyb20gdGhlIHNlcnZlciBhbmQgcmVhZHlcbiAgICogZm9yIGFjdGl2YXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqIC0gcmVzb2x2ZXMgdG8gYHRydWVgIGlmIGEgbmV3IHZlcnNpb24gd2FzIGZvdW5kIGFuZCBpcyByZWFkeSB0byBiZSBhY3RpdmF0ZWQuXG4gICAqIC0gcmVzb2x2ZXMgdG8gYGZhbHNlYCBpZiBubyBuZXcgdmVyc2lvbiB3YXMgZm91bmRcbiAgICogLSByZWplY3RzIGlmIGFueSBlcnJvciBvY2N1cnNcbiAgICovXG4gIGNoZWNrRm9yVXBkYXRlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhPcGVyYXRpb24oJ0NIRUNLX0ZPUl9VUERBVEVTJywge25vbmNlfSwgbm9uY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGN1cnJlbnQgY2xpZW50IChpLmUuIGJyb3dzZXIgdGFiKSB0byB0aGUgbGF0ZXN0IHZlcnNpb24gdGhhdCBpcyByZWFkeSBmb3JcbiAgICogYWN0aXZhdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogIC0gcmVzb2x2ZXMgdG8gYHRydWVgIGlmIGFuIHVwZGF0ZSB3YXMgYWN0aXZhdGVkIHN1Y2Nlc3NmdWxseVxuICAgKiAgLSByZXNvbHZlcyB0byBgZmFsc2VgIGlmIG5vIHVwZGF0ZSB3YXMgYXZhaWxhYmxlIChmb3IgZXhhbXBsZSwgdGhlIGNsaWVudCB3YXMgYWxyZWFkeSBvbiB0aGVcbiAgICogICAgbGF0ZXN0IHZlcnNpb24pLlxuICAgKiAgLSByZWplY3RzIGlmIGFueSBlcnJvciBvY2N1cnNcbiAgICovXG4gIGFjdGl2YXRlVXBkYXRlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhPcGVyYXRpb24oJ0FDVElWQVRFX1VQREFURScsIHtub25jZX0sIG5vbmNlKTtcbiAgfVxufVxuIl19