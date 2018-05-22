/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformBrowser } from '@angular/common';
import { APP_INITIALIZER, ApplicationRef, InjectionToken, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { NgswCommChannel } from './low_level';
import { SwPush } from './push';
import { SwUpdate } from './update';
var RegistrationOptions = /** @class */ (function () {
    function RegistrationOptions() {
    }
    return RegistrationOptions;
}());
export { RegistrationOptions };
export var SCRIPT = new InjectionToken('NGSW_REGISTER_SCRIPT');
export function ngswAppInitializer(injector, script, options, platformId) {
    var initializer = function () {
        var app = injector.get(ApplicationRef);
        if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        var whenStable = app.isStable.pipe(filter(function (stable) { return !!stable; }), take(1)).toPromise();
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }
        });
        // Don't return the Promise, as that will block the application until the SW is registered, and
        // cause a crash if the SW registration fails.
        whenStable.then(function () { return navigator.serviceWorker.register(script, { scope: options.scope }); });
    };
    return initializer;
}
export function ngswCommChannelFactory(opts, platformId) {
    return new NgswCommChannel(isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
        undefined);
}
/**
 * @experimental
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
    /**
       * Register the given Angular Service Worker script.
       *
       * If `enabled` is set to `false` in the given options, the module will behave as if service
       * workers are not supported by the browser, and the service worker will not be registered.
       */
    ServiceWorkerModule.register = /**
       * Register the given Angular Service Worker script.
       *
       * If `enabled` is set to `false` in the given options, the module will behave as if service
       * workers are not supported by the browser, and the service worker will not be registered.
       */
    function (script, opts) {
        if (opts === void 0) { opts = {}; }
        return {
            ngModule: ServiceWorkerModule,
            providers: [
                { provide: SCRIPT, useValue: script },
                { provide: RegistrationOptions, useValue: opts },
                {
                    provide: NgswCommChannel,
                    useFactory: ngswCommChannelFactory,
                    deps: [RegistrationOptions, PLATFORM_ID]
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: ngswAppInitializer,
                    deps: [Injector, SCRIPT, RegistrationOptions, PLATFORM_ID],
                    multi: true,
                },
            ],
        };
    };
    ServiceWorkerModule.decorators = [
        { type: NgModule, args: [{
                    providers: [SwPush, SwUpdate],
                },] }
    ];
    /** @nocollapse */
    ServiceWorkerModule.ctorParameters = function () { return []; };
    return ServiceWorkerModule;
}());
export { ServiceWorkerModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwSSxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTVDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWxDLElBQUE7Ozs4QkFoQkE7SUFtQkMsQ0FBQTtBQUhELCtCQUdDO0FBRUQsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFTLHNCQUFzQixDQUFDLENBQUM7QUFFekUsTUFBTSw2QkFDRixRQUFrQixFQUFFLE1BQWMsRUFBRSxPQUE0QixFQUNoRSxVQUFrQjtJQUNwQixJQUFNLFdBQVcsR0FBRztRQUNsQixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFpQixjQUFjLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQztTQUNSO1FBQ0QsSUFBTSxVQUFVLEdBQ1osR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBZSxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7OztRQUtsRixTQUFTLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO1lBQzNELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO2FBQ3hFO1NBQ0YsQ0FBQyxDQUFDOzs7UUFJSCxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQWhFLENBQWdFLENBQUMsQ0FBQztLQUN6RixDQUFDO0lBQ0YsTUFBTSxDQUFDLFdBQVcsQ0FBQztDQUNwQjtBQUVELE1BQU0saUNBQ0YsSUFBeUIsRUFBRSxVQUFrQjtJQUMvQyxNQUFNLENBQUMsSUFBSSxlQUFlLENBQ3RCLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekIsU0FBUyxDQUFDLENBQUM7Q0FDMUU7Ozs7Ozs7SUFTQzs7Ozs7T0FLRzs7Ozs7OztJQUNJLDRCQUFROzs7Ozs7SUFBZixVQUFnQixNQUFjLEVBQUUsSUFBK0M7UUFBL0MscUJBQUEsRUFBQSxTQUErQztRQUU3RSxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQztnQkFDbkMsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDOUM7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxzQkFBc0I7b0JBQ2xDLElBQUksRUFBRSxDQUFDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQztpQkFDekM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7b0JBQzlCLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxDQUFDO29CQUMxRCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztLQUNIOztnQkE5QkYsUUFBUSxTQUFDO29CQUNSLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7aUJBQzlCOzs7OzhCQS9ERDs7U0FnRWEsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBUFBfSU5JVElBTElaRVIsIEFwcGxpY2F0aW9uUmVmLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2ZpbHRlciwgdGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQge05nc3dDb21tQ2hhbm5lbH0gZnJvbSAnLi9sb3dfbGV2ZWwnO1xuaW1wb3J0IHtTd1B1c2h9IGZyb20gJy4vcHVzaCc7XG5pbXBvcnQge1N3VXBkYXRlfSBmcm9tICcuL3VwZGF0ZSc7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZWdpc3RyYXRpb25PcHRpb25zIHtcbiAgc2NvcGU/OiBzdHJpbmc7XG4gIGVuYWJsZWQ/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgU0NSSVBUID0gbmV3IEluamVjdGlvblRva2VuPHN0cmluZz4oJ05HU1dfUkVHSVNURVJfU0NSSVBUJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3QXBwSW5pdGlhbGl6ZXIoXG4gICAgaW5qZWN0b3I6IEluamVjdG9yLCBzY3JpcHQ6IHN0cmluZywgb3B0aW9uczogUmVnaXN0cmF0aW9uT3B0aW9ucyxcbiAgICBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBGdW5jdGlvbiB7XG4gIGNvbnN0IGluaXRpYWxpemVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IGluamVjdG9yLmdldDxBcHBsaWNhdGlvblJlZj4oQXBwbGljYXRpb25SZWYpO1xuICAgIGlmICghKGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpICYmICgnc2VydmljZVdvcmtlcicgaW4gbmF2aWdhdG9yKSAmJlxuICAgICAgICAgIG9wdGlvbnMuZW5hYmxlZCAhPT0gZmFsc2UpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHdoZW5TdGFibGUgPVxuICAgICAgICBhcHAuaXNTdGFibGUucGlwZShmaWx0ZXIoKHN0YWJsZTogYm9vbGVhbikgPT4gISFzdGFibGUpLCB0YWtlKDEpKS50b1Byb21pc2UoKTtcblxuICAgIC8vIFdhaXQgZm9yIHNlcnZpY2Ugd29ya2VyIGNvbnRyb2xsZXIgY2hhbmdlcywgYW5kIGZpcmUgYW4gSU5JVElBTElaRSBhY3Rpb24gd2hlbiBhIG5ldyBTV1xuICAgIC8vIGJlY29tZXMgYWN0aXZlLiBUaGlzIGFsbG93cyB0aGUgU1cgdG8gaW5pdGlhbGl6ZSBpdHNlbGYgZXZlbiBpZiB0aGVyZSBpcyBubyBhcHBsaWNhdGlvblxuICAgIC8vIHRyYWZmaWMuXG4gICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignY29udHJvbGxlcmNoYW5nZScsICgpID0+IHtcbiAgICAgIGlmIChuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyICE9PSBudWxsKSB7XG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIucG9zdE1lc3NhZ2Uoe2FjdGlvbjogJ0lOSVRJQUxJWkUnfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBEb24ndCByZXR1cm4gdGhlIFByb21pc2UsIGFzIHRoYXQgd2lsbCBibG9jayB0aGUgYXBwbGljYXRpb24gdW50aWwgdGhlIFNXIGlzIHJlZ2lzdGVyZWQsIGFuZFxuICAgIC8vIGNhdXNlIGEgY3Jhc2ggaWYgdGhlIFNXIHJlZ2lzdHJhdGlvbiBmYWlscy5cbiAgICB3aGVuU3RhYmxlLnRoZW4oKCkgPT4gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVnaXN0ZXIoc2NyaXB0LCB7c2NvcGU6IG9wdGlvbnMuc2NvcGV9KSk7XG4gIH07XG4gIHJldHVybiBpbml0aWFsaXplcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dDb21tQ2hhbm5lbEZhY3RvcnkoXG4gICAgb3B0czogUmVnaXN0cmF0aW9uT3B0aW9ucywgcGxhdGZvcm1JZDogc3RyaW5nKTogTmdzd0NvbW1DaGFubmVsIHtcbiAgcmV0dXJuIG5ldyBOZ3N3Q29tbUNoYW5uZWwoXG4gICAgICBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiBvcHRzLmVuYWJsZWQgIT09IGZhbHNlID8gbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCk7XG59XG5cbi8qKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtTd1B1c2gsIFN3VXBkYXRlXSxcbn0pXG5leHBvcnQgY2xhc3MgU2VydmljZVdvcmtlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZ2l2ZW4gQW5ndWxhciBTZXJ2aWNlIFdvcmtlciBzY3JpcHQuXG4gICAqXG4gICAqIElmIGBlbmFibGVkYCBpcyBzZXQgdG8gYGZhbHNlYCBpbiB0aGUgZ2l2ZW4gb3B0aW9ucywgdGhlIG1vZHVsZSB3aWxsIGJlaGF2ZSBhcyBpZiBzZXJ2aWNlXG4gICAqIHdvcmtlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGFuZCB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCBub3QgYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlcihzY3JpcHQ6IHN0cmluZywgb3B0czoge3Njb3BlPzogc3RyaW5nOyBlbmFibGVkPzogYm9vbGVhbjt9ID0ge30pOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTZXJ2aWNlV29ya2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBTQ1JJUFQsIHVzZVZhbHVlOiBzY3JpcHR9LFxuICAgICAgICB7cHJvdmlkZTogUmVnaXN0cmF0aW9uT3B0aW9ucywgdXNlVmFsdWU6IG9wdHN9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTmdzd0NvbW1DaGFubmVsLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dDb21tQ2hhbm5lbEZhY3RvcnksXG4gICAgICAgICAgZGVwczogW1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgUmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=