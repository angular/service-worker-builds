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
ServiceWorkerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.0-next.5+4.sha-2e105a1", ngImport: i0, type: ServiceWorkerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ServiceWorkerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "14.0.0-next.5+4.sha-2e105a1", ngImport: i0, type: ServiceWorkerModule });
ServiceWorkerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.0-next.5+4.sha-2e105a1", ngImport: i0, type: ServiceWorkerModule, providers: [SwPush, SwUpdate] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.0-next.5+4.sha-2e105a1", ngImport: i0, type: ServiceWorkerModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [SwPush, SwUpdate],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUF1QixRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM1SSxPQUFPLEVBQUMsS0FBSyxFQUFjLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMzQyxPQUFPLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7QUFFbEM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxNQUFNLE9BQWdCLHFCQUFxQjtDQThDMUM7QUFFRCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQVMsc0JBQXNCLENBQUMsQ0FBQztBQUV6RSxNQUFNLFVBQVUsa0JBQWtCLENBQzlCLFFBQWtCLEVBQUUsTUFBYyxFQUFFLE9BQThCLEVBQ2xFLFVBQWtCO0lBQ3BCLE1BQU0sV0FBVyxHQUFHLEdBQUcsRUFBRTtRQUN2QixJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxTQUFTLENBQUM7WUFDL0QsT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFFRCwwRkFBMEY7UUFDMUYs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LGVBQWUsQ0FDdEIsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUN6QixTQUFTLENBQUMsQ0FBQztBQUMzRSxDQUFDO0FBRUQ7O0dBRUc7QUFJSCxNQUFNLE9BQU8sbUJBQW1CO0lBQzlCOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFjLEVBQUUsT0FBOEIsRUFBRTtRQUU5RCxPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUM7Z0JBQ25DLEVBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7Z0JBQ2hEO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsc0JBQXNCO29CQUNsQyxJQUFJLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxXQUFXLENBQUM7aUJBQzNDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsa0JBQWtCO29CQUM5QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLFdBQVcsQ0FBQztvQkFDNUQsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOzsySEEzQlUsbUJBQW1COzRIQUFuQixtQkFBbUI7NEhBQW5CLG1CQUFtQixhQUZuQixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7c0dBRWxCLG1CQUFtQjtrQkFIL0IsUUFBUTttQkFBQztvQkFDUixTQUFTLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDO2lCQUM5QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBUFBfSU5JVElBTElaRVIsIEFwcGxpY2F0aW9uUmVmLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBOZ1pvbmUsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIE9ic2VydmFibGUsIG9mfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVsYXksIGZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge05nc3dDb21tQ2hhbm5lbH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuaW1wb3J0IHtTd1B1c2h9IGZyb20gJy4vcHVzaCc7XG5pbXBvcnQge1N3VXBkYXRlfSBmcm9tICcuL3VwZGF0ZSc7XG5cbi8qKlxuICogVG9rZW4gdGhhdCBjYW4gYmUgdXNlZCB0byBwcm92aWRlIG9wdGlvbnMgZm9yIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCBvdXRzaWRlIG9mXG4gKiBgU2VydmljZVdvcmtlck1vZHVsZS5yZWdpc3RlcigpYC5cbiAqXG4gKiBZb3UgY2FuIHVzZSB0aGlzIHRva2VuIHRvIGRlZmluZSBhIHByb3ZpZGVyIHRoYXQgZ2VuZXJhdGVzIHRoZSByZWdpc3RyYXRpb24gb3B0aW9ucyBhdCBydW50aW1lLFxuICogZm9yIGV4YW1wbGUgdmlhIGEgZnVuY3Rpb24gY2FsbDpcbiAqXG4gKiB7QGV4YW1wbGUgc2VydmljZS13b3JrZXIvcmVnaXN0cmF0aW9uLW9wdGlvbnMvbW9kdWxlLnRzIHJlZ2lvbj1cInJlZ2lzdHJhdGlvbi1vcHRpb25zXCJcbiAqICAgICBoZWFkZXI9XCJhcHAubW9kdWxlLnRzXCJ9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3dSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBiZSByZWdpc3RlcmVkIGFuZCB0aGUgcmVsYXRlZCBzZXJ2aWNlcyAoc3VjaCBhcyBgU3dQdXNoYCBhbmRcbiAgICogYFN3VXBkYXRlYCkgd2lsbCBhdHRlbXB0IHRvIGNvbW11bmljYXRlIGFuZCBpbnRlcmFjdCB3aXRoIGl0LlxuICAgKlxuICAgKiBEZWZhdWx0OiB0cnVlXG4gICAqL1xuICBlbmFibGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBVUkwgdGhhdCBkZWZpbmVzIHRoZSBTZXJ2aWNlV29ya2VyJ3MgcmVnaXN0cmF0aW9uIHNjb3BlOyB0aGF0IGlzLCB3aGF0IHJhbmdlIG9mIFVSTHMgaXQgY2FuXG4gICAqIGNvbnRyb2wuIEl0IHdpbGwgYmUgdXNlZCB3aGVuIGNhbGxpbmdcbiAgICogW1NlcnZpY2VXb3JrZXJDb250YWluZXIjcmVnaXN0ZXIoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1NlcnZpY2VXb3JrZXJDb250YWluZXIvcmVnaXN0ZXIpLlxuICAgKi9cbiAgc2NvcGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgdGhlIFNlcnZpY2VXb3JrZXIgcmVnaXN0cmF0aW9uIHN0cmF0ZWd5LCB3aGljaCBkZXRlcm1pbmVzIHdoZW4gaXQgd2lsbCBiZSByZWdpc3RlcmVkXG4gICAqIHdpdGggdGhlIGJyb3dzZXIuXG4gICAqXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHJlZ2lzdGVyaW5nIG9uY2UgdGhlIGFwcGxpY2F0aW9uIHN0YWJpbGl6ZXMgKGkuZS4gYXMgc29vbiBhcyB0aGVyZSBhcmVcbiAgICogbm8gcGVuZGluZyBtaWNyby0gYW5kIG1hY3JvLXRhc2tzKSBpcyBkZXNpZ25lZCB0byByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhcyBzb29uIGFzXG4gICAqIHBvc3NpYmxlIGJ1dCB3aXRob3V0IGFmZmVjdGluZyB0aGUgYXBwbGljYXRpb24ncyBmaXJzdCB0aW1lIGxvYWQuXG4gICAqXG4gICAqIFN0aWxsLCB0aGVyZSBtaWdodCBiZSBjYXNlcyB3aGVyZSB5b3Ugd2FudCBtb3JlIGNvbnRyb2wgb3ZlciB3aGVuIHRoZSBTZXJ2aWNlV29ya2VyIGlzXG4gICAqIHJlZ2lzdGVyZWQgKGZvciBleGFtcGxlLCB0aGVyZSBtaWdodCBiZSBhIGxvbmctcnVubmluZyB0aW1lb3V0IG9yIHBvbGxpbmcgaW50ZXJ2YWwsIHByZXZlbnRpbmdcbiAgICogdGhlIGFwcCBmcm9tIHN0YWJpbGl6aW5nKS4gVGhlIGF2YWlsYWJsZSBvcHRpb24gYXJlOlxuICAgKlxuICAgKiAtIGByZWdpc3RlcldoZW5TdGFibGU6PHRpbWVvdXQ+YDogUmVnaXN0ZXIgYXMgc29vbiBhcyB0aGUgYXBwbGljYXRpb24gc3RhYmlsaXplcyAobm8gcGVuZGluZ1xuICAgKiAgICAgbWljcm8tL21hY3JvLXRhc2tzKSBidXQgbm8gbGF0ZXIgdGhhbiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIElmIHRoZSBhcHAgaGFzbid0XG4gICAqICAgICBzdGFiaWxpemVkIGFmdGVyIGA8dGltZW91dD5gIG1pbGxpc2Vjb25kcyAoZm9yIGV4YW1wbGUsIGR1ZSB0byBhIHJlY3VycmVudCBhc3luY2hyb25vdXNcbiAgICogICAgIHRhc2spLCB0aGUgU2VydmljZVdvcmtlciB3aWxsIGJlIHJlZ2lzdGVyZWQgYW55d2F5LlxuICAgKiAgICAgSWYgYDx0aW1lb3V0PmAgaXMgb21pdHRlZCwgdGhlIFNlcnZpY2VXb3JrZXIgd2lsbCBvbmx5IGJlIHJlZ2lzdGVyZWQgb25jZSB0aGUgYXBwXG4gICAqICAgICBzdGFiaWxpemVzLlxuICAgKiAtIGByZWdpc3RlckltbWVkaWF0ZWx5YDogUmVnaXN0ZXIgaW1tZWRpYXRlbHkuXG4gICAqIC0gYHJlZ2lzdGVyV2l0aERlbGF5Ojx0aW1lb3V0PmA6IFJlZ2lzdGVyIHdpdGggYSBkZWxheSBvZiBgPHRpbWVvdXQ+YCBtaWxsaXNlY29uZHMuIEZvclxuICAgKiAgICAgZXhhbXBsZSwgdXNlIGByZWdpc3RlcldpdGhEZWxheTo1MDAwYCB0byByZWdpc3RlciB0aGUgU2VydmljZVdvcmtlciBhZnRlciA1IHNlY29uZHMuIElmXG4gICAqICAgICBgPHRpbWVvdXQ+YCBpcyBvbWl0dGVkLCBpcyBkZWZhdWx0cyB0byBgMGAsIHdoaWNoIHdpbGwgcmVnaXN0ZXIgdGhlIFNlcnZpY2VXb3JrZXIgYXMgc29vblxuICAgKiAgICAgYXMgcG9zc2libGUgYnV0IHN0aWxsIGFzeW5jaHJvbm91c2x5LCBvbmNlIGFsbCBwZW5kaW5nIG1pY3JvLXRhc2tzIGFyZSBjb21wbGV0ZWQuXG4gICAqIC0gQW4gW09ic2VydmFibGVdKGd1aWRlL29ic2VydmFibGVzKSBmYWN0b3J5IGZ1bmN0aW9uOiBBIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBgT2JzZXJ2YWJsZWAuXG4gICAqICAgICBUaGUgZnVuY3Rpb24gd2lsbCBiZSB1c2VkIGF0IHJ1bnRpbWUgdG8gb2J0YWluIGFuZCBzdWJzY3JpYmUgdG8gdGhlIGBPYnNlcnZhYmxlYCBhbmQgdGhlXG4gICAqICAgICBTZXJ2aWNlV29ya2VyIHdpbGwgYmUgcmVnaXN0ZXJlZCBhcyBzb29uIGFzIHRoZSBmaXJzdCB2YWx1ZSBpcyBlbWl0dGVkLlxuICAgKlxuICAgKiBEZWZhdWx0OiAncmVnaXN0ZXJXaGVuU3RhYmxlOjMwMDAwJ1xuICAgKi9cbiAgcmVnaXN0cmF0aW9uU3RyYXRlZ3k/OiBzdHJpbmd8KCgpID0+IE9ic2VydmFibGU8dW5rbm93bj4pO1xufVxuXG5leHBvcnQgY29uc3QgU0NSSVBUID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ05HU1dfUkVHSVNURVJfU0NSSVBUJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3QXBwSW5pdGlhbGl6ZXIoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLCBzY3JpcHQ6IHN0cmluZywgb3B0aW9uczogU3dSZWdpc3RyYXRpb25PcHRpb25zLFxuICAgIHBsYXRmb3JtSWQ6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgY29uc3QgaW5pdGlhbGl6ZXIgPSAoKSA9PiB7XG4gICAgaWYgKCEoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpICYmXG4gICAgICAgICAgb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXYWl0IGZvciBzZXJ2aWNlIHdvcmtlciBjb250cm9sbGVyIGNoYW5nZXMsIGFuZCBmaXJlIGFuIElOSVRJQUxJWkUgYWN0aW9uIHdoZW4gYSBuZXcgU1dcbiAgICAvLyBiZWNvbWVzIGFjdGl2ZS4gVGhpcyBhbGxvd3MgdGhlIFNXIHRvIGluaXRpYWxpemUgaXRzZWxmIGV2ZW4gaWYgdGhlcmUgaXMgbm8gYXBwbGljYXRpb25cbiAgICAvLyB0cmFmZmljLlxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciAhPT0gbnVsbCkge1xuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdJTklUSUFMSVpFJ30pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgbGV0IHJlYWR5VG9SZWdpc3RlciQ6IE9ic2VydmFibGU8dW5rbm93bj47XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVnaXN0cmF0aW9uU3RyYXRlZ3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IFtzdHJhdGVneSwgLi4uYXJnc10gPVxuICAgICAgICAgIChvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5IHx8ICdyZWdpc3RlcldoZW5TdGFibGU6MzAwMDAnKS5zcGxpdCgnOicpO1xuXG4gICAgICBzd2l0Y2ggKHN0cmF0ZWd5KSB7XG4gICAgICAgIGNhc2UgJ3JlZ2lzdGVySW1tZWRpYXRlbHknOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBvZihudWxsKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAncmVnaXN0ZXJXaXRoRGVsYXknOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSBkZWxheVdpdGhUaW1lb3V0KCthcmdzWzBdIHx8IDApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdyZWdpc3RlcldoZW5TdGFibGUnOlxuICAgICAgICAgIHJlYWR5VG9SZWdpc3RlciQgPSAhYXJnc1swXSA/IHdoZW5TdGFibGUoaW5qZWN0b3IpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXJnZSh3aGVuU3RhYmxlKGluamVjdG9yKSwgZGVsYXlXaXRoVGltZW91dCgrYXJnc1swXSkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIC8vIFVua25vd24gc3RyYXRlZ3kuXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICBgVW5rbm93biBTZXJ2aWNlV29ya2VyIHJlZ2lzdHJhdGlvbiBzdHJhdGVneTogJHtvcHRpb25zLnJlZ2lzdHJhdGlvblN0cmF0ZWd5fWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIERvbid0IHJldHVybiBhbnl0aGluZyB0byBhdm9pZCBibG9ja2luZyB0aGUgYXBwbGljYXRpb24gdW50aWwgdGhlIFNXIGlzIHJlZ2lzdGVyZWQuXG4gICAgLy8gQWxzbywgcnVuIG91dHNpZGUgdGhlIEFuZ3VsYXIgem9uZSB0byBhdm9pZCBwcmV2ZW50aW5nIHRoZSBhcHAgZnJvbSBzdGFiaWxpemluZyAoZXNwZWNpYWxseVxuICAgIC8vIGdpdmVuIHRoYXQgc29tZSByZWdpc3RyYXRpb24gc3RyYXRlZ2llcyB3YWl0IGZvciB0aGUgYXBwIHRvIHN0YWJpbGl6ZSkuXG4gICAgLy8gQ2F0Y2ggYW5kIGxvZyB0aGUgZXJyb3IgaWYgU1cgcmVnaXN0cmF0aW9uIGZhaWxzIHRvIGF2b2lkIHVuY2F1Z2h0IHJlamVjdGlvbiB3YXJuaW5nLlxuICAgIGNvbnN0IG5nWm9uZSA9IGluamVjdG9yLmdldChOZ1pvbmUpO1xuICAgIG5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcihcbiAgICAgICAgKCkgPT4gcmVhZHlUb1JlZ2lzdGVyJC5waXBlKHRha2UoMSkpLnN1YnNjcmliZShcbiAgICAgICAgICAgICgpID0+XG4gICAgICAgICAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc2NyaXB0LCB7c2NvcGU6IG9wdGlvbnMuc2NvcGV9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IGNvbnNvbGUuZXJyb3IoJ1NlcnZpY2Ugd29ya2VyIHJlZ2lzdHJhdGlvbiBmYWlsZWQgd2l0aDonLCBlcnIpKSkpO1xuICB9O1xuICByZXR1cm4gaW5pdGlhbGl6ZXI7XG59XG5cbmZ1bmN0aW9uIGRlbGF5V2l0aFRpbWVvdXQodGltZW91dDogbnVtYmVyKTogT2JzZXJ2YWJsZTx1bmtub3duPiB7XG4gIHJldHVybiBvZihudWxsKS5waXBlKGRlbGF5KHRpbWVvdXQpKTtcbn1cblxuZnVuY3Rpb24gd2hlblN0YWJsZShpbmplY3RvcjogSW5qZWN0b3IpOiBPYnNlcnZhYmxlPHVua25vd24+IHtcbiAgY29uc3QgYXBwUmVmID0gaW5qZWN0b3IuZ2V0KEFwcGxpY2F0aW9uUmVmKTtcbiAgcmV0dXJuIGFwcFJlZi5pc1N0YWJsZS5waXBlKGZpbHRlcihzdGFibGUgPT4gc3RhYmxlKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5KFxuICAgIG9wdHM6IFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgcGxhdGZvcm1JZDogc3RyaW5nKTogTmdzd0NvbW1DaGFubmVsIHtcbiAgcmV0dXJuIG5ldyBOZ3N3Q29tbUNoYW5uZWwoXG4gICAgICBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiBvcHRzLmVuYWJsZWQgIT09IGZhbHNlID8gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtTd1B1c2gsIFN3VXBkYXRlXSxcbn0pXG5leHBvcnQgY2xhc3MgU2VydmljZVdvcmtlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZ2l2ZW4gQW5ndWxhciBTZXJ2aWNlIFdvcmtlciBzY3JpcHQuXG4gICAqXG4gICAqIElmIGBlbmFibGVkYCBpcyBzZXQgdG8gYGZhbHNlYCBpbiB0aGUgZ2l2ZW4gb3B0aW9ucywgdGhlIG1vZHVsZSB3aWxsIGJlaGF2ZSBhcyBpZiBzZXJ2aWNlXG4gICAqIHdvcmtlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGFuZCB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCBub3QgYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlcihzY3JpcHQ6IHN0cmluZywgb3B0czogU3dSZWdpc3RyYXRpb25PcHRpb25zID0ge30pOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVyczxTZXJ2aWNlV29ya2VyTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTZXJ2aWNlV29ya2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBTQ1JJUFQsIHVzZVZhbHVlOiBzY3JpcHR9LFxuICAgICAgICB7cHJvdmlkZTogU3dSZWdpc3RyYXRpb25PcHRpb25zLCB1c2VWYWx1ZTogb3B0c30sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBOZ3N3Q29tbUNoYW5uZWwsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0NvbW1DaGFubmVsRmFjdG9yeSxcbiAgICAgICAgICBkZXBzOiBbU3dSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW0luamVjdG9yLCBTQ1JJUFQsIFN3UmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=