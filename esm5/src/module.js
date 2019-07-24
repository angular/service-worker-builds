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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwSSxPQUFPLEVBQWEsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JDLE9BQU8sRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWxDOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUFBQTtJQTBDQSxDQUFDO0lBQUQsNEJBQUM7QUFBRCxDQUFDLEFBMUNELElBMENDOztBQUVELE1BQU0sQ0FBQyxJQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBUyxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sVUFBVSxrQkFBa0IsQ0FDOUIsUUFBa0IsRUFBRSxNQUFjLEVBQUUsT0FBOEIsRUFDbEUsVUFBa0I7SUFDcEIsSUFBTSxXQUFXLEdBQUc7UUFDbEIsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBRUQsMEZBQTBGO1FB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QjtvQkFDbEMsSUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDO2lCQUMzQztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsVUFBVSxFQUFFLGtCQUFrQjtvQkFDOUIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxXQUFXLENBQUM7b0JBQzVELEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7SUEzQlUsbUJBQW1CO1FBSC9CLFFBQVEsQ0FBQztZQUNSLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7U0FDOUIsQ0FBQztPQUNXLG1CQUFtQixDQTRCL0I7SUFBRCwwQkFBQztDQUFBLEFBNUJELElBNEJDO1NBNUJZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7Tmdzd0NvbW1DaGFubmVsfSBmcm9tICcuL2xvd19sZXZlbCc7XG5pbXBvcnQge1N3UHVzaH0gZnJvbSAnLi9wdXNoJztcbmltcG9ydCB7U3dVcGRhdGV9IGZyb20gJy4vdXBkYXRlJztcblxuLyoqXG4gKiBUb2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgb3B0aW9ucyBmb3IgYFNlcnZpY2VXb3JrZXJNb2R1bGVgIG91dHNpZGUgb2ZcbiAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlLnJlZ2lzdGVyKClgLlxuICpcbiAqIFlvdSBjYW4gdXNlIHRoaXMgdG9rZW4gdG8gZGVmaW5lIGEgcHJvdmlkZXIgdGhhdCBnZW5lcmF0ZXMgdGhlIHJlZ2lzdHJhdGlvbiBvcHRpb25zIGF0IHJ1bnRpbWUsXG4gKiBmb3IgZXhhbXBsZSB2aWEgYSBmdW5jdGlvbiBjYWxsOlxuICpcbiAqIHtAZXhhbXBsZSBzZXJ2aWNlLXdvcmtlci9yZWdpc3RyYXRpb24tb3B0aW9ucy9tb2R1bGUudHMgcmVnaW9uPVwicmVnaXN0cmF0aW9uLW9wdGlvbnNcIlxuICogICAgIGhlYWRlcj1cImFwcC5tb2R1bGUudHNcIn1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYW5kIHRoZSByZWxhdGVkIHNlcnZpY2VzIChzdWNoIGFzIGBTd1B1c2hgIGFuZFxuICAgKiBgU3dVcGRhdGVgKSB3aWxsIGF0dGVtcHQgdG8gY29tbXVuaWNhdGUgYW5kIGludGVyYWN0IHdpdGggaXQuXG4gICAqXG4gICAqIERlZmF1bHQ6IHRydWVcbiAgICovXG4gIGVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIFVSTCB0aGF0IGRlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIncyByZWdpc3RyYXRpb24gc2NvcGU7IHRoYXQgaXMsIHdoYXQgcmFuZ2Ugb2YgVVJMcyBpdCBjYW5cbiAgICogY29udHJvbC4gSXQgd2lsbCBiZSB1c2VkIHdoZW4gY2FsbGluZ1xuICAgKiBbU2VydmljZVdvcmtlckNvbnRhaW5lciNyZWdpc3RlcigpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2VydmljZVdvcmtlckNvbnRhaW5lci9yZWdpc3RlcikuXG4gICAqL1xuICBzY29wZT86IHN0cmluZztcblxuICAvKipcbiAgICogRGVmaW5lcyB0aGUgU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3ksIHdoaWNoIGRldGVybWluZXMgd2hlbiBpdCB3aWxsIGJlIHJlZ2lzdGVyZWRcbiAgICogd2l0aCB0aGUgYnJvd3Nlci5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgcmVnaXN0ZXJpbmcgb25jZSB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAoaS5lLiBhcyBzb29uIGFzIHRoZXJlIGFyZVxuICAgKiBubyBwZW5kaW5nIG1pY3JvLSBhbmQgbWFjcm8tdGFza3MpLCBpcyBkZXNpZ25lZCByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uIGFzIHBvc3NpYmxlXG4gICAqIGJ1dCB3aXRob3V0IGFmZmVjdGluZyB0aGUgYXBwbGljYXRpb24ncyBmaXJzdCB0aW1lIGxvYWQuXG4gICAqXG4gICAqIFN0aWxsLCB0aGVyZSBtaWdodCBiZSBjYXNlcyB3aGVyZSB5b3Ugd2FudCBtb3JlIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBTZXJ2aWNlV29ya2VyIGlzXG4gICAqIHJlZ2lzdGVyZWQgKGUuZy4gdGhlcmUgbWlnaHQgYmUgYSBsb25nLXJ1bm5pbmcgdGltZW91dCBvciBwb2xsaW5nIGludGVydmFsLCBwcmV2ZW50aW5nIHRoZSBhcHBcbiAgICogdG8gc3RhYmlsaXplKS4gVGhlIGF2YWlsYWJsZSBvcHRpb24gYXJlOlxuICAgKlxuICAgKiAtIGByZWdpc3RlcldoZW5TdGFibGVgOiBSZWdpc3RlciBhcyBzb29uIGFzIHRoZSBhcHBsaWNhdGlvbiBzdGFiaWxpemVzIChubyBwZW5kaW5nXG4gICAqICAgICAgbWljcm8tL21hY3JvLXRhc2tzKS5cbiAgICogLSBgcmVnaXN0ZXJJbW1lZGlhdGVseWA6IFJlZ2lzdGVyIGltbWVkaWF0ZWx5LlxuICAgKiAtIGByZWdpc3RlcldpdGhEZWxheTo8dGltZW91dD5gOiBSZWdpc3RlciB3aXRoIGEgZGVsYXkgb2YgYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzLiBGb3JcbiAgICogICAgIGV4YW1wbGUsIHVzZSBgcmVnaXN0ZXJXaXRoRGVsYXk6NTAwMGAgdG8gcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYWZ0ZXIgNSBzZWNvbmRzLiBJZlxuICAgKiAgICAgYDx0aW1lb3V0PmAgaXMgb21pdHRlZCwgaXMgZGVmYXVsdHMgdG8gYDBgLCB3aGljaCB3aWxsIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFzIHNvb25cbiAgICogICAgIGFzIHBvc3NpYmxlIGJ1dCBzdGlsbCBhc3luY2hyb25vdXNseSwgb25jZSBhbGwgcGVuZGluZyBtaWNyby10YXNrcyBhcmUgY29tcGxldGVkLlxuICAgKiAtIEFuIFtPYnNlcnZhYmxlXShndWlkZS9vYnNlcnZhYmxlcykgZmFjdG9yeSBmdW5jdGlvbjogQSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gYE9ic2VydmFibGVgLlxuICAgKiAgICAgVGhlIGZ1bmN0aW9uIHdpbGwgYmUgdXNlZCBhdCBydW50aW1lIHRvIG9idGFpbiBhbmQgc3Vic2NyaWJlIHRvIHRoZSBgT2JzZXJ2YWJsZWAgYW5kIHRoZVxuICAgKiAgICAgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYXMgc29vbiBhcyB0aGUgZmlyc3QgdmFsdWUgaXMgZW1pdHRlZC5cbiAgICpcbiAgICogRGVmYXVsdDogJ3JlZ2lzdGVyV2hlblN0YWJsZSdcbiAgICovXG4gIHJlZ2lzdHJhdGlvblN0cmF0ZWd5Pzogc3RyaW5nfCgoKSA9PiBPYnNlcnZhYmxlPHVua25vd24+KTtcbn1cblxuZXhwb3J0IGNvbnN0IFNDUklQVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdOR1NXX1JFR0lTVEVSX1NDUklQVCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0FwcEluaXRpYWxpemVyKFxuICAgIGluamVjdG9yOiBJbmplY3Rvciwgc2NyaXB0OiBzdHJpbmcsIG9wdGlvbnM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucyxcbiAgICBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBGdW5jdGlvbiB7XG4gIGNvbnN0IGluaXRpYWxpemVyID0gKCkgPT4ge1xuICAgIGlmICghKGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSAmJlxuICAgICAgICAgIG9wdGlvbnMuZW5hYmxlZCAhPT0gZmFsc2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2FpdCBmb3Igc2VydmljZSB3b3JrZXIgY29udHJvbGxlciBjaGFuZ2VzLCBhbmQgZmlyZSBhbiBJTklUSUFMSVpFIGFjdGlvbiB3aGVuIGEgbmV3IFNXXG4gICAgLy8gYmVjb21lcyBhY3RpdmUuIFRoaXMgYWxsb3dzIHRoZSBTVyB0byBpbml0aWFsaXplIGl0c2VsZiBldmVuIGlmIHRoZXJlIGlzIG5vIGFwcGxpY2F0aW9uXG4gICAgLy8gdHJhZmZpYy5cbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuICAgICAgaWYgKG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgIT09IG51bGwpIHtcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlci5wb3N0TWVzc2FnZSh7YWN0aW9uOiAnSU5JVElBTElaRSd9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCByZWFkeVRvUmVnaXN0ZXIkOiBPYnNlcnZhYmxlPHVua25vd24+O1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBbc3RyYXRlZ3ksIC4uLmFyZ3NdID0gKG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgfHwgJ3JlZ2lzdGVyV2hlblN0YWJsZScpLnNwbGl0KCc6Jyk7XG4gICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVySW1tZWRpYXRlbHknOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvZiAobnVsbCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2l0aERlbGF5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb2YgKG51bGwpLnBpcGUoZGVsYXkoK2FyZ3NbMF0gfHwgMCkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldoZW5TdGFibGUnOlxuICAgICAgICAgIGNvbnN0IGFwcFJlZiA9IGluamVjdG9yLmdldDxBcHBsaWNhdGlvblJlZj4oQXBwbGljYXRpb25SZWYpO1xuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBhcHBSZWYuaXNTdGFibGUucGlwZShmaWx0ZXIoc3RhYmxlID0+IHN0YWJsZSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIFVua25vd24gc3RyYXRlZ3kuXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBgVW5rbm93biBTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdHJhdGVneTogJHtvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5fWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERvbid0IHJldHVybiBhbnl0aGluZyB0byBhdm9pZCBibG9ja2luZyB0aGUgYXBwbGljYXRpb24gdW50aWwgdGhlIFNXIGlzIHJlZ2lzdGVyZWQuXG4gICAgLy8gQ2F0Y2ggYW5kIGxvZyB0aGUgZXJyb3IgaWYgU1cgcmVnaXN0cmF0aW9uIGZhaWxzIHRvIGF2b2lkIHVuY2F1Z2h0IHJlamVjdGlvbiB3YXJuaW5nLlxuICAgIHJlYWR5VG9SZWdpc3RlciQucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoXG4gICAgICAgICgpID0+IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHNjcmlwdCwge3Njb3BlOiBvcHRpb25zLnNjb3BlfSlcbiAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZCB3aXRoOicsIGVycikpKTtcbiAgfTtcbiAgcmV0dXJuIGluaXRpYWxpemVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0NvbW1DaGFubmVsRmFjdG9yeShcbiAgICBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHBsYXRmb3JtSWQ6IHN0cmluZyk6IE5nc3dDb21tQ2hhbm5lbCB7XG4gIHJldHVybiBuZXcgTmdzd0NvbW1DaGFubmVsKFxuICAgICAgaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgb3B0cy5lbmFibGVkICE9PSBmYWxzZSA/IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQpO1xufVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbU3dQdXNoLCBTd1VwZGF0ZV0sXG59KVxuZXhwb3J0IGNsYXNzIFNlcnZpY2VXb3JrZXJNb2R1bGUge1xuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGdpdmVuIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIgc2NyaXB0LlxuICAgKlxuICAgKiBJZiBgZW5hYmxlZGAgaXMgc2V0IHRvIGBmYWxzZWAgaW4gdGhlIGdpdmVuIG9wdGlvbnMsIHRoZSBtb2R1bGUgd2lsbCBiZWhhdmUgYXMgaWYgc2VydmljZVxuICAgKiB3b3JrZXJzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCBhbmQgdGhlIHNlcnZpY2Ugd29ya2VyIHdpbGwgbm90IGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBzdGF0aWMgcmVnaXN0ZXIoc2NyaXB0OiBzdHJpbmcsIG9wdHM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucyA9IHt9KTpcbiAgICAgIE1vZHVsZVdpdGhQcm92aWRlcnM8U2VydmljZVdvcmtlck1vZHVsZT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU2VydmljZVdvcmtlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogU0NSSVBULCB1c2VWYWx1ZTogc2NyaXB0fSxcbiAgICAgICAge3Byb3ZpZGU6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgdXNlVmFsdWU6IG9wdHN9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTmdzd0NvbW1DaGFubmVsLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dDb21tQ2hhbm5lbEZhY3RvcnksXG4gICAgICAgICAgZGVwczogW1N3UmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0FwcEluaXRpYWxpemVyLFxuICAgICAgICAgIGRlcHM6IFtJbmplY3RvciwgU0NSSVBULCBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXSxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxufVxuIl19