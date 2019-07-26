/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
     * - `registerWhenStable`: Register as soon as the application stabilizes (no pending
     *      micro-/macro-tasks).
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
            const [strategy, ...args] = (options.registrationStrategy || 'registerWhenStable').split(':');
            switch (strategy) {
                case 'registerImmediately':
                    readyToRegister$ = of(null);
                    break;
                case 'registerWithDelay':
                    readyToRegister$ = of(null).pipe(delay(+args[0] || 0));
                    break;
                case 'registerWhenStable':
                    /** @type {?} */
                    const appRef = injector.get(ApplicationRef);
                    readyToRegister$ = appRef.isStable.pipe(filter((/**
                     * @param {?} stable
                     * @return {?}
                     */
                    stable => stable)));
                    break;
                default:
                    // Unknown strategy.
                    throw new Error(`Unknown ServiceWorker registration strategy: ${options.registrationStrategy}`);
            }
        }
        // Don't return anything to avoid blocking the application until the SW is registered.
        // Catch and log the error if SW registration fails to avoid uncaught rejection warning.
        readyToRegister$.pipe(take(1)).subscribe((/**
         * @return {?}
         */
        () => navigator.serviceWorker.register(script, { scope: options.scope })
            .catch((/**
         * @param {?} err
         * @return {?}
         */
        err => console.error('Service worker registration failed with:', err)))));
    });
    return initializer;
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
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQXVCLFFBQVEsRUFBRSxXQUFXLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDcEksT0FBTyxFQUFhLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNyQyxPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFjbEMsTUFBTSxPQUFnQixxQkFBcUI7Q0EwQzFDOzs7Ozs7Ozs7SUFuQ0Msd0NBQWtCOzs7Ozs7O0lBT2xCLHNDQUFlOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUEyQmYscURBQTBEOzs7QUFHNUQsTUFBTSxPQUFPLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBUyxzQkFBc0IsQ0FBQzs7Ozs7Ozs7QUFFeEUsTUFBTSxVQUFVLGtCQUFrQixDQUM5QixRQUFrQixFQUFFLE1BQWMsRUFBRSxPQUE4QixFQUNsRSxVQUFrQjs7VUFDZCxXQUFXOzs7SUFBRyxHQUFHLEVBQUU7UUFDdkIsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxD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QUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsc0JBQXNCO29CQUNsQyxJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxXQUFXLENBQUM7aUJBQzNDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsa0JBQWtCO29CQUM5QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLFdBQVcsQ0FBQztvQkFDNUQsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzs7WUE5QkYsUUFBUSxTQUFDO2dCQUNSLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7YUFDOUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0FQUF9JTklUSUFMSVpFUiwgQXBwbGljYXRpb25SZWYsIEluamVjdGlvblRva2VuLCBJbmplY3RvciwgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVsYXksIGZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge05nc3dDb21tQ2hhbm5lbH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuaW1wb3J0IHtTd1B1c2h9IGZyb20gJy4vcHVzaCc7XG5pbXBvcnQge1N3VXBkYXRlfSBmcm9tICcuL3VwZGF0ZSc7XG5cbi8qKlxuICogVG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG9wdGlvbnMgZm9yIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCBvdXRzaWRlIG9mXG4gKiBgU2VydmljZVdvcmtlck1vZHVsZS5yZWdpc3RlcigpYC5cbiAqXG4gKiBZb3UgY2FuIHVzZSB0aGlzIHRva2VuIHRvIGRlZmluZSBhIHByb3ZpZGVyIHRoYXQgZ2VuZXJhdGVzIHRoZSByZWdpc3RyYXRpb24gb3B0aW9ucyBhdCBydW50aW1lLFxuICogZm9yIGV4YW1wbGUgdmlhIGEgZnVuY3Rpb24gY2FsbDpcbiAqXG4gKiB7QGV4YW1wbGUgc2VydmljZS13b3JrZXIvcmVnaXN0cmF0aW9uLW9wdGlvbnMvbW9kdWxlLnRzIHJlZ2lvbj1cInJlZ2lzdHJhdGlvbi1vcHRpb25zXCJcbiAqICAgICBoZWFkZXI9XCJhcHAubW9kdWxlLnRzXCJ9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3dSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFuZCB0aGUgcmVsYXRlZCBzZXJ2aWNlcyAoc3VjaCBhcyBgU3dQdXNoYCBhbmRcbiAgICogYFN3VXBkYXRlYCkgd2lsbCBhdHRlbXB0IHRvIGNvbW11bmljYXRlIGFuZCBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBlbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBVUkwgdGhhdCBkZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyJ3MgcmVnaXN0cmF0aW9uIHNjb3BlOyB0aGF0IGlzLCB3aGF0IHJhbmdlIG9mIFVSTHMgaXQgY2FuXG4gICAqIGNvbnRyb2wuIEl0IHdpbGwgYmUgdXNlZCB3aGVuIGNhbGxpbmdcbiAgICogW1NlcnZpY2VXb3JrZXJDb250YWluZXIjcmVnaXN0ZXIoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlcnZpY2VXb3JrZXJDb250YWluZXIvcmVnaXN0ZXIpLlxuICAgKi9cbiAgc2NvcGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5LCB3aGljaCBkZXRlcm1pbmVzIHdoZW4gaXQgd2lsbCBiZSByZWdpc3RlcmVkXG4gICAqIHdpdGggdGhlIGJyb3dzZXIuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHJlZ2lzdGVyaW5nIG9uY2UgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKGkuZS4gYXMgc29vbiBhcyB0aGVyZSBhcmVcbiAgICogbm8gcGVuZGluZyBtaWNyby0gYW5kIG1hY3JvLXRhc2tzKSwgaXMgZGVzaWduZWQgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vbiBhcyBwb3NzaWJsZVxuICAgKiBidXQgd2l0aG91dCBhZmZlY3RpbmcgdGhlIGFwcGxpY2F0aW9uJ3MgZmlyc3QgdGltZSBsb2FkLlxuICAgKlxuICAgKiBTdGlsbCwgdGhlcmUgbWlnaHQgYmUgY2FzZXMgd2hlcmUgeW91IHdhbnQgbW9yZSBjb250cm9sIG92ZXIgd2hlbiB0aGUgU2VydmljZVdvcmtlciBpc1xuICAgKiByZWdpc3RlcmVkIChlLmcuIHRoZXJlIG1pZ2h0IGJlIGEgbG9uZy1ydW5uaW5nIHRpbWVvdXQgb3IgcG9sbGluZyBpbnRlcnZhbCwgcHJldmVudGluZyB0aGUgYXBwXG4gICAqIHRvIHN0YWJpbGl6ZSkuIFRoZSBhdmFpbGFibGUgb3B0aW9uIGFyZTpcbiAgICpcbiAgICogLSBgcmVnaXN0ZXJXaGVuU3RhYmxlYDogUmVnaXN0ZXIgYXMgc29vbiBhcyB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAobm8gcGVuZGluZ1xuICAgKiAgICAgIG1pY3JvLS9tYWNyby10YXNrcykuXG4gICAqIC0gYHJlZ2lzdGVySW1tZWRpYXRlbHlgOiBSZWdpc3RlciBpbW1lZGlhdGVseS5cbiAgICogLSBgcmVnaXN0ZXJXaXRoRGVsYXk6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgd2l0aCBhIGRlbGF5IG9mIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcy4gRm9yXG4gICAqICAgICBleGFtcGxlLCB1c2UgYHJlZ2lzdGVyV2l0aERlbGF5OjUwMDBgIHRvIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFmdGVyIDUgc2Vjb25kcy4gSWZcbiAgICogICAgIGA8dGltZW91dD5gIGlzIG9taXR0ZWQsIGlzIGRlZmF1bHRzIHRvIGAwYCwgd2hpY2ggd2lsbCByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uXG4gICAqICAgICBhcyBwb3NzaWJsZSBidXQgc3RpbGwgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIHBlbmRpbmcgbWljcm8tdGFza3MgYXJlIGNvbXBsZXRlZC5cbiAgICogLSBBbiBbT2JzZXJ2YWJsZV0oZ3VpZGUvb2JzZXJ2YWJsZXMpIGZhY3RvcnkgZnVuY3Rpb246IEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGBPYnNlcnZhYmxlYC5cbiAgICogICAgIFRoZSBmdW5jdGlvbiB3aWxsIGJlIHVzZWQgYXQgcnVudGltZSB0byBvYnRhaW4gYW5kIHN1YnNjcmliZSB0byB0aGUgYE9ic2VydmFibGVgIGFuZCB0aGVcbiAgICogICAgIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFzIHNvb24gYXMgdGhlIGZpcnN0IHZhbHVlIGlzIGVtaXR0ZWQuXG4gICAqXG4gICAqIERlZmF1bHQ6ICdyZWdpc3RlcldoZW5TdGFibGUnXG4gICAqL1xuICByZWdpc3RyYXRpb25TdHJhdGVneT86IHN0cmluZ3woKCkgPT4gT2JzZXJ2YWJsZTx1bmtub3duPik7XG59XG5cbmV4cG9ydCBjb25zdCBTQ1JJUFQgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignTkdTV19SRUdJU1RFUl9TQ1JJUFQnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dBcHBJbml0aWFsaXplcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsIHNjcmlwdDogc3RyaW5nLCBvcHRpb25zOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsXG4gICAgcGxhdGZvcm1JZDogc3RyaW5nKTogRnVuY3Rpb24ge1xuICBjb25zdCBpbml0aWFsaXplciA9ICgpID0+IHtcbiAgICBpZiAoIShpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgJiZcbiAgICAgICAgICBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIGNvbnRyb2xsZXIgY2hhbmdlcywgYW5kIGZpcmUgYW4gSU5JVElBTElaRSBhY3Rpb24gd2hlbiBhIG5ldyBTV1xuICAgIC8vIGJlY29tZXMgYWN0aXZlLiBUaGlzIGFsbG93cyB0aGUgU1cgdG8gaW5pdGlhbGl6ZSBpdHNlbGYgZXZlbiBpZiB0aGVyZSBpcyBubyBhcHBsaWNhdGlvblxuICAgIC8vIHRyYWZmaWMuXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICE9PSBudWxsKSB7XG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ0lOSVRJQUxJWkUnfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcmVhZHlUb1JlZ2lzdGVyJDogT2JzZXJ2YWJsZTx1bmtub3duPjtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgW3N0cmF0ZWd5LCAuLi5hcmdzXSA9IChvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5IHx8ICdyZWdpc3RlcldoZW5TdGFibGUnKS5zcGxpdCgnOicpO1xuICAgICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgICBjYXNlICdyZWdpc3RlckltbWVkaWF0ZWx5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb2YgKG51bGwpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldpdGhEZWxheSc6XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9mIChudWxsKS5waXBlKGRlbGF5KCthcmdzWzBdIHx8IDApKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJXaGVuU3RhYmxlJzpcbiAgICAgICAgICBjb25zdCBhcHBSZWYgPSBpbmplY3Rvci5nZXQ8QXBwbGljYXRpb25SZWY+KEFwcGxpY2F0aW9uUmVmKTtcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gYXBwUmVmLmlzU3RhYmxlLnBpcGUoZmlsdGVyKHN0YWJsZSA9PiBzdGFibGUpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAvLyBVbmtub3duIHN0cmF0ZWd5LlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYFVua25vd24gU2VydmljZVdvcmtlciByZWdpc3RyYXRpb24gc3RyYXRlZ3k6ICR7b3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneX1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBEb24ndCByZXR1cm4gYW55dGhpbmcgdG8gYXZvaWQgYmxvY2tpbmcgdGhlIGFwcGxpY2F0aW9uIHVudGlsIHRoZSBTVyBpcyByZWdpc3RlcmVkLlxuICAgIC8vIENhdGNoIGFuZCBsb2cgdGhlIGVycm9yIGlmIFNXIHJlZ2lzdHJhdGlvbiBmYWlscyB0byBhdm9pZCB1bmNhdWdodCByZWplY3Rpb24gd2FybmluZy5cbiAgICByZWFkeVRvUmVnaXN0ZXIkLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKFxuICAgICAgICAoKSA9PiBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihzY3JpcHQsIHtzY29wZTogb3B0aW9ucy5zY29wZX0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ1NlcnZpY2Ugd29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQgd2l0aDonLCBlcnIpKSk7XG4gIH07XG4gIHJldHVybiBpbml0aWFsaXplcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dDb21tQ2hhbm5lbEZhY3RvcnkoXG4gICAgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zLCBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBOZ3N3Q29tbUNoYW5uZWwge1xuICByZXR1cm4gbmV3IE5nc3dDb21tQ2hhbm5lbChcbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmIG9wdHMuZW5hYmxlZCAhPT0gZmFsc2UgPyBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlciA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1N3UHVzaCwgU3dVcGRhdGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlV29ya2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBnaXZlbiBBbmd1bGFyIFNlcnZpY2UgV29ya2VyIHNjcmlwdC5cbiAgICpcbiAgICogSWYgYGVuYWJsZWRgIGlzIHNldCB0byBgZmFsc2VgIGluIHRoZSBnaXZlbiBvcHRpb25zLCB0aGUgbW9kdWxlIHdpbGwgYmVoYXZlIGFzIGlmIHNlcnZpY2VcbiAgICogd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIHRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyKHNjcmlwdDogc3RyaW5nLCBvcHRzOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMgPSB7fSk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzPFNlcnZpY2VXb3JrZXJNb2R1bGU+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNlcnZpY2VXb3JrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IFNDUklQVCwgdXNlVmFsdWU6IHNjcmlwdH0sXG4gICAgICAgIHtwcm92aWRlOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIHVzZVZhbHVlOiBvcHRzfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5nc3dDb21tQ2hhbm5lbCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF0sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==