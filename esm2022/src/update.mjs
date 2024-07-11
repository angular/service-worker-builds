/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { NEVER } from 'rxjs';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel, } from './low_level';
import * as i0 from "@angular/core";
import * as i1 from "./low_level";
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @see {@link ecosystem/service-workers/communications Service worker communication guide}
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
            this.unrecoverable = NEVER;
            return;
        }
        this.versionUpdates = this.sw.eventsOfType([
            'VERSION_DETECTED',
            'VERSION_INSTALLATION_FAILED',
            'VERSION_READY',
            'NO_NEW_VERSION_DETECTED',
        ]);
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
     * mismatch between the application shell and other page resources,
     * such as lazy-loaded chunks, whose filenames may change between
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.1.0+sha-94c6ec0", ngImport: i0, type: SwUpdate, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.1.0+sha-94c6ec0", ngImport: i0, type: SwUpdate }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.1.0+sha-94c6ec0", ngImport: i0, type: SwUpdate, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.NgswCommChannel }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFFdkMsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixlQUFlLEdBR2hCLE1BQU0sYUFBYSxDQUFDOzs7QUFFckI7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyxRQUFRO0lBbUJuQjs7O09BR0c7SUFDSCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDO0lBQzNCLENBQUM7SUFFRCxZQUFvQixFQUFtQjtRQUFuQixPQUFFLEdBQUYsRUFBRSxDQUFpQjtRQUNyQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQzNCLE9BQU87UUFDVCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBZTtZQUN2RCxrQkFBa0I7WUFDbEIsNkJBQTZCO1lBQzdCLGVBQWU7WUFDZix5QkFBeUI7U0FDMUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBMEIscUJBQXFCLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN0QyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsbUJBQW1CLEVBQUUsRUFBQyxLQUFLLEVBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BdUJHO0lBQ0gsY0FBYztRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLGlCQUFpQixFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0UsQ0FBQzt5SEF6RlUsUUFBUTs2SEFBUixRQUFROztzR0FBUixRQUFRO2tCQURwQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05FVkVSLCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHtcbiAgRVJSX1NXX05PVF9TVVBQT1JURUQsXG4gIE5nc3dDb21tQ2hhbm5lbCxcbiAgVW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQsXG4gIFZlcnNpb25FdmVudCxcbn0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuXG4vKipcbiAqIFN1YnNjcmliZSB0byB1cGRhdGUgbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBTZXJ2aWNlIFdvcmtlciwgdHJpZ2dlciB1cGRhdGVcbiAqIGNoZWNrcywgYW5kIGZvcmNpYmx5IGFjdGl2YXRlIHVwZGF0ZXMuXG4gKlxuICogQHNlZSB7QGxpbmsgZWNvc3lzdGVtL3NlcnZpY2Utd29ya2Vycy9jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN3VXBkYXRlIHtcbiAgLyoqXG4gICAqIEVtaXRzIGEgYFZlcnNpb25EZXRlY3RlZEV2ZW50YCBldmVudCB3aGVuZXZlciBhIG5ldyB2ZXJzaW9uIGlzIGRldGVjdGVkIG9uIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEVtaXRzIGEgYFZlcnNpb25JbnN0YWxsYXRpb25GYWlsZWRFdmVudGAgZXZlbnQgd2hlbmV2ZXIgY2hlY2tpbmcgZm9yIG9yIGRvd25sb2FkaW5nIGEgbmV3XG4gICAqIHZlcnNpb24gZmFpbHMuXG4gICAqXG4gICAqIEVtaXRzIGEgYFZlcnNpb25SZWFkeUV2ZW50YCBldmVudCB3aGVuZXZlciBhIG5ldyB2ZXJzaW9uIGhhcyBiZWVuIGRvd25sb2FkZWQgYW5kIGlzIHJlYWR5IGZvclxuICAgKiBhY3RpdmF0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgdmVyc2lvblVwZGF0ZXM6IE9ic2VydmFibGU8VmVyc2lvbkV2ZW50PjtcblxuICAvKipcbiAgICogRW1pdHMgYW4gYFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50YCBldmVudCB3aGVuZXZlciB0aGUgdmVyc2lvbiBvZiB0aGUgYXBwIHVzZWQgYnkgdGhlIHNlcnZpY2VcbiAgICogd29ya2VyIHRvIHNlcnZlIHRoaXMgY2xpZW50IGlzIGluIGEgYnJva2VuIHN0YXRlIHRoYXQgY2Fubm90IGJlIHJlY292ZXJlZCBmcm9tIHdpdGhvdXQgYSBmdWxsXG4gICAqIHBhZ2UgcmVsb2FkLlxuICAgKi9cbiAgcmVhZG9ubHkgdW5yZWNvdmVyYWJsZTogT2JzZXJ2YWJsZTxVbnJlY292ZXJhYmxlU3RhdGVFdmVudD47XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIFNlcnZpY2UgV29ya2VyIGlzIGVuYWJsZWQgKHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBhbmQgZW5hYmxlZCB2aWFcbiAgICogYFNlcnZpY2VXb3JrZXJNb2R1bGVgKS5cbiAgICovXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3cuaXNFbmFibGVkO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdzogTmdzd0NvbW1DaGFubmVsKSB7XG4gICAgaWYgKCFzdy5pc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMudmVyc2lvblVwZGF0ZXMgPSBORVZFUjtcbiAgICAgIHRoaXMudW5yZWNvdmVyYWJsZSA9IE5FVkVSO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnZlcnNpb25VcGRhdGVzID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VmVyc2lvbkV2ZW50PihbXG4gICAgICAnVkVSU0lPTl9ERVRFQ1RFRCcsXG4gICAgICAnVkVSU0lPTl9JTlNUQUxMQVRJT05fRkFJTEVEJyxcbiAgICAgICdWRVJTSU9OX1JFQURZJyxcbiAgICAgICdOT19ORVdfVkVSU0lPTl9ERVRFQ1RFRCcsXG4gICAgXSk7XG4gICAgdGhpcy51bnJlY292ZXJhYmxlID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8VW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQ+KCdVTlJFQ09WRVJBQkxFX1NUQVRFJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBhbiB1cGRhdGUgYW5kIHdhaXRzIHVudGlsIHRoZSBuZXcgdmVyc2lvbiBpcyBkb3dubG9hZGVkIGZyb20gdGhlIHNlcnZlciBhbmQgcmVhZHlcbiAgICogZm9yIGFjdGl2YXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqIC0gcmVzb2x2ZXMgdG8gYHRydWVgIGlmIGEgbmV3IHZlcnNpb24gd2FzIGZvdW5kIGFuZCBpcyByZWFkeSB0byBiZSBhY3RpdmF0ZWQuXG4gICAqIC0gcmVzb2x2ZXMgdG8gYGZhbHNlYCBpZiBubyBuZXcgdmVyc2lvbiB3YXMgZm91bmRcbiAgICogLSByZWplY3RzIGlmIGFueSBlcnJvciBvY2N1cnNcbiAgICovXG4gIGNoZWNrRm9yVXBkYXRlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhPcGVyYXRpb24oJ0NIRUNLX0ZPUl9VUERBVEVTJywge25vbmNlfSwgbm9uY2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGN1cnJlbnQgY2xpZW50IChpLmUuIGJyb3dzZXIgdGFiKSB0byB0aGUgbGF0ZXN0IHZlcnNpb24gdGhhdCBpcyByZWFkeSBmb3JcbiAgICogYWN0aXZhdGlvbi5cbiAgICpcbiAgICogSW4gbW9zdCBjYXNlcywgeW91IHNob3VsZCBub3QgdXNlIHRoaXMgbWV0aG9kIGFuZCBpbnN0ZWFkIHNob3VsZCB1cGRhdGUgYSBjbGllbnQgYnkgcmVsb2FkaW5nXG4gICAqIHRoZSBwYWdlLlxuICAgKlxuICAgKiA8ZGl2IGNsYXNzPVwiYWxlcnQgaXMtaW1wb3J0YW50XCI+XG4gICAqXG4gICAqIFVwZGF0aW5nIGEgY2xpZW50IHdpdGhvdXQgcmVsb2FkaW5nIGNhbiBlYXNpbHkgcmVzdWx0IGluIGEgYnJva2VuIGFwcGxpY2F0aW9uIGR1ZSB0byBhIHZlcnNpb25cbiAgICogbWlzbWF0Y2ggYmV0d2VlbiB0aGUgYXBwbGljYXRpb24gc2hlbGwgYW5kIG90aGVyIHBhZ2UgcmVzb3VyY2VzLFxuICAgKiBzdWNoIGFzIGxhenktbG9hZGVkIGNodW5rcywgd2hvc2UgZmlsZW5hbWVzIG1heSBjaGFuZ2UgYmV0d2VlblxuICAgKiB2ZXJzaW9ucy5cbiAgICpcbiAgICogT25seSB1c2UgdGhpcyBtZXRob2QsIGlmIHlvdSBhcmUgY2VydGFpbiBpdCBpcyBzYWZlIGZvciB5b3VyIHNwZWNpZmljIHVzZSBjYXNlLlxuICAgKlxuICAgKiA8L2Rpdj5cbiAgICpcbiAgICogQHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogIC0gcmVzb2x2ZXMgdG8gYHRydWVgIGlmIGFuIHVwZGF0ZSB3YXMgYWN0aXZhdGVkIHN1Y2Nlc3NmdWxseVxuICAgKiAgLSByZXNvbHZlcyB0byBgZmFsc2VgIGlmIG5vIHVwZGF0ZSB3YXMgYXZhaWxhYmxlIChmb3IgZXhhbXBsZSwgdGhlIGNsaWVudCB3YXMgYWxyZWFkeSBvbiB0aGVcbiAgICogICAgbGF0ZXN0IHZlcnNpb24pLlxuICAgKiAgLSByZWplY3RzIGlmIGFueSBlcnJvciBvY2N1cnNcbiAgICovXG4gIGFjdGl2YXRlVXBkYXRlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLnN3LmdlbmVyYXRlTm9uY2UoKTtcbiAgICByZXR1cm4gdGhpcy5zdy5wb3N0TWVzc2FnZVdpdGhPcGVyYXRpb24oJ0FDVElWQVRFX1VQREFURScsIHtub25jZX0sIG5vbmNlKTtcbiAgfVxufVxuIl19