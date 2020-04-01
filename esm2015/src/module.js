/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Token that can be used to provide options for `ServiceWorkerModule` outside of
 * `ServiceWorkerModule.register()`.
 *
 * You can use this token to define a provider that generates the registration options at runtime,
 * for example via a function call:
 *
 * {\@example service-worker/registration-options/module.ts region="registration-options"
 *     header="app.module.ts"}
 *
 * \@publicApi
 * @abstract
 */
export class SwRegistrationOptions {
}
if (false) {
    /**
     * Whether the ServiceWorker will be registered and the related services (such as `SwPush` and
     * `SwUpdate`) will attempt to communicate and interact with it.
     *
     * Default: true
     * @type {?}
     */
    SwRegistrationOptions.prototype.enabled;
    /**
     * A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
     * control. It will be used when calling
     * [ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
     * @type {?}
     */
    SwRegistrationOptions.prototype.scope;
    /**
     * Defines the ServiceWorker registration strategy, which determines when it will be registered
     * with the browser.
     *
     * The default behavior of registering once the application stabilizes (i.e. as soon as there are
     * no pending micro- and macro-tasks), is designed register the ServiceWorker as soon as possible
     * but without affecting the application's first time load.
     *
     * Still, there might be cases where you want more control over when the ServiceWorker is
     * registered (e.g. there might be a long-running timeout or polling interval, preventing the app
     * to stabilize). The available option are:
     *
     * - `registerWhenStable:<timeout>`: Register as soon as the application stabilizes (no pending
     *     micro-/macro-tasks) but no later than `<timeout>` milliseconds. If the app hasn't
     *     stabilized after `<timeout>` milliseconds (for example, due to a recurrent asynchronous
     *     task), the ServiceWorker will be registered anyway.
     *     If `<timeout>` is omitted, the ServiceWorker will only be registered once the app
     *     stabilizes.
     * - `registerImmediately`: Register immediately.
     * - `registerWithDelay:<timeout>`: Register with a delay of `<timeout>` milliseconds. For
     *     example, use `registerWithDelay:5000` to register the ServiceWorker after 5 seconds. If
     *     `<timeout>` is omitted, is defaults to `0`, which will register the ServiceWorker as soon
     *     as possible but still asynchronously, once all pending micro-tasks are completed.
     * - An [Observable](guide/observables) factory function: A function that returns an `Observable`.
     *     The function will be used at runtime to obtain and subscribe to the `Observable` and the
     *     ServiceWorker will be registered as soon as the first value is emitted.
     *
     * Default: 'registerWhenStable'
     * @type {?}
     */
    SwRegistrationOptions.prototype.registrationStrategy;
}
/** @type {?} */
export const SCRIPT = new InjectionToken('NGSW_REGISTER_SCRIPT');
/**
 * @param {?} injector
 * @param {?} script
 * @param {?} options
 * @param {?} platformId
 * @return {?}
 */
export function ngswAppInitializer(injector, script, options, platformId) {
    /** @type {?} */
    const initializer = (/**
     * @return {?}
     */
    () => {
        if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        navigator.serviceWorker.addEventListener('controllerchange', (/**
         * @return {?}
         */
        () => {
            if (navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }
        }));
        /** @type {?} */
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
        /** @type {?} */
        const ngZone = injector.get(NgZone);
        ngZone.runOutsideAngular((/**
         * @return {?}
         */
        () => readyToRegister$.pipe(take(1)).subscribe((/**
         * @return {?}
         */
        () => navigator.serviceWorker.register(script, { scope: options.scope })
            .catch((/**
         * @param {?} err
         * @return {?}
         */
        err => console.error('Service worker registration failed with:', err)))))));
    });
    return initializer;
}
/**
 * @param {?} timeout
 * @return {?}
 */
function delayWithTimeout(timeout) {
    return of(null).pipe(delay(timeout));
}
/**
 * @param {?} injector
 * @return {?}
 */
function whenStable(injector) {
    /** @type {?} */
    const appRef = injector.get(ApplicationRef);
    return appRef.isStable.pipe(filter((/**
     * @param {?} stable
     * @return {?}
     */
    stable => stable)));
}
/**
 * @param {?} opts
 * @param {?} platformId
 * @return {?}
 */
export function ngswCommChannelFactory(opts, platformId) {
    return new NgswCommChannel(isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
        undefined);
}
/**
 * \@publicApi
 */
export class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     * @param {?} script
     * @param {?=} opts
     * @return {?}
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
ServiceWorkerModule.decorators = [
    { type: NgModule, args: [{
                providers: [SwPush, SwUpdate],
            },] },
];
/** @nocollapse */ ServiceWorkerModule.ɵmod = i0.ɵɵdefineNgModule({ type: ServiceWorkerModule });
/** @nocollapse */ ServiceWorkerModule.ɵinj = i0.ɵɵdefineInjector({ factory: function ServiceWorkerModule_Factory(t) { return new (t || ServiceWorkerModule)(); }, providers: [SwPush, SwUpdate] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ServiceWorkerModule, [{
        type: NgModule,
        args: [{
                providers: [SwPush, SwUpdate],
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQVFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQXVCLFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVJLE9BQU8sRUFBYSxLQUFLLEVBQUUsRUFBRSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY2xDLE1BQU0sT0FBZ0IscUJBQXFCO0NBOEMxQzs7Ozs7Ozs7O0lBdkNDLHdDQUFrQjs7Ozs7OztJQU9sQixzQ0FBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQStCZixxREFBMEQ7OztBQUc1RCxNQUFNLE9BQU8sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFTLHNCQUFzQixDQUFDOzs7Ozs7OztBQUV4RSxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLFFBQWtCLEVBQUUsTUFBYyxFQUFFLE9BQThCLEVBQ2xFLFVBQWtCOztVQUNkLFdBQVc7OztJQUFHLEdBQUcsRUFBRTtRQUN2QixJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxTQUFTLENBQUM7WUFDL0Qs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aWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgTmdab25lLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIG1lcmdlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtkZWxheSwgZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7Tmdzd0NvbW1DaGFubmVsfSBmcm9tICcuL2xvd19sZXZlbCc7XG5pbXBvcnQge1N3UHVzaH0gZnJvbSAnLi9wdXNoJztcbmltcG9ydCB7U3dVcGRhdGV9IGZyb20gJy4vdXBkYXRlJztcblxuLyoqXG4gKiBUb2tlbiB0aGF0IGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgb3B0aW9ucyBmb3IgYFNlcnZpY2VXb3JrZXJNb2R1bGVgIG91dHNpZGUgb2ZcbiAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlLnJlZ2lzdGVyKClgLlxuICpcbiAqIFlvdSBjYW4gdXNlIHRoaXMgdG9rZW4gdG8gZGVmaW5lIGEgcHJvdmlkZXIgdGhhdCBnZW5lcmF0ZXMgdGhlIHJlZ2lzdHJhdGlvbiBvcHRpb25zIGF0IHJ1bnRpbWUsXG4gKiBmb3IgZXhhbXBsZSB2aWEgYSBmdW5jdGlvbiBjYWxsOlxuICpcbiAqIHtAZXhhbXBsZSBzZXJ2aWNlLXdvcmtlci9yZWdpc3RyYXRpb24tb3B0aW9ucy9tb2R1bGUudHMgcmVnaW9uPVwicmVnaXN0cmF0aW9uLW9wdGlvbnNcIlxuICogICAgIGhlYWRlcj1cImFwcC5tb2R1bGUudHNcIn1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogV2hldGhlciB0aGUgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYW5kIHRoZSByZWxhdGVkIHNlcnZpY2VzIChzdWNoIGFzIGBTd1B1c2hgIGFuZFxuICAgKiBgU3dVcGRhdGVgKSB3aWxsIGF0dGVtcHQgdG8gY29tbXVuaWNhdGUgYW5kIGludGVyYWN0IHdpdGggaXQuXG4gICAqXG4gICAqIERlZmF1bHQ6IHRydWVcbiAgICovXG4gIGVuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIFVSTCB0aGF0IGRlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIncyByZWdpc3RyYXRpb24gc2NvcGU7IHRoYXQgaXMsIHdoYXQgcmFuZ2Ugb2YgVVJMcyBpdCBjYW5cbiAgICogY29udHJvbC4gSXQgd2lsbCBiZSB1c2VkIHdoZW4gY2FsbGluZ1xuICAgKiBbU2VydmljZVdvcmtlckNvbnRhaW5lciNyZWdpc3RlcigpXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvU2VydmljZVdvcmtlckNvbnRhaW5lci9yZWdpc3RlcikuXG4gICAqL1xuICBzY29wZT86IHN0cmluZztcblxuICAvKipcbiAgICogRGVmaW5lcyB0aGUgU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3ksIHdoaWNoIGRldGVybWluZXMgd2hlbiBpdCB3aWxsIGJlIHJlZ2lzdGVyZWRcbiAgICogd2l0aCB0aGUgYnJvd3Nlci5cbiAgICpcbiAgICogVGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgcmVnaXN0ZXJpbmcgb25jZSB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAoaS5lLiBhcyBzb29uIGFzIHRoZXJlIGFyZVxuICAgKiBubyBwZW5kaW5nIG1pY3JvLSBhbmQgbWFjcm8tdGFza3MpLCBpcyBkZXNpZ25lZCByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uIGFzIHBvc3NpYmxlXG4gICAqIGJ1dCB3aXRob3V0IGFmZmVjdGluZyB0aGUgYXBwbGljYXRpb24ncyBmaXJzdCB0aW1lIGxvYWQuXG4gICAqXG4gICAqIFN0aWxsLCB0aGVyZSBtaWdodCBiZSBjYXNlcyB3aGVyZSB5b3Ugd2FudCBtb3JlIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBTZXJ2aWNlV29ya2VyIGlzXG4gICAqIHJlZ2lzdGVyZWQgKGUuZy4gdGhlcmUgbWlnaHQgYmUgYSBsb25nLXJ1bm5pbmcgdGltZW91dCBvciBwb2xsaW5nIGludGVydmFsLCBwcmV2ZW50aW5nIHRoZSBhcHBcbiAgICogdG8gc3RhYmlsaXplKS4gVGhlIGF2YWlsYWJsZSBvcHRpb24gYXJlOlxuICAgKlxuICAgKiAtIGByZWdpc3RlcldoZW5TdGFibGU6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgYXMgc29vbiBhcyB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAobm8gcGVuZGluZ1xuICAgKiAgICAgbWljcm8tL21hY3JvLXRhc2tzKSBidXQgbm8gbGF0ZXIgdGhhbiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIElmIHRoZSBhcHAgaGFzbid0XG4gICAqICAgICBzdGFiaWxpemVkIGFmdGVyIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcyAoZm9yIGV4YW1wbGUsIGR1ZSB0byBhIHJlY3VycmVudCBhc3luY2hyb25vdXNcbiAgICogICAgIHRhc2spLCB0aGUgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYW55d2F5LlxuICAgKiAgICAgSWYgYDx0aW1lb3V0PmAgaXMgb21pdHRlZCwgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBvbmx5IGJlIHJlZ2lzdGVyZWQgb25jZSB0aGUgYXBwXG4gICAqICAgICBzdGFiaWxpemVzLlxuICAgKiAtIGByZWdpc3RlckltbWVkaWF0ZWx5YDogUmVnaXN0ZXIgaW1tZWRpYXRlbHkuXG4gICAqIC0gYHJlZ2lzdGVyV2l0aERlbGF5Ojx0aW1lb3V0PmA6IFJlZ2lzdGVyIHdpdGggYSBkZWxheSBvZiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIEZvclxuICAgKiAgICAgZXhhbXBsZSwgdXNlIGByZWdpc3RlcldpdGhEZWxheTo1MDAwYCB0byByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhZnRlciA1IHNlY29uZHMuIElmXG4gICAqICAgICBgPHRpbWVvdXQ+YCBpcyBvbWl0dGVkLCBpcyBkZWZhdWx0cyB0byBgMGAsIHdoaWNoIHdpbGwgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vblxuICAgKiAgICAgYXMgcG9zc2libGUgYnV0IHN0aWxsIGFzeW5jaHJvbm91c2x5LCBvbmNlIGFsbCBwZW5kaW5nIG1pY3JvLXRhc2tzIGFyZSBjb21wbGV0ZWQuXG4gICAqIC0gQW4gW09ic2VydmFibGVdKGd1aWRlL29ic2VydmFibGVzKSBmYWN0b3J5IGZ1bmN0aW9uOiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBgT2JzZXJ2YWJsZWAuXG4gICAqICAgICBUaGUgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIGF0IHJ1bnRpbWUgdG8gb2J0YWluIGFuZCBzdWJzY3JpYmUgdG8gdGhlIGBPYnNlcnZhYmxlYCBhbmQgdGhlXG4gICAqICAgICBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhcyBzb29uIGFzIHRoZSBmaXJzdCB2YWx1ZSBpcyBlbWl0dGVkLlxuICAgKlxuICAgKiBEZWZhdWx0OiAncmVnaXN0ZXJXaGVuU3RhYmxlJ1xuICAgKi9cbiAgcmVnaXN0cmF0aW9uU3RyYXRlZ3k/OiBzdHJpbmd8KCgpID0+IE9ic2VydmFibGU8dW5rbm93bj4pO1xufVxuXG5leHBvcnQgY29uc3QgU0NSSVBUID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ05HU1dfUkVHSVNURVJfU0NSSVBUJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3QXBwSW5pdGlhbGl6ZXIoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLCBzY3JpcHQ6IHN0cmluZywgb3B0aW9uczogU3dSZWdpc3RyYXRpb25PcHRpb25zLFxuICAgIHBsYXRmb3JtSWQ6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgY29uc3QgaW5pdGlhbGl6ZXIgPSAoKSA9PiB7XG4gICAgaWYgKCEoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpICYmXG4gICAgICAgICAgb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciBzZXJ2aWNlIHdvcmtlciBjb250cm9sbGVyIGNoYW5nZXMsIGFuZCBmaXJlIGFuIElOSVRJQUxJWkUgYWN0aW9uIHdoZW4gYSBuZXcgU1dcbiAgICAvLyBiZWNvbWVzIGFjdGl2ZS4gVGhpcyBhbGxvd3MgdGhlIFNXIHRvIGluaXRpYWxpemUgaXRzZWxmIGV2ZW4gaWYgdGhlcmUgaXMgbm8gYXBwbGljYXRpb25cbiAgICAvLyB0cmFmZmljLlxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciAhPT0gbnVsbCkge1xuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdJTklUSUFMSVpFJ30pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHJlYWR5VG9SZWdpc3RlciQ6IE9ic2VydmFibGU8dW5rbm93bj47XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtzdHJhdGVneSwgLi4uYXJnc10gPVxuICAgICAgICAgIChvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5IHx8ICdyZWdpc3RlcldoZW5TdGFibGU6MzAwMDAnKS5zcGxpdCgnOicpO1xuXG4gICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVySW1tZWRpYXRlbHknOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvZiAobnVsbCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2l0aERlbGF5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gZGVsYXlXaXRoVGltZW91dCgrYXJnc1swXSB8fCAwKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJXaGVuU3RhYmxlJzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gIWFyZ3NbMF0gPyB3aGVuU3RhYmxlKGluamVjdG9yKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVyZ2Uod2hlblN0YWJsZShpbmplY3RvciksIGRlbGF5V2l0aFRpbWVvdXQoK2FyZ3NbMF0pKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBVbmtub3duIHN0cmF0ZWd5LlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYFVua25vd24gU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3k6ICR7b3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEb24ndCByZXR1cm4gYW55dGhpbmcgdG8gYXZvaWQgYmxvY2tpbmcgdGhlIGFwcGxpY2F0aW9uIHVudGlsIHRoZSBTVyBpcyByZWdpc3RlcmVkLlxuICAgIC8vIEFsc28sIHJ1biBvdXRzaWRlIHRoZSBBbmd1bGFyIHpvbmUgdG8gYXZvaWQgcHJldmVudGluZyB0aGUgYXBwIGZyb20gc3RhYmlsaXppbmcgKGVzcGVjaWFsbHlcbiAgICAvLyBnaXZlbiB0aGF0IHNvbWUgcmVnaXN0cmF0aW9uIHN0cmF0ZWdpZXMgd2FpdCBmb3IgdGhlIGFwcCB0byBzdGFiaWxpemUpLlxuICAgIC8vIENhdGNoIGFuZCBsb2cgdGhlIGVycm9yIGlmIFNXIHJlZ2lzdHJhdGlvbiBmYWlscyB0byBhdm9pZCB1bmNhdWdodCByZWplY3Rpb24gd2FybmluZy5cbiAgICBjb25zdCBuZ1pvbmUgPSBpbmplY3Rvci5nZXQoTmdab25lKTtcbiAgICBuZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoXG4gICAgICAgICgpID0+IHJlYWR5VG9SZWdpc3RlciQucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoXG4gICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHNjcmlwdCwge3Njb3BlOiBvcHRpb25zLnNjb3BlfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdTZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkIHdpdGg6JywgZXJyKSkpKTtcbiAgfTtcbiAgcmV0dXJuIGluaXRpYWxpemVyO1xufVxuXG5mdW5jdGlvbiBkZWxheVdpdGhUaW1lb3V0KHRpbWVvdXQ6IG51bWJlcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICByZXR1cm4gb2YgKG51bGwpLnBpcGUoZGVsYXkodGltZW91dCkpO1xufVxuXG5mdW5jdGlvbiB3aGVuU3RhYmxlKGluamVjdG9yOiBJbmplY3Rvcik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCBhcHBSZWYgPSBpbmplY3Rvci5nZXQoQXBwbGljYXRpb25SZWYpO1xuICByZXR1cm4gYXBwUmVmLmlzU3RhYmxlLnBpcGUoZmlsdGVyKHN0YWJsZSA9PiBzdGFibGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dDb21tQ2hhbm5lbEZhY3RvcnkoXG4gICAgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zLCBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBOZ3N3Q29tbUNoYW5uZWwge1xuICByZXR1cm4gbmV3IE5nc3dDb21tQ2hhbm5lbChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmIG9wdHMuZW5hYmxlZCAhPT0gZmFsc2UgPyBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1N3UHVzaCwgU3dVcGRhdGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlV29ya2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBnaXZlbiBBbmd1bGFyIFNlcnZpY2UgV29ya2VyIHNjcmlwdC5cbiAgICpcbiAgICogSWYgYGVuYWJsZWRgIGlzIHNldCB0byBgZmFsc2VgIGluIHRoZSBnaXZlbiBvcHRpb25zLCB0aGUgbW9kdWxlIHdpbGwgYmVoYXZlIGFzIGlmIHNlcnZpY2VcbiAgICogd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIHRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyKHNjcmlwdDogc3RyaW5nLCBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMgPSB7fSk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPFNlcnZpY2VXb3JrZXJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNlcnZpY2VXb3JrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IFNDUklQVCwgdXNlVmFsdWU6IHNjcmlwdH0sXG4gICAgICAgIHtwcm92aWRlOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHVzZVZhbHVlOiBvcHRzfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5nc3dDb21tQ2hhbm5lbCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF0sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==