/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/module.ts
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUF1QixRQUFRLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BJLE9BQU8sRUFBYSxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFbkQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxVQUFVLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FBY2xDLE1BQU0sT0FBZ0IscUJBQXFCO0NBMEMxQzs7Ozs7Ozs7O0lBbkNDLHdDQUFrQjs7Ozs7OztJQU9sQixzQ0FBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkJmLHFEQUEwRDs7O0FBRzVELE1BQU0sT0FBTyxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQVMsc0JBQXNCLENBQUM7Ozs7Ozs7O0FBRXhFLE1BQU0sVUFBVSxrQkFBa0IsQ0FDOUIsUUFBa0IsRUFBRSxNQUFjLEVBQUUsT0FBOEIsRUFDbEUsVUFBa0I7O1VBQ2QsV0FBVzs7O0lBQUcsR0FBRyxFQUFFO1FBQ3ZCLElBQUksQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZUFBZSxJQUFJLFNBQVMsQ0FBQztZQUMvRCxPQUFPLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2hDLE9BQU87U0FDUjtRQUVELDBGQUEwRjtRQUMxRiwwRkFBMEY7UUFDMUYsV0FBVztRQUNYLFNBQVMsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCOzs7UUFBRSxHQUFHLEVBQUU7WUFDaEUsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQy9DLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO2FBQ3hFO1FBQ0gsQ0FBQyxFQUFDLENBQUM7O1lBRUMsZ0JBQXFDO1FBRXpDLElBQUksT0FBTyxPQUFPLENBQUMsb0JBQW9CLEtBQUssVUFBVSxFQUFFO1lBQ3RELGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQ25EO2FBQU07a0JBQ0MsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsSUFBSSxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDN0YsUUFBUSxRQUFRLEVBQUU7Z0JBQ2hCLEtBQUsscUJBQXFCO29CQUN4QixnQkFBZ0IsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVCLE1BQU07Z0JBQ1IsS0FBSyxtQkFBbUI7b0JBQ3RCLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZELE1BQU07Z0JBQ1IsS0FBSyxvQkFBb0I7OzBCQUNqQixNQUFNLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBaUIsY0FBYyxDQUFDO29CQUMzRCxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNOzs7O29CQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztvQkFDbEUsTUFBTTtnQkFDUjtvQkFDRSxvQkFBb0I7b0JBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQ1gsZ0RBQWdELE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7YUFDdkY7U0FDRjtRQUVELHNGQUFzRjtRQUN0Rix3RkFBd0Y7UUFDeEYsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7OztRQUNwQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDO2FBQzNELEtBQUs7Ozs7UUFBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsMENBQTBDLEVBQUUsR0FBRyxDQUFDLEVBQUMsRUFBQyxDQUFDO0lBQy9GLENBQUMsQ0FBQTtJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7Ozs7OztBQUVELE1BQU0sVUFBVSxzQkFBc0IsQ0FDbEMsSUFBMkIsRUFBRSxVQUFrQjtJQUNqRCxPQUFPLElBQUksZUFBZSxDQUN0QixpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3pCLFNBQVMsQ0FBQyxDQUFDO0FBQzNFLENBQUM7Ozs7QUFRRCxNQUFNLE9BQU8sbUJBQW1COzs7Ozs7Ozs7O0lBTzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBYyxFQUFFLE9BQThCLEVBQUU7UUFFOUQsT0FBTztZQUNMLFFBQVEsRUFBRSxtQkFBbUI7WUFDN0IsU0FBUyxFQUFFO2dCQUNULEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFDO2dCQUNuQyxFQUFDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO2dCQUNoRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsVUFBVSxFQUFFLHNCQUFzQjtvQkFDbEMsSUFBSSxFQUFFLENBQUMscUJBQXFCLEVBQUUsV0FBVyxDQUFDO2lCQUMzQztnQkFDRDtvQkFDRSxPQUFPLEVBQUUsZUFBZTtvQkFDeEIsVUFBVSxFQUFFLGtCQUFrQjtvQkFDOUIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxXQUFXLENBQUM7b0JBQzVELEtBQUssRUFBRSxJQUFJO2lCQUNaO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7O1lBOUJGLFFBQVEsU0FBQztnQkFDUixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO2FBQzlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBUFBfSU5JVElBTElaRVIsIEFwcGxpY2F0aW9uUmVmLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVsYXksIGZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge05nc3dDb21tQ2hhbm5lbH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuaW1wb3J0IHtTd1B1c2h9IGZyb20gJy4vcHVzaCc7XG5pbXBvcnQge1N3VXBkYXRlfSBmcm9tICcuL3VwZGF0ZSc7XG5cbi8qKlxuICogVG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG9wdGlvbnMgZm9yIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCBvdXRzaWRlIG9mXG4gKiBgU2VydmljZVdvcmtlck1vZHVsZS5yZWdpc3RlcigpYC5cbiAqXG4gKiBZb3UgY2FuIHVzZSB0aGlzIHRva2VuIHRvIGRlZmluZSBhIHByb3ZpZGVyIHRoYXQgZ2VuZXJhdGVzIHRoZSByZWdpc3RyYXRpb24gb3B0aW9ucyBhdCBydW50aW1lLFxuICogZm9yIGV4YW1wbGUgdmlhIGEgZnVuY3Rpb24gY2FsbDpcbiAqXG4gKiB7QGV4YW1wbGUgc2VydmljZS13b3JrZXIvcmVnaXN0cmF0aW9uLW9wdGlvbnMvbW9kdWxlLnRzIHJlZ2lvbj1cInJlZ2lzdHJhdGlvbi1vcHRpb25zXCJcbiAqICAgICBoZWFkZXI9XCJhcHAubW9kdWxlLnRzXCJ9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3dSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFuZCB0aGUgcmVsYXRlZCBzZXJ2aWNlcyAoc3VjaCBhcyBgU3dQdXNoYCBhbmRcbiAgICogYFN3VXBkYXRlYCkgd2lsbCBhdHRlbXB0IHRvIGNvbW11bmljYXRlIGFuZCBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBlbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBVUkwgdGhhdCBkZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyJ3MgcmVnaXN0cmF0aW9uIHNjb3BlOyB0aGF0IGlzLCB3aGF0IHJhbmdlIG9mIFVSTHMgaXQgY2FuXG4gICAqIGNvbnRyb2wuIEl0IHdpbGwgYmUgdXNlZCB3aGVuIGNhbGxpbmdcbiAgICogW1NlcnZpY2VXb3JrZXJDb250YWluZXIjcmVnaXN0ZXIoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlcnZpY2VXb3JrZXJDb250YWluZXIvcmVnaXN0ZXIpLlxuICAgKi9cbiAgc2NvcGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5LCB3aGljaCBkZXRlcm1pbmVzIHdoZW4gaXQgd2lsbCBiZSByZWdpc3RlcmVkXG4gICAqIHdpdGggdGhlIGJyb3dzZXIuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHJlZ2lzdGVyaW5nIG9uY2UgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKGkuZS4gYXMgc29vbiBhcyB0aGVyZSBhcmVcbiAgICogbm8gcGVuZGluZyBtaWNyby0gYW5kIG1hY3JvLXRhc2tzKSwgaXMgZGVzaWduZWQgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vbiBhcyBwb3NzaWJsZVxuICAgKiBidXQgd2l0aG91dCBhZmZlY3RpbmcgdGhlIGFwcGxpY2F0aW9uJ3MgZmlyc3QgdGltZSBsb2FkLlxuICAgKlxuICAgKiBTdGlsbCwgdGhlcmUgbWlnaHQgYmUgY2FzZXMgd2hlcmUgeW91IHdhbnQgbW9yZSBjb250cm9sIG92ZXIgd2hlbiB0aGUgU2VydmljZVdvcmtlciBpc1xuICAgKiByZWdpc3RlcmVkIChlLmcuIHRoZXJlIG1pZ2h0IGJlIGEgbG9uZy1ydW5uaW5nIHRpbWVvdXQgb3IgcG9sbGluZyBpbnRlcnZhbCwgcHJldmVudGluZyB0aGUgYXBwXG4gICAqIHRvIHN0YWJpbGl6ZSkuIFRoZSBhdmFpbGFibGUgb3B0aW9uIGFyZTpcbiAgICpcbiAgICogLSBgcmVnaXN0ZXJXaGVuU3RhYmxlYDogUmVnaXN0ZXIgYXMgc29vbiBhcyB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAobm8gcGVuZGluZ1xuICAgKiAgICAgIG1pY3JvLS9tYWNyby10YXNrcykuXG4gICAqIC0gYHJlZ2lzdGVySW1tZWRpYXRlbHlgOiBSZWdpc3RlciBpbW1lZGlhdGVseS5cbiAgICogLSBgcmVnaXN0ZXJXaXRoRGVsYXk6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgd2l0aCBhIGRlbGF5IG9mIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcy4gRm9yXG4gICAqICAgICBleGFtcGxlLCB1c2UgYHJlZ2lzdGVyV2l0aERlbGF5OjUwMDBgIHRvIHJlZ2lzdGVyIHRoZSBTZXJ2aWNlV29ya2VyIGFmdGVyIDUgc2Vjb25kcy4gSWZcbiAgICogICAgIGA8dGltZW91dD5gIGlzIG9taXR0ZWQsIGlzIGRlZmF1bHRzIHRvIGAwYCwgd2hpY2ggd2lsbCByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uXG4gICAqICAgICBhcyBwb3NzaWJsZSBidXQgc3RpbGwgYXN5bmNocm9ub3VzbHksIG9uY2UgYWxsIHBlbmRpbmcgbWljcm8tdGFza3MgYXJlIGNvbXBsZXRlZC5cbiAgICogLSBBbiBbT2JzZXJ2YWJsZV0oZ3VpZGUvb2JzZXJ2YWJsZXMpIGZhY3RvcnkgZnVuY3Rpb246IEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGBPYnNlcnZhYmxlYC5cbiAgICogICAgIFRoZSBmdW5jdGlvbiB3aWxsIGJlIHVzZWQgYXQgcnVudGltZSB0byBvYnRhaW4gYW5kIHN1YnNjcmliZSB0byB0aGUgYE9ic2VydmFibGVgIGFuZCB0aGVcbiAgICogICAgIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFzIHNvb24gYXMgdGhlIGZpcnN0IHZhbHVlIGlzIGVtaXR0ZWQuXG4gICAqXG4gICAqIERlZmF1bHQ6ICdyZWdpc3RlcldoZW5TdGFibGUnXG4gICAqL1xuICByZWdpc3RyYXRpb25TdHJhdGVneT86IHN0cmluZ3woKCkgPT4gT2JzZXJ2YWJsZTx1bmtub3duPik7XG59XG5cbmV4cG9ydCBjb25zdCBTQ1JJUFQgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignTkdTV19SRUdJU1RFUl9TQ1JJUFQnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dBcHBJbml0aWFsaXplcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsIHNjcmlwdDogc3RyaW5nLCBvcHRpb25zOiBTd1JlZ2lzdHJhdGlvbk9wdGlvbnMsXG4gICAgcGxhdGZvcm1JZDogc3RyaW5nKTogRnVuY3Rpb24ge1xuICBjb25zdCBpbml0aWFsaXplciA9ICgpID0+IHtcbiAgICBpZiAoIShpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgJiZcbiAgICAgICAgICBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIGNvbnRyb2xsZXIgY2hhbmdlcywgYW5kIGZpcmUgYW4gSU5JVElBTElaRSBhY3Rpb24gd2hlbiBhIG5ldyBTV1xuICAgIC8vIGJlY29tZXMgYWN0aXZlLiBUaGlzIGFsbG93cyB0aGUgU1cgdG8gaW5pdGlhbGl6ZSBpdHNlbGYgZXZlbiBpZiB0aGVyZSBpcyBubyBhcHBsaWNhdGlvblxuICAgIC8vIHRyYWZmaWMuXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICE9PSBudWxsKSB7XG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ0lOSVRJQUxJWkUnfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcmVhZHlUb1JlZ2lzdGVyJDogT2JzZXJ2YWJsZTx1bmtub3duPjtcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZWdpc3RyYXRpb25TdHJhdGVneSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3koKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgW3N0cmF0ZWd5LCAuLi5hcmdzXSA9IChvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5IHx8ICdyZWdpc3RlcldoZW5TdGFibGUnKS5zcGxpdCgnOicpO1xuICAgICAgc3dpdGNoIChzdHJhdGVneSkge1xuICAgICAgICBjYXNlICdyZWdpc3RlckltbWVkaWF0ZWx5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb2YobnVsbCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2l0aERlbGF5JzpcbiAgICAgICAgICByZWFkeVRvUmVnaXN0ZXIkID0gb2YobnVsbCkucGlwZShkZWxheSgrYXJnc1swXSB8fCAwKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVyV2hlblN0YWJsZSc6XG4gICAgICAgICAgY29uc3QgYXBwUmVmID0gaW5qZWN0b3IuZ2V0PEFwcGxpY2F0aW9uUmVmPihBcHBsaWNhdGlvblJlZik7XG4gICAgICAgICAgcmVhZHlUb1JlZ2lzdGVyJCA9IGFwcFJlZi5pc1N0YWJsZS5waXBlKGZpbHRlcihzdGFibGUgPT4gc3RhYmxlKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gVW5rbm93biBzdHJhdGVneS5cbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBVbmtub3duIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5OiAke29wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3l9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRG9uJ3QgcmV0dXJuIGFueXRoaW5nIHRvIGF2b2lkIGJsb2NraW5nIHRoZSBhcHBsaWNhdGlvbiB1bnRpbCB0aGUgU1cgaXMgcmVnaXN0ZXJlZC5cbiAgICAvLyBDYXRjaCBhbmQgbG9nIHRoZSBlcnJvciBpZiBTVyByZWdpc3RyYXRpb24gZmFpbHMgdG8gYXZvaWQgdW5jYXVnaHQgcmVqZWN0aW9uIHdhcm5pbmcuXG4gICAgcmVhZHlUb1JlZ2lzdGVyJC5waXBlKHRha2UoMSkpLnN1YnNjcmliZShcbiAgICAgICAgKCkgPT4gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc2NyaXB0LCB7c2NvcGU6IG9wdGlvbnMuc2NvcGV9KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiBjb25zb2xlLmVycm9yKCdTZXJ2aWNlIHdvcmtlciByZWdpc3RyYXRpb24gZmFpbGVkIHdpdGg6JywgZXJyKSkpO1xuICB9O1xuICByZXR1cm4gaW5pdGlhbGl6ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5KFxuICAgIG9wdHM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgcGxhdGZvcm1JZDogc3RyaW5nKTogTmdzd0NvbW1DaGFubmVsIHtcbiAgcmV0dXJuIG5ldyBOZ3N3Q29tbUNoYW5uZWwoXG4gICAgICBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiBvcHRzLmVuYWJsZWQgIT09IGZhbHNlID8gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtTd1B1c2gsIFN3VXBkYXRlXSxcbn0pXG5leHBvcnQgY2xhc3MgU2VydmljZVdvcmtlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZ2l2ZW4gQW5ndWxhciBTZXJ2aWNlIFdvcmtlciBzY3JpcHQuXG4gICAqXG4gICAqIElmIGBlbmFibGVkYCBpcyBzZXQgdG8gYGZhbHNlYCBpbiB0aGUgZ2l2ZW4gb3B0aW9ucywgdGhlIG1vZHVsZSB3aWxsIGJlaGF2ZSBhcyBpZiBzZXJ2aWNlXG4gICAqIHdvcmtlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGFuZCB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCBub3QgYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlcihzY3JpcHQ6IHN0cmluZywgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zID0ge30pOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVyczxTZXJ2aWNlV29ya2VyTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTZXJ2aWNlV29ya2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBTQ1JJUFQsIHVzZVZhbHVlOiBzY3JpcHR9LFxuICAgICAgICB7cHJvdmlkZTogU3dSZWdpc3RyYXRpb25PcHRpb25zLCB1c2VWYWx1ZTogb3B0c30sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBOZ3N3Q29tbUNoYW5uZWwsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0NvbW1DaGFubmVsRmFjdG9yeSxcbiAgICAgICAgICBkZXBzOiBbU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW0luamVjdG9yLCBTQ1JJUFQsIFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=