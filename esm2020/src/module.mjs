/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformBrowser } from '@angular/common';
import { APP_INITIALIZER, ApplicationRef, InjectionToken, Injector, NgModule, NgZone, PLATFORM_ID } from '@angular/core';
import { merge, of } from 'rxjs';
import { delay, filter, take } from 'rxjs/operators';
import { NgswCommChannel } from './low_level';
import { SwPush } from './push';
import { SwUpdate } from './update';
import * as i0 from "@angular/core";
/**
 * Token that can be used to provide options for `ServiceWorkerModule` outside of
 * `ServiceWorkerModule.register()`.
 *
 * You can use this token to define a provider that generates the registration options at runtime,
 * for example via a function call:
 *
 * {@example service-worker/registration-options/module.ts region="registration-options"
 *     header="app.module.ts"}
 *
 * @publicApi
 */
export class SwRegistrationOptions {
}
export const SCRIPT = new InjectionToken('NGSW_REGISTER_SCRIPT');
export function ngswAppInitializer(injector, script, options, platformId) {
    return () => {
        if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }
        });
        let readyToRegister$;
        if (typeof options.registrationStrategy === 'function') {
            readyToRegister$ = options.registrationStrategy();
        }
        else {
            const [strategy, ...args] = (options.registrationStrategy || 'registerWhenStable:30000').split(':');
            switch (strategy) {
                case 'registerImmediately':
                    readyToRegister$ = of(null);
                    break;
                case 'registerWithDelay':
                    readyToRegister$ = delayWithTimeout(+args[0] || 0);
                    break;
                case 'registerWhenStable':
                    readyToRegister$ = !args[0] ? whenStable(injector) :
                        merge(whenStable(injector), delayWithTimeout(+args[0]));
                    break;
                default:
                    // Unknown strategy.
                    throw new Error(`Unknown ServiceWorker registration strategy: ${options.registrationStrategy}`);
            }
        }
        // Don't return anything to avoid blocking the application until the SW is registered.
        // Also, run outside the Angular zone to avoid preventing the app from stabilizing (especially
        // given that some registration strategies wait for the app to stabilize).
        // Catch and log the error if SW registration fails to avoid uncaught rejection warning.
        const ngZone = injector.get(NgZone);
        ngZone.runOutsideAngular(() => readyToRegister$.pipe(take(1)).subscribe(() => navigator.serviceWorker.register(script, { scope: options.scope })
            .catch(err => console.error('Service worker registration failed with:', err))));
    };
}
function delayWithTimeout(timeout) {
    return of(null).pipe(delay(timeout));
}
function whenStable(injector) {
    const appRef = injector.get(ApplicationRef);
    return appRef.isStable.pipe(filter(stable => stable));
}
export function ngswCommChannelFactory(opts, platformId) {
    return new NgswCommChannel(isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
        undefined);
}
/**
 * @publicApi
 */
class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    static register(script, opts = {}) {
        return {
            ngModule: ServiceWorkerModule,
            providers: [
                { provide: SCRIPT, useValue: script },
                { provide: SwRegistrationOptions, useValue: opts },
                {
                    provide: NgswCommChannel,
                    useFactory: ngswCommChannelFactory,
                    deps: [SwRegistrationOptions, PLATFORM_ID]
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: ngswAppInitializer,
                    deps: [Injector, SCRIPT, SwRegistrationOptions, PLATFORM_ID],
                    multi: true,
                },
            ],
        };
    }
}
ServiceWorkerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.1+sha-e57d5db", ngImport: i0, type: ServiceWorkerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ServiceWorkerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.0-next.1+sha-e57d5db", ngImport: i0, type: ServiceWorkerModule });
ServiceWorkerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.0-next.1+sha-e57d5db", ngImport: i0, type: ServiceWorkerModule, providers: [SwPush, SwUpdate] });
export { ServiceWorkerModule };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.1+sha-e57d5db", ngImport: i0, type: ServiceWorkerModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [SwPush, SwUpdate],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUF1QixRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1SSxPQUFPLEVBQUMsS0FBSyxFQUFjLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbEM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLE9BQWdCLHFCQUFxQjtDQThDMUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQVMsc0JBQXNCLENBQUMsQ0FBQztBQUV6RSxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLFFBQWtCLEVBQUUsTUFBYyxFQUFFLE9BQThCLEVBQ2xFLFVBQWtCO0lBQ3BCLE9BQU8sR0FBRyxFQUFFO1FBQ1YsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBRUQsMEZBQTBGO1FBQzFGLDBGQUEwRjtRQUMxRixXQUFXO1FBQ1gsU0FBUyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7WUFDaEUsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQy9DLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO2FBQ3hFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLGdCQUFxQyxDQUFDO1FBRTFDLElBQUksT0FBTyxPQUFPLENBQUMsb0JBQW9CLEtBQUssVUFBVSxFQUFFO1lBQ3RELGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQ25EO2FBQU07WUFDTCxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQ3JCLENBQUMsT0FBTyxDQUFDLG9CQUFvQixJQUFJLDBCQUEwQixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTVFLFFBQVEsUUFBUSxFQUFFO2dCQUNoQixLQUFLLHFCQUFxQjtvQkFDeEIsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QixNQUFNO2dCQUNSLEtBQUssbUJBQW1CO29CQUN0QixnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDbkQsTUFBTTtnQkFDUixLQUFLLG9CQUFvQjtvQkFDdkIsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEYsTUFBTTtnQkFDUjtvQkFDRSxvQkFBb0I7b0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQ1gsZ0RBQWdELE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7YUFDdkY7U0FDRjtRQUVELHNGQUFzRjtRQUN0Riw4RkFBOEY7UUFDOUYsMEVBQTBFO1FBQzFFLHdGQUF3RjtRQUN4RixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FDcEIsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FDMUMsR0FBRyxFQUFFLENBQ0QsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUMsQ0FBQzthQUMzRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE9BQWU7SUFDdkMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxRQUFrQjtJQUNwQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRUQsTUFBTSxVQUFVLHNCQUFzQixDQUNsQyxJQUEyQixFQUFFLFVBQWtCO0lBQ2pELE9BQU8sSUFBSSxlQUFlLENBQ3RCLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekIsU0FBUyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFHYSxtQkFBbUI7SUFDOUI7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWMsRUFBRSxPQUE4QixFQUFFO1FBRTlELE9BQU87WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQztnQkFDbkMsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDaEQ7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxzQkFBc0I7b0JBQ2xDLElBQUksRUFBRSxDQUFDLHFCQUFxQixFQUFFLFdBQVcsQ0FBQztpQkFDM0M7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7b0JBQzlCLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxDQUFDO29CQUM1RCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7OzJIQTNCVSxtQkFBbUI7NEhBQW5CLG1CQUFtQjs0SEFBbkIsbUJBQW1CLGFBRm5CLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztTQUVsQixtQkFBbUI7c0dBQW5CLG1CQUFtQjtrQkFIL0IsUUFBUTttQkFBQztvQkFDUixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO2lCQUM5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBUFBfSU5JVElBTElaRVIsIEFwcGxpY2F0aW9uUmVmLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBOZ1pvbmUsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVsYXksIGZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge05nc3dDb21tQ2hhbm5lbH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuaW1wb3J0IHtTd1B1c2h9IGZyb20gJy4vcHVzaCc7XG5pbXBvcnQge1N3VXBkYXRlfSBmcm9tICcuL3VwZGF0ZSc7XG5cbi8qKlxuICogVG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG9wdGlvbnMgZm9yIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCBvdXRzaWRlIG9mXG4gKiBgU2VydmljZVdvcmtlck1vZHVsZS5yZWdpc3RlcigpYC5cbiAqXG4gKiBZb3UgY2FuIHVzZSB0aGlzIHRva2VuIHRvIGRlZmluZSBhIHByb3ZpZGVyIHRoYXQgZ2VuZXJhdGVzIHRoZSByZWdpc3RyYXRpb24gb3B0aW9ucyBhdCBydW50aW1lLFxuICogZm9yIGV4YW1wbGUgdmlhIGEgZnVuY3Rpb24gY2FsbDpcbiAqXG4gKiB7QGV4YW1wbGUgc2VydmljZS13b3JrZXIvcmVnaXN0cmF0aW9uLW9wdGlvbnMvbW9kdWxlLnRzIHJlZ2lvbj1cInJlZ2lzdHJhdGlvbi1vcHRpb25zXCJcbiAqICAgICBoZWFkZXI9XCJhcHAubW9kdWxlLnRzXCJ9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3dSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFuZCB0aGUgcmVsYXRlZCBzZXJ2aWNlcyAoc3VjaCBhcyBgU3dQdXNoYCBhbmRcbiAgICogYFN3VXBkYXRlYCkgd2lsbCBhdHRlbXB0IHRvIGNvbW11bmljYXRlIGFuZCBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBlbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBVUkwgdGhhdCBkZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyJ3MgcmVnaXN0cmF0aW9uIHNjb3BlOyB0aGF0IGlzLCB3aGF0IHJhbmdlIG9mIFVSTHMgaXQgY2FuXG4gICAqIGNvbnRyb2wuIEl0IHdpbGwgYmUgdXNlZCB3aGVuIGNhbGxpbmdcbiAgICogW1NlcnZpY2VXb3JrZXJDb250YWluZXIjcmVnaXN0ZXIoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlcnZpY2VXb3JrZXJDb250YWluZXIvcmVnaXN0ZXIpLlxuICAgKi9cbiAgc2NvcGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5LCB3aGljaCBkZXRlcm1pbmVzIHdoZW4gaXQgd2lsbCBiZSByZWdpc3RlcmVkXG4gICAqIHdpdGggdGhlIGJyb3dzZXIuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHJlZ2lzdGVyaW5nIG9uY2UgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKGkuZS4gYXMgc29vbiBhcyB0aGVyZSBhcmVcbiAgICogbm8gcGVuZGluZyBtaWNyby0gYW5kIG1hY3JvLXRhc2tzKSBpcyBkZXNpZ25lZCB0byByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uIGFzXG4gICAqIHBvc3NpYmxlIGJ1dCB3aXRob3V0IGFmZmVjdGluZyB0aGUgYXBwbGljYXRpb24ncyBmaXJzdCB0aW1lIGxvYWQuXG4gICAqXG4gICAqIFN0aWxsLCB0aGVyZSBtaWdodCBiZSBjYXNlcyB3aGVyZSB5b3Ugd2FudCBtb3JlIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBTZXJ2aWNlV29ya2VyIGlzXG4gICAqIHJlZ2lzdGVyZWQgKGZvciBleGFtcGxlLCB0aGVyZSBtaWdodCBiZSBhIGxvbmctcnVubmluZyB0aW1lb3V0IG9yIHBvbGxpbmcgaW50ZXJ2YWwsIHByZXZlbnRpbmdcbiAgICogdGhlIGFwcCBmcm9tIHN0YWJpbGl6aW5nKS4gVGhlIGF2YWlsYWJsZSBvcHRpb24gYXJlOlxuICAgKlxuICAgKiAtIGByZWdpc3RlcldoZW5TdGFibGU6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgYXMgc29vbiBhcyB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAobm8gcGVuZGluZ1xuICAgKiAgICAgbWljcm8tL21hY3JvLXRhc2tzKSBidXQgbm8gbGF0ZXIgdGhhbiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIElmIHRoZSBhcHAgaGFzbid0XG4gICAqICAgICBzdGFiaWxpemVkIGFmdGVyIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcyAoZm9yIGV4YW1wbGUsIGR1ZSB0byBhIHJlY3VycmVudCBhc3luY2hyb25vdXNcbiAgICogICAgIHRhc2spLCB0aGUgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYW55d2F5LlxuICAgKiAgICAgSWYgYDx0aW1lb3V0PmAgaXMgb21pdHRlZCwgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBvbmx5IGJlIHJlZ2lzdGVyZWQgb25jZSB0aGUgYXBwXG4gICAqICAgICBzdGFiaWxpemVzLlxuICAgKiAtIGByZWdpc3RlckltbWVkaWF0ZWx5YDogUmVnaXN0ZXIgaW1tZWRpYXRlbHkuXG4gICAqIC0gYHJlZ2lzdGVyV2l0aERlbGF5Ojx0aW1lb3V0PmA6IFJlZ2lzdGVyIHdpdGggYSBkZWxheSBvZiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIEZvclxuICAgKiAgICAgZXhhbXBsZSwgdXNlIGByZWdpc3RlcldpdGhEZWxheTo1MDAwYCB0byByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhZnRlciA1IHNlY29uZHMuIElmXG4gICAqICAgICBgPHRpbWVvdXQ+YCBpcyBvbWl0dGVkLCBpcyBkZWZhdWx0cyB0byBgMGAsIHdoaWNoIHdpbGwgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vblxuICAgKiAgICAgYXMgcG9zc2libGUgYnV0IHN0aWxsIGFzeW5jaHJvbm91c2x5LCBvbmNlIGFsbCBwZW5kaW5nIG1pY3JvLXRhc2tzIGFyZSBjb21wbGV0ZWQuXG4gICAqIC0gQW4gW09ic2VydmFibGVdKGd1aWRlL29ic2VydmFibGVzKSBmYWN0b3J5IGZ1bmN0aW9uOiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBgT2JzZXJ2YWJsZWAuXG4gICAqICAgICBUaGUgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIGF0IHJ1bnRpbWUgdG8gb2J0YWluIGFuZCBzdWJzY3JpYmUgdG8gdGhlIGBPYnNlcnZhYmxlYCBhbmQgdGhlXG4gICAqICAgICBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhcyBzb29uIGFzIHRoZSBmaXJzdCB2YWx1ZSBpcyBlbWl0dGVkLlxuICAgKlxuICAgKiBEZWZhdWx0OiAncmVnaXN0ZXJXaGVuU3RhYmxlOjMwMDAwJ1xuICAgKi9cbiAgcmVnaXN0cmF0aW9uU3RyYXRlZ3k/OiBzdHJpbmd8KCgpID0+IE9ic2VydmFibGU8dW5rbm93bj4pO1xufVxuXG5leHBvcnQgY29uc3QgU0NSSVBUID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ05HU1dfUkVHSVNURVJfU0NSSVBUJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3QXBwSW5pdGlhbGl6ZXIoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLCBzY3JpcHQ6IHN0cmluZywgb3B0aW9uczogU3dSZWdpc3RyYXRpb25PcHRpb25zLFxuICAgIHBsYXRmb3JtSWQ6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgcmV0dXJuICgpID0+IHtcbiAgICBpZiAoIShpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgJiZcbiAgICAgICAgICBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIGNvbnRyb2xsZXIgY2hhbmdlcywgYW5kIGZpcmUgYW4gSU5JVElBTElaRSBhY3Rpb24gd2hlbiBhIG5ldyBTV1xuICAgIC8vIGJlY29tZXMgYWN0aXZlLiBUaGlzIGFsbG93cyB0aGUgU1cgdG8gaW5pdGlhbGl6ZSBpdHNlbGYgZXZlbiBpZiB0aGVyZSBpcyBubyBhcHBsaWNhdGlvblxuICAgIC8vIHRyYWZmaWMuXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICE9PSBudWxsKSB7XG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ0lOSVRJQUxJWkUnfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcmVhZHlUb1JlZ2lzdGVyJDogT2JzZXJ2YWJsZTx1bmtub3duPjtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgW3N0cmF0ZWd5LCAuLi5hcmdzXSA9XG4gICAgICAgICAgKG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgfHwgJ3JlZ2lzdGVyV2hlblN0YWJsZTozMDAwMCcpLnNwbGl0KCc6Jyk7XG5cbiAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJJbW1lZGlhdGVseSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9mKG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldpdGhEZWxheSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IGRlbGF5V2l0aFRpbWVvdXQoK2FyZ3NbMF0gfHwgMCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2hlblN0YWJsZSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9ICFhcmdzWzBdID8gd2hlblN0YWJsZShpbmplY3RvcikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlKHdoZW5TdGFibGUoaW5qZWN0b3IpLCBkZWxheVdpdGhUaW1lb3V0KCthcmdzWzBdKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gVW5rbm93biBzdHJhdGVneS5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBVbmtub3duIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5OiAke29wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3l9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgcmV0dXJuIGFueXRoaW5nIHRvIGF2b2lkIGJsb2NraW5nIHRoZSBhcHBsaWNhdGlvbiB1bnRpbCB0aGUgU1cgaXMgcmVnaXN0ZXJlZC5cbiAgICAvLyBBbHNvLCBydW4gb3V0c2lkZSB0aGUgQW5ndWxhciB6b25lIHRvIGF2b2lkIHByZXZlbnRpbmcgdGhlIGFwcCBmcm9tIHN0YWJpbGl6aW5nIChlc3BlY2lhbGx5XG4gICAgLy8gZ2l2ZW4gdGhhdCBzb21lIHJlZ2lzdHJhdGlvbiBzdHJhdGVnaWVzIHdhaXQgZm9yIHRoZSBhcHAgdG8gc3RhYmlsaXplKS5cbiAgICAvLyBDYXRjaCBhbmQgbG9nIHRoZSBlcnJvciBpZiBTVyByZWdpc3RyYXRpb24gZmFpbHMgdG8gYXZvaWQgdW5jYXVnaHQgcmVqZWN0aW9uIHdhcm5pbmcuXG4gICAgY29uc3Qgbmdab25lID0gaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKFxuICAgICAgICAoKSA9PiByZWFkeVRvUmVnaXN0ZXIkLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihzY3JpcHQsIHtzY29wZTogb3B0aW9ucy5zY29wZX0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZCB3aXRoOicsIGVycikpKSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlbGF5V2l0aFRpbWVvdXQodGltZW91dDogbnVtYmVyKTogT2JzZXJ2YWJsZTx1bmtub3duPiB7XG4gIHJldHVybiBvZihudWxsKS5waXBlKGRlbGF5KHRpbWVvdXQpKTtcbn1cblxuZnVuY3Rpb24gd2hlblN0YWJsZShpbmplY3RvcjogSW5qZWN0b3IpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcbiAgY29uc3QgYXBwUmVmID0gaW5qZWN0b3IuZ2V0KEFwcGxpY2F0aW9uUmVmKTtcbiAgcmV0dXJuIGFwcFJlZi5pc1N0YWJsZS5waXBlKGZpbHRlcihzdGFibGUgPT4gc3RhYmxlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5KFxuICAgIG9wdHM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgcGxhdGZvcm1JZDogc3RyaW5nKTogTmdzd0NvbW1DaGFubmVsIHtcbiAgcmV0dXJuIG5ldyBOZ3N3Q29tbUNoYW5uZWwoXG4gICAgICBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiBvcHRzLmVuYWJsZWQgIT09IGZhbHNlID8gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtTd1B1c2gsIFN3VXBkYXRlXSxcbn0pXG5leHBvcnQgY2xhc3MgU2VydmljZVdvcmtlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZ2l2ZW4gQW5ndWxhciBTZXJ2aWNlIFdvcmtlciBzY3JpcHQuXG4gICAqXG4gICAqIElmIGBlbmFibGVkYCBpcyBzZXQgdG8gYGZhbHNlYCBpbiB0aGUgZ2l2ZW4gb3B0aW9ucywgdGhlIG1vZHVsZSB3aWxsIGJlaGF2ZSBhcyBpZiBzZXJ2aWNlXG4gICAqIHdvcmtlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGFuZCB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCBub3QgYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlcihzY3JpcHQ6IHN0cmluZywgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zID0ge30pOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVyczxTZXJ2aWNlV29ya2VyTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTZXJ2aWNlV29ya2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBTQ1JJUFQsIHVzZVZhbHVlOiBzY3JpcHR9LFxuICAgICAgICB7cHJvdmlkZTogU3dSZWdpc3RyYXRpb25PcHRpb25zLCB1c2VWYWx1ZTogb3B0c30sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBOZ3N3Q29tbUNoYW5uZWwsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0NvbW1DaGFubmVsRmFjdG9yeSxcbiAgICAgICAgICBkZXBzOiBbU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW0luamVjdG9yLCBTQ1JJUFQsIFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=