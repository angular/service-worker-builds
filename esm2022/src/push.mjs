/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { merge, NEVER, Subject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
import * as i0 from "@angular/core";
import * as i1 from "./low_level";
/**
 * Subscribe and listen to
 * [Web Push
 * Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices) through
 * Angular Service Worker.
 *
 * @usageNotes
 *
 * You can inject a `SwPush` instance into any component or service
 * as a dependency.
 *
 * <code-example path="service-worker/push/module.ts" region="inject-sw-push"
 * header="app.component.ts"></code-example>
 *
 * To subscribe, call `SwPush.requestSubscription()`, which asks the user for permission.
 * The call returns a `Promise` with a new
 * [`PushSubscription`](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
 * instance.
 *
 * <code-example path="service-worker/push/module.ts" region="subscribe-to-push"
 * header="app.component.ts"></code-example>
 *
 * A request is rejected if the user denies permission, or if the browser
 * blocks or does not support the Push API or ServiceWorkers.
 * Check `SwPush.isEnabled` to confirm status.
 *
 * Invoke Push Notifications by pushing a message with the following payload.
 *
 * ```ts
 * {
 *   "notification": {
 *     "actions": NotificationAction[],
 *     "badge": USVString,
 *     "body": DOMString,
 *     "data": any,
 *     "dir": "auto"|"ltr"|"rtl",
 *     "icon": USVString,
 *     "image": USVString,
 *     "lang": DOMString,
 *     "renotify": boolean,
 *     "requireInteraction": boolean,
 *     "silent": boolean,
 *     "tag": DOMString,
 *     "timestamp": DOMTimeStamp,
 *     "title": DOMString,
 *     "vibrate": number[]
 *   }
 * }
 * ```
 *
 * Only `title` is required. See `Notification`
 * [instance
 * properties](https://developer.mozilla.org/en-US/docs/Web/API/Notification#Instance_properties).
 *
 * While the subscription is active, Service Worker listens for
 * [PushEvent](https://developer.mozilla.org/en-US/docs/Web/API/PushEvent)
 * occurrences and creates
 * [Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
 * instances in response.
 *
 * Unsubscribe using `SwPush.unsubscribe()`.
 *
 * An application can subscribe to `SwPush.notificationClicks` observable to be notified when a user
 * clicks on a notification. For example:
 *
 * <code-example path="service-worker/push/module.ts" region="subscribe-to-notification-clicks"
 * header="app.component.ts"></code-example>
 *
 * You can read more on handling notification clicks in the [Service worker notifications
 * guide](ecosystem/service-workers/push-notifications).
 *
 * @see [Push Notifications](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)
 * @see [Angular Push Notifications](https://blog.angular-university.io/angular-push-notifications/)
 * @see [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
 * @see [MDN: Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
 * @see [MDN: Web Push API Notifications best practices](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)
 *
 * @publicApi
 */
export class SwPush {
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    get isEnabled() {
        return this.sw.isEnabled;
    }
    constructor(sw) {
        this.sw = sw;
        this.pushManager = null;
        this.subscriptionChanges = new Subject();
        if (!sw.isEnabled) {
            this.messages = NEVER;
            this.notificationClicks = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map((message) => message.data));
        this.notificationClicks = this.sw
            .eventsOfType('NOTIFICATION_CLICK')
            .pipe(map((message) => message.data));
        this.pushManager = this.sw.registration.pipe(map((registration) => registration.pushManager));
        const workerDrivenSubscriptions = this.pushManager.pipe(switchMap((pm) => pm.getSubscription()));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    /**
     * Subscribes to Web Push Notifications,
     * after requesting and receiving user permission.
     *
     * @param options An object containing the `serverPublicKey` string.
     * @returns A Promise that resolves to the new subscription object.
     */
    requestSubscription(options) {
        if (!this.sw.isEnabled || this.pushManager === null) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const pushOptions = { userVisibleOnly: true };
        let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (let i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return this.pushManager
            .pipe(switchMap((pm) => pm.subscribe(pushOptions)), take(1))
            .toPromise()
            .then((sub) => {
            this.subscriptionChanges.next(sub);
            return sub;
        });
    }
    /**
     * Unsubscribes from Service Worker push notifications.
     *
     * @returns A Promise that is resolved when the operation succeeds, or is rejected if there is no
     *          active subscription or the unsubscribe operation fails.
     */
    unsubscribe() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const doUnsubscribe = (sub) => {
            if (sub === null) {
                throw new Error('Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then((success) => {
                if (!success) {
                    throw new Error('Unsubscribe failed!');
                }
                this.subscriptionChanges.next(null);
            });
        };
        return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
    }
    decodeBase64(input) {
        return atob(input);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.4+sha-e1240c6", ngImport: i0, type: SwPush, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.0-next.4+sha-e1240c6", ngImport: i0, type: SwPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.4+sha-e1240c6", ngImport: i0, type: SwPush, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.NgswCommChannel }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxlQUFlLEVBQVksTUFBTSxhQUFhLENBQUM7OztBQUU3RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEVHO0FBRUgsTUFBTSxPQUFPLE1BQU07SUErQmpCOzs7T0FHRztJQUNILElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7SUFDM0IsQ0FBQztJQUtELFlBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBSC9CLGdCQUFXLEdBQW1DLElBQUksQ0FBQztRQUNuRCx3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBMkIsQ0FBQztRQUduRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDMUIsT0FBTztRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFZLE1B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LENBQUMsdUNBQXVDLENBQUMsQ0FBQztZQUMzRCxDQUFDO1lBRUQsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ3hDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDYixNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUM7Z0JBQ3pDLENBQUM7Z0JBRUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9FLENBQUM7SUFFTyxZQUFZLENBQUMsS0FBYTtRQUNoQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO3lIQTdIVSxNQUFNOzZIQUFOLE1BQU07O3NHQUFOLE1BQU07a0JBRGxCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIE5FVkVSLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsLCBQdXNoRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuLyoqXG4gKiBTdWJzY3JpYmUgYW5kIGxpc3RlbiB0b1xuICogW1dlYiBQdXNoXG4gKiBOb3RpZmljYXRpb25zXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaF9BUEkvQmVzdF9QcmFjdGljZXMpIHRocm91Z2hcbiAqIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBZb3UgY2FuIGluamVjdCBhIGBTd1B1c2hgIGluc3RhbmNlIGludG8gYW55IGNvbXBvbmVudCBvciBzZXJ2aWNlXG4gKiBhcyBhIGRlcGVuZGVuY3kuXG4gKlxuICogPGNvZGUtZXhhbXBsZSBwYXRoPVwic2VydmljZS13b3JrZXIvcHVzaC9tb2R1bGUudHNcIiByZWdpb249XCJpbmplY3Qtc3ctcHVzaFwiXG4gKiBoZWFkZXI9XCJhcHAuY29tcG9uZW50LnRzXCI+PC9jb2RlLWV4YW1wbGU+XG4gKlxuICogVG8gc3Vic2NyaWJlLCBjYWxsIGBTd1B1c2gucmVxdWVzdFN1YnNjcmlwdGlvbigpYCwgd2hpY2ggYXNrcyB0aGUgdXNlciBmb3IgcGVybWlzc2lvbi5cbiAqIFRoZSBjYWxsIHJldHVybnMgYSBgUHJvbWlzZWAgd2l0aCBhIG5ld1xuICogW2BQdXNoU3Vic2NyaXB0aW9uYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hTdWJzY3JpcHRpb24pXG4gKiBpbnN0YW5jZS5cbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJzZXJ2aWNlLXdvcmtlci9wdXNoL21vZHVsZS50c1wiIHJlZ2lvbj1cInN1YnNjcmliZS10by1wdXNoXCJcbiAqIGhlYWRlcj1cImFwcC5jb21wb25lbnQudHNcIj48L2NvZGUtZXhhbXBsZT5cbiAqXG4gKiBBIHJlcXVlc3QgaXMgcmVqZWN0ZWQgaWYgdGhlIHVzZXIgZGVuaWVzIHBlcm1pc3Npb24sIG9yIGlmIHRoZSBicm93c2VyXG4gKiBibG9ja3Mgb3IgZG9lcyBub3Qgc3VwcG9ydCB0aGUgUHVzaCBBUEkgb3IgU2VydmljZVdvcmtlcnMuXG4gKiBDaGVjayBgU3dQdXNoLmlzRW5hYmxlZGAgdG8gY29uZmlybSBzdGF0dXMuXG4gKlxuICogSW52b2tlIFB1c2ggTm90aWZpY2F0aW9ucyBieSBwdXNoaW5nIGEgbWVzc2FnZSB3aXRoIHRoZSBmb2xsb3dpbmcgcGF5bG9hZC5cbiAqXG4gKiBgYGB0c1xuICoge1xuICogICBcIm5vdGlmaWNhdGlvblwiOiB7XG4gKiAgICAgXCJhY3Rpb25zXCI6IE5vdGlmaWNhdGlvbkFjdGlvbltdLFxuICogICAgIFwiYmFkZ2VcIjogVVNWU3RyaW5nLFxuICogICAgIFwiYm9keVwiOiBET01TdHJpbmcsXG4gKiAgICAgXCJkYXRhXCI6IGFueSxcbiAqICAgICBcImRpclwiOiBcImF1dG9cInxcImx0clwifFwicnRsXCIsXG4gKiAgICAgXCJpY29uXCI6IFVTVlN0cmluZyxcbiAqICAgICBcImltYWdlXCI6IFVTVlN0cmluZyxcbiAqICAgICBcImxhbmdcIjogRE9NU3RyaW5nLFxuICogICAgIFwicmVub3RpZnlcIjogYm9vbGVhbixcbiAqICAgICBcInJlcXVpcmVJbnRlcmFjdGlvblwiOiBib29sZWFuLFxuICogICAgIFwic2lsZW50XCI6IGJvb2xlYW4sXG4gKiAgICAgXCJ0YWdcIjogRE9NU3RyaW5nLFxuICogICAgIFwidGltZXN0YW1wXCI6IERPTVRpbWVTdGFtcCxcbiAqICAgICBcInRpdGxlXCI6IERPTVN0cmluZyxcbiAqICAgICBcInZpYnJhdGVcIjogbnVtYmVyW11cbiAqICAgfVxuICogfVxuICogYGBgXG4gKlxuICogT25seSBgdGl0bGVgIGlzIHJlcXVpcmVkLiBTZWUgYE5vdGlmaWNhdGlvbmBcbiAqIFtpbnN0YW5jZVxuICogcHJvcGVydGllc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vdGlmaWNhdGlvbiNJbnN0YW5jZV9wcm9wZXJ0aWVzKS5cbiAqXG4gKiBXaGlsZSB0aGUgc3Vic2NyaXB0aW9uIGlzIGFjdGl2ZSwgU2VydmljZSBXb3JrZXIgbGlzdGVucyBmb3JcbiAqIFtQdXNoRXZlbnRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoRXZlbnQpXG4gKiBvY2N1cnJlbmNlcyBhbmQgY3JlYXRlc1xuICogW05vdGlmaWNhdGlvbl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vdGlmaWNhdGlvbilcbiAqIGluc3RhbmNlcyBpbiByZXNwb25zZS5cbiAqXG4gKiBVbnN1YnNjcmliZSB1c2luZyBgU3dQdXNoLnVuc3Vic2NyaWJlKClgLlxuICpcbiAqIEFuIGFwcGxpY2F0aW9uIGNhbiBzdWJzY3JpYmUgdG8gYFN3UHVzaC5ub3RpZmljYXRpb25DbGlja3NgIG9ic2VydmFibGUgdG8gYmUgbm90aWZpZWQgd2hlbiBhIHVzZXJcbiAqIGNsaWNrcyBvbiBhIG5vdGlmaWNhdGlvbi4gRm9yIGV4YW1wbGU6XG4gKlxuICogPGNvZGUtZXhhbXBsZSBwYXRoPVwic2VydmljZS13b3JrZXIvcHVzaC9tb2R1bGUudHNcIiByZWdpb249XCJzdWJzY3JpYmUtdG8tbm90aWZpY2F0aW9uLWNsaWNrc1wiXG4gKiBoZWFkZXI9XCJhcHAuY29tcG9uZW50LnRzXCI+PC9jb2RlLWV4YW1wbGU+XG4gKlxuICogWW91IGNhbiByZWFkIG1vcmUgb24gaGFuZGxpbmcgbm90aWZpY2F0aW9uIGNsaWNrcyBpbiB0aGUgW1NlcnZpY2Ugd29ya2VyIG5vdGlmaWNhdGlvbnNcbiAqIGd1aWRlXShlY29zeXN0ZW0vc2VydmljZS13b3JrZXJzL3B1c2gtbm90aWZpY2F0aW9ucykuXG4gKlxuICogQHNlZSBbUHVzaCBOb3RpZmljYXRpb25zXShodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvZnVuZGFtZW50YWxzL2NvZGVsYWJzL3B1c2gtbm90aWZpY2F0aW9ucy8pXG4gKiBAc2VlIFtBbmd1bGFyIFB1c2ggTm90aWZpY2F0aW9uc10oaHR0cHM6Ly9ibG9nLmFuZ3VsYXItdW5pdmVyc2l0eS5pby9hbmd1bGFyLXB1c2gtbm90aWZpY2F0aW9ucy8pXG4gKiBAc2VlIFtNRE46IFB1c2ggQVBJXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaF9BUEkpXG4gKiBAc2VlIFtNRE46IE5vdGlmaWNhdGlvbnMgQVBJXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm90aWZpY2F0aW9uc19BUEkpXG4gKiBAc2VlIFtNRE46IFdlYiBQdXNoIEFQSSBOb3RpZmljYXRpb25zIGJlc3QgcHJhY3RpY2VzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaF9BUEkvQmVzdF9QcmFjdGljZXMpXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dQdXNoIHtcbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBwYXlsb2FkcyBvZiB0aGUgcmVjZWl2ZWQgcHVzaCBub3RpZmljYXRpb24gbWVzc2FnZXMuXG4gICAqL1xuICByZWFkb25seSBtZXNzYWdlczogT2JzZXJ2YWJsZTxvYmplY3Q+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgcGF5bG9hZHMgb2YgdGhlIHJlY2VpdmVkIHB1c2ggbm90aWZpY2F0aW9uIG1lc3NhZ2VzIGFzIHdlbGwgYXMgdGhlIGFjdGlvbiB0aGUgdXNlclxuICAgKiBpbnRlcmFjdGVkIHdpdGguIElmIG5vIGFjdGlvbiB3YXMgdXNlZCB0aGUgYGFjdGlvbmAgcHJvcGVydHkgY29udGFpbnMgYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgYG5vdGlmaWNhdGlvbmAgcHJvcGVydHkgZG9lcyAqKm5vdCoqIGNvbnRhaW4gYVxuICAgKiBbTm90aWZpY2F0aW9uXVtNb3ppbGxhIE5vdGlmaWNhdGlvbl0gb2JqZWN0IGJ1dCByYXRoZXIgYVxuICAgKiBbTm90aWZpY2F0aW9uT3B0aW9uc10oaHR0cHM6Ly9ub3RpZmljYXRpb25zLnNwZWMud2hhdHdnLm9yZy8jZGljdGRlZi1ub3RpZmljYXRpb25vcHRpb25zKVxuICAgKiBvYmplY3QgdGhhdCBhbHNvIGluY2x1ZGVzIHRoZSBgdGl0bGVgIG9mIHRoZSBbTm90aWZpY2F0aW9uXVtNb3ppbGxhIE5vdGlmaWNhdGlvbl0gb2JqZWN0LlxuICAgKlxuICAgKiBbTW96aWxsYSBOb3RpZmljYXRpb25dOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm90aWZpY2F0aW9uXG4gICAqL1xuICByZWFkb25seSBub3RpZmljYXRpb25DbGlja3M6IE9ic2VydmFibGU8e1xuICAgIGFjdGlvbjogc3RyaW5nO1xuICAgIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uT3B0aW9ucyAmIHtcbiAgICAgIHRpdGxlOiBzdHJpbmc7XG4gICAgfTtcbiAgfT47XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBjdXJyZW50bHkgYWN0aXZlXG4gICAqIFtQdXNoU3Vic2NyaXB0aW9uXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaFN1YnNjcmlwdGlvbilcbiAgICogYXNzb2NpYXRlZCB0byB0aGUgU2VydmljZSBXb3JrZXIgcmVnaXN0cmF0aW9uIG9yIGBudWxsYCBpZiB0aGVyZSBpcyBubyBzdWJzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBzdWJzY3JpcHRpb246IE9ic2VydmFibGU8UHVzaFN1YnNjcmlwdGlvbiB8IG51bGw+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN3LmlzRW5hYmxlZDtcbiAgfVxuXG4gIHByaXZhdGUgcHVzaE1hbmFnZXI6IE9ic2VydmFibGU8UHVzaE1hbmFnZXI+IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PFB1c2hTdWJzY3JpcHRpb24gfCBudWxsPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3c6IE5nc3dDb21tQ2hhbm5lbCkge1xuICAgIGlmICghc3cuaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gTkVWRVI7XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbkNsaWNrcyA9IE5FVkVSO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8UHVzaEV2ZW50PignUFVTSCcpLnBpcGUobWFwKChtZXNzYWdlKSA9PiBtZXNzYWdlLmRhdGEpKTtcblxuICAgIHRoaXMubm90aWZpY2F0aW9uQ2xpY2tzID0gdGhpcy5zd1xuICAgICAgLmV2ZW50c09mVHlwZSgnTk9USUZJQ0FUSU9OX0NMSUNLJylcbiAgICAgIC5waXBlKG1hcCgobWVzc2FnZTogYW55KSA9PiBtZXNzYWdlLmRhdGEpKTtcblxuICAgIHRoaXMucHVzaE1hbmFnZXIgPSB0aGlzLnN3LnJlZ2lzdHJhdGlvbi5waXBlKG1hcCgocmVnaXN0cmF0aW9uKSA9PiByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIpKTtcblxuICAgIGNvbnN0IHdvcmtlckRyaXZlblN1YnNjcmlwdGlvbnMgPSB0aGlzLnB1c2hNYW5hZ2VyLnBpcGUoXG4gICAgICBzd2l0Y2hNYXAoKHBtKSA9PiBwbS5nZXRTdWJzY3JpcHRpb24oKSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG1lcmdlKHdvcmtlckRyaXZlblN1YnNjcmlwdGlvbnMsIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcyk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBXZWIgUHVzaCBOb3RpZmljYXRpb25zLFxuICAgKiBhZnRlciByZXF1ZXN0aW5nIGFuZCByZWNlaXZpbmcgdXNlciBwZXJtaXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgYHNlcnZlclB1YmxpY0tleWAgc3RyaW5nLlxuICAgKiBAcmV0dXJucyBBIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbmV3IHN1YnNjcmlwdGlvbiBvYmplY3QuXG4gICAqL1xuICByZXF1ZXN0U3Vic2NyaXB0aW9uKG9wdGlvbnM6IHtzZXJ2ZXJQdWJsaWNLZXk6IHN0cmluZ30pOiBQcm9taXNlPFB1c2hTdWJzY3JpcHRpb24+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkIHx8IHRoaXMucHVzaE1hbmFnZXIgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3QgcHVzaE9wdGlvbnM6IFB1c2hTdWJzY3JpcHRpb25PcHRpb25zSW5pdCA9IHt1c2VyVmlzaWJsZU9ubHk6IHRydWV9O1xuICAgIGxldCBrZXkgPSB0aGlzLmRlY29kZUJhc2U2NChvcHRpb25zLnNlcnZlclB1YmxpY0tleS5yZXBsYWNlKC9fL2csICcvJykucmVwbGFjZSgvLS9nLCAnKycpKTtcbiAgICBsZXQgYXBwbGljYXRpb25TZXJ2ZXJLZXkgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIoa2V5Lmxlbmd0aCkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcHBsaWNhdGlvblNlcnZlcktleVtpXSA9IGtleS5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICBwdXNoT3B0aW9ucy5hcHBsaWNhdGlvblNlcnZlcktleSA9IGFwcGxpY2F0aW9uU2VydmVyS2V5O1xuXG4gICAgcmV0dXJuIHRoaXMucHVzaE1hbmFnZXJcbiAgICAgIC5waXBlKFxuICAgICAgICBzd2l0Y2hNYXAoKHBtKSA9PiBwbS5zdWJzY3JpYmUocHVzaE9wdGlvbnMpKSxcbiAgICAgICAgdGFrZSgxKSxcbiAgICAgIClcbiAgICAgIC50b1Byb21pc2UoKVxuICAgICAgLnRoZW4oKHN1YikgPT4ge1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMubmV4dChzdWIhKTtcbiAgICAgICAgcmV0dXJuIHN1YiE7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZXMgZnJvbSBTZXJ2aWNlIFdvcmtlciBwdXNoIG5vdGlmaWNhdGlvbnMuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgUHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIG9wZXJhdGlvbiBzdWNjZWVkcywgb3IgaXMgcmVqZWN0ZWQgaWYgdGhlcmUgaXMgbm9cbiAgICogICAgICAgICAgYWN0aXZlIHN1YnNjcmlwdGlvbiBvciB0aGUgdW5zdWJzY3JpYmUgb3BlcmF0aW9uIGZhaWxzLlxuICAgKi9cbiAgdW5zdWJzY3JpYmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGRvVW5zdWJzY3JpYmUgPSAoc3ViOiBQdXNoU3Vic2NyaXB0aW9uIHwgbnVsbCkgPT4ge1xuICAgICAgaWYgKHN1YiA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBzdWJzY3JpYmVkIHRvIHB1c2ggbm90aWZpY2F0aW9ucy4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1Yi51bnN1YnNjcmliZSgpLnRoZW4oKHN1Y2Nlc3MpID0+IHtcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1YnNjcmliZSBmYWlsZWQhJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMubmV4dChudWxsKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb24ucGlwZSh0YWtlKDEpLCBzd2l0Y2hNYXAoZG9VbnN1YnNjcmliZSkpLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVCYXNlNjQoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGF0b2IoaW5wdXQpO1xuICB9XG59XG4iXX0=