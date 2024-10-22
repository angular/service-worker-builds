/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8+sha-2fb88a5", ngImport: i0, type: SwUpdate, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.8+sha-2fb88a5", ngImport: i0, type: SwUpdate }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8+sha-2fb88a5", ngImport: i0, type: SwUpdate, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.NgswCommChannel }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL3VwZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQWEsTUFBTSxNQUFNLENBQUM7QUFFdkMsT0FBTyxFQUNMLG9CQUFvQixFQUNwQixlQUFlLEdBR2hCLE1BQU0sYUFBYSxDQUFDOzs7QUFFckI7Ozs7Ozs7R0FPRztBQUVILE1BQU0sT0FBTyxRQUFRO0lBbUJuQjs7O09BR0c7SUFDSCxJQUFJLFNBQVM7UUFDWCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDO0lBQzNCLENBQUM7SUFFRCxZQUFvQixFQUFtQjtRQUFuQixPQUFFLEdBQUYsRUFBRSxDQUFpQjtRQUNyQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQzNCLE9BQU87UUFDVCxDQUFDO1FBQ0QsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBZTtZQUN2RCxrQkFBa0I7WUFDbEIsNkJBQTZCO1lBQzdCLGVBQWU7WUFDZix5QkFBeUI7U0FDMUIsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBMEIscUJBQXFCLENBQUMsQ0FBQztJQUM1RixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdkIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN0QyxPQUFPLElBQUksQ0FBQyxFQUFFLENBQUMsd0JBQXdCLENBQUMsbUJBQW1CLEVBQUUsRUFBQyxLQUFLLEVBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BdUJHO0lBQ0gsY0FBYztRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUNELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdEMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLHdCQUF3QixDQUFDLGlCQUFpQixFQUFFLEVBQUMsS0FBSyxFQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0UsQ0FBQzt5SEF6RlUsUUFBUTs2SEFBUixRQUFROztzR0FBUixRQUFRO2tCQURwQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuZGV2L2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtORVZFUiwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7XG4gIEVSUl9TV19OT1RfU1VQUE9SVEVELFxuICBOZ3N3Q29tbUNoYW5uZWwsXG4gIFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50LFxuICBWZXJzaW9uRXZlbnQsXG59IGZyb20gJy4vbG93X2xldmVsJztcblxuLyoqXG4gKiBTdWJzY3JpYmUgdG8gdXBkYXRlIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgU2VydmljZSBXb3JrZXIsIHRyaWdnZXIgdXBkYXRlXG4gKiBjaGVja3MsIGFuZCBmb3JjaWJseSBhY3RpdmF0ZSB1cGRhdGVzLlxuICpcbiAqIEBzZWUge0BsaW5rIGVjb3N5c3RlbS9zZXJ2aWNlLXdvcmtlcnMvY29tbXVuaWNhdGlvbnMgU2VydmljZSB3b3JrZXIgY29tbXVuaWNhdGlvbiBndWlkZX1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTd1VwZGF0ZSB7XG4gIC8qKlxuICAgKiBFbWl0cyBhIGBWZXJzaW9uRGV0ZWN0ZWRFdmVudGAgZXZlbnQgd2hlbmV2ZXIgYSBuZXcgdmVyc2lvbiBpcyBkZXRlY3RlZCBvbiB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBFbWl0cyBhIGBWZXJzaW9uSW5zdGFsbGF0aW9uRmFpbGVkRXZlbnRgIGV2ZW50IHdoZW5ldmVyIGNoZWNraW5nIGZvciBvciBkb3dubG9hZGluZyBhIG5ld1xuICAgKiB2ZXJzaW9uIGZhaWxzLlxuICAgKlxuICAgKiBFbWl0cyBhIGBWZXJzaW9uUmVhZHlFdmVudGAgZXZlbnQgd2hlbmV2ZXIgYSBuZXcgdmVyc2lvbiBoYXMgYmVlbiBkb3dubG9hZGVkIGFuZCBpcyByZWFkeSBmb3JcbiAgICogYWN0aXZhdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHZlcnNpb25VcGRhdGVzOiBPYnNlcnZhYmxlPFZlcnNpb25FdmVudD47XG5cbiAgLyoqXG4gICAqIEVtaXRzIGFuIGBVbnJlY292ZXJhYmxlU3RhdGVFdmVudGAgZXZlbnQgd2hlbmV2ZXIgdGhlIHZlcnNpb24gb2YgdGhlIGFwcCB1c2VkIGJ5IHRoZSBzZXJ2aWNlXG4gICAqIHdvcmtlciB0byBzZXJ2ZSB0aGlzIGNsaWVudCBpcyBpbiBhIGJyb2tlbiBzdGF0ZSB0aGF0IGNhbm5vdCBiZSByZWNvdmVyZWQgZnJvbSB3aXRob3V0IGEgZnVsbFxuICAgKiBwYWdlIHJlbG9hZC5cbiAgICovXG4gIHJlYWRvbmx5IHVucmVjb3ZlcmFibGU6IE9ic2VydmFibGU8VW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQ+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN3LmlzRW5hYmxlZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3c6IE5nc3dDb21tQ2hhbm5lbCkge1xuICAgIGlmICghc3cuaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLnZlcnNpb25VcGRhdGVzID0gTkVWRVI7XG4gICAgICB0aGlzLnVucmVjb3ZlcmFibGUgPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy52ZXJzaW9uVXBkYXRlcyA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFZlcnNpb25FdmVudD4oW1xuICAgICAgJ1ZFUlNJT05fREVURUNURUQnLFxuICAgICAgJ1ZFUlNJT05fSU5TVEFMTEFUSU9OX0ZBSUxFRCcsXG4gICAgICAnVkVSU0lPTl9SRUFEWScsXG4gICAgICAnTk9fTkVXX1ZFUlNJT05fREVURUNURUQnLFxuICAgIF0pO1xuICAgIHRoaXMudW5yZWNvdmVyYWJsZSA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFVucmVjb3ZlcmFibGVTdGF0ZUV2ZW50PignVU5SRUNPVkVSQUJMRV9TVEFURScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBmb3IgYW4gdXBkYXRlIGFuZCB3YWl0cyB1bnRpbCB0aGUgbmV3IHZlcnNpb24gaXMgZG93bmxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHJlYWR5XG4gICAqIGZvciBhY3RpdmF0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBhIHByb21pc2UgdGhhdFxuICAgKiAtIHJlc29sdmVzIHRvIGB0cnVlYCBpZiBhIG5ldyB2ZXJzaW9uIHdhcyBmb3VuZCBhbmQgaXMgcmVhZHkgdG8gYmUgYWN0aXZhdGVkLlxuICAgKiAtIHJlc29sdmVzIHRvIGBmYWxzZWAgaWYgbm8gbmV3IHZlcnNpb24gd2FzIGZvdW5kXG4gICAqIC0gcmVqZWN0cyBpZiBhbnkgZXJyb3Igb2NjdXJzXG4gICAqL1xuICBjaGVja0ZvclVwZGF0ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IG5vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoT3BlcmF0aW9uKCdDSEVDS19GT1JfVVBEQVRFUycsIHtub25jZX0sIG5vbmNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBjdXJyZW50IGNsaWVudCAoaS5lLiBicm93c2VyIHRhYikgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIHRoYXQgaXMgcmVhZHkgZm9yXG4gICAqIGFjdGl2YXRpb24uXG4gICAqXG4gICAqIEluIG1vc3QgY2FzZXMsIHlvdSBzaG91bGQgbm90IHVzZSB0aGlzIG1ldGhvZCBhbmQgaW5zdGVhZCBzaG91bGQgdXBkYXRlIGEgY2xpZW50IGJ5IHJlbG9hZGluZ1xuICAgKiB0aGUgcGFnZS5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cImFsZXJ0IGlzLWltcG9ydGFudFwiPlxuICAgKlxuICAgKiBVcGRhdGluZyBhIGNsaWVudCB3aXRob3V0IHJlbG9hZGluZyBjYW4gZWFzaWx5IHJlc3VsdCBpbiBhIGJyb2tlbiBhcHBsaWNhdGlvbiBkdWUgdG8gYSB2ZXJzaW9uXG4gICAqIG1pc21hdGNoIGJldHdlZW4gdGhlIGFwcGxpY2F0aW9uIHNoZWxsIGFuZCBvdGhlciBwYWdlIHJlc291cmNlcyxcbiAgICogc3VjaCBhcyBsYXp5LWxvYWRlZCBjaHVua3MsIHdob3NlIGZpbGVuYW1lcyBtYXkgY2hhbmdlIGJldHdlZW5cbiAgICogdmVyc2lvbnMuXG4gICAqXG4gICAqIE9ubHkgdXNlIHRoaXMgbWV0aG9kLCBpZiB5b3UgYXJlIGNlcnRhaW4gaXQgaXMgc2FmZSBmb3IgeW91ciBzcGVjaWZpYyB1c2UgY2FzZS5cbiAgICpcbiAgICogPC9kaXY+XG4gICAqXG4gICAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0XG4gICAqICAtIHJlc29sdmVzIHRvIGB0cnVlYCBpZiBhbiB1cGRhdGUgd2FzIGFjdGl2YXRlZCBzdWNjZXNzZnVsbHlcbiAgICogIC0gcmVzb2x2ZXMgdG8gYGZhbHNlYCBpZiBubyB1cGRhdGUgd2FzIGF2YWlsYWJsZSAoZm9yIGV4YW1wbGUsIHRoZSBjbGllbnQgd2FzIGFscmVhZHkgb24gdGhlXG4gICAqICAgIGxhdGVzdCB2ZXJzaW9uKS5cbiAgICogIC0gcmVqZWN0cyBpZiBhbnkgZXJyb3Igb2NjdXJzXG4gICAqL1xuICBhY3RpdmF0ZVVwZGF0ZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IG5vbmNlID0gdGhpcy5zdy5nZW5lcmF0ZU5vbmNlKCk7XG4gICAgcmV0dXJuIHRoaXMuc3cucG9zdE1lc3NhZ2VXaXRoT3BlcmF0aW9uKCdBQ1RJVkFURV9VUERBVEUnLCB7bm9uY2V9LCBub25jZSk7XG4gIH1cbn1cbiJdfQ==