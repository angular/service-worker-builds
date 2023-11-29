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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0-next.1+sha-a359951", ngImport: i0, type: SwUpdate, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0-next.1+sha-a359951", ngImport: i0, type: SwUpdate }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0-next.1+sha-a359951", ngImport: i0, type: SwUpdate, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.NgswCommChannel }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFFdkMsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGVBQWUsRUFBd0MsTUFBTSxhQUFhLENBQUM7OztBQUV6Rzs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLFFBQVE7SUFtQm5COzs7T0FHRztJQUNILElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7SUFDM0IsQ0FBQztJQUVELFlBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBQ3JDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDM0IsT0FBTztRQUNULENBQUM7UUFDRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFlO1lBQ3ZELGtCQUFrQjtZQUNsQiw2QkFBNkI7WUFDN0IsZUFBZTtZQUNmLHlCQUF5QjtTQUMxQixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUEwQixxQkFBcUIsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILGNBQWM7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN2QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1FBQ3pELENBQUM7UUFDRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxtQkFBbUIsRUFBRSxFQUFDLEtBQUssRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1Qkc7SUFDSCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN0QyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsaUJBQWlCLEVBQUUsRUFBQyxLQUFLLEVBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM3RSxDQUFDO3lIQXpGVSxRQUFROzZIQUFSLFFBQVE7O3NHQUFSLFFBQVE7a0JBRHBCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkVWRVIsIE9ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQge0VSUl9TV19OT1RfU1VQUE9SVEVELCBOZ3N3Q29tbUNoYW5uZWwsIFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50LCBWZXJzaW9uRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuLyoqXG4gKiBTdWJzY3JpYmUgdG8gdXBkYXRlIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgU2VydmljZSBXb3JrZXIsIHRyaWdnZXIgdXBkYXRlXG4gKiBjaGVja3MsIGFuZCBmb3JjaWJseSBhY3RpdmF0ZSB1cGRhdGVzLlxuICpcbiAqIEBzZWUge0BsaW5rIGd1aWRlL3NlcnZpY2Utd29ya2VyLWNvbW11bmljYXRpb25zIFNlcnZpY2Ugd29ya2VyIGNvbW11bmljYXRpb24gZ3VpZGV9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dVcGRhdGUge1xuICAvKipcbiAgICogRW1pdHMgYSBgVmVyc2lvbkRldGVjdGVkRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaXMgZGV0ZWN0ZWQgb24gdGhlIHNlcnZlci5cbiAgICpcbiAgICogRW1pdHMgYSBgVmVyc2lvbkluc3RhbGxhdGlvbkZhaWxlZEV2ZW50YCBldmVudCB3aGVuZXZlciBjaGVja2luZyBmb3Igb3IgZG93bmxvYWRpbmcgYSBuZXdcbiAgICogdmVyc2lvbiBmYWlscy5cbiAgICpcbiAgICogRW1pdHMgYSBgVmVyc2lvblJlYWR5RXZlbnRgIGV2ZW50IHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaGFzIGJlZW4gZG93bmxvYWRlZCBhbmQgaXMgcmVhZHkgZm9yXG4gICAqIGFjdGl2YXRpb24uXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uVXBkYXRlczogT2JzZXJ2YWJsZTxWZXJzaW9uRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyBhbiBgVW5yZWNvdmVyYWJsZVN0YXRlRXZlbnRgIGV2ZW50IHdoZW5ldmVyIHRoZSB2ZXJzaW9uIG9mIHRoZSBhcHAgdXNlZCBieSB0aGUgc2VydmljZVxuICAgKiB3b3JrZXIgdG8gc2VydmUgdGhpcyBjbGllbnQgaXMgaW4gYSBicm9rZW4gc3RhdGUgdGhhdCBjYW5ub3QgYmUgcmVjb3ZlcmVkIGZyb20gd2l0aG91dCBhIGZ1bGxcbiAgICogcGFnZSByZWxvYWQuXG4gICAqL1xuICByZWFkb25seSB1bnJlY292ZXJhYmxlOiBPYnNlcnZhYmxlPFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50PjtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgU2VydmljZSBXb3JrZXIgaXMgZW5hYmxlZCAoc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIGFuZCBlbmFibGVkIHZpYVxuICAgKiBgU2VydmljZVdvcmtlck1vZHVsZWApLlxuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdy5pc0VuYWJsZWQ7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN3OiBOZ3N3Q29tbUNoYW5uZWwpIHtcbiAgICBpZiAoIXN3LmlzRW5hYmxlZCkge1xuICAgICAgdGhpcy52ZXJzaW9uVXBkYXRlcyA9IE5FVkVSO1xuICAgICAgdGhpcy51bnJlY292ZXJhYmxlID0gTkVWRVI7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudmVyc2lvblVwZGF0ZXMgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxWZXJzaW9uRXZlbnQ+KFtcbiAgICAgICdWRVJTSU9OX0RFVEVDVEVEJyxcbiAgICAgICdWRVJTSU9OX0lOU1RBTExBVElPTl9GQUlMRUQnLFxuICAgICAgJ1ZFUlNJT05fUkVBRFknLFxuICAgICAgJ05PX05FV19WRVJTSU9OX0RFVEVDVEVEJyxcbiAgICBdKTtcbiAgICB0aGlzLnVucmVjb3ZlcmFibGUgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxVbnJlY292ZXJhYmxlU3RhdGVFdmVudD4oJ1VOUkVDT1ZFUkFCTEVfU1RBVEUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIGFuIHVwZGF0ZSBhbmQgd2FpdHMgdW50aWwgdGhlIG5ldyB2ZXJzaW9uIGlzIGRvd25sb2FkZWQgZnJvbSB0aGUgc2VydmVyIGFuZCByZWFkeVxuICAgKiBmb3IgYWN0aXZhdGlvbi5cbiAgICpcbiAgICogQHJldHVybnMgYSBwcm9taXNlIHRoYXRcbiAgICogLSByZXNvbHZlcyB0byBgdHJ1ZWAgaWYgYSBuZXcgdmVyc2lvbiB3YXMgZm91bmQgYW5kIGlzIHJlYWR5IHRvIGJlIGFjdGl2YXRlZC5cbiAgICogLSByZXNvbHZlcyB0byBgZmFsc2VgIGlmIG5vIG5ldyB2ZXJzaW9uIHdhcyBmb3VuZFxuICAgKiAtIHJlamVjdHMgaWYgYW55IGVycm9yIG9jY3Vyc1xuICAgKi9cbiAgY2hlY2tGb3JVcGRhdGUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBub25jZSA9IHRoaXMuc3cuZ2VuZXJhdGVOb25jZSgpO1xuICAgIHJldHVybiB0aGlzLnN3LnBvc3RNZXNzYWdlV2l0aE9wZXJhdGlvbignQ0hFQ0tfRk9SX1VQREFURVMnLCB7bm9uY2V9LCBub25jZSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY3VycmVudCBjbGllbnQgKGkuZS4gYnJvd3NlciB0YWIpIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiB0aGF0IGlzIHJlYWR5IGZvclxuICAgKiBhY3RpdmF0aW9uLlxuICAgKlxuICAgKiBJbiBtb3N0IGNhc2VzLCB5b3Ugc2hvdWxkIG5vdCB1c2UgdGhpcyBtZXRob2QgYW5kIGluc3RlYWQgc2hvdWxkIHVwZGF0ZSBhIGNsaWVudCBieSByZWxvYWRpbmdcbiAgICogdGhlIHBhZ2UuXG4gICAqXG4gICAqIDxkaXYgY2xhc3M9XCJhbGVydCBpcy1pbXBvcnRhbnRcIj5cbiAgICpcbiAgICogVXBkYXRpbmcgYSBjbGllbnQgd2l0aG91dCByZWxvYWRpbmcgY2FuIGVhc2lseSByZXN1bHQgaW4gYSBicm9rZW4gYXBwbGljYXRpb24gZHVlIHRvIGEgdmVyc2lvblxuICAgKiBtaXNtYXRjaCBiZXR3ZWVuIHRoZSBbYXBwbGljYXRpb24gc2hlbGxdKGd1aWRlL2dsb3NzYXJ5I2FwcC1zaGVsbCkgYW5kIG90aGVyIHBhZ2UgcmVzb3VyY2VzLFxuICAgKiBzdWNoIGFzIFtsYXp5LWxvYWRlZCBjaHVua3NdKGd1aWRlL2dsb3NzYXJ5I2xhenktbG9hZGluZyksIHdob3NlIGZpbGVuYW1lcyBtYXkgY2hhbmdlIGJldHdlZW5cbiAgICogdmVyc2lvbnMuXG4gICAqXG4gICAqIE9ubHkgdXNlIHRoaXMgbWV0aG9kLCBpZiB5b3UgYXJlIGNlcnRhaW4gaXQgaXMgc2FmZSBmb3IgeW91ciBzcGVjaWZpYyB1c2UgY2FzZS5cbiAgICpcbiAgICogPC9kaXY+XG4gICAqXG4gICAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqICAtIHJlc29sdmVzIHRvIGB0cnVlYCBpZiBhbiB1cGRhdGUgd2FzIGFjdGl2YXRlZCBzdWNjZXNzZnVsbHlcbiAgICogIC0gcmVzb2x2ZXMgdG8gYGZhbHNlYCBpZiBubyB1cGRhdGUgd2FzIGF2YWlsYWJsZSAoZm9yIGV4YW1wbGUsIHRoZSBjbGllbnQgd2FzIGFscmVhZHkgb24gdGhlXG4gICAqICAgIGxhdGVzdCB2ZXJzaW9uKS5cbiAgICogIC0gcmVqZWN0cyBpZiBhbnkgZXJyb3Igb2NjdXJzXG4gICAqL1xuICBhY3RpdmF0ZVVwZGF0ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IG5vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoT3BlcmF0aW9uKCdBQ1RJVkFURV9VUERBVEUnLCB7bm9uY2V9LCBub25jZSk7XG4gIH1cbn1cbiJdfQ==