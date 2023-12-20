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
 * guide](guide/service-worker-notifications).
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
        this.messages = this.sw.eventsOfType('PUSH').pipe(map(message => message.data));
        this.notificationClicks =
            this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(map((message) => message.data));
        this.pushManager = this.sw.registration.pipe(map(registration => registration.pushManager));
        const workerDrivenSubscriptions = this.pushManager.pipe(switchMap(pm => pm.getSubscription()));
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
        return this.pushManager.pipe(switchMap(pm => pm.subscribe(pushOptions)), take(1))
            .toPromise()
            .then(sub => {
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
            return sub.unsubscribe().then(success => {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.7+sha-8a77a5a", ngImport: i0, type: SwPush, deps: [{ token: i1.NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.0.7+sha-8a77a5a", ngImport: i0, type: SwPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.7+sha-8a77a5a", ngImport: i0, type: SwPush, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.NgswCommChannel }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxlQUFlLEVBQVksTUFBTSxhQUFhLENBQUM7OztBQUc3RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEVHO0FBRUgsTUFBTSxPQUFPLE1BQU07SUErQmpCOzs7T0FHRztJQUNILElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7SUFDM0IsQ0FBQztJQUtELFlBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBSC9CLGdCQUFXLEdBQWlDLElBQUksQ0FBQztRQUNqRCx3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBeUIsQ0FBQztRQUdqRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQVksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTNGLElBQUksQ0FBQyxrQkFBa0I7WUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBWSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV6RixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUU1RixNQUFNLHlCQUF5QixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0YsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDakYsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILG1CQUFtQixDQUFDLE9BQWtDO1FBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksRUFBRTtZQUNuRCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO1NBQ3hEO1FBQ0QsTUFBTSxXQUFXLEdBQWdDLEVBQUMsZUFBZSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3pFLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzRixJQUFJLG9CQUFvQixHQUFHLElBQUksVUFBVSxDQUFDLElBQUksV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDN0M7UUFDRCxXQUFXLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7UUFFeEQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzVFLFNBQVMsRUFBRTthQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNWLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsR0FBSSxDQUFDLENBQUM7WUFDcEMsT0FBTyxHQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFdBQVc7UUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDdEIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztTQUN4RDtRQUVELE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBMEIsRUFBRSxFQUFFO1lBQ25ELElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtnQkFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO2FBQzFEO1lBRUQsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDeEM7Z0JBRUQsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9FLENBQUM7SUFFTyxZQUFZLENBQUMsS0FBYTtRQUNoQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO3lIQXRIVSxNQUFNOzZIQUFOLE1BQU07O3NHQUFOLE1BQU07a0JBRGxCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIE5FVkVSLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsLCBQdXNoRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuXG4vKipcbiAqIFN1YnNjcmliZSBhbmQgbGlzdGVuIHRvXG4gKiBbV2ViIFB1c2hcbiAqIE5vdGlmaWNhdGlvbnNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoX0FQSS9CZXN0X1ByYWN0aWNlcykgdGhyb3VnaFxuICogQW5ndWxhciBTZXJ2aWNlIFdvcmtlci5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIFlvdSBjYW4gaW5qZWN0IGEgYFN3UHVzaGAgaW5zdGFuY2UgaW50byBhbnkgY29tcG9uZW50IG9yIHNlcnZpY2VcbiAqIGFzIGEgZGVwZW5kZW5jeS5cbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJzZXJ2aWNlLXdvcmtlci9wdXNoL21vZHVsZS50c1wiIHJlZ2lvbj1cImluamVjdC1zdy1wdXNoXCJcbiAqIGhlYWRlcj1cImFwcC5jb21wb25lbnQudHNcIj48L2NvZGUtZXhhbXBsZT5cbiAqXG4gKiBUbyBzdWJzY3JpYmUsIGNhbGwgYFN3UHVzaC5yZXF1ZXN0U3Vic2NyaXB0aW9uKClgLCB3aGljaCBhc2tzIHRoZSB1c2VyIGZvciBwZXJtaXNzaW9uLlxuICogVGhlIGNhbGwgcmV0dXJucyBhIGBQcm9taXNlYCB3aXRoIGEgbmV3XG4gKiBbYFB1c2hTdWJzY3JpcHRpb25gXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaFN1YnNjcmlwdGlvbilcbiAqIGluc3RhbmNlLlxuICpcbiAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cInNlcnZpY2Utd29ya2VyL3B1c2gvbW9kdWxlLnRzXCIgcmVnaW9uPVwic3Vic2NyaWJlLXRvLXB1c2hcIlxuICogaGVhZGVyPVwiYXBwLmNvbXBvbmVudC50c1wiPjwvY29kZS1leGFtcGxlPlxuICpcbiAqIEEgcmVxdWVzdCBpcyByZWplY3RlZCBpZiB0aGUgdXNlciBkZW5pZXMgcGVybWlzc2lvbiwgb3IgaWYgdGhlIGJyb3dzZXJcbiAqIGJsb2NrcyBvciBkb2VzIG5vdCBzdXBwb3J0IHRoZSBQdXNoIEFQSSBvciBTZXJ2aWNlV29ya2Vycy5cbiAqIENoZWNrIGBTd1B1c2guaXNFbmFibGVkYCB0byBjb25maXJtIHN0YXR1cy5cbiAqXG4gKiBJbnZva2UgUHVzaCBOb3RpZmljYXRpb25zIGJ5IHB1c2hpbmcgYSBtZXNzYWdlIHdpdGggdGhlIGZvbGxvd2luZyBwYXlsb2FkLlxuICpcbiAqIGBgYHRzXG4gKiB7XG4gKiAgIFwibm90aWZpY2F0aW9uXCI6IHtcbiAqICAgICBcImFjdGlvbnNcIjogTm90aWZpY2F0aW9uQWN0aW9uW10sXG4gKiAgICAgXCJiYWRnZVwiOiBVU1ZTdHJpbmcsXG4gKiAgICAgXCJib2R5XCI6IERPTVN0cmluZyxcbiAqICAgICBcImRhdGFcIjogYW55LFxuICogICAgIFwiZGlyXCI6IFwiYXV0b1wifFwibHRyXCJ8XCJydGxcIixcbiAqICAgICBcImljb25cIjogVVNWU3RyaW5nLFxuICogICAgIFwiaW1hZ2VcIjogVVNWU3RyaW5nLFxuICogICAgIFwibGFuZ1wiOiBET01TdHJpbmcsXG4gKiAgICAgXCJyZW5vdGlmeVwiOiBib29sZWFuLFxuICogICAgIFwicmVxdWlyZUludGVyYWN0aW9uXCI6IGJvb2xlYW4sXG4gKiAgICAgXCJzaWxlbnRcIjogYm9vbGVhbixcbiAqICAgICBcInRhZ1wiOiBET01TdHJpbmcsXG4gKiAgICAgXCJ0aW1lc3RhbXBcIjogRE9NVGltZVN0YW1wLFxuICogICAgIFwidGl0bGVcIjogRE9NU3RyaW5nLFxuICogICAgIFwidmlicmF0ZVwiOiBudW1iZXJbXVxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBPbmx5IGB0aXRsZWAgaXMgcmVxdWlyZWQuIFNlZSBgTm90aWZpY2F0aW9uYFxuICogW2luc3RhbmNlXG4gKiBwcm9wZXJ0aWVzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm90aWZpY2F0aW9uI0luc3RhbmNlX3Byb3BlcnRpZXMpLlxuICpcbiAqIFdoaWxlIHRoZSBzdWJzY3JpcHRpb24gaXMgYWN0aXZlLCBTZXJ2aWNlIFdvcmtlciBsaXN0ZW5zIGZvclxuICogW1B1c2hFdmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hFdmVudClcbiAqIG9jY3VycmVuY2VzIGFuZCBjcmVhdGVzXG4gKiBbTm90aWZpY2F0aW9uXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm90aWZpY2F0aW9uKVxuICogaW5zdGFuY2VzIGluIHJlc3BvbnNlLlxuICpcbiAqIFVuc3Vic2NyaWJlIHVzaW5nIGBTd1B1c2gudW5zdWJzY3JpYmUoKWAuXG4gKlxuICogQW4gYXBwbGljYXRpb24gY2FuIHN1YnNjcmliZSB0byBgU3dQdXNoLm5vdGlmaWNhdGlvbkNsaWNrc2Agb2JzZXJ2YWJsZSB0byBiZSBub3RpZmllZCB3aGVuIGEgdXNlclxuICogY2xpY2tzIG9uIGEgbm90aWZpY2F0aW9uLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJzZXJ2aWNlLXdvcmtlci9wdXNoL21vZHVsZS50c1wiIHJlZ2lvbj1cInN1YnNjcmliZS10by1ub3RpZmljYXRpb24tY2xpY2tzXCJcbiAqIGhlYWRlcj1cImFwcC5jb21wb25lbnQudHNcIj48L2NvZGUtZXhhbXBsZT5cbiAqXG4gKiBZb3UgY2FuIHJlYWQgbW9yZSBvbiBoYW5kbGluZyBub3RpZmljYXRpb24gY2xpY2tzIGluIHRoZSBbU2VydmljZSB3b3JrZXIgbm90aWZpY2F0aW9uc1xuICogZ3VpZGVdKGd1aWRlL3NlcnZpY2Utd29ya2VyLW5vdGlmaWNhdGlvbnMpLlxuICpcbiAqIEBzZWUgW1B1c2ggTm90aWZpY2F0aW9uc10oaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy9jb2RlbGFicy9wdXNoLW5vdGlmaWNhdGlvbnMvKVxuICogQHNlZSBbQW5ndWxhciBQdXNoIE5vdGlmaWNhdGlvbnNdKGh0dHBzOi8vYmxvZy5hbmd1bGFyLXVuaXZlcnNpdHkuaW8vYW5ndWxhci1wdXNoLW5vdGlmaWNhdGlvbnMvKVxuICogQHNlZSBbTUROOiBQdXNoIEFQSV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hfQVBJKVxuICogQHNlZSBbTUROOiBOb3RpZmljYXRpb25zIEFQSV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vdGlmaWNhdGlvbnNfQVBJKVxuICogQHNlZSBbTUROOiBXZWIgUHVzaCBBUEkgTm90aWZpY2F0aW9ucyBiZXN0IHByYWN0aWNlc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hfQVBJL0Jlc3RfUHJhY3RpY2VzKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN3UHVzaCB7XG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgcGF5bG9hZHMgb2YgdGhlIHJlY2VpdmVkIHB1c2ggbm90aWZpY2F0aW9uIG1lc3NhZ2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZXM6IE9ic2VydmFibGU8b2JqZWN0PjtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIHBheWxvYWRzIG9mIHRoZSByZWNlaXZlZCBwdXNoIG5vdGlmaWNhdGlvbiBtZXNzYWdlcyBhcyB3ZWxsIGFzIHRoZSBhY3Rpb24gdGhlIHVzZXJcbiAgICogaW50ZXJhY3RlZCB3aXRoLiBJZiBubyBhY3Rpb24gd2FzIHVzZWQgdGhlIGBhY3Rpb25gIHByb3BlcnR5IGNvbnRhaW5zIGFuIGVtcHR5IHN0cmluZyBgJydgLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGBub3RpZmljYXRpb25gIHByb3BlcnR5IGRvZXMgKipub3QqKiBjb250YWluIGFcbiAgICogW05vdGlmaWNhdGlvbl1bTW96aWxsYSBOb3RpZmljYXRpb25dIG9iamVjdCBidXQgcmF0aGVyIGFcbiAgICogW05vdGlmaWNhdGlvbk9wdGlvbnNdKGh0dHBzOi8vbm90aWZpY2F0aW9ucy5zcGVjLndoYXR3Zy5vcmcvI2RpY3RkZWYtbm90aWZpY2F0aW9ub3B0aW9ucylcbiAgICogb2JqZWN0IHRoYXQgYWxzbyBpbmNsdWRlcyB0aGUgYHRpdGxlYCBvZiB0aGUgW05vdGlmaWNhdGlvbl1bTW96aWxsYSBOb3RpZmljYXRpb25dIG9iamVjdC5cbiAgICpcbiAgICogW01vemlsbGEgTm90aWZpY2F0aW9uXTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vdGlmaWNhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgbm90aWZpY2F0aW9uQ2xpY2tzOiBPYnNlcnZhYmxlPHtcbiAgICBhY3Rpb246IHN0cmluZzsgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb25PcHRpb25zICZcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBzdHJpbmdcbiAgICAgICAgfVxuICB9PjtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIGN1cnJlbnRseSBhY3RpdmVcbiAgICogW1B1c2hTdWJzY3JpcHRpb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoU3Vic2NyaXB0aW9uKVxuICAgKiBhc3NvY2lhdGVkIHRvIHRoZSBTZXJ2aWNlIFdvcmtlciByZWdpc3RyYXRpb24gb3IgYG51bGxgIGlmIHRoZXJlIGlzIG5vIHN1YnNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxQdXNoU3Vic2NyaXB0aW9ufG51bGw+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN3LmlzRW5hYmxlZDtcbiAgfVxuXG4gIHByaXZhdGUgcHVzaE1hbmFnZXI6IE9ic2VydmFibGU8UHVzaE1hbmFnZXI+fG51bGwgPSBudWxsO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbkNoYW5nZXMgPSBuZXcgU3ViamVjdDxQdXNoU3Vic2NyaXB0aW9ufG51bGw+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdzogTmdzd0NvbW1DaGFubmVsKSB7XG4gICAgaWYgKCFzdy5pc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSBORVZFUjtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9uQ2xpY2tzID0gTkVWRVI7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IE5FVkVSO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxQdXNoRXZlbnQ+KCdQVVNIJykucGlwZShtYXAobWVzc2FnZSA9PiBtZXNzYWdlLmRhdGEpKTtcblxuICAgIHRoaXMubm90aWZpY2F0aW9uQ2xpY2tzID1cbiAgICAgICAgdGhpcy5zdy5ldmVudHNPZlR5cGUoJ05PVElGSUNBVElPTl9DTElDSycpLnBpcGUobWFwKChtZXNzYWdlOiBhbnkpID0+IG1lc3NhZ2UuZGF0YSkpO1xuXG4gICAgdGhpcy5wdXNoTWFuYWdlciA9IHRoaXMuc3cucmVnaXN0cmF0aW9uLnBpcGUobWFwKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIpKTtcblxuICAgIGNvbnN0IHdvcmtlckRyaXZlblN1YnNjcmlwdGlvbnMgPSB0aGlzLnB1c2hNYW5hZ2VyLnBpcGUoc3dpdGNoTWFwKHBtID0+IHBtLmdldFN1YnNjcmlwdGlvbigpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBtZXJnZSh3b3JrZXJEcml2ZW5TdWJzY3JpcHRpb25zLCB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gV2ViIFB1c2ggTm90aWZpY2F0aW9ucyxcbiAgICogYWZ0ZXIgcmVxdWVzdGluZyBhbmQgcmVjZWl2aW5nIHVzZXIgcGVybWlzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGBzZXJ2ZXJQdWJsaWNLZXlgIHN0cmluZy5cbiAgICogQHJldHVybnMgQSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIG5ldyBzdWJzY3JpcHRpb24gb2JqZWN0LlxuICAgKi9cbiAgcmVxdWVzdFN1YnNjcmlwdGlvbihvcHRpb25zOiB7c2VydmVyUHVibGljS2V5OiBzdHJpbmd9KTogUHJvbWlzZTxQdXNoU3Vic2NyaXB0aW9uPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCB8fCB0aGlzLnB1c2hNYW5hZ2VyID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IHB1c2hPcHRpb25zOiBQdXNoU3Vic2NyaXB0aW9uT3B0aW9uc0luaXQgPSB7dXNlclZpc2libGVPbmx5OiB0cnVlfTtcbiAgICBsZXQga2V5ID0gdGhpcy5kZWNvZGVCYXNlNjQob3B0aW9ucy5zZXJ2ZXJQdWJsaWNLZXkucmVwbGFjZSgvXy9nLCAnLycpLnJlcGxhY2UoLy0vZywgJysnKSk7XG4gICAgbGV0IGFwcGxpY2F0aW9uU2VydmVyS2V5ID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKGtleS5sZW5ndGgpKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleS5sZW5ndGg7IGkrKykge1xuICAgICAgYXBwbGljYXRpb25TZXJ2ZXJLZXlbaV0gPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcHVzaE9wdGlvbnMuYXBwbGljYXRpb25TZXJ2ZXJLZXkgPSBhcHBsaWNhdGlvblNlcnZlcktleTtcblxuICAgIHJldHVybiB0aGlzLnB1c2hNYW5hZ2VyLnBpcGUoc3dpdGNoTWFwKHBtID0+IHBtLnN1YnNjcmliZShwdXNoT3B0aW9ucykpLCB0YWtlKDEpKVxuICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgLnRoZW4oc3ViID0+IHtcbiAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMubmV4dChzdWIhKTtcbiAgICAgICAgICByZXR1cm4gc3ViITtcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVW5zdWJzY3JpYmVzIGZyb20gU2VydmljZSBXb3JrZXIgcHVzaCBub3RpZmljYXRpb25zLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIFByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIHRoZSBvcGVyYXRpb24gc3VjY2VlZHMsIG9yIGlzIHJlamVjdGVkIGlmIHRoZXJlIGlzIG5vXG4gICAqICAgICAgICAgIGFjdGl2ZSBzdWJzY3JpcHRpb24gb3IgdGhlIHVuc3Vic2NyaWJlIG9wZXJhdGlvbiBmYWlscy5cbiAgICovXG4gIHVuc3Vic2NyaWJlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG5cbiAgICBjb25zdCBkb1Vuc3Vic2NyaWJlID0gKHN1YjogUHVzaFN1YnNjcmlwdGlvbnxudWxsKSA9PiB7XG4gICAgICBpZiAoc3ViID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IHN1YnNjcmliZWQgdG8gcHVzaCBub3RpZmljYXRpb25zLicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3ViLnVuc3Vic2NyaWJlKCkudGhlbihzdWNjZXNzID0+IHtcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1YnNjcmliZSBmYWlsZWQhJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMubmV4dChudWxsKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb24ucGlwZSh0YWtlKDEpLCBzd2l0Y2hNYXAoZG9VbnN1YnNjcmliZSkpLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVCYXNlNjQoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGF0b2IoaW5wdXQpO1xuICB9XG59XG4iXX0=