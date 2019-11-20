import { __read } from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformBrowser } from '@angular/common';
import { APP_INITIALIZER, ApplicationRef, InjectionToken, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';
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
            var _a = __read((options.registrationStrategy || 'registerWhenStable').split(':')), strategy = _a[0], args = _a.slice(1);
            switch (strategy) {
                case 'registerImmediately':
                    readyToRegister$ = of(null);
                    break;
                case 'registerWithDelay':
                    readyToRegister$ = of(null).pipe(delay(+args[0] || 0));
                    break;
                case 'registerWhenStable':
                    var appRef = injector.get(ApplicationRef);
                    readyToRegister$ = appRef.isStable.pipe(filter(function (stable) { return stable; }));
                    break;
                default:
                    // Unknown strategy.
                    throw new Error("Unknown ServiceWorker registration strategy: " + options.registrationStrategy);
            }
        }
        // Don't return anything to avoid blocking the application until the SW is registered.
        // Catch and log the error if SW registration fails to avoid uncaught rejection warning.
        readyToRegister$.pipe(take(1)).subscribe(function () { return navigator.serviceWorker.register(script, { scope: options.scope })
            .catch(function (err) { return console.error('Service worker registration failed with:', err); }); });
    };
    return initializer;
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
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    ServiceWorkerModule.register = function (script, opts) {
        if (opts === void 0) { opts = {}; }
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
    };
    ServiceWorkerModule.ɵmod = i0.ɵɵdefineNgModule({ type: ServiceWorkerModule });
    ServiceWorkerModule.ɵinj = i0.ɵɵdefineInjector({ factory: function ServiceWorkerModule_Factory(t) { return new (t || ServiceWorkerModule)(); }, providers: [SwPush, SwUpdate] });
    return ServiceWorkerModule;
}());
export { ServiceWorkerModule };
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ServiceWorkerModule, [{
        type: NgModule,
        args: [{
                providers: [SwPush, SwUpdate],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwSSxPQUFPLEVBQWEsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDOztBQUVsQzs7Ozs7Ozs7Ozs7R0FXRztBQUNIO0lBQUE7SUEwQ0EsQ0FBQztJQUFELDRCQUFDO0FBQUQsQ0FBQyxBQTFDRCxJQTBDQzs7QUFFRCxNQUFNLENBQUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQVMsc0JBQXNCLENBQUMsQ0FBQztBQUV6RSxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLFFBQWtCLEVBQUUsTUFBYyxFQUFFLE9BQThCLEVBQ2xFLFVBQWtCO0lBQ3BCLElBQU0sV0FBVyxHQUFHO1FBQ2xCLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLFNBQVMsQ0FBQztZQUMvRCxPQUFPLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLE9BQU87U0FDUjtRQUVELDBGQUEwRjtR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LENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDO2lCQUMzQztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsVUFBVSxFQUFFLGtCQUFrQjtvQkFDOUIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxXQUFXLENBQUM7b0JBQzVELEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzsyREEzQlUsbUJBQW1CO3lIQUFuQixtQkFBbUIsbUJBRm5CLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQzs4QkF6SS9CO0NBdUtDLEFBL0JELElBK0JDO1NBNUJZLG1CQUFtQjtrREFBbkIsbUJBQW1CO2NBSC9CLFFBQVE7ZUFBQztnQkFDUixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO2FBQzlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBUFBfSU5JVElBTElaRVIsIEFwcGxpY2F0aW9uUmVmLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlbGF5LCBmaWx0ZXIsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtOZ3N3Q29tbUNoYW5uZWx9IGZyb20gJy4vbG93X2xldmVsJztcbmltcG9ydCB7U3dQdXNofSBmcm9tICcuL3B1c2gnO1xuaW1wb3J0IHtTd1VwZGF0ZX0gZnJvbSAnLi91cGRhdGUnO1xuXG4vKipcbiAqIFRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSBvcHRpb25zIGZvciBgU2VydmljZVdvcmtlck1vZHVsZWAgb3V0c2lkZSBvZlxuICogYFNlcnZpY2VXb3JrZXJNb2R1bGUucmVnaXN0ZXIoKWAuXG4gKlxuICogWW91IGNhbiB1c2UgdGhpcyB0b2tlbiB0byBkZWZpbmUgYSBwcm92aWRlciB0aGF0IGdlbmVyYXRlcyB0aGUgcmVnaXN0cmF0aW9uIG9wdGlvbnMgYXQgcnVudGltZSxcbiAqIGZvciBleGFtcGxlIHZpYSBhIGZ1bmN0aW9uIGNhbGw6XG4gKlxuICoge0BleGFtcGxlIHNlcnZpY2Utd29ya2VyL3JlZ2lzdHJhdGlvbi1vcHRpb25zL21vZHVsZS50cyByZWdpb249XCJyZWdpc3RyYXRpb24tb3B0aW9uc1wiXG4gKiAgICAgaGVhZGVyPVwiYXBwLm1vZHVsZS50c1wifVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN3UmVnaXN0cmF0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhbmQgdGhlIHJlbGF0ZWQgc2VydmljZXMgKHN1Y2ggYXMgYFN3UHVzaGAgYW5kXG4gICAqIGBTd1VwZGF0ZWApIHdpbGwgYXR0ZW1wdCB0byBjb21tdW5pY2F0ZSBhbmQgaW50ZXJhY3Qgd2l0aCBpdC5cbiAgICpcbiAgICogRGVmYXVsdDogdHJ1ZVxuICAgKi9cbiAgZW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgVVJMIHRoYXQgZGVmaW5lcyB0aGUgU2VydmljZVdvcmtlcidzIHJlZ2lzdHJhdGlvbiBzY29wZTsgdGhhdCBpcywgd2hhdCByYW5nZSBvZiBVUkxzIGl0IGNhblxuICAgKiBjb250cm9sLiBJdCB3aWxsIGJlIHVzZWQgd2hlbiBjYWxsaW5nXG4gICAqIFtTZXJ2aWNlV29ya2VyQ29udGFpbmVyI3JlZ2lzdGVyKCldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TZXJ2aWNlV29ya2VyQ29udGFpbmVyL3JlZ2lzdGVyKS5cbiAgICovXG4gIHNjb3BlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdHJhdGVneSwgd2hpY2ggZGV0ZXJtaW5lcyB3aGVuIGl0IHdpbGwgYmUgcmVnaXN0ZXJlZFxuICAgKiB3aXRoIHRoZSBicm93c2VyLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBiZWhhdmlvciBvZiByZWdpc3RlcmluZyBvbmNlIHRoZSBhcHBsaWNhdGlvbiBzdGFiaWxpemVzIChpLmUuIGFzIHNvb24gYXMgdGhlcmUgYXJlXG4gICAqIG5vIHBlbmRpbmcgbWljcm8tIGFuZCBtYWNyby10YXNrcyksIGlzIGRlc2lnbmVkIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFzIHNvb24gYXMgcG9zc2libGVcbiAgICogYnV0IHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBhcHBsaWNhdGlvbidzIGZpcnN0IHRpbWUgbG9hZC5cbiAgICpcbiAgICogU3RpbGwsIHRoZXJlIG1pZ2h0IGJlIGNhc2VzIHdoZXJlIHlvdSB3YW50IG1vcmUgY29udHJvbCBvdmVyIHdoZW4gdGhlIFNlcnZpY2VXb3JrZXIgaXNcbiAgICogcmVnaXN0ZXJlZCAoZS5nLiB0aGVyZSBtaWdodCBiZSBhIGxvbmctcnVubmluZyB0aW1lb3V0IG9yIHBvbGxpbmcgaW50ZXJ2YWwsIHByZXZlbnRpbmcgdGhlIGFwcFxuICAgKiB0byBzdGFiaWxpemUpLiBUaGUgYXZhaWxhYmxlIG9wdGlvbiBhcmU6XG4gICAqXG4gICAqIC0gYHJlZ2lzdGVyV2hlblN0YWJsZWA6IFJlZ2lzdGVyIGFzIHNvb24gYXMgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKG5vIHBlbmRpbmdcbiAgICogICAgICBtaWNyby0vbWFjcm8tdGFza3MpLlxuICAgKiAtIGByZWdpc3RlckltbWVkaWF0ZWx5YDogUmVnaXN0ZXIgaW1tZWRpYXRlbHkuXG4gICAqIC0gYHJlZ2lzdGVyV2l0aERlbGF5Ojx0aW1lb3V0PmA6IFJlZ2lzdGVyIHdpdGggYSBkZWxheSBvZiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIEZvclxuICAgKiAgICAgZXhhbXBsZSwgdXNlIGByZWdpc3RlcldpdGhEZWxheTo1MDAwYCB0byByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhZnRlciA1IHNlY29uZHMuIElmXG4gICAqICAgICBgPHRpbWVvdXQ+YCBpcyBvbWl0dGVkLCBpcyBkZWZhdWx0cyB0byBgMGAsIHdoaWNoIHdpbGwgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vblxuICAgKiAgICAgYXMgcG9zc2libGUgYnV0IHN0aWxsIGFzeW5jaHJvbm91c2x5LCBvbmNlIGFsbCBwZW5kaW5nIG1pY3JvLXRhc2tzIGFyZSBjb21wbGV0ZWQuXG4gICAqIC0gQW4gW09ic2VydmFibGVdKGd1aWRlL29ic2VydmFibGVzKSBmYWN0b3J5IGZ1bmN0aW9uOiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBgT2JzZXJ2YWJsZWAuXG4gICAqICAgICBUaGUgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIGF0IHJ1bnRpbWUgdG8gb2J0YWluIGFuZCBzdWJzY3JpYmUgdG8gdGhlIGBPYnNlcnZhYmxlYCBhbmQgdGhlXG4gICAqICAgICBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhcyBzb29uIGFzIHRoZSBmaXJzdCB2YWx1ZSBpcyBlbWl0dGVkLlxuICAgKlxuICAgKiBEZWZhdWx0OiAncmVnaXN0ZXJXaGVuU3RhYmxlJ1xuICAgKi9cbiAgcmVnaXN0cmF0aW9uU3RyYXRlZ3k/OiBzdHJpbmd8KCgpID0+IE9ic2VydmFibGU8dW5rbm93bj4pO1xufVxuXG5leHBvcnQgY29uc3QgU0NSSVBUID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ05HU1dfUkVHSVNURVJfU0NSSVBUJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3QXBwSW5pdGlhbGl6ZXIoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLCBzY3JpcHQ6IHN0cmluZywgb3B0aW9uczogU3dSZWdpc3RyYXRpb25PcHRpb25zLFxuICAgIHBsYXRmb3JtSWQ6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgY29uc3QgaW5pdGlhbGl6ZXIgPSAoKSA9PiB7XG4gICAgaWYgKCEoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpICYmXG4gICAgICAgICAgb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciBzZXJ2aWNlIHdvcmtlciBjb250cm9sbGVyIGNoYW5nZXMsIGFuZCBmaXJlIGFuIElOSVRJQUxJWkUgYWN0aW9uIHdoZW4gYSBuZXcgU1dcbiAgICAvLyBiZWNvbWVzIGFjdGl2ZS4gVGhpcyBhbGxvd3MgdGhlIFNXIHRvIGluaXRpYWxpemUgaXRzZWxmIGV2ZW4gaWYgdGhlcmUgaXMgbm8gYXBwbGljYXRpb25cbiAgICAvLyB0cmFmZmljLlxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciAhPT0gbnVsbCkge1xuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdJTklUSUFMSVpFJ30pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHJlYWR5VG9SZWdpc3RlciQ6IE9ic2VydmFibGU8dW5rbm93bj47XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtzdHJhdGVneSwgLi4uYXJnc10gPSAob3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSB8fCAncmVnaXN0ZXJXaGVuU3RhYmxlJykuc3BsaXQoJzonKTtcbiAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJJbW1lZGlhdGVseSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9mIChudWxsKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJXaXRoRGVsYXknOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvZiAobnVsbCkucGlwZShkZWxheSgrYXJnc1swXSB8fCAwKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2hlblN0YWJsZSc6XG4gICAgICAgICAgY29uc3QgYXBwUmVmID0gaW5qZWN0b3IuZ2V0PEFwcGxpY2F0aW9uUmVmPihBcHBsaWNhdGlvblJlZik7XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IGFwcFJlZi5pc1N0YWJsZS5waXBlKGZpbHRlcihzdGFibGUgPT4gc3RhYmxlKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gVW5rbm93biBzdHJhdGVneS5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBVbmtub3duIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5OiAke29wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3l9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgcmV0dXJuIGFueXRoaW5nIHRvIGF2b2lkIGJsb2NraW5nIHRoZSBhcHBsaWNhdGlvbiB1bnRpbCB0aGUgU1cgaXMgcmVnaXN0ZXJlZC5cbiAgICAvLyBDYXRjaCBhbmQgbG9nIHRoZSBlcnJvciBpZiBTVyByZWdpc3RyYXRpb24gZmFpbHMgdG8gYXZvaWQgdW5jYXVnaHQgcmVqZWN0aW9uIHdhcm5pbmcuXG4gICAgcmVhZHlUb1JlZ2lzdGVyJC5waXBlKHRha2UoMSkpLnN1YnNjcmliZShcbiAgICAgICAgKCkgPT4gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc2NyaXB0LCB7c2NvcGU6IG9wdGlvbnMuc2NvcGV9KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdTZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkIHdpdGg6JywgZXJyKSkpO1xuICB9O1xuICByZXR1cm4gaW5pdGlhbGl6ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5KFxuICAgIG9wdHM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgcGxhdGZvcm1JZDogc3RyaW5nKTogTmdzd0NvbW1DaGFubmVsIHtcbiAgcmV0dXJuIG5ldyBOZ3N3Q29tbUNoYW5uZWwoXG4gICAgICBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiBvcHRzLmVuYWJsZWQgIT09IGZhbHNlID8gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtTd1B1c2gsIFN3VXBkYXRlXSxcbn0pXG5leHBvcnQgY2xhc3MgU2VydmljZVdvcmtlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZ2l2ZW4gQW5ndWxhciBTZXJ2aWNlIFdvcmtlciBzY3JpcHQuXG4gICAqXG4gICAqIElmIGBlbmFibGVkYCBpcyBzZXQgdG8gYGZhbHNlYCBpbiB0aGUgZ2l2ZW4gb3B0aW9ucywgdGhlIG1vZHVsZSB3aWxsIGJlaGF2ZSBhcyBpZiBzZXJ2aWNlXG4gICAqIHdvcmtlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGFuZCB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCBub3QgYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlcihzY3JpcHQ6IHN0cmluZywgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zID0ge30pOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVyczxTZXJ2aWNlV29ya2VyTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTZXJ2aWNlV29ya2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBTQ1JJUFQsIHVzZVZhbHVlOiBzY3JpcHR9LFxuICAgICAgICB7cHJvdmlkZTogU3dSZWdpc3RyYXRpb25PcHRpb25zLCB1c2VWYWx1ZTogb3B0c30sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBOZ3N3Q29tbUNoYW5uZWwsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0NvbW1DaGFubmVsRmFjdG9yeSxcbiAgICAgICAgICBkZXBzOiBbU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW0luamVjdG9yLCBTQ1JJUFQsIFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=