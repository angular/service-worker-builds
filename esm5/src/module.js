/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __read } from "tslib";
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
var SwRegistrationOptions = /** @class */ (function () {
    function SwRegistrationOptions() {
    }
    return SwRegistrationOptions;
}());
export { SwRegistrationOptions };
export var SCRIPT = new InjectionToken('NGSW_REGISTER_SCRIPT');
export function ngswAppInitializer(injector, script, options, platformId) {
    var initializer = function () {
        if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }
        });
        var readyToRegister$;
        if (typeof options.registrationStrategy === 'function') {
            readyToRegister$ = options.registrationStrategy();
        }
        else {
            var _a = __read((options.registrationStrategy || 'registerWhenStable:30000').split(':')), strategy = _a[0], args = _a.slice(1);
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
                    throw new Error("Unknown ServiceWorker registration strategy: " + options.registrationStrategy);
            }
        }
        // Don't return anything to avoid blocking the application until the SW is registered.
        // Also, run outside the Angular zone to avoid preventing the app from stabilizing (especially
        // given that some registration strategies wait for the app to stabilize).
        // Catch and log the error if SW registration fails to avoid uncaught rejection warning.
        var ngZone = injector.get(NgZone);
        ngZone.runOutsideAngular(function () { return readyToRegister$.pipe(take(1)).subscribe(function () {
            return navigator.serviceWorker.register(script, { scope: options.scope })
                .catch(function (err) { return console.error('Service worker registration failed with:', err); });
        }); });
    };
    return initializer;
}
function delayWithTimeout(timeout) {
    return of(null).pipe(delay(timeout));
}
function whenStable(injector) {
    var appRef = injector.get(ApplicationRef);
    return appRef.isStable.pipe(filter(function (stable) { return stable; }));
}
export function ngswCommChannelFactory(opts, platformId) {
    return new NgswCommChannel(isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
        undefined);
}
/**
 * @publicApi
 */
var ServiceWorkerModule = /** @class */ (function () {
    function ServiceWorkerModule() {
    }
    ServiceWorkerModule_1 = ServiceWorkerModule;
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    ServiceWorkerModule.register = function (script, opts) {
        if (opts === void 0) { opts = {}; }
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
    };
    var ServiceWorkerModule_1;
    ServiceWorkerModule = ServiceWorkerModule_1 = __decorate([
        NgModule({
            providers: [SwPush, SwUpdate],
        })
    ], ServiceWorkerModule);
    return ServiceWorkerModule;
}());
export { ServiceWorkerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUksT0FBTyxFQUFhLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFbEM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSDtJQUFBO0lBOENBLENBQUM7SUFBRCw0QkFBQztBQUFELENBQUMsQUE5Q0QsSUE4Q0M7O0FBRUQsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFTLHNCQUFzQixDQUFDLENBQUM7QUFFekUsTUFBTSxVQUFVLGtCQUFrQixDQUM5QixRQUFrQixFQUFFLE1BQWMsRUFBRSxPQUE4QixFQUNsRSxVQUFrQjtJQUNwQixJQUFNLFdBQVcsR0FBRztRQUNsQixJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxTQUFTLENBQUM7WUFDL0QsT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNoQyxPQUFP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LFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekIsU0FBUyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVEOztHQUVHO0FBSUg7SUFBQTtJQTRCQSxDQUFDOzRCQTVCWSxtQkFBbUI7SUFDOUI7Ozs7O09BS0c7SUFDSSw0QkFBUSxHQUFmLFVBQWdCLE1BQWMsRUFBRSxJQUFnQztRQUFoQyxxQkFBQSxFQUFBLFNBQWdDO1FBRTlELE9BQU87WUFDTCxRQUFRLEVBQUUscUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQztnQkFDbkMsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDaEQ7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxzQkFBc0I7b0JBQ2xDLElBQUksRUFBRSxDQUFDLHFCQUFxQixFQUFFLFdBQVcsQ0FBQztpQkFDM0M7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7b0JBQzlCLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxDQUFDO29CQUM1RCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7O0lBM0JVLG1CQUFtQjtRQUgvQixRQUFRLENBQUM7WUFDUixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO1NBQzlCLENBQUM7T0FDVyxtQkFBbUIsQ0E0Qi9CO0lBQUQsMEJBQUM7Q0FBQSxBQTVCRCxJQTRCQztTQTVCWSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FQUF9JTklUSUFMSVpFUiwgQXBwbGljYXRpb25SZWYsIEluamVjdGlvblRva2VuLCBJbmplY3RvciwgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIE5nWm9uZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBtZXJnZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVsYXksIGZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge05nc3dDb21tQ2hhbm5lbH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuaW1wb3J0IHtTd1B1c2h9IGZyb20gJy4vcHVzaCc7XG5pbXBvcnQge1N3VXBkYXRlfSBmcm9tICcuL3VwZGF0ZSc7XG5cbi8qKlxuICogVG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG9wdGlvbnMgZm9yIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCBvdXRzaWRlIG9mXG4gKiBgU2VydmljZVdvcmtlck1vZHVsZS5yZWdpc3RlcigpYC5cbiAqXG4gKiBZb3UgY2FuIHVzZSB0aGlzIHRva2VuIHRvIGRlZmluZSBhIHByb3ZpZGVyIHRoYXQgZ2VuZXJhdGVzIHRoZSByZWdpc3RyYXRpb24gb3B0aW9ucyBhdCBydW50aW1lLFxuICogZm9yIGV4YW1wbGUgdmlhIGEgZnVuY3Rpb24gY2FsbDpcbiAqXG4gKiB7QGV4YW1wbGUgc2VydmljZS13b3JrZXIvcmVnaXN0cmF0aW9uLW9wdGlvbnMvbW9kdWxlLnRzIHJlZ2lvbj1cInJlZ2lzdHJhdGlvbi1vcHRpb25zXCJcbiAqICAgICBoZWFkZXI9XCJhcHAubW9kdWxlLnRzXCJ9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3dSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFuZCB0aGUgcmVsYXRlZCBzZXJ2aWNlcyAoc3VjaCBhcyBgU3dQdXNoYCBhbmRcbiAgICogYFN3VXBkYXRlYCkgd2lsbCBhdHRlbXB0IHRvIGNvbW11bmljYXRlIGFuZCBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBlbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBVUkwgdGhhdCBkZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyJ3MgcmVnaXN0cmF0aW9uIHNjb3BlOyB0aGF0IGlzLCB3aGF0IHJhbmdlIG9mIFVSTHMgaXQgY2FuXG4gICAqIGNvbnRyb2wuIEl0IHdpbGwgYmUgdXNlZCB3aGVuIGNhbGxpbmdcbiAgICogW1NlcnZpY2VXb3JrZXJDb250YWluZXIjcmVnaXN0ZXIoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlcnZpY2VXb3JrZXJDb250YWluZXIvcmVnaXN0ZXIpLlxuICAgKi9cbiAgc2NvcGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5LCB3aGljaCBkZXRlcm1pbmVzIHdoZW4gaXQgd2lsbCBiZSByZWdpc3RlcmVkXG4gICAqIHdpdGggdGhlIGJyb3dzZXIuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHJlZ2lzdGVyaW5nIG9uY2UgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKGkuZS4gYXMgc29vbiBhcyB0aGVyZSBhcmVcbiAgICogbm8gcGVuZGluZyBtaWNyby0gYW5kIG1hY3JvLXRhc2tzKSwgaXMgZGVzaWduZWQgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vbiBhcyBwb3NzaWJsZVxuICAgKiBidXQgd2l0aG91dCBhZmZlY3RpbmcgdGhlIGFwcGxpY2F0aW9uJ3MgZmlyc3QgdGltZSBsb2FkLlxuICAgKlxuICAgKiBTdGlsbCwgdGhlcmUgbWlnaHQgYmUgY2FzZXMgd2hlcmUgeW91IHdhbnQgbW9yZSBjb250cm9sIG92ZXIgd2hlbiB0aGUgU2VydmljZVdvcmtlciBpc1xuICAgKiByZWdpc3RlcmVkIChlLmcuIHRoZXJlIG1pZ2h0IGJlIGEgbG9uZy1ydW5uaW5nIHRpbWVvdXQgb3IgcG9sbGluZyBpbnRlcnZhbCwgcHJldmVudGluZyB0aGUgYXBwXG4gICAqIHRvIHN0YWJpbGl6ZSkuIFRoZSBhdmFpbGFibGUgb3B0aW9uIGFyZTpcbiAgICpcbiAgICogLSBgcmVnaXN0ZXJXaGVuU3RhYmxlOjx0aW1lb3V0PmA6IFJlZ2lzdGVyIGFzIHNvb24gYXMgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKG5vIHBlbmRpbmdcbiAgICogICAgIG1pY3JvLS9tYWNyby10YXNrcykgYnV0IG5vIGxhdGVyIHRoYW4gYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzLiBJZiB0aGUgYXBwIGhhc24ndFxuICAgKiAgICAgc3RhYmlsaXplZCBhZnRlciBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMgKGZvciBleGFtcGxlLCBkdWUgdG8gYSByZWN1cnJlbnQgYXN5bmNocm9ub3VzXG4gICAqICAgICB0YXNrKSwgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFueXdheS5cbiAgICogICAgIElmIGA8dGltZW91dD5gIGlzIG9taXR0ZWQsIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgb25seSBiZSByZWdpc3RlcmVkIG9uY2UgdGhlIGFwcFxuICAgKiAgICAgc3RhYmlsaXplcy5cbiAgICogLSBgcmVnaXN0ZXJJbW1lZGlhdGVseWA6IFJlZ2lzdGVyIGltbWVkaWF0ZWx5LlxuICAgKiAtIGByZWdpc3RlcldpdGhEZWxheTo8dGltZW91dD5gOiBSZWdpc3RlciB3aXRoIGEgZGVsYXkgb2YgYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzLiBGb3JcbiAgICogICAgIGV4YW1wbGUsIHVzZSBgcmVnaXN0ZXJXaXRoRGVsYXk6NTAwMGAgdG8gcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYWZ0ZXIgNSBzZWNvbmRzLiBJZlxuICAgKiAgICAgYDx0aW1lb3V0PmAgaXMgb21pdHRlZCwgaXMgZGVmYXVsdHMgdG8gYDBgLCB3aGljaCB3aWxsIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFzIHNvb25cbiAgICogICAgIGFzIHBvc3NpYmxlIGJ1dCBzdGlsbCBhc3luY2hyb25vdXNseSwgb25jZSBhbGwgcGVuZGluZyBtaWNyby10YXNrcyBhcmUgY29tcGxldGVkLlxuICAgKiAtIEFuIFtPYnNlcnZhYmxlXShndWlkZS9vYnNlcnZhYmxlcykgZmFjdG9yeSBmdW5jdGlvbjogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYE9ic2VydmFibGVgLlxuICAgKiAgICAgVGhlIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBhdCBydW50aW1lIHRvIG9idGFpbiBhbmQgc3Vic2NyaWJlIHRvIHRoZSBgT2JzZXJ2YWJsZWAgYW5kIHRoZVxuICAgKiAgICAgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYXMgc29vbiBhcyB0aGUgZmlyc3QgdmFsdWUgaXMgZW1pdHRlZC5cbiAgICpcbiAgICogRGVmYXVsdDogJ3JlZ2lzdGVyV2hlblN0YWJsZSdcbiAgICovXG4gIHJlZ2lzdHJhdGlvblN0cmF0ZWd5Pzogc3RyaW5nfCgoKSA9PiBPYnNlcnZhYmxlPHVua25vd24+KTtcbn1cblxuZXhwb3J0IGNvbnN0IFNDUklQVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdOR1NXX1JFR0lTVEVSX1NDUklQVCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0FwcEluaXRpYWxpemVyKFxuICAgIGluamVjdG9yOiBJbmplY3Rvciwgc2NyaXB0OiBzdHJpbmcsIG9wdGlvbnM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucyxcbiAgICBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBGdW5jdGlvbiB7XG4gIGNvbnN0IGluaXRpYWxpemVyID0gKCkgPT4ge1xuICAgIGlmICghKGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSAmJlxuICAgICAgICAgIG9wdGlvbnMuZW5hYmxlZCAhPT0gZmFsc2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2FpdCBmb3Igc2VydmljZSB3b3JrZXIgY29udHJvbGxlciBjaGFuZ2VzLCBhbmQgZmlyZSBhbiBJTklUSUFMSVpFIGFjdGlvbiB3aGVuIGEgbmV3IFNXXG4gICAgLy8gYmVjb21lcyBhY3RpdmUuIFRoaXMgYWxsb3dzIHRoZSBTVyB0byBpbml0aWFsaXplIGl0c2VsZiBldmVuIGlmIHRoZXJlIGlzIG5vIGFwcGxpY2F0aW9uXG4gICAgLy8gdHJhZmZpYy5cbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuICAgICAgaWYgKG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgIT09IG51bGwpIHtcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlci5wb3N0TWVzc2FnZSh7YWN0aW9uOiAnSU5JVElBTElaRSd9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCByZWFkeVRvUmVnaXN0ZXIkOiBPYnNlcnZhYmxlPHVua25vd24+O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBbc3RyYXRlZ3ksIC4uLmFyZ3NdID1cbiAgICAgICAgICAob3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSB8fCAncmVnaXN0ZXJXaGVuU3RhYmxlOjMwMDAwJykuc3BsaXQoJzonKTtcblxuICAgICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgICBjYXNlICdyZWdpc3RlckltbWVkaWF0ZWx5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb2YgKG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldpdGhEZWxheSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IGRlbGF5V2l0aFRpbWVvdXQoK2FyZ3NbMF0gfHwgMCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2hlblN0YWJsZSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9ICFhcmdzWzBdID8gd2hlblN0YWJsZShpbmplY3RvcikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlKHdoZW5TdGFibGUoaW5qZWN0b3IpLCBkZWxheVdpdGhUaW1lb3V0KCthcmdzWzBdKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gVW5rbm93biBzdHJhdGVneS5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBVbmtub3duIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5OiAke29wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3l9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgcmV0dXJuIGFueXRoaW5nIHRvIGF2b2lkIGJsb2NraW5nIHRoZSBhcHBsaWNhdGlvbiB1bnRpbCB0aGUgU1cgaXMgcmVnaXN0ZXJlZC5cbiAgICAvLyBBbHNvLCBydW4gb3V0c2lkZSB0aGUgQW5ndWxhciB6b25lIHRvIGF2b2lkIHByZXZlbnRpbmcgdGhlIGFwcCBmcm9tIHN0YWJpbGl6aW5nIChlc3BlY2lhbGx5XG4gICAgLy8gZ2l2ZW4gdGhhdCBzb21lIHJlZ2lzdHJhdGlvbiBzdHJhdGVnaWVzIHdhaXQgZm9yIHRoZSBhcHAgdG8gc3RhYmlsaXplKS5cbiAgICAvLyBDYXRjaCBhbmQgbG9nIHRoZSBlcnJvciBpZiBTVyByZWdpc3RyYXRpb24gZmFpbHMgdG8gYXZvaWQgdW5jYXVnaHQgcmVqZWN0aW9uIHdhcm5pbmcuXG4gICAgY29uc3Qgbmdab25lID0gaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKFxuICAgICAgICAoKSA9PiByZWFkeVRvUmVnaXN0ZXIkLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihzY3JpcHQsIHtzY29wZTogb3B0aW9ucy5zY29wZX0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZCB3aXRoOicsIGVycikpKSk7XG4gIH07XG4gIHJldHVybiBpbml0aWFsaXplcjtcbn1cblxuZnVuY3Rpb24gZGVsYXlXaXRoVGltZW91dCh0aW1lb3V0OiBudW1iZXIpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcbiAgcmV0dXJuIG9mIChudWxsKS5waXBlKGRlbGF5KHRpbWVvdXQpKTtcbn1cblxuZnVuY3Rpb24gd2hlblN0YWJsZShpbmplY3RvcjogSW5qZWN0b3IpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcbiAgY29uc3QgYXBwUmVmID0gaW5qZWN0b3IuZ2V0KEFwcGxpY2F0aW9uUmVmKTtcbiAgcmV0dXJuIGFwcFJlZi5pc1N0YWJsZS5waXBlKGZpbHRlcihzdGFibGUgPT4gc3RhYmxlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5KFxuICAgIG9wdHM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgcGxhdGZvcm1JZDogc3RyaW5nKTogTmdzd0NvbW1DaGFubmVsIHtcbiAgcmV0dXJuIG5ldyBOZ3N3Q29tbUNoYW5uZWwoXG4gICAgICBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiBvcHRzLmVuYWJsZWQgIT09IGZhbHNlID8gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtTd1B1c2gsIFN3VXBkYXRlXSxcbn0pXG5leHBvcnQgY2xhc3MgU2VydmljZVdvcmtlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZ2l2ZW4gQW5ndWxhciBTZXJ2aWNlIFdvcmtlciBzY3JpcHQuXG4gICAqXG4gICAqIElmIGBlbmFibGVkYCBpcyBzZXQgdG8gYGZhbHNlYCBpbiB0aGUgZ2l2ZW4gb3B0aW9ucywgdGhlIG1vZHVsZSB3aWxsIGJlaGF2ZSBhcyBpZiBzZXJ2aWNlXG4gICAqIHdvcmtlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGFuZCB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCBub3QgYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlcihzY3JpcHQ6IHN0cmluZywgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zID0ge30pOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVyczxTZXJ2aWNlV29ya2VyTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTZXJ2aWNlV29ya2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBTQ1JJUFQsIHVzZVZhbHVlOiBzY3JpcHR9LFxuICAgICAgICB7cHJvdmlkZTogU3dSZWdpc3RyYXRpb25PcHRpb25zLCB1c2VWYWx1ZTogb3B0c30sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBOZ3N3Q29tbUNoYW5uZWwsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0NvbW1DaGFubmVsRmFjdG9yeSxcbiAgICAgICAgICBkZXBzOiBbU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW0luamVjdG9yLCBTQ1JJUFQsIFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=