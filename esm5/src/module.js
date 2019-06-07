/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { isPlatformBrowser } from '@angular/common';
import { APP_INITIALIZER, ApplicationRef, InjectionToken, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { of } from 'rxjs';
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
 *     header="app.module.ts" linenums="false"}
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
            var _a = tslib_1.__read((options.registrationStrategy || 'registerWhenStable').split(':')), strategy = _a[0], args = _a.slice(1);
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
    ServiceWorkerModule = ServiceWorkerModule_1 = tslib_1.__decorate([
        NgModule({
            providers: [SwPush, SwUpdate],
        })
    ], ServiceWorkerModule);
    return ServiceWorkerModule;
}());
export { ServiceWorkerModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwSSxPQUFPLEVBQWEsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWxDOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUFBQTtJQTBDQSxDQUFDO0lBQUQsNEJBQUM7QUFBRCxDQUFDLEFBMUNELElBMENDOztBQUVELE1BQU0sQ0FBQyxJQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBUyxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sVUFBVSxrQkFBa0IsQ0FDOUIsUUFBa0IsRUFBRSxNQUFjLEVBQUUsT0FBOEIsRUFDbEUsVUFBa0I7SUFDcEIsSUFBTSxXQUFXLEdBQUc7UUFDbEIsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBRUQsMEZBQTBGO1FB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QjtvQkFDbEMsSUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDO2lCQUMzQztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsVUFBVSxFQUFFLGtCQUFrQjtvQkFDOUIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxXQUFXLENBQUM7b0JBQzVELEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7SUEzQlUsbUJBQW1CO1FBSC9CLFFBQVEsQ0FBQztZQUNSLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7U0FDOUIsQ0FBQztPQUNXLG1CQUFtQixDQTRCL0I7SUFBRCwwQkFBQztDQUFBLEFBNUJELElBNEJDO1NBNUJZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7Tmdzd0NvbW1DaGFubmVsfSBmcm9tICcuL2xvd19sZXZlbCc7XG5pbXBvcnQge1N3UHVzaH0gZnJvbSAnLi9wdXNoJztcbmltcG9ydCB7U3dVcGRhdGV9IGZyb20gJy4vdXBkYXRlJztcblxuLyoqXG4gKiBUb2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgb3B0aW9ucyBmb3IgYFNlcnZpY2VXb3JrZXJNb2R1bGVgIG91dHNpZGUgb2ZcbiAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlLnJlZ2lzdGVyKClgLlxuICpcbiAqIFlvdSBjYW4gdXNlIHRoaXMgdG9rZW4gdG8gZGVmaW5lIGEgcHJvdmlkZXIgdGhhdCBnZW5lcmF0ZXMgdGhlIHJlZ2lzdHJhdGlvbiBvcHRpb25zIGF0IHJ1bnRpbWUsXG4gKiBmb3IgZXhhbXBsZSB2aWEgYSBmdW5jdGlvbiBjYWxsOlxuICpcbiAqIHtAZXhhbXBsZSBzZXJ2aWNlLXdvcmtlci9yZWdpc3RyYXRpb24tb3B0aW9ucy9tb2R1bGUudHMgcmVnaW9uPVwicmVnaXN0cmF0aW9uLW9wdGlvbnNcIlxuICogICAgIGhlYWRlcj1cImFwcC5tb2R1bGUudHNcIiBsaW5lbnVtcz1cImZhbHNlXCJ9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3dSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFuZCB0aGUgcmVsYXRlZCBzZXJ2aWNlcyAoc3VjaCBhcyBgU3dQdXNoYCBhbmRcbiAgICogYFN3VXBkYXRlYCkgd2lsbCBhdHRlbXB0IHRvIGNvbW11bmljYXRlIGFuZCBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBlbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBVUkwgdGhhdCBkZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyJ3MgcmVnaXN0cmF0aW9uIHNjb3BlOyB0aGF0IGlzLCB3aGF0IHJhbmdlIG9mIFVSTHMgaXQgY2FuXG4gICAqIGNvbnRyb2wuIEl0IHdpbGwgYmUgdXNlZCB3aGVuIGNhbGxpbmdcbiAgICogW1NlcnZpY2VXb3JrZXJDb250YWluZXIjcmVnaXN0ZXIoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlcnZpY2VXb3JrZXJDb250YWluZXIvcmVnaXN0ZXIpLlxuICAgKi9cbiAgc2NvcGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5LCB3aGljaCBkZXRlcm1pbmVzIHdoZW4gaXQgd2lsbCBiZSByZWdpc3RlcmVkXG4gICAqIHdpdGggdGhlIGJyb3dzZXIuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHJlZ2lzdGVyaW5nIG9uY2UgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKGkuZS4gYXMgc29vbiBhcyB0aGVyZSBhcmVcbiAgICogbm8gcGVuZGluZyBtaWNyby0gYW5kIG1hY3JvLXRhc2tzKSwgaXMgZGVzaWduZWQgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vbiBhcyBwb3NzaWJsZVxuICAgKiBidXQgd2l0aG91dCBhZmZlY3RpbmcgdGhlIGFwcGxpY2F0aW9uJ3MgZmlyc3QgdGltZSBsb2FkLlxuICAgKlxuICAgKiBTdGlsbCwgdGhlcmUgbWlnaHQgYmUgY2FzZXMgd2hlcmUgeW91IHdhbnQgbW9yZSBjb250cm9sIG92ZXIgd2hlbiB0aGUgU2VydmljZVdvcmtlciBpc1xuICAgKiByZWdpc3RlcmVkIChlLmcuIHRoZXJlIG1pZ2h0IGJlIGEgbG9uZy1ydW5uaW5nIHRpbWVvdXQgb3IgcG9sbGluZyBpbnRlcnZhbCwgcHJldmVudGluZyB0aGUgYXBwXG4gICAqIHRvIHN0YWJpbGl6ZSkuIFRoZSBhdmFpbGFibGUgb3B0aW9uIGFyZTpcbiAgICpcbiAgICogLSBgcmVnaXN0ZXJXaGVuU3RhYmxlYDogUmVnaXN0ZXIgYXMgc29vbiBhcyB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAobm8gcGVuZGluZ1xuICAgKiAgICAgIG1pY3JvLS9tYWNyby10YXNrcykuXG4gICAqIC0gYHJlZ2lzdGVySW1tZWRpYXRlbHlgOiBSZWdpc3RlciBpbW1lZGlhdGVseS5cbiAgICogLSBgcmVnaXN0ZXJXaXRoRGVsYXk6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgd2l0aCBhIGRlbGF5IG9mIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcy4gRm9yXG4gICAqICAgICBleGFtcGxlLCB1c2UgYHJlZ2lzdGVyV2l0aERlbGF5OjUwMDBgIHRvIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFmdGVyIDUgc2Vjb25kcy4gSWZcbiAgICogICAgIGA8dGltZW91dD5gIGlzIG9taXR0ZWQsIGlzIGRlZmF1bHRzIHRvIGAwYCwgd2hpY2ggd2lsbCByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uXG4gICAqICAgICBhcyBwb3NzaWJsZSBidXQgc3RpbGwgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIHBlbmRpbmcgbWljcm8tdGFza3MgYXJlIGNvbXBsZXRlZC5cbiAgICogLSBBbiBbT2JzZXJ2YWJsZV0oZ3VpZGUvb2JzZXJ2YWJsZXMpIGZhY3RvcnkgZnVuY3Rpb246IEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGBPYnNlcnZhYmxlYC5cbiAgICogICAgIFRoZSBmdW5jdGlvbiB3aWxsIGJlIHVzZWQgYXQgcnVudGltZSB0byBvYnRhaW4gYW5kIHN1YnNjcmliZSB0byB0aGUgYE9ic2VydmFibGVgIGFuZCB0aGVcbiAgICogICAgIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFzIHNvb24gYXMgdGhlIGZpcnN0IHZhbHVlIGlzIGVtaXR0ZWQuXG4gICAqXG4gICAqIERlZmF1bHQ6ICdyZWdpc3RlcldoZW5TdGFibGUnXG4gICAqL1xuICByZWdpc3RyYXRpb25TdHJhdGVneT86IHN0cmluZ3woKCkgPT4gT2JzZXJ2YWJsZTx1bmtub3duPik7XG59XG5cbmV4cG9ydCBjb25zdCBTQ1JJUFQgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignTkdTV19SRUdJU1RFUl9TQ1JJUFQnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dBcHBJbml0aWFsaXplcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsIHNjcmlwdDogc3RyaW5nLCBvcHRpb25zOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsXG4gICAgcGxhdGZvcm1JZDogc3RyaW5nKTogRnVuY3Rpb24ge1xuICBjb25zdCBpbml0aWFsaXplciA9ICgpID0+IHtcbiAgICBpZiAoIShpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgJiZcbiAgICAgICAgICBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIGNvbnRyb2xsZXIgY2hhbmdlcywgYW5kIGZpcmUgYW4gSU5JVElBTElaRSBhY3Rpb24gd2hlbiBhIG5ldyBTV1xuICAgIC8vIGJlY29tZXMgYWN0aXZlLiBUaGlzIGFsbG93cyB0aGUgU1cgdG8gaW5pdGlhbGl6ZSBpdHNlbGYgZXZlbiBpZiB0aGVyZSBpcyBubyBhcHBsaWNhdGlvblxuICAgIC8vIHRyYWZmaWMuXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICE9PSBudWxsKSB7XG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ0lOSVRJQUxJWkUnfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcmVhZHlUb1JlZ2lzdGVyJDogT2JzZXJ2YWJsZTx1bmtub3duPjtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgW3N0cmF0ZWd5LCAuLi5hcmdzXSA9IChvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5IHx8ICdyZWdpc3RlcldoZW5TdGFibGUnKS5zcGxpdCgnOicpO1xuICAgICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgICBjYXNlICdyZWdpc3RlckltbWVkaWF0ZWx5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb2YgKG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldpdGhEZWxheSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9mIChudWxsKS5waXBlKGRlbGF5KCthcmdzWzBdIHx8IDApKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJXaGVuU3RhYmxlJzpcbiAgICAgICAgICBjb25zdCBhcHBSZWYgPSBpbmplY3Rvci5nZXQ8QXBwbGljYXRpb25SZWY+KEFwcGxpY2F0aW9uUmVmKTtcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gYXBwUmVmLmlzU3RhYmxlLnBpcGUoZmlsdGVyKHN0YWJsZSA9PiBzdGFibGUpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBVbmtub3duIHN0cmF0ZWd5LlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYFVua25vd24gU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3k6ICR7b3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEb24ndCByZXR1cm4gYW55dGhpbmcgdG8gYXZvaWQgYmxvY2tpbmcgdGhlIGFwcGxpY2F0aW9uIHVudGlsIHRoZSBTVyBpcyByZWdpc3RlcmVkLlxuICAgIC8vIENhdGNoIGFuZCBsb2cgdGhlIGVycm9yIGlmIFNXIHJlZ2lzdHJhdGlvbiBmYWlscyB0byBhdm9pZCB1bmNhdWdodCByZWplY3Rpb24gd2FybmluZy5cbiAgICByZWFkeVRvUmVnaXN0ZXIkLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKFxuICAgICAgICAoKSA9PiBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihzY3JpcHQsIHtzY29wZTogb3B0aW9ucy5zY29wZX0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ1NlcnZpY2Ugd29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQgd2l0aDonLCBlcnIpKSk7XG4gIH07XG4gIHJldHVybiBpbml0aWFsaXplcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dDb21tQ2hhbm5lbEZhY3RvcnkoXG4gICAgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zLCBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBOZ3N3Q29tbUNoYW5uZWwge1xuICByZXR1cm4gbmV3IE5nc3dDb21tQ2hhbm5lbChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmIG9wdHMuZW5hYmxlZCAhPT0gZmFsc2UgPyBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1N3UHVzaCwgU3dVcGRhdGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlV29ya2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBnaXZlbiBBbmd1bGFyIFNlcnZpY2UgV29ya2VyIHNjcmlwdC5cbiAgICpcbiAgICogSWYgYGVuYWJsZWRgIGlzIHNldCB0byBgZmFsc2VgIGluIHRoZSBnaXZlbiBvcHRpb25zLCB0aGUgbW9kdWxlIHdpbGwgYmVoYXZlIGFzIGlmIHNlcnZpY2VcbiAgICogd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIHRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyKHNjcmlwdDogc3RyaW5nLCBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMgPSB7fSk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPFNlcnZpY2VXb3JrZXJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNlcnZpY2VXb3JrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IFNDUklQVCwgdXNlVmFsdWU6IHNjcmlwdH0sXG4gICAgICAgIHtwcm92aWRlOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHVzZVZhbHVlOiBvcHRzfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5nc3dDb21tQ2hhbm5lbCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF0sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==