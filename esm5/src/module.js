import { __read } from "tslib";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUksT0FBTyxFQUFhLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDNUMsT0FBTyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxVQUFVLENBQUM7O0FBRWxDOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUFBQTtJQThDQSxDQUFDO0lBQUQsNEJBQUM7QUFBRCxDQUFDLEFBOUNELElBOENDOztBQUVELE1BQU0sQ0FBQyxJQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBUyxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sVUFBVSxrQkFBa0IsQ0FDOUIsUUFBa0IsRUFBRSxNQUFjLEVBQUUsT0FBOEIsRUFDbEUsVUFBa0I7SUFDcEIsSUFBTSxXQUFXLEdBQUc7UUFDbEIsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FB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QyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxDQUFDO0FBQzNFLENBQUM7QUFFRDs7R0FFRztBQUNIO0lBQUE7S0ErQkM7SUEzQkM7Ozs7O09BS0c7SUFDSSw0QkFBUSxHQUFmLFVBQWdCLE1BQWMsRUFBRSxJQUFnQztRQUFoQyxxQkFBQSxFQUFBLFNBQWdDO1FBRTlELE9BQU87WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQztnQkFDbkMsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDaEQ7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxzQkFBc0I7b0JBQ2xDLElBQUksRUFBRSxDQUFDLHFCQUFxQixFQUFFLFdBQVcsQ0FBQztpQkFDM0M7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7b0JBQzlCLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUscUJBQXFCLEVBQUUsV0FBVyxDQUFDO29CQUM1RCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztJQUNKLENBQUM7MkRBM0JVLG1CQUFtQjt5SEFBbkIsbUJBQW1CLG1CQUZuQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7OEJBN0ovQjtDQTJMQyxBQS9CRCxJQStCQztTQTVCWSxtQkFBbUI7a0RBQW5CLG1CQUFtQjtjQUgvQixRQUFRO2VBQUM7Z0JBQ1IsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQzthQUM5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgTmdab25lLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIG1lcmdlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7Tmdzd0NvbW1DaGFubmVsfSBmcm9tICcuL2xvd19sZXZlbCc7XG5pbXBvcnQge1N3UHVzaH0gZnJvbSAnLi9wdXNoJztcbmltcG9ydCB7U3dVcGRhdGV9IGZyb20gJy4vdXBkYXRlJztcblxuLyoqXG4gKiBUb2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgb3B0aW9ucyBmb3IgYFNlcnZpY2VXb3JrZXJNb2R1bGVgIG91dHNpZGUgb2ZcbiAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlLnJlZ2lzdGVyKClgLlxuICpcbiAqIFlvdSBjYW4gdXNlIHRoaXMgdG9rZW4gdG8gZGVmaW5lIGEgcHJvdmlkZXIgdGhhdCBnZW5lcmF0ZXMgdGhlIHJlZ2lzdHJhdGlvbiBvcHRpb25zIGF0IHJ1bnRpbWUsXG4gKiBmb3IgZXhhbXBsZSB2aWEgYSBmdW5jdGlvbiBjYWxsOlxuICpcbiAqIHtAZXhhbXBsZSBzZXJ2aWNlLXdvcmtlci9yZWdpc3RyYXRpb24tb3B0aW9ucy9tb2R1bGUudHMgcmVnaW9uPVwicmVnaXN0cmF0aW9uLW9wdGlvbnNcIlxuICogICAgIGhlYWRlcj1cImFwcC5tb2R1bGUudHNcIn1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYW5kIHRoZSByZWxhdGVkIHNlcnZpY2VzIChzdWNoIGFzIGBTd1B1c2hgIGFuZFxuICAgKiBgU3dVcGRhdGVgKSB3aWxsIGF0dGVtcHQgdG8gY29tbXVuaWNhdGUgYW5kIGludGVyYWN0IHdpdGggaXQuXG4gICAqXG4gICAqIERlZmF1bHQ6IHRydWVcbiAgICovXG4gIGVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIFVSTCB0aGF0IGRlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIncyByZWdpc3RyYXRpb24gc2NvcGU7IHRoYXQgaXMsIHdoYXQgcmFuZ2Ugb2YgVVJMcyBpdCBjYW5cbiAgICogY29udHJvbC4gSXQgd2lsbCBiZSB1c2VkIHdoZW4gY2FsbGluZ1xuICAgKiBbU2VydmljZVdvcmtlckNvbnRhaW5lciNyZWdpc3RlcigpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2VydmljZVdvcmtlckNvbnRhaW5lci9yZWdpc3RlcikuXG4gICAqL1xuICBzY29wZT86IHN0cmluZztcblxuICAvKipcbiAgICogRGVmaW5lcyB0aGUgU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3ksIHdoaWNoIGRldGVybWluZXMgd2hlbiBpdCB3aWxsIGJlIHJlZ2lzdGVyZWRcbiAgICogd2l0aCB0aGUgYnJvd3Nlci5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgcmVnaXN0ZXJpbmcgb25jZSB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAoaS5lLiBhcyBzb29uIGFzIHRoZXJlIGFyZVxuICAgKiBubyBwZW5kaW5nIG1pY3JvLSBhbmQgbWFjcm8tdGFza3MpLCBpcyBkZXNpZ25lZCByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uIGFzIHBvc3NpYmxlXG4gICAqIGJ1dCB3aXRob3V0IGFmZmVjdGluZyB0aGUgYXBwbGljYXRpb24ncyBmaXJzdCB0aW1lIGxvYWQuXG4gICAqXG4gICAqIFN0aWxsLCB0aGVyZSBtaWdodCBiZSBjYXNlcyB3aGVyZSB5b3Ugd2FudCBtb3JlIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBTZXJ2aWNlV29ya2VyIGlzXG4gICAqIHJlZ2lzdGVyZWQgKGUuZy4gdGhlcmUgbWlnaHQgYmUgYSBsb25nLXJ1bm5pbmcgdGltZW91dCBvciBwb2xsaW5nIGludGVydmFsLCBwcmV2ZW50aW5nIHRoZSBhcHBcbiAgICogdG8gc3RhYmlsaXplKS4gVGhlIGF2YWlsYWJsZSBvcHRpb24gYXJlOlxuICAgKlxuICAgKiAtIGByZWdpc3RlcldoZW5TdGFibGU6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgYXMgc29vbiBhcyB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAobm8gcGVuZGluZ1xuICAgKiAgICAgbWljcm8tL21hY3JvLXRhc2tzKSBidXQgbm8gbGF0ZXIgdGhhbiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIElmIHRoZSBhcHAgaGFzbid0XG4gICAqICAgICBzdGFiaWxpemVkIGFmdGVyIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcyAoZm9yIGV4YW1wbGUsIGR1ZSB0byBhIHJlY3VycmVudCBhc3luY2hyb25vdXNcbiAgICogICAgIHRhc2spLCB0aGUgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYW55d2F5LlxuICAgKiAgICAgSWYgYDx0aW1lb3V0PmAgaXMgb21pdHRlZCwgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBvbmx5IGJlIHJlZ2lzdGVyZWQgb25jZSB0aGUgYXBwXG4gICAqICAgICBzdGFiaWxpemVzLlxuICAgKiAtIGByZWdpc3RlckltbWVkaWF0ZWx5YDogUmVnaXN0ZXIgaW1tZWRpYXRlbHkuXG4gICAqIC0gYHJlZ2lzdGVyV2l0aERlbGF5Ojx0aW1lb3V0PmA6IFJlZ2lzdGVyIHdpdGggYSBkZWxheSBvZiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIEZvclxuICAgKiAgICAgZXhhbXBsZSwgdXNlIGByZWdpc3RlcldpdGhEZWxheTo1MDAwYCB0byByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhZnRlciA1IHNlY29uZHMuIElmXG4gICAqICAgICBgPHRpbWVvdXQ+YCBpcyBvbWl0dGVkLCBpcyBkZWZhdWx0cyB0byBgMGAsIHdoaWNoIHdpbGwgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vblxuICAgKiAgICAgYXMgcG9zc2libGUgYnV0IHN0aWxsIGFzeW5jaHJvbm91c2x5LCBvbmNlIGFsbCBwZW5kaW5nIG1pY3JvLXRhc2tzIGFyZSBjb21wbGV0ZWQuXG4gICAqIC0gQW4gW09ic2VydmFibGVdKGd1aWRlL29ic2VydmFibGVzKSBmYWN0b3J5IGZ1bmN0aW9uOiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBgT2JzZXJ2YWJsZWAuXG4gICAqICAgICBUaGUgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIGF0IHJ1bnRpbWUgdG8gb2J0YWluIGFuZCBzdWJzY3JpYmUgdG8gdGhlIGBPYnNlcnZhYmxlYCBhbmQgdGhlXG4gICAqICAgICBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhcyBzb29uIGFzIHRoZSBmaXJzdCB2YWx1ZSBpcyBlbWl0dGVkLlxuICAgKlxuICAgKiBEZWZhdWx0OiAncmVnaXN0ZXJXaGVuU3RhYmxlJ1xuICAgKi9cbiAgcmVnaXN0cmF0aW9uU3RyYXRlZ3k/OiBzdHJpbmd8KCgpID0+IE9ic2VydmFibGU8dW5rbm93bj4pO1xufVxuXG5leHBvcnQgY29uc3QgU0NSSVBUID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ05HU1dfUkVHSVNURVJfU0NSSVBUJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3QXBwSW5pdGlhbGl6ZXIoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLCBzY3JpcHQ6IHN0cmluZywgb3B0aW9uczogU3dSZWdpc3RyYXRpb25PcHRpb25zLFxuICAgIHBsYXRmb3JtSWQ6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgY29uc3QgaW5pdGlhbGl6ZXIgPSAoKSA9PiB7XG4gICAgaWYgKCEoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpICYmXG4gICAgICAgICAgb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciBzZXJ2aWNlIHdvcmtlciBjb250cm9sbGVyIGNoYW5nZXMsIGFuZCBmaXJlIGFuIElOSVRJQUxJWkUgYWN0aW9uIHdoZW4gYSBuZXcgU1dcbiAgICAvLyBiZWNvbWVzIGFjdGl2ZS4gVGhpcyBhbGxvd3MgdGhlIFNXIHRvIGluaXRpYWxpemUgaXRzZWxmIGV2ZW4gaWYgdGhlcmUgaXMgbm8gYXBwbGljYXRpb25cbiAgICAvLyB0cmFmZmljLlxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciAhPT0gbnVsbCkge1xuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdJTklUSUFMSVpFJ30pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHJlYWR5VG9SZWdpc3RlciQ6IE9ic2VydmFibGU8dW5rbm93bj47XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtzdHJhdGVneSwgLi4uYXJnc10gPVxuICAgICAgICAgIChvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5IHx8ICdyZWdpc3RlcldoZW5TdGFibGU6MzAwMDAnKS5zcGxpdCgnOicpO1xuXG4gICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVySW1tZWRpYXRlbHknOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvZiAobnVsbCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2l0aERlbGF5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gZGVsYXlXaXRoVGltZW91dCgrYXJnc1swXSB8fCAwKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJXaGVuU3RhYmxlJzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gIWFyZ3NbMF0gPyB3aGVuU3RhYmxlKGluamVjdG9yKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2Uod2hlblN0YWJsZShpbmplY3RvciksIGRlbGF5V2l0aFRpbWVvdXQoK2FyZ3NbMF0pKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBVbmtub3duIHN0cmF0ZWd5LlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYFVua25vd24gU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3k6ICR7b3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEb24ndCByZXR1cm4gYW55dGhpbmcgdG8gYXZvaWQgYmxvY2tpbmcgdGhlIGFwcGxpY2F0aW9uIHVudGlsIHRoZSBTVyBpcyByZWdpc3RlcmVkLlxuICAgIC8vIEFsc28sIHJ1biBvdXRzaWRlIHRoZSBBbmd1bGFyIHpvbmUgdG8gYXZvaWQgcHJldmVudGluZyB0aGUgYXBwIGZyb20gc3RhYmlsaXppbmcgKGVzcGVjaWFsbHlcbiAgICAvLyBnaXZlbiB0aGF0IHNvbWUgcmVnaXN0cmF0aW9uIHN0cmF0ZWdpZXMgd2FpdCBmb3IgdGhlIGFwcCB0byBzdGFiaWxpemUpLlxuICAgIC8vIENhdGNoIGFuZCBsb2cgdGhlIGVycm9yIGlmIFNXIHJlZ2lzdHJhdGlvbiBmYWlscyB0byBhdm9pZCB1bmNhdWdodCByZWplY3Rpb24gd2FybmluZy5cbiAgICBjb25zdCBuZ1pvbmUgPSBpbmplY3Rvci5nZXQoTmdab25lKTtcbiAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoXG4gICAgICAgICgpID0+IHJlYWR5VG9SZWdpc3RlciQucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHNjcmlwdCwge3Njb3BlOiBvcHRpb25zLnNjb3BlfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdTZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkIHdpdGg6JywgZXJyKSkpKTtcbiAgfTtcbiAgcmV0dXJuIGluaXRpYWxpemVyO1xufVxuXG5mdW5jdGlvbiBkZWxheVdpdGhUaW1lb3V0KHRpbWVvdXQ6IG51bWJlcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICByZXR1cm4gb2YgKG51bGwpLnBpcGUoZGVsYXkodGltZW91dCkpO1xufVxuXG5mdW5jdGlvbiB3aGVuU3RhYmxlKGluamVjdG9yOiBJbmplY3Rvcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCBhcHBSZWYgPSBpbmplY3Rvci5nZXQoQXBwbGljYXRpb25SZWYpO1xuICByZXR1cm4gYXBwUmVmLmlzU3RhYmxlLnBpcGUoZmlsdGVyKHN0YWJsZSA9PiBzdGFibGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dDb21tQ2hhbm5lbEZhY3RvcnkoXG4gICAgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zLCBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBOZ3N3Q29tbUNoYW5uZWwge1xuICByZXR1cm4gbmV3IE5nc3dDb21tQ2hhbm5lbChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmIG9wdHMuZW5hYmxlZCAhPT0gZmFsc2UgPyBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1N3UHVzaCwgU3dVcGRhdGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlV29ya2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBnaXZlbiBBbmd1bGFyIFNlcnZpY2UgV29ya2VyIHNjcmlwdC5cbiAgICpcbiAgICogSWYgYGVuYWJsZWRgIGlzIHNldCB0byBgZmFsc2VgIGluIHRoZSBnaXZlbiBvcHRpb25zLCB0aGUgbW9kdWxlIHdpbGwgYmVoYXZlIGFzIGlmIHNlcnZpY2VcbiAgICogd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIHRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyKHNjcmlwdDogc3RyaW5nLCBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMgPSB7fSk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPFNlcnZpY2VXb3JrZXJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNlcnZpY2VXb3JrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IFNDUklQVCwgdXNlVmFsdWU6IHNjcmlwdH0sXG4gICAgICAgIHtwcm92aWRlOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHVzZVZhbHVlOiBvcHRzfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5nc3dDb21tQ2hhbm5lbCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF0sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==