/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate } from "tslib";
import { isPlatformBrowser } from '@angular/common';
import { APP_INITIALIZER, ApplicationRef, InjectionToken, Injector, NgModule, NgZone, PLATFORM_ID } from '@angular/core';
import { merge, of } from 'rxjs';
import { delay, filter, take } from 'rxjs/operators';
import { NgswCommChannel } from './low_level';
import { SwPush } from './push';
import { SwUpdate } from './update';
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
    const initializer = () => {
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
    return initializer;
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
let ServiceWorkerModule = /** @class */ (() => {
    var ServiceWorkerModule_1;
    let ServiceWorkerModule = ServiceWorkerModule_1 = class ServiceWorkerModule {
        /**
         * Register the given Angular Service Worker script.
         *
         * If `enabled` is set to `false` in the given options, the module will behave as if service
         * workers are not supported by the browser, and the service worker will not be registered.
         */
        static register(script, opts = {}) {
            return {
                ngModule: ServiceWorkerModule_1,
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
    };
    ServiceWorkerModule = ServiceWorkerModule_1 = __decorate([
        NgModule({
            providers: [SwPush, SwUpdate],
        })
    ], ServiceWorkerModule);
    return ServiceWorkerModule;
})();
export { ServiceWorkerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUksT0FBTyxFQUFDLEtBQUssRUFBYyxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFbEM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLE9BQWdCLHFCQUFxQjtDQThDMUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQVMsc0JBQXNCLENBQUMsQ0FBQztBQUV6RSxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLFFBQWtCLEVBQUUsTUFBYyxFQUFFLE9BQThCLEVBQ2xFLFVBQWtCO0lBQ3BCLE1BQU0sV0FBVyxHQUFHLEdBQUcsRUFBRTtRQUN2QixJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxTQUFTLENBQUM7WUFDL0QsT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFFRCwwRkFBMEY7UUFDMUYsMEZBQTBGO1FBQzFGLFdBQVc7UUFDWCxTQUFTLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtZQUNoRSxJQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxLQUFLLElBQUksRUFBRTtnQkFDL0MsU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEVBQUMsTUFBTSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7YUFDeEU7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksZ0JBQXFDLENBQUM7UUFFMUMsSUFBSSxPQUFPLE9BQU8sQ0FBQyxvQkFBb0IsS0FBSyxVQUFVLEVBQUU7WUFDdEQsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDbkQ7YUFBTTtZQUNMLE1BQU0sQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FDckIsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLElBQUksMEJBQTBCLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFFNUUsUUFBUSxRQUFRLEVBQUU7Z0JBQ2hCLEtBQUsscUJBQXFCO29CQUN4QixnQkFBZ0IsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVCLE1BQU07Z0JBQ1IsS0FBSyxtQkFBbUI7b0JBQ3RCLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNuRCxNQUFNO2dCQUNSLEtBQUssb0JBQW9CO29CQUN2QixnQkFBZ0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7d0JBQ3RCLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RixNQUFNO2dCQUNSO29CQUNFLG9CQUFvQjtvQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FDWCxnREFBZ0QsT0FBTyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQzthQUN2RjtTQUNGO1FBRUQsc0ZBQXNGO1FBQ3RGLDhGQUE4RjtRQUM5RiwwRUFBMEU7UUFDMUUsd0ZBQXdGO1FBQ3hGLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDcEMsTUFBTSxDQUFDLGlCQUFpQixDQUNwQixHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUMxQyxHQUFHLEVBQUUsQ0FDRCxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDO2FBQzNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEcsQ0FBQyxDQUFDO0lBQ0YsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVELFNBQVMsZ0JBQWdCLENBQUMsT0FBZTtJQUN2QyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDdkMsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLFFBQWtCO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUMsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRCxNQUFNLFVBQVUsc0JBQXNCLENBQ2xDLElBQTJCLEVBQUUsVUFBa0I7SUFDakQsT0FBTyxJQUFJLGVBQWUsQ0FDdEIsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN6QixTQUFTLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7O0dBRUc7QUFJSDs7SUFBQSxJQUFhLG1CQUFtQiwyQkFBaEMsTUFBYSxtQkFBbUI7UUFDOUI7Ozs7O1dBS0c7UUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWMsRUFBRSxPQUE4QixFQUFFO1lBRTlELE9BQU87Z0JBQ0wsUUFBUSxFQUFFLHFCQUFtQjtnQkFDN0IsU0FBUyxFQUFFO29CQUNULEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDO29CQUNuQyxFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO29CQUNoRDt3QkFDRSxPQUFPLEVBQUUsZUFBZTt3QkFDeEIsVUFBVSxFQUFFLHNCQUFzQjt3QkFDbEMsSUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDO3FCQUMzQztvQkFDRDt3QkFDRSxPQUFPLEVBQUUsZUFBZTt3QkFDeEIsVUFBVSxFQUFFLGtCQUFrQjt3QkFDOUIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxXQUFXLENBQUM7d0JBQzVELEtBQUssRUFBRSxJQUFJO3FCQUNaO2lCQUNGO2FBQ0YsQ0FBQztRQUNKLENBQUM7S0FDRixDQUFBO0lBNUJZLG1CQUFtQjtRQUgvQixRQUFRLENBQUM7WUFDUixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO1NBQzlCLENBQUM7T0FDVyxtQkFBbUIsQ0E0Qi9CO0lBQUQsMEJBQUM7S0FBQTtTQTVCWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgTmdab25lLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtOZ3N3Q29tbUNoYW5uZWx9IGZyb20gJy4vbG93X2xldmVsJztcbmltcG9ydCB7U3dQdXNofSBmcm9tICcuL3B1c2gnO1xuaW1wb3J0IHtTd1VwZGF0ZX0gZnJvbSAnLi91cGRhdGUnO1xuXG4vKipcbiAqIFRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSBvcHRpb25zIGZvciBgU2VydmljZVdvcmtlck1vZHVsZWAgb3V0c2lkZSBvZlxuICogYFNlcnZpY2VXb3JrZXJNb2R1bGUucmVnaXN0ZXIoKWAuXG4gKlxuICogWW91IGNhbiB1c2UgdGhpcyB0b2tlbiB0byBkZWZpbmUgYSBwcm92aWRlciB0aGF0IGdlbmVyYXRlcyB0aGUgcmVnaXN0cmF0aW9uIG9wdGlvbnMgYXQgcnVudGltZSxcbiAqIGZvciBleGFtcGxlIHZpYSBhIGZ1bmN0aW9uIGNhbGw6XG4gKlxuICoge0BleGFtcGxlIHNlcnZpY2Utd29ya2VyL3JlZ2lzdHJhdGlvbi1vcHRpb25zL21vZHVsZS50cyByZWdpb249XCJyZWdpc3RyYXRpb24tb3B0aW9uc1wiXG4gKiAgICAgaGVhZGVyPVwiYXBwLm1vZHVsZS50c1wifVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN3UmVnaXN0cmF0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhbmQgdGhlIHJlbGF0ZWQgc2VydmljZXMgKHN1Y2ggYXMgYFN3UHVzaGAgYW5kXG4gICAqIGBTd1VwZGF0ZWApIHdpbGwgYXR0ZW1wdCB0byBjb21tdW5pY2F0ZSBhbmQgaW50ZXJhY3Qgd2l0aCBpdC5cbiAgICpcbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgZW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgVVJMIHRoYXQgZGVmaW5lcyB0aGUgU2VydmljZVdvcmtlcidzIHJlZ2lzdHJhdGlvbiBzY29wZTsgdGhhdCBpcywgd2hhdCByYW5nZSBvZiBVUkxzIGl0IGNhblxuICAgKiBjb250cm9sLiBJdCB3aWxsIGJlIHVzZWQgd2hlbiBjYWxsaW5nXG4gICAqIFtTZXJ2aWNlV29ya2VyQ29udGFpbmVyI3JlZ2lzdGVyKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TZXJ2aWNlV29ya2VyQ29udGFpbmVyL3JlZ2lzdGVyKS5cbiAgICovXG4gIHNjb3BlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdHJhdGVneSwgd2hpY2ggZGV0ZXJtaW5lcyB3aGVuIGl0IHdpbGwgYmUgcmVnaXN0ZXJlZFxuICAgKiB3aXRoIHRoZSBicm93c2VyLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBvZiByZWdpc3RlcmluZyBvbmNlIHRoZSBhcHBsaWNhdGlvbiBzdGFiaWxpemVzIChpLmUuIGFzIHNvb24gYXMgdGhlcmUgYXJlXG4gICAqIG5vIHBlbmRpbmcgbWljcm8tIGFuZCBtYWNyby10YXNrcyksIGlzIGRlc2lnbmVkIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFzIHNvb24gYXMgcG9zc2libGVcbiAgICogYnV0IHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBhcHBsaWNhdGlvbidzIGZpcnN0IHRpbWUgbG9hZC5cbiAgICpcbiAgICogU3RpbGwsIHRoZXJlIG1pZ2h0IGJlIGNhc2VzIHdoZXJlIHlvdSB3YW50IG1vcmUgY29udHJvbCBvdmVyIHdoZW4gdGhlIFNlcnZpY2VXb3JrZXIgaXNcbiAgICogcmVnaXN0ZXJlZCAoZS5nLiB0aGVyZSBtaWdodCBiZSBhIGxvbmctcnVubmluZyB0aW1lb3V0IG9yIHBvbGxpbmcgaW50ZXJ2YWwsIHByZXZlbnRpbmcgdGhlIGFwcFxuICAgKiB0byBzdGFiaWxpemUpLiBUaGUgYXZhaWxhYmxlIG9wdGlvbiBhcmU6XG4gICAqXG4gICAqIC0gYHJlZ2lzdGVyV2hlblN0YWJsZTo8dGltZW91dD5gOiBSZWdpc3RlciBhcyBzb29uIGFzIHRoZSBhcHBsaWNhdGlvbiBzdGFiaWxpemVzIChubyBwZW5kaW5nXG4gICAqICAgICBtaWNyby0vbWFjcm8tdGFza3MpIGJ1dCBubyBsYXRlciB0aGFuIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcy4gSWYgdGhlIGFwcCBoYXNuJ3RcbiAgICogICAgIHN0YWJpbGl6ZWQgYWZ0ZXIgYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzIChmb3IgZXhhbXBsZSwgZHVlIHRvIGEgcmVjdXJyZW50IGFzeW5jaHJvbm91c1xuICAgKiAgICAgdGFzayksIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhbnl3YXkuXG4gICAqICAgICBJZiBgPHRpbWVvdXQ+YCBpcyBvbWl0dGVkLCB0aGUgU2VydmljZVdvcmtlciB3aWxsIG9ubHkgYmUgcmVnaXN0ZXJlZCBvbmNlIHRoZSBhcHBcbiAgICogICAgIHN0YWJpbGl6ZXMuXG4gICAqIC0gYHJlZ2lzdGVySW1tZWRpYXRlbHlgOiBSZWdpc3RlciBpbW1lZGlhdGVseS5cbiAgICogLSBgcmVnaXN0ZXJXaXRoRGVsYXk6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgd2l0aCBhIGRlbGF5IG9mIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcy4gRm9yXG4gICAqICAgICBleGFtcGxlLCB1c2UgYHJlZ2lzdGVyV2l0aERlbGF5OjUwMDBgIHRvIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFmdGVyIDUgc2Vjb25kcy4gSWZcbiAgICogICAgIGA8dGltZW91dD5gIGlzIG9taXR0ZWQsIGlzIGRlZmF1bHRzIHRvIGAwYCwgd2hpY2ggd2lsbCByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uXG4gICAqICAgICBhcyBwb3NzaWJsZSBidXQgc3RpbGwgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIHBlbmRpbmcgbWljcm8tdGFza3MgYXJlIGNvbXBsZXRlZC5cbiAgICogLSBBbiBbT2JzZXJ2YWJsZV0oZ3VpZGUvb2JzZXJ2YWJsZXMpIGZhY3RvcnkgZnVuY3Rpb246IEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGBPYnNlcnZhYmxlYC5cbiAgICogICAgIFRoZSBmdW5jdGlvbiB3aWxsIGJlIHVzZWQgYXQgcnVudGltZSB0byBvYnRhaW4gYW5kIHN1YnNjcmliZSB0byB0aGUgYE9ic2VydmFibGVgIGFuZCB0aGVcbiAgICogICAgIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFzIHNvb24gYXMgdGhlIGZpcnN0IHZhbHVlIGlzIGVtaXR0ZWQuXG4gICAqXG4gICAqIERlZmF1bHQ6ICdyZWdpc3RlcldoZW5TdGFibGUnXG4gICAqL1xuICByZWdpc3RyYXRpb25TdHJhdGVneT86IHN0cmluZ3woKCkgPT4gT2JzZXJ2YWJsZTx1bmtub3duPik7XG59XG5cbmV4cG9ydCBjb25zdCBTQ1JJUFQgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignTkdTV19SRUdJU1RFUl9TQ1JJUFQnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dBcHBJbml0aWFsaXplcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsIHNjcmlwdDogc3RyaW5nLCBvcHRpb25zOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsXG4gICAgcGxhdGZvcm1JZDogc3RyaW5nKTogRnVuY3Rpb24ge1xuICBjb25zdCBpbml0aWFsaXplciA9ICgpID0+IHtcbiAgICBpZiAoIShpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgJiZcbiAgICAgICAgICBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIGNvbnRyb2xsZXIgY2hhbmdlcywgYW5kIGZpcmUgYW4gSU5JVElBTElaRSBhY3Rpb24gd2hlbiBhIG5ldyBTV1xuICAgIC8vIGJlY29tZXMgYWN0aXZlLiBUaGlzIGFsbG93cyB0aGUgU1cgdG8gaW5pdGlhbGl6ZSBpdHNlbGYgZXZlbiBpZiB0aGVyZSBpcyBubyBhcHBsaWNhdGlvblxuICAgIC8vIHRyYWZmaWMuXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICE9PSBudWxsKSB7XG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ0lOSVRJQUxJWkUnfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcmVhZHlUb1JlZ2lzdGVyJDogT2JzZXJ2YWJsZTx1bmtub3duPjtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgW3N0cmF0ZWd5LCAuLi5hcmdzXSA9XG4gICAgICAgICAgKG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgfHwgJ3JlZ2lzdGVyV2hlblN0YWJsZTozMDAwMCcpLnNwbGl0KCc6Jyk7XG5cbiAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJJbW1lZGlhdGVseSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9mKG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldpdGhEZWxheSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IGRlbGF5V2l0aFRpbWVvdXQoK2FyZ3NbMF0gfHwgMCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2hlblN0YWJsZSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9ICFhcmdzWzBdID8gd2hlblN0YWJsZShpbmplY3RvcikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlKHdoZW5TdGFibGUoaW5qZWN0b3IpLCBkZWxheVdpdGhUaW1lb3V0KCthcmdzWzBdKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gVW5rbm93biBzdHJhdGVneS5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBVbmtub3duIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5OiAke29wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3l9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgcmV0dXJuIGFueXRoaW5nIHRvIGF2b2lkIGJsb2NraW5nIHRoZSBhcHBsaWNhdGlvbiB1bnRpbCB0aGUgU1cgaXMgcmVnaXN0ZXJlZC5cbiAgICAvLyBBbHNvLCBydW4gb3V0c2lkZSB0aGUgQW5ndWxhciB6b25lIHRvIGF2b2lkIHByZXZlbnRpbmcgdGhlIGFwcCBmcm9tIHN0YWJpbGl6aW5nIChlc3BlY2lhbGx5XG4gICAgLy8gZ2l2ZW4gdGhhdCBzb21lIHJlZ2lzdHJhdGlvbiBzdHJhdGVnaWVzIHdhaXQgZm9yIHRoZSBhcHAgdG8gc3RhYmlsaXplKS5cbiAgICAvLyBDYXRjaCBhbmQgbG9nIHRoZSBlcnJvciBpZiBTVyByZWdpc3RyYXRpb24gZmFpbHMgdG8gYXZvaWQgdW5jYXVnaHQgcmVqZWN0aW9uIHdhcm5pbmcuXG4gICAgY29uc3Qgbmdab25lID0gaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKFxuICAgICAgICAoKSA9PiByZWFkeVRvUmVnaXN0ZXIkLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihzY3JpcHQsIHtzY29wZTogb3B0aW9ucy5zY29wZX0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZCB3aXRoOicsIGVycikpKSk7XG4gIH07XG4gIHJldHVybiBpbml0aWFsaXplcjtcbn1cblxuZnVuY3Rpb24gZGVsYXlXaXRoVGltZW91dCh0aW1lb3V0OiBudW1iZXIpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcbiAgcmV0dXJuIG9mKG51bGwpLnBpcGUoZGVsYXkodGltZW91dCkpO1xufVxuXG5mdW5jdGlvbiB3aGVuU3RhYmxlKGluamVjdG9yOiBJbmplY3Rvcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCBhcHBSZWYgPSBpbmplY3Rvci5nZXQoQXBwbGljYXRpb25SZWYpO1xuICByZXR1cm4gYXBwUmVmLmlzU3RhYmxlLnBpcGUoZmlsdGVyKHN0YWJsZSA9PiBzdGFibGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dDb21tQ2hhbm5lbEZhY3RvcnkoXG4gICAgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zLCBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBOZ3N3Q29tbUNoYW5uZWwge1xuICByZXR1cm4gbmV3IE5nc3dDb21tQ2hhbm5lbChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmIG9wdHMuZW5hYmxlZCAhPT0gZmFsc2UgPyBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1N3UHVzaCwgU3dVcGRhdGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlV29ya2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBnaXZlbiBBbmd1bGFyIFNlcnZpY2UgV29ya2VyIHNjcmlwdC5cbiAgICpcbiAgICogSWYgYGVuYWJsZWRgIGlzIHNldCB0byBgZmFsc2VgIGluIHRoZSBnaXZlbiBvcHRpb25zLCB0aGUgbW9kdWxlIHdpbGwgYmVoYXZlIGFzIGlmIHNlcnZpY2VcbiAgICogd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIHRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyKHNjcmlwdDogc3RyaW5nLCBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMgPSB7fSk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPFNlcnZpY2VXb3JrZXJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNlcnZpY2VXb3JrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IFNDUklQVCwgdXNlVmFsdWU6IHNjcmlwdH0sXG4gICAgICAgIHtwcm92aWRlOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHVzZVZhbHVlOiBvcHRzfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5nc3dDb21tQ2hhbm5lbCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF0sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==