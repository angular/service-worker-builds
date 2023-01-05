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
export class ServiceWorkerModule {
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
ServiceWorkerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0-next.0+sha-0c5db1a", ngImport: i0, type: ServiceWorkerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ServiceWorkerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.0-next.0+sha-0c5db1a", ngImport: i0, type: ServiceWorkerModule });
ServiceWorkerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.0-next.0+sha-0c5db1a", ngImport: i0, type: ServiceWorkerModule, providers: [SwPush, SwUpdate] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0-next.0+sha-0c5db1a", ngImport: i0, type: ServiceWorkerModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [SwPush, SwUpdate],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUF1QixRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1SSxPQUFPLEVBQUMsS0FBSyxFQUFjLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbEM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLE9BQWdCLHFCQUFxQjtDQThDMUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQVMsc0JBQXNCLENBQUMsQ0FBQztBQUV6RSxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLFFBQWtCLEVBQUUsTUFBYyxFQUFFLE9BQThCLEVBQ2xFLFVBQWtCO0lBQ3BCLE9BQU8sR0FBRyxFQUFFO1FBQ1YsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBRUQsMEZBQTBGO1FBQzFGLDBGQUEwRjtRQUMxRixXQUFXO1FBQ1gsU0FBUyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7WUFDaEUsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQy9DLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO2FBQ3hFO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLGdCQUFxQyxDQUFDO1FBRTFDLElBQUksT0FBTyxPQUFPLENBQUMsb0JBQW9CLEtBQUssVUFBVSxFQUFFO1lBQ3RELGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQ25EO2FBQU07WUFDTCxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQ3JCLENBQUMsT0FBTyxDQUFDLG9CQUFvQixJQUFJLDBCQUEwQixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRTVFLFFBQVEsUUFBUSxFQUFFO2dCQUNoQixLQUFLLHFCQUFxQjtvQkFDeEIsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QixNQUFNO2dCQUNSLEtBQUssbUJBQW1CO29CQUN0QixnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDbkQsTUFBTTtnQkFDUixLQUFLLG9CQUFvQjtvQkFDdkIsZ0JBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO3dCQUN0QixLQUFLLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdEYsTUFBTTtnQkFDUjtvQkFDRSxvQkFBb0I7b0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQ1gsZ0RBQWdELE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7YUFDdkY7U0FDRjtRQUVELHNGQUFzRjtRQUN0Riw4RkFBOEY7UUFDOUYsMEVBQTBFO1FBQzFFLHdGQUF3RjtRQUN4RixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FDcEIsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FDMUMsR0FBRyxFQUFFLENBQ0QsU0FBUyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUMsQ0FBQzthQUMzRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE9BQWU7SUFDdkMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxRQUFrQjtJQUNwQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVDLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBRUQsTUFBTSxVQUFVLHNCQUFzQixDQUNsQyxJQUEyQixFQUFFLFVBQWtCO0lBQ2pELE9BQU8sSUFBSSxlQUFlLENBQ3RCLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekIsU0FBUyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVEOztHQUVHO0FBSUgsTUFBTSxPQUFPLG1CQUFtQjtJQUM5Qjs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBYyxFQUFFLE9BQThCLEVBQUU7UUFFOUQsT0FBTztZQUNMLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDO2dCQUNuQyxFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO2dCQUNoRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsVUFBVSxFQUFFLHNCQUFzQjtvQkFDbEMsSUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDO2lCQUMzQztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsVUFBVSxFQUFFLGtCQUFrQjtvQkFDOUIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxXQUFXLENBQUM7b0JBQzVELEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7MkhBM0JVLG1CQUFtQjs0SEFBbkIsbUJBQW1COzRIQUFuQixtQkFBbUIsYUFGbkIsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO3NHQUVsQixtQkFBbUI7a0JBSC9CLFFBQVE7bUJBQUM7b0JBQ1IsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQztpQkFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgTmdab25lLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtOZ3N3Q29tbUNoYW5uZWx9IGZyb20gJy4vbG93X2xldmVsJztcbmltcG9ydCB7U3dQdXNofSBmcm9tICcuL3B1c2gnO1xuaW1wb3J0IHtTd1VwZGF0ZX0gZnJvbSAnLi91cGRhdGUnO1xuXG4vKipcbiAqIFRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSBvcHRpb25zIGZvciBgU2VydmljZVdvcmtlck1vZHVsZWAgb3V0c2lkZSBvZlxuICogYFNlcnZpY2VXb3JrZXJNb2R1bGUucmVnaXN0ZXIoKWAuXG4gKlxuICogWW91IGNhbiB1c2UgdGhpcyB0b2tlbiB0byBkZWZpbmUgYSBwcm92aWRlciB0aGF0IGdlbmVyYXRlcyB0aGUgcmVnaXN0cmF0aW9uIG9wdGlvbnMgYXQgcnVudGltZSxcbiAqIGZvciBleGFtcGxlIHZpYSBhIGZ1bmN0aW9uIGNhbGw6XG4gKlxuICoge0BleGFtcGxlIHNlcnZpY2Utd29ya2VyL3JlZ2lzdHJhdGlvbi1vcHRpb25zL21vZHVsZS50cyByZWdpb249XCJyZWdpc3RyYXRpb24tb3B0aW9uc1wiXG4gKiAgICAgaGVhZGVyPVwiYXBwLm1vZHVsZS50c1wifVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN3UmVnaXN0cmF0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhbmQgdGhlIHJlbGF0ZWQgc2VydmljZXMgKHN1Y2ggYXMgYFN3UHVzaGAgYW5kXG4gICAqIGBTd1VwZGF0ZWApIHdpbGwgYXR0ZW1wdCB0byBjb21tdW5pY2F0ZSBhbmQgaW50ZXJhY3Qgd2l0aCBpdC5cbiAgICpcbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgZW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgVVJMIHRoYXQgZGVmaW5lcyB0aGUgU2VydmljZVdvcmtlcidzIHJlZ2lzdHJhdGlvbiBzY29wZTsgdGhhdCBpcywgd2hhdCByYW5nZSBvZiBVUkxzIGl0IGNhblxuICAgKiBjb250cm9sLiBJdCB3aWxsIGJlIHVzZWQgd2hlbiBjYWxsaW5nXG4gICAqIFtTZXJ2aWNlV29ya2VyQ29udGFpbmVyI3JlZ2lzdGVyKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TZXJ2aWNlV29ya2VyQ29udGFpbmVyL3JlZ2lzdGVyKS5cbiAgICovXG4gIHNjb3BlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdHJhdGVneSwgd2hpY2ggZGV0ZXJtaW5lcyB3aGVuIGl0IHdpbGwgYmUgcmVnaXN0ZXJlZFxuICAgKiB3aXRoIHRoZSBicm93c2VyLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBvZiByZWdpc3RlcmluZyBvbmNlIHRoZSBhcHBsaWNhdGlvbiBzdGFiaWxpemVzIChpLmUuIGFzIHNvb24gYXMgdGhlcmUgYXJlXG4gICAqIG5vIHBlbmRpbmcgbWljcm8tIGFuZCBtYWNyby10YXNrcykgaXMgZGVzaWduZWQgdG8gcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vbiBhc1xuICAgKiBwb3NzaWJsZSBidXQgd2l0aG91dCBhZmZlY3RpbmcgdGhlIGFwcGxpY2F0aW9uJ3MgZmlyc3QgdGltZSBsb2FkLlxuICAgKlxuICAgKiBTdGlsbCwgdGhlcmUgbWlnaHQgYmUgY2FzZXMgd2hlcmUgeW91IHdhbnQgbW9yZSBjb250cm9sIG92ZXIgd2hlbiB0aGUgU2VydmljZVdvcmtlciBpc1xuICAgKiByZWdpc3RlcmVkIChmb3IgZXhhbXBsZSwgdGhlcmUgbWlnaHQgYmUgYSBsb25nLXJ1bm5pbmcgdGltZW91dCBvciBwb2xsaW5nIGludGVydmFsLCBwcmV2ZW50aW5nXG4gICAqIHRoZSBhcHAgZnJvbSBzdGFiaWxpemluZykuIFRoZSBhdmFpbGFibGUgb3B0aW9uIGFyZTpcbiAgICpcbiAgICogLSBgcmVnaXN0ZXJXaGVuU3RhYmxlOjx0aW1lb3V0PmA6IFJlZ2lzdGVyIGFzIHNvb24gYXMgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKG5vIHBlbmRpbmdcbiAgICogICAgIG1pY3JvLS9tYWNyby10YXNrcykgYnV0IG5vIGxhdGVyIHRoYW4gYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzLiBJZiB0aGUgYXBwIGhhc24ndFxuICAgKiAgICAgc3RhYmlsaXplZCBhZnRlciBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMgKGZvciBleGFtcGxlLCBkdWUgdG8gYSByZWN1cnJlbnQgYXN5bmNocm9ub3VzXG4gICAqICAgICB0YXNrKSwgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFueXdheS5cbiAgICogICAgIElmIGA8dGltZW91dD5gIGlzIG9taXR0ZWQsIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgb25seSBiZSByZWdpc3RlcmVkIG9uY2UgdGhlIGFwcFxuICAgKiAgICAgc3RhYmlsaXplcy5cbiAgICogLSBgcmVnaXN0ZXJJbW1lZGlhdGVseWA6IFJlZ2lzdGVyIGltbWVkaWF0ZWx5LlxuICAgKiAtIGByZWdpc3RlcldpdGhEZWxheTo8dGltZW91dD5gOiBSZWdpc3RlciB3aXRoIGEgZGVsYXkgb2YgYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzLiBGb3JcbiAgICogICAgIGV4YW1wbGUsIHVzZSBgcmVnaXN0ZXJXaXRoRGVsYXk6NTAwMGAgdG8gcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYWZ0ZXIgNSBzZWNvbmRzLiBJZlxuICAgKiAgICAgYDx0aW1lb3V0PmAgaXMgb21pdHRlZCwgaXMgZGVmYXVsdHMgdG8gYDBgLCB3aGljaCB3aWxsIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFzIHNvb25cbiAgICogICAgIGFzIHBvc3NpYmxlIGJ1dCBzdGlsbCBhc3luY2hyb25vdXNseSwgb25jZSBhbGwgcGVuZGluZyBtaWNyby10YXNrcyBhcmUgY29tcGxldGVkLlxuICAgKiAtIEFuIFtPYnNlcnZhYmxlXShndWlkZS9vYnNlcnZhYmxlcykgZmFjdG9yeSBmdW5jdGlvbjogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYE9ic2VydmFibGVgLlxuICAgKiAgICAgVGhlIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBhdCBydW50aW1lIHRvIG9idGFpbiBhbmQgc3Vic2NyaWJlIHRvIHRoZSBgT2JzZXJ2YWJsZWAgYW5kIHRoZVxuICAgKiAgICAgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYXMgc29vbiBhcyB0aGUgZmlyc3QgdmFsdWUgaXMgZW1pdHRlZC5cbiAgICpcbiAgICogRGVmYXVsdDogJ3JlZ2lzdGVyV2hlblN0YWJsZTozMDAwMCdcbiAgICovXG4gIHJlZ2lzdHJhdGlvblN0cmF0ZWd5Pzogc3RyaW5nfCgoKSA9PiBPYnNlcnZhYmxlPHVua25vd24+KTtcbn1cblxuZXhwb3J0IGNvbnN0IFNDUklQVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdOR1NXX1JFR0lTVEVSX1NDUklQVCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0FwcEluaXRpYWxpemVyKFxuICAgIGluamVjdG9yOiBJbmplY3Rvciwgc2NyaXB0OiBzdHJpbmcsIG9wdGlvbnM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucyxcbiAgICBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBGdW5jdGlvbiB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgaWYgKCEoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpICYmXG4gICAgICAgICAgb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciBzZXJ2aWNlIHdvcmtlciBjb250cm9sbGVyIGNoYW5nZXMsIGFuZCBmaXJlIGFuIElOSVRJQUxJWkUgYWN0aW9uIHdoZW4gYSBuZXcgU1dcbiAgICAvLyBiZWNvbWVzIGFjdGl2ZS4gVGhpcyBhbGxvd3MgdGhlIFNXIHRvIGluaXRpYWxpemUgaXRzZWxmIGV2ZW4gaWYgdGhlcmUgaXMgbm8gYXBwbGljYXRpb25cbiAgICAvLyB0cmFmZmljLlxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciAhPT0gbnVsbCkge1xuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdJTklUSUFMSVpFJ30pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHJlYWR5VG9SZWdpc3RlciQ6IE9ic2VydmFibGU8dW5rbm93bj47XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtzdHJhdGVneSwgLi4uYXJnc10gPVxuICAgICAgICAgIChvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5IHx8ICdyZWdpc3RlcldoZW5TdGFibGU6MzAwMDAnKS5zcGxpdCgnOicpO1xuXG4gICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVySW1tZWRpYXRlbHknOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvZihudWxsKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJXaXRoRGVsYXknOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBkZWxheVdpdGhUaW1lb3V0KCthcmdzWzBdIHx8IDApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldoZW5TdGFibGUnOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSAhYXJnc1swXSA/IHdoZW5TdGFibGUoaW5qZWN0b3IpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZSh3aGVuU3RhYmxlKGluamVjdG9yKSwgZGVsYXlXaXRoVGltZW91dCgrYXJnc1swXSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIFVua25vd24gc3RyYXRlZ3kuXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBgVW5rbm93biBTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdHJhdGVneTogJHtvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5fWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERvbid0IHJldHVybiBhbnl0aGluZyB0byBhdm9pZCBibG9ja2luZyB0aGUgYXBwbGljYXRpb24gdW50aWwgdGhlIFNXIGlzIHJlZ2lzdGVyZWQuXG4gICAgLy8gQWxzbywgcnVuIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZSB0byBhdm9pZCBwcmV2ZW50aW5nIHRoZSBhcHAgZnJvbSBzdGFiaWxpemluZyAoZXNwZWNpYWxseVxuICAgIC8vIGdpdmVuIHRoYXQgc29tZSByZWdpc3RyYXRpb24gc3RyYXRlZ2llcyB3YWl0IGZvciB0aGUgYXBwIHRvIHN0YWJpbGl6ZSkuXG4gICAgLy8gQ2F0Y2ggYW5kIGxvZyB0aGUgZXJyb3IgaWYgU1cgcmVnaXN0cmF0aW9uIGZhaWxzIHRvIGF2b2lkIHVuY2F1Z2h0IHJlamVjdGlvbiB3YXJuaW5nLlxuICAgIGNvbnN0IG5nWm9uZSA9IGluamVjdG9yLmdldChOZ1pvbmUpO1xuICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcihcbiAgICAgICAgKCkgPT4gcmVhZHlUb1JlZ2lzdGVyJC5waXBlKHRha2UoMSkpLnN1YnNjcmliZShcbiAgICAgICAgICAgICgpID0+XG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc2NyaXB0LCB7c2NvcGU6IG9wdGlvbnMuc2NvcGV9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ1NlcnZpY2Ugd29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQgd2l0aDonLCBlcnIpKSkpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBkZWxheVdpdGhUaW1lb3V0KHRpbWVvdXQ6IG51bWJlcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICByZXR1cm4gb2YobnVsbCkucGlwZShkZWxheSh0aW1lb3V0KSk7XG59XG5cbmZ1bmN0aW9uIHdoZW5TdGFibGUoaW5qZWN0b3I6IEluamVjdG9yKTogT2JzZXJ2YWJsZTx1bmtub3duPiB7XG4gIGNvbnN0IGFwcFJlZiA9IGluamVjdG9yLmdldChBcHBsaWNhdGlvblJlZik7XG4gIHJldHVybiBhcHBSZWYuaXNTdGFibGUucGlwZShmaWx0ZXIoc3RhYmxlID0+IHN0YWJsZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0NvbW1DaGFubmVsRmFjdG9yeShcbiAgICBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHBsYXRmb3JtSWQ6IHN0cmluZyk6IE5nc3dDb21tQ2hhbm5lbCB7XG4gIHJldHVybiBuZXcgTmdzd0NvbW1DaGFubmVsKFxuICAgICAgaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgb3B0cy5lbmFibGVkICE9PSBmYWxzZSA/IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQpO1xufVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbU3dQdXNoLCBTd1VwZGF0ZV0sXG59KVxuZXhwb3J0IGNsYXNzIFNlcnZpY2VXb3JrZXJNb2R1bGUge1xuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGdpdmVuIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIgc2NyaXB0LlxuICAgKlxuICAgKiBJZiBgZW5hYmxlZGAgaXMgc2V0IHRvIGBmYWxzZWAgaW4gdGhlIGdpdmVuIG9wdGlvbnMsIHRoZSBtb2R1bGUgd2lsbCBiZWhhdmUgYXMgaWYgc2VydmljZVxuICAgKiB3b3JrZXJzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCBhbmQgdGhlIHNlcnZpY2Ugd29ya2VyIHdpbGwgbm90IGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBzdGF0aWMgcmVnaXN0ZXIoc2NyaXB0OiBzdHJpbmcsIG9wdHM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucyA9IHt9KTpcbiAgICAgIE1vZHVsZVdpdGhQcm92aWRlcnM8U2VydmljZVdvcmtlck1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU2VydmljZVdvcmtlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogU0NSSVBULCB1c2VWYWx1ZTogc2NyaXB0fSxcbiAgICAgICAge3Byb3ZpZGU6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgdXNlVmFsdWU6IG9wdHN9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTmdzd0NvbW1DaGFubmVsLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dDb21tQ2hhbm5lbEZhY3RvcnksXG4gICAgICAgICAgZGVwczogW1N3UmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0FwcEluaXRpYWxpemVyLFxuICAgICAgICAgIGRlcHM6IFtJbmplY3RvciwgU0NSSVBULCBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXSxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxufVxuIl19