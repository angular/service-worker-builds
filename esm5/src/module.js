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
    ServiceWorkerModule.register = function (script, opts) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUF1QixRQUFRLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BJLE9BQU8sRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFNUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFbEM7SUFBQTtJQUdBLENBQUM7SUFBRCwwQkFBQztBQUFELENBQUMsQUFIRCxJQUdDOztBQUVELE1BQU0sQ0FBQyxJQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBUyxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpFLE1BQU0sNkJBQ0YsUUFBa0IsRUFBRSxNQUFjLEVBQUUsT0FBNEIsRUFDaEUsVUFBa0I7SUFDcEIsSUFBTSxXQUFXLEdBQUc7UUFDbEIsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBaUIsY0FBYyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxlQUFlLElBQUksU0FBUyxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDaEMsT0FBTztTQUNSO1FBQ0QsSUFBTSxVQUFVLEdBQ1osR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBZSxJQUFLLE9BQUEsQ0FBQyxDQUFDLE1BQU0sRUFBUixDQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVsRiwwRkFBMEY7UUFDMUYsMEZBQTBGO1FBQzFGLFdBQVc7UUFDWCxTQUFTLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO1lBQzNELElBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEtBQUssSUFBSSxFQUFFO2dCQUMvQyxTQUFTLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBQyxNQUFNLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQzthQUN4RTtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsK0ZBQStGO1FBQy9GLDhDQUE4QztRQUM5QyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBQyxDQUFDLEVBQWhFLENBQWdFLENBQUMsQ0FBQztJQUMxRixDQUFDLENBQUM7SUFDRixPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDO0FBRUQsTUFBTSxpQ0FDRixJQUF5QixFQUFFLFVBQWtCO0lBQy9DLE9BQU8sSUFBSSxlQUFlLENBQ3RCLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekIsU0FBUyxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQUVEOztHQUVHO0FBQ0g7SUFBQTtJQStCQSxDQUFDO0lBM0JDOzs7OztPQUtHO0lBQ0ksNEJBQVEsR0FBZixVQUFnQixNQUFjLEVBQUUsSUFBK0M7UUFBL0MscUJBQUEsRUFBQSxTQUErQztRQUU3RSxPQUFPO1lBQ0wsUUFBUSxFQUFFLG1CQUFtQjtZQUM3QixTQUFTLEVBQUU7Z0JBQ1QsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUM7Z0JBQ25DLEVBQUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7Z0JBQzlDO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsc0JBQXNCO29CQUNsQyxJQUFJLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUM7aUJBQ3pDO2dCQUNEO29CQUNFLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsa0JBQWtCO29CQUM5QixJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsQ0FBQztvQkFDMUQsS0FBSyxFQUFFLElBQUk7aUJBQ1o7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDOztnQkE5QkYsUUFBUSxTQUFDO29CQUNSLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUM7aUJBQzlCOztJQTZCRCwwQkFBQztDQUFBLEFBL0JELElBK0JDO1NBNUJZLG1CQUFtQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvblJlZiwgSW5qZWN0aW9uVG9rZW4sIEluamVjdG9yLCBNb2R1bGVXaXRoUHJvdmlkZXJzLCBOZ01vZHVsZSwgUExBVEZPUk1fSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtmaWx0ZXIsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtOZ3N3Q29tbUNoYW5uZWx9IGZyb20gJy4vbG93X2xldmVsJztcbmltcG9ydCB7U3dQdXNofSBmcm9tICcuL3B1c2gnO1xuaW1wb3J0IHtTd1VwZGF0ZX0gZnJvbSAnLi91cGRhdGUnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVnaXN0cmF0aW9uT3B0aW9ucyB7XG4gIHNjb3BlPzogc3RyaW5nO1xuICBlbmFibGVkPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IFNDUklQVCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxzdHJpbmc+KCdOR1NXX1JFR0lTVEVSX1NDUklQVCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gbmdzd0FwcEluaXRpYWxpemVyKFxuICAgIGluamVjdG9yOiBJbmplY3Rvciwgc2NyaXB0OiBzdHJpbmcsIG9wdGlvbnM6IFJlZ2lzdHJhdGlvbk9wdGlvbnMsXG4gICAgcGxhdGZvcm1JZDogc3RyaW5nKTogRnVuY3Rpb24ge1xuICBjb25zdCBpbml0aWFsaXplciA9ICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBpbmplY3Rvci5nZXQ8QXBwbGljYXRpb25SZWY+KEFwcGxpY2F0aW9uUmVmKTtcbiAgICBpZiAoIShpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSAmJiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikgJiZcbiAgICAgICAgICBvcHRpb25zLmVuYWJsZWQgIT09IGZhbHNlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB3aGVuU3RhYmxlID1cbiAgICAgICAgYXBwLmlzU3RhYmxlLnBpcGUoZmlsdGVyKChzdGFibGU6IGJvb2xlYW4pID0+ICEhc3RhYmxlKSwgdGFrZSgxKSkudG9Qcm9taXNlKCk7XG5cbiAgICAvLyBXYWl0IGZvciBzZXJ2aWNlIHdvcmtlciBjb250cm9sbGVyIGNoYW5nZXMsIGFuZCBmaXJlIGFuIElOSVRJQUxJWkUgYWN0aW9uIHdoZW4gYSBuZXcgU1dcbiAgICAvLyBiZWNvbWVzIGFjdGl2ZS4gVGhpcyBhbGxvd3MgdGhlIFNXIHRvIGluaXRpYWxpemUgaXRzZWxmIGV2ZW4gaWYgdGhlcmUgaXMgbm8gYXBwbGljYXRpb25cbiAgICAvLyB0cmFmZmljLlxuICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRyb2xsZXJjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpZiAobmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlciAhPT0gbnVsbCkge1xuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyLnBvc3RNZXNzYWdlKHthY3Rpb246ICdJTklUSUFMSVpFJ30pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gRG9uJ3QgcmV0dXJuIHRoZSBQcm9taXNlLCBhcyB0aGF0IHdpbGwgYmxvY2sgdGhlIGFwcGxpY2F0aW9uIHVudGlsIHRoZSBTVyBpcyByZWdpc3RlcmVkLCBhbmRcbiAgICAvLyBjYXVzZSBhIGNyYXNoIGlmIHRoZSBTVyByZWdpc3RyYXRpb24gZmFpbHMuXG4gICAgd2hlblN0YWJsZS50aGVuKCgpID0+IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKHNjcmlwdCwge3Njb3BlOiBvcHRpb25zLnNjb3BlfSkpO1xuICB9O1xuICByZXR1cm4gaW5pdGlhbGl6ZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5KFxuICAgIG9wdHM6IFJlZ2lzdHJhdGlvbk9wdGlvbnMsIHBsYXRmb3JtSWQ6IHN0cmluZyk6IE5nc3dDb21tQ2hhbm5lbCB7XG4gIHJldHVybiBuZXcgTmdzd0NvbW1DaGFubmVsKFxuICAgICAgaXNQbGF0Zm9ybUJyb3dzZXIocGxhdGZvcm1JZCkgJiYgb3B0cy5lbmFibGVkICE9PSBmYWxzZSA/IG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQpO1xufVxuXG4vKipcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuQE5nTW9kdWxlKHtcbiAgcHJvdmlkZXJzOiBbU3dQdXNoLCBTd1VwZGF0ZV0sXG59KVxuZXhwb3J0IGNsYXNzIFNlcnZpY2VXb3JrZXJNb2R1bGUge1xuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGdpdmVuIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIgc2NyaXB0LlxuICAgKlxuICAgKiBJZiBgZW5hYmxlZGAgaXMgc2V0IHRvIGBmYWxzZWAgaW4gdGhlIGdpdmVuIG9wdGlvbnMsIHRoZSBtb2R1bGUgd2lsbCBiZWhhdmUgYXMgaWYgc2VydmljZVxuICAgKiB3b3JrZXJzIGFyZSBub3Qgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCBhbmQgdGhlIHNlcnZpY2Ugd29ya2VyIHdpbGwgbm90IGJlIHJlZ2lzdGVyZWQuXG4gICAqL1xuICBzdGF0aWMgcmVnaXN0ZXIoc2NyaXB0OiBzdHJpbmcsIG9wdHM6IHtzY29wZT86IHN0cmluZzsgZW5hYmxlZD86IGJvb2xlYW47fSA9IHt9KTpcbiAgICAgIE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogU2VydmljZVdvcmtlck1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICB7cHJvdmlkZTogU0NSSVBULCB1c2VWYWx1ZTogc2NyaXB0fSxcbiAgICAgICAge3Byb3ZpZGU6IFJlZ2lzdHJhdGlvbk9wdGlvbnMsIHVzZVZhbHVlOiBvcHRzfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IE5nc3dDb21tQ2hhbm5lbCxcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3Q29tbUNoYW5uZWxGYWN0b3J5LFxuICAgICAgICAgIGRlcHM6IFtSZWdpc3RyYXRpb25PcHRpb25zLCBQTEFURk9STV9JRF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6IEFQUF9JTklUSUFMSVpFUixcbiAgICAgICAgICB1c2VGYWN0b3J5OiBuZ3N3QXBwSW5pdGlhbGl6ZXIsXG4gICAgICAgICAgZGVwczogW0luamVjdG9yLCBTQ1JJUFQsIFJlZ2lzdHJhdGlvbk9wdGlvbnMsIFBMQVRGT1JNX0lEXSxcbiAgICAgICAgICBtdWx0aTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfTtcbiAgfVxufVxuIl19