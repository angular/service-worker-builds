/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
import { NgModule } from '@angular/core';
import { provideServiceWorker } from './provider';
import { SwPush } from './push';
import { SwUpdate } from './update';
import * as i0 from "@angular/core";
/**
 * @publicApi
 */
export class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    static register(script, options = {}) {
        return {
            ngModule: ServiceWorkerModule,
            providers: [provideServiceWorker(script, options)],
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.12+sha-88072c8", ngImport: i0, type: ServiceWorkerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.12+sha-88072c8", ngImport: i0, type: ServiceWorkerModule }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.12+sha-88072c8", ngImport: i0, type: ServiceWorkerModule, providers: [SwPush, SwUpdate] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.12+sha-88072c8", ngImport: i0, type: ServiceWorkerModule, decorators: [{
            type: NgModule,
            args: [{ providers: [SwPush, SwUpdate] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQXNCLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUU1RCxPQUFPLEVBQUMsb0JBQW9CLEVBQXdCLE1BQU0sWUFBWSxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbEM7O0dBRUc7QUFFSCxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FDYixNQUFjLEVBQ2QsVUFBaUMsRUFBRTtRQUVuQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDbkQsQ0FBQztJQUNKLENBQUM7eUhBZlUsbUJBQW1COzBIQUFuQixtQkFBbUI7MEhBQW5CLG1CQUFtQixhQURWLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQzs7c0dBQzNCLG1CQUFtQjtrQkFEL0IsUUFBUTttQkFBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmRldi9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7cHJvdmlkZVNlcnZpY2VXb3JrZXIsIFN3UmVnaXN0cmF0aW9uT3B0aW9uc30gZnJvbSAnLi9wcm92aWRlcic7XG5pbXBvcnQge1N3UHVzaH0gZnJvbSAnLi9wdXNoJztcbmltcG9ydCB7U3dVcGRhdGV9IGZyb20gJy4vdXBkYXRlJztcblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7cHJvdmlkZXJzOiBbU3dQdXNoLCBTd1VwZGF0ZV19KVxuZXhwb3J0IGNsYXNzIFNlcnZpY2VXb3JrZXJNb2R1bGUge1xuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGdpdmVuIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIgc2NyaXB0LlxuICAgKlxuICAgKiBJZiBgZW5hYmxlZGAgaXMgc2V0IHRvIGBmYWxzZWAgaW4gdGhlIGdpdmVuIG9wdGlvbnMsIHRoZSBtb2R1bGUgd2lsbCBiZWhhdmUgYXMgaWYgc2VydmljZVxuICAgKiB3b3JrZXJzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCBhbmQgdGhlIHNlcnZpY2Ugd29ya2VyIHdpbGwgbm90IGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBzdGF0aWMgcmVnaXN0ZXIoXG4gICAgc2NyaXB0OiBzdHJpbmcsXG4gICAgb3B0aW9uczogU3dSZWdpc3RyYXRpb25PcHRpb25zID0ge30sXG4gICk6IE1vZHVsZVdpdGhQcm92aWRlcnM8U2VydmljZVdvcmtlck1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU2VydmljZVdvcmtlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3Byb3ZpZGVTZXJ2aWNlV29ya2VyKHNjcmlwdCwgb3B0aW9ucyldLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==