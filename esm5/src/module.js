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
    return new NgswCommChannel(opts.enabled !== false ? navigator.serviceWorker : undefined, platformId);
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
    return ServiceWorkerModule;
}());
export { ServiceWorkerModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVwSSxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTVDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWxDLElBQUE7Ozs4QkFqQkE7SUFvQkMsQ0FBQTtBQUhELCtCQUdDO0FBRUQsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFTLHNCQUFzQixDQUFDLENBQUM7QUFFekUsTUFBTSw2QkFDRixRQUFrQixFQUFFLE1BQWMsRUFBRSxPQUE0QixFQUNoRSxVQUFrQjtJQUNwQixJQUFNLFdBQVcsR0FBRztRQUNsQixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFpQixjQUFjLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxTQUFTLENBQUM7WUFDL0QsT0FBTyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNoQyxPQUFPO1NBQ1I7UUFDRCxJQUFNLFVBQVUsR0FDWixHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFlLElBQUssT0FBQSxDQUFDLENBQUMsTUFBTSxFQUFSLENBQVEsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDOzs7O1FBS2xGLFNBQVMsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUU7WUFDM0QsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7Z0JBQy9DLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO2FBQ3hFO1NBQ0YsQ0FBQyxDQUFDOzs7UUFJSCxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQWhFLENBQWdFLENBQUMsQ0FBQztLQUN6RixDQUFDO0lBQ0YsT0FBTyxXQUFXLENBQUM7Q0FDcEI7QUFFRCxNQUFNLGlDQUNGLElBQXlCLEVBQUUsVUFBa0I7SUFDL0MsT0FBTyxJQUFJLGVBQWUsQ0FDdEIsSUFBSSxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUMvRTs7Ozs7OztJQVNDOzs7OztPQUtHOzs7Ozs7O0lBQ0ksNEJBQVE7Ozs7OztJQUFmLFVBQWdCLE1BQWMsRUFBRSxJQUErQztRQUEvQyxxQkFBQSxFQUFBLFNBQStDO1FBRTdFLE9BQU87WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQztnQkFDbkMsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDOUM7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxzQkFBc0I7b0JBQ2xDLElBQUksRUFBRSxDQUFDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQztpQkFDekM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7b0JBQzlCLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxDQUFDO29CQUMxRCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztLQUNIOztnQkE5QkYsUUFBUSxTQUFDO29CQUNSLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7aUJBQzlCOzs4QkEvREQ7O1NBZ0VhLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7Tmdzd0NvbW1DaGFubmVsfSBmcm9tICcuL2xvd19sZXZlbCc7XG5pbXBvcnQge1N3UHVzaH0gZnJvbSAnLi9wdXNoJztcbmltcG9ydCB7U3dVcGRhdGV9IGZyb20gJy4vdXBkYXRlJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFJlZ2lzdHJhdGlvbk9wdGlvbnMge1xuICBzY29wZT86IHN0cmluZztcbiAgZW5hYmxlZD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBTQ1JJUFQgPSBuZXcgSW5qZWN0aW9uVG9rZW48c3RyaW5nPignTkdTV19SRUdJU1RFUl9TQ1JJUFQnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIG5nc3dBcHBJbml0aWFsaXplcihcbiAgICBpbmplY3RvcjogSW5qZWN0b3IsIHNjcmlwdDogc3RyaW5nLCBvcHRpb25zOiBSZWdpc3RyYXRpb25PcHRpb25zLFxuICAgIHBsYXRmb3JtSWQ6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgY29uc3QgaW5pdGlhbGl6ZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gaW5qZWN0b3IuZ2V0PEFwcGxpY2F0aW9uUmVmPihBcHBsaWNhdGlvblJlZik7XG4gICAgaWYgKCEoaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgKCdzZXJ2aWNlV29ya2VyJyBpbiBuYXZpZ2F0b3IpICYmXG4gICAgICAgICAgb3B0aW9ucy5lbmFibGVkICE9PSBmYWxzZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgd2hlblN0YWJsZSA9XG4gICAgICAgIGFwcC5pc1N0YWJsZS5waXBlKGZpbHRlcigoc3RhYmxlOiBib29sZWFuKSA9PiAhIXN0YWJsZSksIHRha2UoMSkpLnRvUHJvbWlzZSgpO1xuXG4gICAgLy8gV2FpdCBmb3Igc2VydmljZSB3b3JrZXIgY29udHJvbGxlciBjaGFuZ2VzLCBhbmQgZmlyZSBhbiBJTklUSUFMSVpFIGFjdGlvbiB3aGVuIGEgbmV3IFNXXG4gICAgLy8gYmVjb21lcyBhY3RpdmUuIFRoaXMgYWxsb3dzIHRoZSBTVyB0byBpbml0aWFsaXplIGl0c2VsZiBldmVuIGlmIHRoZXJlIGlzIG5vIGFwcGxpY2F0aW9uXG4gICAgLy8gdHJhZmZpYy5cbiAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5hZGRFdmVudExpc3RlbmVyKCdjb250cm9sbGVyY2hhbmdlJywgKCkgPT4ge1xuICAgICAgaWYgKG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIgIT09IG51bGwpIHtcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlci5wb3N0TWVzc2FnZSh7YWN0aW9uOiAnSU5JVElBTElaRSd9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIERvbid0IHJldHVybiB0aGUgUHJvbWlzZSwgYXMgdGhhdCB3aWxsIGJsb2NrIHRoZSBhcHBsaWNhdGlvbiB1bnRpbCB0aGUgU1cgaXMgcmVnaXN0ZXJlZCwgYW5kXG4gICAgLy8gY2F1c2UgYSBjcmFzaCBpZiB0aGUgU1cgcmVnaXN0cmF0aW9uIGZhaWxzLlxuICAgIHdoZW5TdGFibGUudGhlbigoKSA9PiBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5yZWdpc3RlcihzY3JpcHQsIHtzY29wZTogb3B0aW9ucy5zY29wZX0pKTtcbiAgfTtcbiAgcmV0dXJuIGluaXRpYWxpemVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0NvbW1DaGFubmVsRmFjdG9yeShcbiAgICBvcHRzOiBSZWdpc3RyYXRpb25PcHRpb25zLCBwbGF0Zm9ybUlkOiBzdHJpbmcpOiBOZ3N3Q29tbUNoYW5uZWwge1xuICByZXR1cm4gbmV3IE5nc3dDb21tQ2hhbm5lbChcbiAgICAgIG9wdHMuZW5hYmxlZCAhPT0gZmFsc2UgPyBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlciA6IHVuZGVmaW5lZCwgcGxhdGZvcm1JZCk7XG59XG5cbi8qKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5ATmdNb2R1bGUoe1xuICBwcm92aWRlcnM6IFtTd1B1c2gsIFN3VXBkYXRlXSxcbn0pXG5leHBvcnQgY2xhc3MgU2VydmljZVdvcmtlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZ2l2ZW4gQW5ndWxhciBTZXJ2aWNlIFdvcmtlciBzY3JpcHQuXG4gICAqXG4gICAqIElmIGBlbmFibGVkYCBpcyBzZXQgdG8gYGZhbHNlYCBpbiB0aGUgZ2l2ZW4gb3B0aW9ucywgdGhlIG1vZHVsZSB3aWxsIGJlaGF2ZSBhcyBpZiBzZXJ2aWNlXG4gICAqIHdvcmtlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIGFuZCB0aGUgc2VydmljZSB3b3JrZXIgd2lsbCBub3QgYmUgcmVnaXN0ZXJlZC5cbiAgICovXG4gIHN0YXRpYyByZWdpc3RlcihzY3JpcHQ6IHN0cmluZywgb3B0czoge3Njb3BlPzogc3RyaW5nOyBlbmFibGVkPzogYm9vbGVhbjt9ID0ge30pOlxuICAgICAgTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTZXJ2aWNlV29ya2VyTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIHtwcm92aWRlOiBTQ1JJUFQsIHVzZVZhbHVlOiBzY3JpcHR9LFxuICAgICAgICB7cHJvdmlkZTogUmVnaXN0cmF0aW9uT3B0aW9ucywgdXNlVmFsdWU6IG9wdHN9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogTmdzd0NvbW1DaGFubmVsLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dDb21tQ2hhbm5lbEZhY3RvcnksXG4gICAgICAgICAgZGVwczogW1JlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgcHJvdmlkZTogQVBQX0lOSVRJQUxJWkVSLFxuICAgICAgICAgIHVzZUZhY3Rvcnk6IG5nc3dBcHBJbml0aWFsaXplcixcbiAgICAgICAgICBkZXBzOiBbSW5qZWN0b3IsIFNDUklQVCwgUmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdLFxuICAgICAgICAgIG11bHRpOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9O1xuICB9XG59XG4iXX0=