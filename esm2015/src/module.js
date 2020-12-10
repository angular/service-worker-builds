/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformBrowser } from '@angular/common';
import { APP_INITIALIZER, ApplicationRef, ErrorHandler, InjectionToken, Injector, NgModule, NgZone, PLATFORM_ID } from '@angular/core';
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
        ngZone.runOutsideAngular(() => readyToRegister$.pipe(take(1)).subscribe(() => navigator.serviceWorker.register(script, { scope: options.scope }).catch(err => {
            const errorHandler = injector.get(ErrorHandler);
            errorHandler.handleError(err);
        })));
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
ServiceWorkerModule.ɵmod = i0.ɵɵdefineNgModule({ type: ServiceWorkerModule });
ServiceWorkerModule.ɵinj = i0.ɵɵdefineInjector({ factory: function ServiceWorkerModule_Factory(t) { return new (t || ServiceWorkerModule)(); }, providers: [SwPush, SwUpdate] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ServiceWorkerModule, [{
        type: NgModule,
        args: [{
                providers: [SwPush, SwUpdate],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUosT0FBTyxFQUFDLEtBQUssRUFBYyxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxVQUFVLENBQUM7O0FBRWxDOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxPQUFnQixxQkFBcUI7Q0E4QzFDO0FBRUQsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFTLHNCQUFzQixDQUFDLENBQUM7QUFFekUsTUFBTSxVQUFVLGtCQUFrQixDQUM5QixRQUFrQixFQUFFLE1BQWMsRUFBRSxPQUE4QixFQUNsRSxVQUFrQjtJQUNwQixNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7UUFDdkIsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBRUQsMEZB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ICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FQUF9JTklUSUFMSVpFUiwgQXBwbGljYXRpb25SZWYsIEVycm9ySGFuZGxlciwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgTmdab25lLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtOZ3N3Q29tbUNoYW5uZWx9IGZyb20gJy4vbG93X2xldmVsJztcbmltcG9ydCB7U3dQdXNofSBmcm9tICcuL3B1c2gnO1xuaW1wb3J0IHtTd1VwZGF0ZX0gZnJvbSAnLi91cGRhdGUnO1xuXG4vKipcbiAqIFRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSBvcHRpb25zIGZvciBgU2VydmljZVdvcmtlck1vZHVsZWAgb3V0c2lkZSBvZlxuICogYFNlcnZpY2VXb3JrZXJNb2R1bGUucmVnaXN0ZXIoKWAuXG4gKlxuICogWW91IGNhbiB1c2UgdGhpcyB0b2tlbiB0byBkZWZpbmUgYSBwcm92aWRlciB0aGF0IGdlbmVyYXRlcyB0aGUgcmVnaXN0cmF0aW9uIG9wdGlvbnMgYXQgcnVudGltZSxcbiAqIGZvciBleGFtcGxlIHZpYSBhIGZ1bmN0aW9uIGNhbGw6XG4gKlxuICoge0BleGFtcGxlIHNlcnZpY2Utd29ya2VyL3JlZ2lzdHJhdGlvbi1vcHRpb25zL21vZHVsZS50cyByZWdpb249XCJyZWdpc3RyYXRpb24tb3B0aW9uc1wiXG4gKiAgICAgaGVhZGVyPVwiYXBwLm1vZHVsZS50c1wifVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN3UmVnaXN0cmF0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhbmQgdGhlIHJlbGF0ZWQgc2VydmljZXMgKHN1Y2ggYXMgYFN3UHVzaGAgYW5kXG4gICAqIGBTd1VwZGF0ZWApIHdpbGwgYXR0ZW1wdCB0byBjb21tdW5pY2F0ZSBhbmQgaW50ZXJhY3Qgd2l0aCBpdC5cbiAgICpcbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgZW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgVVJMIHRoYXQgZGVmaW5lcyB0aGUgU2VydmljZVdvcmtlcidzIHJlZ2lzdHJhdGlvbiBzY29wZTsgdGhhdCBpcywgd2hhdCByYW5nZSBvZiBVUkxzIGl0IGNhblxuICAgKiBjb250cm9sLiBJdCB3aWxsIGJlIHVzZWQgd2hlbiBjYWxsaW5nXG4gICAqIFtTZXJ2aWNlV29ya2VyQ29udGFpbmVyI3JlZ2lzdGVyKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TZXJ2aWNlV29ya2VyQ29udGFpbmVyL3JlZ2lzdGVyKS5cbiAgICovXG4gIHNjb3BlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdHJhdGVneSwgd2hpY2ggZGV0ZXJtaW5lcyB3aGVuIGl0IHdpbGwgYmUgcmVnaXN0ZXJlZFxuICAgKiB3aXRoIHRoZSBicm93c2VyLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBvZiByZWdpc3RlcmluZyBvbmNlIHRoZSBhcHBsaWNhdGlvbiBzdGFiaWxpemVzIChpLmUuIGFzIHNvb24gYXMgdGhlcmUgYXJlXG4gICAqIG5vIHBlbmRpbmcgbWljcm8tIGFuZCBtYWNyby10YXNrcykgaXMgZGVzaWduZWQgdG8gcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vbiBhc1xuICAgKiBwb3NzaWJsZSBidXQgd2l0aG91dCBhZmZlY3RpbmcgdGhlIGFwcGxpY2F0aW9uJ3MgZmlyc3QgdGltZSBsb2FkLlxuICAgKlxuICAgKiBTdGlsbCwgdGhlcmUgbWlnaHQgYmUgY2FzZXMgd2hlcmUgeW91IHdhbnQgbW9yZSBjb250cm9sIG92ZXIgd2hlbiB0aGUgU2VydmljZVdvcmtlciBpc1xuICAgKiByZWdpc3RlcmVkIChmb3IgZXhhbXBsZSwgdGhlcmUgbWlnaHQgYmUgYSBsb25nLXJ1bm5pbmcgdGltZW91dCBvciBwb2xsaW5nIGludGVydmFsLCBwcmV2ZW50aW5nXG4gICAqIHRoZSBhcHAgZnJvbSBzdGFiaWxpemluZykuIFRoZSBhdmFpbGFibGUgb3B0aW9uIGFyZTpcbiAgICpcbiAgICogLSBgcmVnaXN0ZXJXaGVuU3RhYmxlOjx0aW1lb3V0PmA6IFJlZ2lzdGVyIGFzIHNvb24gYXMgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKG5vIHBlbmRpbmdcbiAgICogICAgIG1pY3JvLS9tYWNyby10YXNrcykgYnV0IG5vIGxhdGVyIHRoYW4gYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzLiBJZiB0aGUgYXBwIGhhc24ndFxuICAgKiAgICAgc3RhYmlsaXplZCBhZnRlciBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMgKGZvciBleGFtcGxlLCBkdWUgdG8gYSByZWN1cnJlbnQgYXN5bmNocm9ub3VzXG4gICAqICAgICB0YXNrKSwgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFueXdheS5cbiAgICogICAgIElmIGA8dGltZW91dD5gIGlzIG9taXR0ZWQsIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgb25seSBiZSByZWdpc3RlcmVkIG9uY2UgdGhlIGFwcFxuICAgKiAgICAgc3RhYmlsaXplcy5cbiAgICogLSBgcmVnaXN0ZXJJbW1lZGlhdGVseWA6IFJlZ2lzdGVyIGltbWVkaWF0ZWx5LlxuICAgKiAtIGByZWdpc3RlcldpdGhEZWxheTo8dGltZW91dD5gOiBSZWdpc3RlciB3aXRoIGEgZGVsYXkgb2YgYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzLiBGb3JcbiAgICogICAgIGV4YW1wbGUsIHVzZSBgcmVnaXN0ZXJXaXRoRGVsYXk6NTAwMGAgdG8gcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYWZ0ZXIgNSBzZWNvbmRzLiBJZlxuICAgKiAgICAgYDx0aW1lb3V0PmAgaXMgb21pdHRlZCwgaXMgZGVmYXVsdHMgdG8gYDBgLCB3aGljaCB3aWxsIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFzIHNvb25cbiAgICogICAgIGFzIHBvc3NpYmxlIGJ1dCBzdGlsbCBhc3luY2hyb25vdXNseSwgb25jZSBhbGwgcGVuZGluZyBtaWNyby10YXNrcyBhcmUgY29tcGxldGVkLlxuICAgKiAtIEFuIFtPYnNlcnZhYmxlXShndWlkZS9vYnNlcnZhYmxlcykgZmFjdG9yeSBmdW5jdGlvbjogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYE9ic2VydmFibGVgLlxuICAgKiAgICAgVGhlIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBhdCBydW50aW1lIHRvIG9idGFpbiBhbmQgc3Vic2NyaWJlIHRvIHRoZSBgT2JzZXJ2YWJsZWAgYW5kIHRoZVxuICAgKiAgICAgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYXMgc29vbiBhcyB0aGUgZmlyc3QgdmFsdWUgaXMgZW1pdHRlZC5cbiAgICpcbiAgICogRGVmYXVsdDogJ3JlZ2lzdGVyV2hlblN0YWJsZTozMDAwMCdcbiAgICovXG4gIHJlZ2lzdHJhdGlvblN0cmF0ZWd5Pzogc3RyaW5nfCgoKSA9PiBPYnNlcnZhYmxlPHVua25vd24+KTtcbn1cblxuZXhwb3J0IGNvbnN0IFNDUklQVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdOR1NXX1JFR0lTVEVSX1NDUklQVCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0FwcEluaXRpYWxpemVyKFxuICAgIGluamVjdG9yOiBJbmplY3Rvciwgc2NyaXB0OiBzdHJpbmcsIG9wdGlvbnM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucyxcbiAgICBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBGdW5jdGlvbiB7XG4gIGNvbnN0IGluaXRpYWxpemVyID0gKCkgPT4ge1xuICAgIGlmICghKGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSAmJlxuICAgICAgICAgIG9wdGlvbnMuZW5hYmxlZCAhPT0gZmFsc2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2FpdCBmb3Igc2VydmljZSB3b3JrZXIgY29udHJvbGxlciBjaGFuZ2VzLCBhbmQgZmlyZSBhbiBJTklUSUFMSVpFIGFjdGlvbiB3aGVuIGEgbmV3IFNXXG4gICAgLy8gYmVjb21lcyBhY3RpdmUuIFRoaXMgYWxsb3dzIHRoZSBTVyB0byBpbml0aWFsaXplIGl0c2VsZiBldmVuIGlmIHRoZXJlIGlzIG5vIGFwcGxpY2F0aW9uXG4gICAgLy8gdHJhZmZpYy5cbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuICAgICAgaWYgKG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgIT09IG51bGwpIHtcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlci5wb3N0TWVzc2FnZSh7YWN0aW9uOiAnSU5JVElBTElaRSd9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCByZWFkeVRvUmVnaXN0ZXIkOiBPYnNlcnZhYmxlPHVua25vd24+O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBbc3RyYXRlZ3ksIC4uLmFyZ3NdID1cbiAgICAgICAgICAob3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSB8fCAncmVnaXN0ZXJXaGVuU3RhYmxlOjMwMDAwJykuc3BsaXQoJzonKTtcblxuICAgICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgICBjYXNlICdyZWdpc3RlckltbWVkaWF0ZWx5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb2YobnVsbCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2l0aERlbGF5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gZGVsYXlXaXRoVGltZW91dCgrYXJnc1swXSB8fCAwKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJXaGVuU3RhYmxlJzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gIWFyZ3NbMF0gPyB3aGVuU3RhYmxlKGluamVjdG9yKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2Uod2hlblN0YWJsZShpbmplY3RvciksIGRlbGF5V2l0aFRpbWVvdXQoK2FyZ3NbMF0pKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBVbmtub3duIHN0cmF0ZWd5LlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYFVua25vd24gU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3k6ICR7b3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEb24ndCByZXR1cm4gYW55dGhpbmcgdG8gYXZvaWQgYmxvY2tpbmcgdGhlIGFwcGxpY2F0aW9uIHVudGlsIHRoZSBTVyBpcyByZWdpc3RlcmVkLlxuICAgIC8vIEFsc28sIHJ1biBvdXRzaWRlIHRoZSBBbmd1bGFyIHpvbmUgdG8gYXZvaWQgcHJldmVudGluZyB0aGUgYXBwIGZyb20gc3RhYmlsaXppbmcgKGVzcGVjaWFsbHlcbiAgICAvLyBnaXZlbiB0aGF0IHNvbWUgcmVnaXN0cmF0aW9uIHN0cmF0ZWdpZXMgd2FpdCBmb3IgdGhlIGFwcCB0byBzdGFiaWxpemUpLlxuICAgIC8vIENhdGNoIGFuZCBsb2cgdGhlIGVycm9yIGlmIFNXIHJlZ2lzdHJhdGlvbiBmYWlscyB0byBhdm9pZCB1bmNhdWdodCByZWplY3Rpb24gd2FybmluZy5cbiAgICBjb25zdCBuZ1pvbmUgPSBpbmplY3Rvci5nZXQoTmdab25lKTtcbiAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoXG4gICAgICAgICgpID0+IHJlYWR5VG9SZWdpc3RlciQucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoKSA9PiBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihzY3JpcHQsIHtzY29wZTogb3B0aW9ucy5zY29wZX0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVycm9ySGFuZGxlciA9IGluamVjdG9yLmdldChFcnJvckhhbmRsZXIpO1xuICAgICAgICAgICAgICBlcnJvckhhbmRsZXIuaGFuZGxlRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH0pKSk7XG4gIH07XG4gIHJldHVybiBpbml0aWFsaXplcjtcbn1cblxuZnVuY3Rpb24gZGVsYXlXaXRoVGltZW91dCh0aW1lb3V0OiBudW1iZXIpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcbiAgcmV0dXJuIG9mKG51bGwpLnBpcGUoZGVsYXkodGltZW91dCkpO1xufVxuXG5mdW5jdGlvbiB3aGVuU3RhYmxlKGluamVjdG9yOiBJbmplY3Rvcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCBhcHBSZWYgPSBpbmplY3Rvci5nZXQoQXBwbGljYXRpb25SZWYpO1xuICByZXR1cm4gYXBwUmVmLmlzU3RhYmxlLnBpcGUoZmlsdGVyKHN0YWJsZSA9PiBzdGFibGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dDb21tQ2hhbm5lbEZhY3RvcnkoXG4gICAgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zLCBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBOZ3N3Q29tbUNoYW5uZWwge1xuICByZXR1cm4gbmV3IE5nc3dDb21tQ2hhbm5lbChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmIG9wdHMuZW5hYmxlZCAhPT0gZmFsc2UgPyBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1N3UHVzaCwgU3dVcGRhdGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlV29ya2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBnaXZlbiBBbmd1bGFyIFNlcnZpY2UgV29ya2VyIHNjcmlwdC5cbiAgICpcbiAgICogSWYgYGVuYWJsZWRgIGlzIHNldCB0byBgZmFsc2VgIGluIHRoZSBnaXZlbiBvcHRpb25zLCB0aGUgbW9kdWxlIHdpbGwgYmVoYXZlIGFzIGlmIHNlcnZpY2VcbiAgICogd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIHRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyKHNjcmlwdDogc3RyaW5nLCBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMgPSB7fSk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPFNlcnZpY2VXb3JrZXJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNlcnZpY2VXb3JrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IFNDUklQVCwgdXNlVmFsdWU6IHNjcmlwdH0sXG4gICAgICAgIHtwcm92aWRlOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHVzZVZhbHVlOiBvcHRzfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5nc3dDb21tQ2hhbm5lbCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF0sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==