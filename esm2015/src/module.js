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
ServiceWorkerModule.ɵfac = function ServiceWorkerModule_Factory(t) { return new (t || ServiceWorkerModule)(); };
ServiceWorkerModule.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: ServiceWorkerModule });
ServiceWorkerModule.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ providers: [SwPush, SwUpdate] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ServiceWorkerModule, [{
        type: NgModule,
        args: [{
                providers: [SwPush, SwUpdate],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUF1QixRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1SSxPQUFPLEVBQUMsS0FBSyxFQUFjLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbEM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLE9BQWdCLHFCQUFxQjtDQThDMUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQVMsc0JBQXNCLENBQUMsQ0FBQztBQUV6RSxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLFFBQWtCLEVBQUUsTUFBYyxFQUFFLE9BQThCLEVBQ2xFLFVBQWtCO0lBQ3BCLE1BQU0sV0FBVyxHQUFHLEdBQUcsRUFBRTtRQUN2QixJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxTQUFTLENBQUM7WUFDL0QsT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFFRCwwRkFBMEY7UUFDMUYs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LGVBQWUsQ0FDdEIsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN6QixTQUFTLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7O0dBRUc7QUFJSCxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFjLEVBQUUsT0FBOEIsRUFBRTtRQUU5RCxPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUM7Z0JBQ25DLEVBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7Z0JBQ2hEO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsc0JBQXNCO29CQUNsQyxJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxXQUFXLENBQUM7aUJBQzNDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsa0JBQWtCO29CQUM5QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLFdBQVcsQ0FBQztvQkFDNUQsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOztzRkEzQlUsbUJBQW1CO3FFQUFuQixtQkFBbUI7MEVBRm5CLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQzt1RkFFbEIsbUJBQW1CO2NBSC9CLFFBQVE7ZUFBQztnQkFDUixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO2FBQzlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FQUF9JTklUSUFMSVpFUiwgQXBwbGljYXRpb25SZWYsIEluamVjdGlvblRva2VuLCBJbmplY3RvciwgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIE5nWm9uZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHttZXJnZSwgT2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7Tmdzd0NvbW1DaGFubmVsfSBmcm9tICcuL2xvd19sZXZlbCc7XG5pbXBvcnQge1N3UHVzaH0gZnJvbSAnLi9wdXNoJztcbmltcG9ydCB7U3dVcGRhdGV9IGZyb20gJy4vdXBkYXRlJztcblxuLyoqXG4gKiBUb2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgb3B0aW9ucyBmb3IgYFNlcnZpY2VXb3JrZXJNb2R1bGVgIG91dHNpZGUgb2ZcbiAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlLnJlZ2lzdGVyKClgLlxuICpcbiAqIFlvdSBjYW4gdXNlIHRoaXMgdG9rZW4gdG8gZGVmaW5lIGEgcHJvdmlkZXIgdGhhdCBnZW5lcmF0ZXMgdGhlIHJlZ2lzdHJhdGlvbiBvcHRpb25zIGF0IHJ1bnRpbWUsXG4gKiBmb3IgZXhhbXBsZSB2aWEgYSBmdW5jdGlvbiBjYWxsOlxuICpcbiAqIHtAZXhhbXBsZSBzZXJ2aWNlLXdvcmtlci9yZWdpc3RyYXRpb24tb3B0aW9ucy9tb2R1bGUudHMgcmVnaW9uPVwicmVnaXN0cmF0aW9uLW9wdGlvbnNcIlxuICogICAgIGhlYWRlcj1cImFwcC5tb2R1bGUudHNcIn1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYW5kIHRoZSByZWxhdGVkIHNlcnZpY2VzIChzdWNoIGFzIGBTd1B1c2hgIGFuZFxuICAgKiBgU3dVcGRhdGVgKSB3aWxsIGF0dGVtcHQgdG8gY29tbXVuaWNhdGUgYW5kIGludGVyYWN0IHdpdGggaXQuXG4gICAqXG4gICAqIERlZmF1bHQ6IHRydWVcbiAgICovXG4gIGVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIFVSTCB0aGF0IGRlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIncyByZWdpc3RyYXRpb24gc2NvcGU7IHRoYXQgaXMsIHdoYXQgcmFuZ2Ugb2YgVVJMcyBpdCBjYW5cbiAgICogY29udHJvbC4gSXQgd2lsbCBiZSB1c2VkIHdoZW4gY2FsbGluZ1xuICAgKiBbU2VydmljZVdvcmtlckNvbnRhaW5lciNyZWdpc3RlcigpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2VydmljZVdvcmtlckNvbnRhaW5lci9yZWdpc3RlcikuXG4gICAqL1xuICBzY29wZT86IHN0cmluZztcblxuICAvKipcbiAgICogRGVmaW5lcyB0aGUgU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3ksIHdoaWNoIGRldGVybWluZXMgd2hlbiBpdCB3aWxsIGJlIHJlZ2lzdGVyZWRcbiAgICogd2l0aCB0aGUgYnJvd3Nlci5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgcmVnaXN0ZXJpbmcgb25jZSB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAoaS5lLiBhcyBzb29uIGFzIHRoZXJlIGFyZVxuICAgKiBubyBwZW5kaW5nIG1pY3JvLSBhbmQgbWFjcm8tdGFza3MpIGlzIGRlc2lnbmVkIHRvIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFzIHNvb24gYXNcbiAgICogcG9zc2libGUgYnV0IHdpdGhvdXQgYWZmZWN0aW5nIHRoZSBhcHBsaWNhdGlvbidzIGZpcnN0IHRpbWUgbG9hZC5cbiAgICpcbiAgICogU3RpbGwsIHRoZXJlIG1pZ2h0IGJlIGNhc2VzIHdoZXJlIHlvdSB3YW50IG1vcmUgY29udHJvbCBvdmVyIHdoZW4gdGhlIFNlcnZpY2VXb3JrZXIgaXNcbiAgICogcmVnaXN0ZXJlZCAoZm9yIGV4YW1wbGUsIHRoZXJlIG1pZ2h0IGJlIGEgbG9uZy1ydW5uaW5nIHRpbWVvdXQgb3IgcG9sbGluZyBpbnRlcnZhbCwgcHJldmVudGluZ1xuICAgKiB0aGUgYXBwIGZyb20gc3RhYmlsaXppbmcpLiBUaGUgYXZhaWxhYmxlIG9wdGlvbiBhcmU6XG4gICAqXG4gICAqIC0gYHJlZ2lzdGVyV2hlblN0YWJsZTo8dGltZW91dD5gOiBSZWdpc3RlciBhcyBzb29uIGFzIHRoZSBhcHBsaWNhdGlvbiBzdGFiaWxpemVzIChubyBwZW5kaW5nXG4gICAqICAgICBtaWNyby0vbWFjcm8tdGFza3MpIGJ1dCBubyBsYXRlciB0aGFuIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcy4gSWYgdGhlIGFwcCBoYXNuJ3RcbiAgICogICAgIHN0YWJpbGl6ZWQgYWZ0ZXIgYDx0aW1lb3V0PmAgbWlsbGlzZWNvbmRzIChmb3IgZXhhbXBsZSwgZHVlIHRvIGEgcmVjdXJyZW50IGFzeW5jaHJvbm91c1xuICAgKiAgICAgdGFzayksIHRoZSBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhbnl3YXkuXG4gICAqICAgICBJZiBgPHRpbWVvdXQ+YCBpcyBvbWl0dGVkLCB0aGUgU2VydmljZVdvcmtlciB3aWxsIG9ubHkgYmUgcmVnaXN0ZXJlZCBvbmNlIHRoZSBhcHBcbiAgICogICAgIHN0YWJpbGl6ZXMuXG4gICAqIC0gYHJlZ2lzdGVySW1tZWRpYXRlbHlgOiBSZWdpc3RlciBpbW1lZGlhdGVseS5cbiAgICogLSBgcmVnaXN0ZXJXaXRoRGVsYXk6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgd2l0aCBhIGRlbGF5IG9mIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcy4gRm9yXG4gICAqICAgICBleGFtcGxlLCB1c2UgYHJlZ2lzdGVyV2l0aERlbGF5OjUwMDBgIHRvIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFmdGVyIDUgc2Vjb25kcy4gSWZcbiAgICogICAgIGA8dGltZW91dD5gIGlzIG9taXR0ZWQsIGlzIGRlZmF1bHRzIHRvIGAwYCwgd2hpY2ggd2lsbCByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uXG4gICAqICAgICBhcyBwb3NzaWJsZSBidXQgc3RpbGwgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIHBlbmRpbmcgbWljcm8tdGFza3MgYXJlIGNvbXBsZXRlZC5cbiAgICogLSBBbiBbT2JzZXJ2YWJsZV0oZ3VpZGUvb2JzZXJ2YWJsZXMpIGZhY3RvcnkgZnVuY3Rpb246IEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGBPYnNlcnZhYmxlYC5cbiAgICogICAgIFRoZSBmdW5jdGlvbiB3aWxsIGJlIHVzZWQgYXQgcnVudGltZSB0byBvYnRhaW4gYW5kIHN1YnNjcmliZSB0byB0aGUgYE9ic2VydmFibGVgIGFuZCB0aGVcbiAgICogICAgIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFzIHNvb24gYXMgdGhlIGZpcnN0IHZhbHVlIGlzIGVtaXR0ZWQuXG4gICAqXG4gICAqIERlZmF1bHQ6ICdyZWdpc3RlcldoZW5TdGFibGU6MzAwMDAnXG4gICAqL1xuICByZWdpc3RyYXRpb25TdHJhdGVneT86IHN0cmluZ3woKCkgPT4gT2JzZXJ2YWJsZTx1bmtub3duPik7XG59XG5cbmV4cG9ydCBjb25zdCBTQ1JJUFQgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignTkdTV19SRUdJU1RFUl9TQ1JJUFQnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dBcHBJbml0aWFsaXplcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsIHNjcmlwdDogc3RyaW5nLCBvcHRpb25zOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsXG4gICAgcGxhdGZvcm1JZDogc3RyaW5nKTogRnVuY3Rpb24ge1xuICBjb25zdCBpbml0aWFsaXplciA9ICgpID0+IHtcbiAgICBpZiAoIShpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgJiZcbiAgICAgICAgICBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIGNvbnRyb2xsZXIgY2hhbmdlcywgYW5kIGZpcmUgYW4gSU5JVElBTElaRSBhY3Rpb24gd2hlbiBhIG5ldyBTV1xuICAgIC8vIGJlY29tZXMgYWN0aXZlLiBUaGlzIGFsbG93cyB0aGUgU1cgdG8gaW5pdGlhbGl6ZSBpdHNlbGYgZXZlbiBpZiB0aGVyZSBpcyBubyBhcHBsaWNhdGlvblxuICAgIC8vIHRyYWZmaWMuXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICE9PSBudWxsKSB7XG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ0lOSVRJQUxJWkUnfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcmVhZHlUb1JlZ2lzdGVyJDogT2JzZXJ2YWJsZTx1bmtub3duPjtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgW3N0cmF0ZWd5LCAuLi5hcmdzXSA9XG4gICAgICAgICAgKG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgfHwgJ3JlZ2lzdGVyV2hlblN0YWJsZTozMDAwMCcpLnNwbGl0KCc6Jyk7XG5cbiAgICAgIHN3aXRjaCAoc3RyYXRlZ3kpIHtcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJJbW1lZGlhdGVseSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9mKG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldpdGhEZWxheSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IGRlbGF5V2l0aFRpbWVvdXQoK2FyZ3NbMF0gfHwgMCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2hlblN0YWJsZSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9ICFhcmdzWzBdID8gd2hlblN0YWJsZShpbmplY3RvcikgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lcmdlKHdoZW5TdGFibGUoaW5qZWN0b3IpLCBkZWxheVdpdGhUaW1lb3V0KCthcmdzWzBdKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gVW5rbm93biBzdHJhdGVneS5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBVbmtub3duIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5OiAke29wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3l9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgcmV0dXJuIGFueXRoaW5nIHRvIGF2b2lkIGJsb2NraW5nIHRoZSBhcHBsaWNhdGlvbiB1bnRpbCB0aGUgU1cgaXMgcmVnaXN0ZXJlZC5cbiAgICAvLyBBbHNvLCBydW4gb3V0c2lkZSB0aGUgQW5ndWxhciB6b25lIHRvIGF2b2lkIHByZXZlbnRpbmcgdGhlIGFwcCBmcm9tIHN0YWJpbGl6aW5nIChlc3BlY2lhbGx5XG4gICAgLy8gZ2l2ZW4gdGhhdCBzb21lIHJlZ2lzdHJhdGlvbiBzdHJhdGVnaWVzIHdhaXQgZm9yIHRoZSBhcHAgdG8gc3RhYmlsaXplKS5cbiAgICAvLyBDYXRjaCBhbmQgbG9nIHRoZSBlcnJvciBpZiBTVyByZWdpc3RyYXRpb24gZmFpbHMgdG8gYXZvaWQgdW5jYXVnaHQgcmVqZWN0aW9uIHdhcm5pbmcuXG4gICAgY29uc3Qgbmdab25lID0gaW5qZWN0b3IuZ2V0KE5nWm9uZSk7XG4gICAgbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKFxuICAgICAgICAoKSA9PiByZWFkeVRvUmVnaXN0ZXIkLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKFxuICAgICAgICAgICAgKCkgPT5cbiAgICAgICAgICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihzY3JpcHQsIHtzY29wZTogb3B0aW9ucy5zY29wZX0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcignU2VydmljZSB3b3JrZXIgcmVnaXN0cmF0aW9uIGZhaWxlZCB3aXRoOicsIGVycikpKSk7XG4gIH07XG4gIHJldHVybiBpbml0aWFsaXplcjtcbn1cblxuZnVuY3Rpb24gZGVsYXlXaXRoVGltZW91dCh0aW1lb3V0OiBudW1iZXIpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcbiAgcmV0dXJuIG9mKG51bGwpLnBpcGUoZGVsYXkodGltZW91dCkpO1xufVxuXG5mdW5jdGlvbiB3aGVuU3RhYmxlKGluamVjdG9yOiBJbmplY3Rvcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCBhcHBSZWYgPSBpbmplY3Rvci5nZXQoQXBwbGljYXRpb25SZWYpO1xuICByZXR1cm4gYXBwUmVmLmlzU3RhYmxlLnBpcGUoZmlsdGVyKHN0YWJsZSA9PiBzdGFibGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dDb21tQ2hhbm5lbEZhY3RvcnkoXG4gICAgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zLCBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBOZ3N3Q29tbUNoYW5uZWwge1xuICByZXR1cm4gbmV3IE5nc3dDb21tQ2hhbm5lbChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmIG9wdHMuZW5hYmxlZCAhPT0gZmFsc2UgPyBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1N3UHVzaCwgU3dVcGRhdGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlV29ya2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBnaXZlbiBBbmd1bGFyIFNlcnZpY2UgV29ya2VyIHNjcmlwdC5cbiAgICpcbiAgICogSWYgYGVuYWJsZWRgIGlzIHNldCB0byBgZmFsc2VgIGluIHRoZSBnaXZlbiBvcHRpb25zLCB0aGUgbW9kdWxlIHdpbGwgYmVoYXZlIGFzIGlmIHNlcnZpY2VcbiAgICogd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIHRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyKHNjcmlwdDogc3RyaW5nLCBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMgPSB7fSk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPFNlcnZpY2VXb3JrZXJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNlcnZpY2VXb3JrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IFNDUklQVCwgdXNlVmFsdWU6IHNjcmlwdH0sXG4gICAgICAgIHtwcm92aWRlOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHVzZVZhbHVlOiBvcHRzfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5nc3dDb21tQ2hhbm5lbCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF0sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==