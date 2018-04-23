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
    /** @nocollapse */
    ServiceWorkerModule.ctorParameters = function () { return []; };
    return ServiceWorkerModule;
}());
export { ServiceWorkerModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBUUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUVwSSxPQUFPLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTVDLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDNUMsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRWxDLElBQUE7Ozs4QkFqQkE7SUFvQkMsQ0FBQTtBQUhELCtCQUdDO0FBRUQsTUFBTSxDQUFDLElBQU0sTUFBTSxHQUFHLElBQUksY0FBYyxDQUFTLHNCQUFzQixDQUFDLENBQUM7QUFFekUsTUFBTSw2QkFDRixRQUFrQixFQUFFLE1BQWMsRUFBRSxPQUE0QixFQUNoRSxVQUFrQjtJQUNwQixJQUFNLFdBQVcsR0FBRztRQUNsQixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFpQixjQUFjLENBQUMsQ0FBQztRQUN6RCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQztTQUNSO1FBQ0QsSUFBTSxVQUFVLEdBQ1osR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBZSxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQzs7OztRQUtsRixTQUFTLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO1lBQzNELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELFNBQVMsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO2FBQ3hFO1NBQ0YsQ0FBQyxDQUFDOzs7UUFJSCxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQWhFLENBQWdFLENBQUMsQ0FBQztLQUN6RixDQUFDO0lBQ0YsTUFBTSxDQUFDLFdBQVcsQ0FBQztDQUNwQjtBQUVELE1BQU0saUNBQ0YsSUFBeUIsRUFBRSxVQUFrQjtJQUMvQyxNQUFNLENBQUMsSUFBSSxlQUFlLENBQ3RCLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7Q0FDL0U7Ozs7Ozs7SUFTQzs7Ozs7T0FLRzs7Ozs7OztJQUNJLDRCQUFROzs7Ozs7SUFBZixVQUFnQixNQUFjLEVBQUUsSUFBK0M7UUFBL0MscUJBQUEsRUFBQSxTQUErQztRQUU3RSxNQUFNLENBQUM7WUFDTCxRQUFRLEVBQUUsbUJBQW1CO1lBQzdCLFNBQVMsRUFBRTtnQkFDVCxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQztnQkFDbkMsRUFBQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDOUM7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxzQkFBc0I7b0JBQ2xDLElBQUksRUFBRSxDQUFDLG1CQUFtQixFQUFFLFdBQVcsQ0FBQztpQkFDekM7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLGVBQWU7b0JBQ3hCLFVBQVUsRUFBRSxrQkFBa0I7b0JBQzlCLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxDQUFDO29CQUMxRCxLQUFLLEVBQUUsSUFBSTtpQkFDWjthQUNGO1NBQ0YsQ0FBQztLQUNIOztnQkE5QkYsUUFBUSxTQUFDO29CQUNSLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7aUJBQzlCOzs7OzhCQS9ERDs7U0FnRWEsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtBUFBfSU5JVElBTElaRVIsIEFwcGxpY2F0aW9uUmVmLCBJbmplY3Rpb25Ub2tlbiwgSW5qZWN0b3IsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBQTEFURk9STV9JRH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtOZ3N3Q29tbUNoYW5uZWx9IGZyb20gJy4vbG93X2xldmVsJztcbmltcG9ydCB7U3dQdXNofSBmcm9tICcuL3B1c2gnO1xuaW1wb3J0IHtTd1VwZGF0ZX0gZnJvbSAnLi91cGRhdGUnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVnaXN0cmF0aW9uT3B0aW9ucyB7XG4gIHNjb3BlPzogc3RyaW5nO1xuICBlbmFibGVkPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IFNDUklQVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdOR1NXX1JFR0lTVEVSX1NDUklQVCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0FwcEluaXRpYWxpemVyKFxuICAgIGluamVjdG9yOiBJbmplY3Rvciwgc2NyaXB0OiBzdHJpbmcsIG9wdGlvbnM6IFJlZ2lzdHJhdGlvbk9wdGlvbnMsXG4gICAgcGxhdGZvcm1JZDogc3RyaW5nKTogRnVuY3Rpb24ge1xuICBjb25zdCBpbml0aWFsaXplciA9ICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBpbmplY3Rvci5nZXQ8QXBwbGljYXRpb25SZWY+KEFwcGxpY2F0aW9uUmVmKTtcbiAgICBpZiAoIShpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgJiZcbiAgICAgICAgICBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB3aGVuU3RhYmxlID1cbiAgICAgICAgYXBwLmlzU3RhYmxlLnBpcGUoZmlsdGVyKChzdGFibGU6IGJvb2xlYW4pID0+ICEhc3RhYmxlKSwgdGFrZSgxKSkudG9Qcm9taXNlKCk7XG5cbiAgICAvLyBXYWl0IGZvciBzZXJ2aWNlIHdvcmtlciBjb250cm9sbGVyIGNoYW5nZXMsIGFuZCBmaXJlIGFuIElOSVRJQUxJWkUgYWN0aW9uIHdoZW4gYSBuZXcgU1dcbiAgICAvLyBiZWNvbWVzIGFjdGl2ZS4gVGhpcyBhbGxvd3MgdGhlIFNXIHRvIGluaXRpYWxpemUgaXRzZWxmIGV2ZW4gaWYgdGhlcmUgaXMgbm8gYXBwbGljYXRpb25cbiAgICAvLyB0cmFmZmljLlxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciAhPT0gbnVsbCkge1xuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdJTklUSUFMSVpFJ30pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRG9uJ3QgcmV0dXJuIHRoZSBQcm9taXNlLCBhcyB0aGF0IHdpbGwgYmxvY2sgdGhlIGFwcGxpY2F0aW9uIHVudGlsIHRoZSBTVyBpcyByZWdpc3RlcmVkLCBhbmRcbiAgICAvLyBjYXVzZSBhIGNyYXNoIGlmIHRoZSBTVyByZWdpc3RyYXRpb24gZmFpbHMuXG4gICAgd2hlblN0YWJsZS50aGVuKCgpID0+IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHNjcmlwdCwge3Njb3BlOiBvcHRpb25zLnNjb3BlfSkpO1xuICB9O1xuICByZXR1cm4gaW5pdGlhbGl6ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5KFxuICAgIG9wdHM6IFJlZ2lzdHJhdGlvbk9wdGlvbnMsIHBsYXRmb3JtSWQ6IHN0cmluZyk6IE5nc3dDb21tQ2hhbm5lbCB7XG4gIHJldHVybiBuZXcgTmdzd0NvbW1DaGFubmVsKFxuICAgICAgb3B0cy5lbmFibGVkICE9PSBmYWxzZSA/IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyIDogdW5kZWZpbmVkLCBwbGF0Zm9ybUlkKTtcbn1cblxuLyoqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbkBOZ01vZHVsZSh7XG4gIHByb3ZpZGVyczogW1N3UHVzaCwgU3dVcGRhdGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZXJ2aWNlV29ya2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBnaXZlbiBBbmd1bGFyIFNlcnZpY2UgV29ya2VyIHNjcmlwdC5cbiAgICpcbiAgICogSWYgYGVuYWJsZWRgIGlzIHNldCB0byBgZmFsc2VgIGluIHRoZSBnaXZlbiBvcHRpb25zLCB0aGUgbW9kdWxlIHdpbGwgYmVoYXZlIGFzIGlmIHNlcnZpY2VcbiAgICogd29ya2VycyBhcmUgbm90IHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciwgYW5kIHRoZSBzZXJ2aWNlIHdvcmtlciB3aWxsIG5vdCBiZSByZWdpc3RlcmVkLlxuICAgKi9cbiAgc3RhdGljIHJlZ2lzdGVyKHNjcmlwdDogc3RyaW5nLCBvcHRzOiB7c2NvcGU/OiBzdHJpbmc7IGVuYWJsZWQ/OiBib29sZWFuO30gPSB7fSk6XG4gICAgICBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFNlcnZpY2VXb3JrZXJNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtcbiAgICAgICAge3Byb3ZpZGU6IFNDUklQVCwgdXNlVmFsdWU6IHNjcmlwdH0sXG4gICAgICAgIHtwcm92aWRlOiBSZWdpc3RyYXRpb25PcHRpb25zLCB1c2VWYWx1ZTogb3B0c30sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBOZ3N3Q29tbUNoYW5uZWwsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0NvbW1DaGFubmVsRmFjdG9yeSxcbiAgICAgICAgICBkZXBzOiBbUmVnaXN0cmF0aW9uT3B0aW9ucywgUExBVEZPUk1fSURdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBwcm92aWRlOiBBUFBfSU5JVElBTElaRVIsXG4gICAgICAgICAgdXNlRmFjdG9yeTogbmdzd0FwcEluaXRpYWxpemVyLFxuICAgICAgICAgIGRlcHM6IFtJbmplY3RvciwgU0NSSVBULCBSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF0sXG4gICAgICAgICAgbXVsdGk6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==