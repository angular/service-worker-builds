/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { merge, NEVER, Subject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
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
 *     "badge": USVString
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
 * @see [Push Notifications](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)
 * @see [Angular Push Notifications](https://blog.angular-university.io/angular-push-notifications/)
 * @see [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
 * @see [MDN: Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
 * @see [MDN: Web Push API Notifications best practices](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)
 *
 * @publicApi
 */
var SwPush = /** @class */ (function () {
    function SwPush(sw) {
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        if (!sw.isEnabled) {
            this.messages = NEVER;
            this.notificationClicks = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map(function (message) { return message.data; }));
        this.notificationClicks =
            this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(map(function (message) { return message.data; }));
        this.pushManager = this.sw.registration.pipe(map(function (registration) { return registration.pushManager; }));
        var workerDrivenSubscriptions = this.pushManager.pipe(switchMap(function (pm) { return pm.getSubscription(); }));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    Object.defineProperty(SwPush.prototype, "isEnabled", {
        /**
         * True if the Service Worker is enabled (supported by the browser and enabled via
         * `ServiceWorkerModule`).
         */
        get: function () {
            return this.sw.isEnabled;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribes to Web Push Notifications,
     * after requesting and receiving user permission.
     *
     * @param options An object containing the `serverPublicKey` string.
     * @returns A Promise that resolves to the new subscription object.
     */
    SwPush.prototype.requestSubscription = function (options) {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var pushOptions = { userVisibleOnly: true };
        var key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        var applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (var i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return this.pushManager.pipe(switchMap(function (pm) { return pm.subscribe(pushOptions); }), take(1))
            .toPromise()
            .then(function (sub) {
            _this.subscriptionChanges.next(sub);
            return sub;
        });
    };
    /**
     * Unsubscribes from Service Worker push notifications.
     *
     * @returns A Promise that is resolved when the operation succeeds, or is rejected if there is no
     *          active subscription or the unsubscribe operation fails.
     */
    SwPush.prototype.unsubscribe = function () {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var doUnsubscribe = function (sub) {
            if (sub === null) {
                throw new Error('Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then(function (success) {
                if (!success) {
                    throw new Error('Unsubscribe failed!');
                }
                _this.subscriptionChanges.next(null);
            });
        };
        return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
    };
    SwPush.prototype.decodeBase64 = function (input) {
        return atob(input);
    };
    SwPush = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [NgswCommChannel])
    ], SwPush);
    return SwPush;
}());
export { SwPush };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFjLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVwRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsZUFBZSxFQUFZLE1BQU0sYUFBYSxDQUFDO0FBRzdFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyRUc7QUFFSDtJQTJDRSxnQkFBb0IsRUFBbUI7UUFBbkIsT0FBRSxHQUFGLEVBQUUsQ0FBaUI7UUFGL0Isd0JBQW1CLEdBQUcsSUFBSSxPQUFPLEVBQXlCLENBQUM7UUFHakUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFZLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxPQUFPLENBQUMsSUFBSSxFQUFaLENBQVksQ0FBQyxDQUFDLENBQUM7UUFFM0YsSUFBSSxDQUFDLGtCQUFrQjtZQUNuQixJQUFJ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QUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQSxPQUFPO2dCQUNuQyxJQUFJLENBQUMsT0FBTyxFQUFFO29CQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMscUJBQXFCLENBQUMsQ0FBQztpQkFDeEM7Z0JBRUQsS0FBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9FLENBQUM7SUFFTyw2QkFBWSxHQUFwQixVQUFxQixLQUFhO1FBQ2hDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUF2SFUsTUFBTTtRQURsQixVQUFVLEVBQUU7eUNBNENhLGVBQWU7T0EzQzVCLE1BQU0sQ0F3SGxCO0lBQUQsYUFBQztDQUFBLEFBeEhELElBd0hDO1NBeEhZLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge21lcmdlLCBORVZFUiwgT2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgc3dpdGNoTWFwLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7RVJSX1NXX05PVF9TVVBQT1JURUQsIE5nc3dDb21tQ2hhbm5lbCwgUHVzaEV2ZW50fSBmcm9tICcuL2xvd19sZXZlbCc7XG5cblxuLyoqXG4gKiBTdWJzY3JpYmUgYW5kIGxpc3RlbiB0b1xuICogW1dlYiBQdXNoXG4gKiBOb3RpZmljYXRpb25zXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaF9BUEkvQmVzdF9QcmFjdGljZXMpIHRocm91Z2hcbiAqIEFuZ3VsYXIgU2VydmljZSBXb3JrZXIuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBZb3UgY2FuIGluamVjdCBhIGBTd1B1c2hgIGluc3RhbmNlIGludG8gYW55IGNvbXBvbmVudCBvciBzZXJ2aWNlXG4gKiBhcyBhIGRlcGVuZGVuY3kuXG4gKlxuICogPGNvZGUtZXhhbXBsZSBwYXRoPVwic2VydmljZS13b3JrZXIvcHVzaC9tb2R1bGUudHNcIiByZWdpb249XCJpbmplY3Qtc3ctcHVzaFwiXG4gKiBoZWFkZXI9XCJhcHAuY29tcG9uZW50LnRzXCI+PC9jb2RlLWV4YW1wbGU+XG4gKlxuICogVG8gc3Vic2NyaWJlLCBjYWxsIGBTd1B1c2gucmVxdWVzdFN1YnNjcmlwdGlvbigpYCwgd2hpY2ggYXNrcyB0aGUgdXNlciBmb3IgcGVybWlzc2lvbi5cbiAqIFRoZSBjYWxsIHJldHVybnMgYSBgUHJvbWlzZWAgd2l0aCBhIG5ld1xuICogW2BQdXNoU3Vic2NyaXB0aW9uYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hTdWJzY3JpcHRpb24pXG4gKiBpbnN0YW5jZS5cbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJzZXJ2aWNlLXdvcmtlci9wdXNoL21vZHVsZS50c1wiIHJlZ2lvbj1cInN1YnNjcmliZS10by1wdXNoXCJcbiAqIGhlYWRlcj1cImFwcC5jb21wb25lbnQudHNcIj48L2NvZGUtZXhhbXBsZT5cbiAqXG4gKiBBIHJlcXVlc3QgaXMgcmVqZWN0ZWQgaWYgdGhlIHVzZXIgZGVuaWVzIHBlcm1pc3Npb24sIG9yIGlmIHRoZSBicm93c2VyXG4gKiBibG9ja3Mgb3IgZG9lcyBub3Qgc3VwcG9ydCB0aGUgUHVzaCBBUEkgb3IgU2VydmljZVdvcmtlcnMuXG4gKiBDaGVjayBgU3dQdXNoLmlzRW5hYmxlZGAgdG8gY29uZmlybSBzdGF0dXMuXG4gKlxuICogSW52b2tlIFB1c2ggTm90aWZpY2F0aW9ucyBieSBwdXNoaW5nIGEgbWVzc2FnZSB3aXRoIHRoZSBmb2xsb3dpbmcgcGF5bG9hZC5cbiAqXG4gKiBgYGB0c1xuICoge1xuICogICBcIm5vdGlmaWNhdGlvblwiOiB7XG4gKiAgICAgXCJhY3Rpb25zXCI6IE5vdGlmaWNhdGlvbkFjdGlvbltdLFxuICogICAgIFwiYmFkZ2VcIjogVVNWU3RyaW5nXG4gKiAgICAgXCJib2R5XCI6IERPTVN0cmluZyxcbiAqICAgICBcImRhdGFcIjogYW55LFxuICogICAgIFwiZGlyXCI6IFwiYXV0b1wifFwibHRyXCJ8XCJydGxcIixcbiAqICAgICBcImljb25cIjogVVNWU3RyaW5nLFxuICogICAgIFwiaW1hZ2VcIjogVVNWU3RyaW5nLFxuICogICAgIFwibGFuZ1wiOiBET01TdHJpbmcsXG4gKiAgICAgXCJyZW5vdGlmeVwiOiBib29sZWFuLFxuICogICAgIFwicmVxdWlyZUludGVyYWN0aW9uXCI6IGJvb2xlYW4sXG4gKiAgICAgXCJzaWxlbnRcIjogYm9vbGVhbixcbiAqICAgICBcInRhZ1wiOiBET01TdHJpbmcsXG4gKiAgICAgXCJ0aW1lc3RhbXBcIjogRE9NVGltZVN0YW1wLFxuICogICAgIFwidGl0bGVcIjogRE9NU3RyaW5nLFxuICogICAgIFwidmlicmF0ZVwiOiBudW1iZXJbXVxuICogICB9XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBPbmx5IGB0aXRsZWAgaXMgcmVxdWlyZWQuIFNlZSBgTm90aWZpY2F0aW9uYFxuICogW2luc3RhbmNlXG4gKiBwcm9wZXJ0aWVzXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm90aWZpY2F0aW9uI0luc3RhbmNlX3Byb3BlcnRpZXMpLlxuICpcbiAqIFdoaWxlIHRoZSBzdWJzY3JpcHRpb24gaXMgYWN0aXZlLCBTZXJ2aWNlIFdvcmtlciBsaXN0ZW5zIGZvclxuICogW1B1c2hFdmVudF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hFdmVudClcbiAqIG9jY3VycmVuY2VzIGFuZCBjcmVhdGVzXG4gKiBbTm90aWZpY2F0aW9uXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvTm90aWZpY2F0aW9uKVxuICogaW5zdGFuY2VzIGluIHJlc3BvbnNlLlxuICpcbiAqIFVuc3Vic2NyaWJlIHVzaW5nIGBTd1B1c2gudW5zdWJzY3JpYmUoKWAuXG4gKlxuICogQW4gYXBwbGljYXRpb24gY2FuIHN1YnNjcmliZSB0byBgU3dQdXNoLm5vdGlmaWNhdGlvbkNsaWNrc2Agb2JzZXJ2YWJsZSB0byBiZSBub3RpZmllZCB3aGVuIGEgdXNlclxuICogY2xpY2tzIG9uIGEgbm90aWZpY2F0aW9uLiBGb3IgZXhhbXBsZTpcbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJzZXJ2aWNlLXdvcmtlci9wdXNoL21vZHVsZS50c1wiIHJlZ2lvbj1cInN1YnNjcmliZS10by1ub3RpZmljYXRpb24tY2xpY2tzXCJcbiAqIGhlYWRlcj1cImFwcC5jb21wb25lbnQudHNcIj48L2NvZGUtZXhhbXBsZT5cbiAqXG4gKiBAc2VlIFtQdXNoIE5vdGlmaWNhdGlvbnNdKGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvY29kZWxhYnMvcHVzaC1ub3RpZmljYXRpb25zLylcbiAqIEBzZWUgW0FuZ3VsYXIgUHVzaCBOb3RpZmljYXRpb25zXShodHRwczovL2Jsb2cuYW5ndWxhci11bml2ZXJzaXR5LmlvL2FuZ3VsYXItcHVzaC1ub3RpZmljYXRpb25zLylcbiAqIEBzZWUgW01ETjogUHVzaCBBUEldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoX0FQSSlcbiAqIEBzZWUgW01ETjogTm90aWZpY2F0aW9ucyBBUEldKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob3RpZmljYXRpb25zX0FQSSlcbiAqIEBzZWUgW01ETjogV2ViIFB1c2ggQVBJIE5vdGlmaWNhdGlvbnMgYmVzdCBwcmFjdGljZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoX0FQSS9CZXN0X1ByYWN0aWNlcylcbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTd1B1c2gge1xuICAvKipcbiAgICogRW1pdHMgdGhlIHBheWxvYWRzIG9mIHRoZSByZWNlaXZlZCBwdXNoIG5vdGlmaWNhdGlvbiBtZXNzYWdlcy5cbiAgICovXG4gIHJlYWRvbmx5IG1lc3NhZ2VzOiBPYnNlcnZhYmxlPG9iamVjdD47XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBwYXlsb2FkcyBvZiB0aGUgcmVjZWl2ZWQgcHVzaCBub3RpZmljYXRpb24gbWVzc2FnZXMgYXMgd2VsbCBhcyB0aGUgYWN0aW9uIHRoZSB1c2VyXG4gICAqIGludGVyYWN0ZWQgd2l0aC4gSWYgbm8gYWN0aW9uIHdhcyB1c2VkIHRoZSBgYWN0aW9uYCBwcm9wZXJ0eSBjb250YWlucyBhbiBlbXB0eSBzdHJpbmcgYCcnYC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBgbm90aWZpY2F0aW9uYCBwcm9wZXJ0eSBkb2VzICoqbm90KiogY29udGFpbiBhXG4gICAqIFtOb3RpZmljYXRpb25dW01vemlsbGEgTm90aWZpY2F0aW9uXSBvYmplY3QgYnV0IHJhdGhlciBhXG4gICAqIFtOb3RpZmljYXRpb25PcHRpb25zXShodHRwczovL25vdGlmaWNhdGlvbnMuc3BlYy53aGF0d2cub3JnLyNkaWN0ZGVmLW5vdGlmaWNhdGlvbm9wdGlvbnMpXG4gICAqIG9iamVjdCB0aGF0IGFsc28gaW5jbHVkZXMgdGhlIGB0aXRsZWAgb2YgdGhlIFtOb3RpZmljYXRpb25dW01vemlsbGEgTm90aWZpY2F0aW9uXSBvYmplY3QuXG4gICAqXG4gICAqIFtNb3ppbGxhIE5vdGlmaWNhdGlvbl06IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob3RpZmljYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IG5vdGlmaWNhdGlvbkNsaWNrczogT2JzZXJ2YWJsZTx7XG4gICAgYWN0aW9uOiBzdHJpbmc7IG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uT3B0aW9ucyAmXG4gICAgICAgIHtcbiAgICAgICAgICB0aXRsZTogc3RyaW5nXG4gICAgICAgIH1cbiAgfT47XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBjdXJyZW50bHkgYWN0aXZlXG4gICAqIFtQdXNoU3Vic2NyaXB0aW9uXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaFN1YnNjcmlwdGlvbilcbiAgICogYXNzb2NpYXRlZCB0byB0aGUgU2VydmljZSBXb3JrZXIgcmVnaXN0cmF0aW9uIG9yIGBudWxsYCBpZiB0aGVyZSBpcyBubyBzdWJzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBzdWJzY3JpcHRpb246IE9ic2VydmFibGU8UHVzaFN1YnNjcmlwdGlvbnxudWxsPjtcblxuICAvKipcbiAgICogVHJ1ZSBpZiB0aGUgU2VydmljZSBXb3JrZXIgaXMgZW5hYmxlZCAoc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIGFuZCBlbmFibGVkIHZpYVxuICAgKiBgU2VydmljZVdvcmtlck1vZHVsZWApLlxuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdy5pc0VuYWJsZWQ7XG4gIH1cblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBwdXNoTWFuYWdlciE6IE9ic2VydmFibGU8UHVzaE1hbmFnZXI+O1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbkNoYW5nZXMgPSBuZXcgU3ViamVjdDxQdXNoU3Vic2NyaXB0aW9ufG51bGw+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdzogTmdzd0NvbW1DaGFubmVsKSB7XG4gICAgaWYgKCFzdy5pc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSBORVZFUjtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9uQ2xpY2tzID0gTkVWRVI7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IE5FVkVSO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxQdXNoRXZlbnQ+KCdQVVNIJykucGlwZShtYXAobWVzc2FnZSA9PiBtZXNzYWdlLmRhdGEpKTtcblxuICAgIHRoaXMubm90aWZpY2F0aW9uQ2xpY2tzID1cbiAgICAgICAgdGhpcy5zdy5ldmVudHNPZlR5cGUoJ05PVElGSUNBVElPTl9DTElDSycpLnBpcGUobWFwKChtZXNzYWdlOiBhbnkpID0+IG1lc3NhZ2UuZGF0YSkpO1xuXG4gICAgdGhpcy5wdXNoTWFuYWdlciA9IHRoaXMuc3cucmVnaXN0cmF0aW9uLnBpcGUobWFwKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIpKTtcblxuICAgIGNvbnN0IHdvcmtlckRyaXZlblN1YnNjcmlwdGlvbnMgPSB0aGlzLnB1c2hNYW5hZ2VyLnBpcGUoc3dpdGNoTWFwKHBtID0+IHBtLmdldFN1YnNjcmlwdGlvbigpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBtZXJnZSh3b3JrZXJEcml2ZW5TdWJzY3JpcHRpb25zLCB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gV2ViIFB1c2ggTm90aWZpY2F0aW9ucyxcbiAgICogYWZ0ZXIgcmVxdWVzdGluZyBhbmQgcmVjZWl2aW5nIHVzZXIgcGVybWlzc2lvbi5cbiAgICpcbiAgICogQHBhcmFtIG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGBzZXJ2ZXJQdWJsaWNLZXlgIHN0cmluZy5cbiAgICogQHJldHVybnMgQSBQcm9taXNlIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIG5ldyBzdWJzY3JpcHRpb24gb2JqZWN0LlxuICAgKi9cbiAgcmVxdWVzdFN1YnNjcmlwdGlvbihvcHRpb25zOiB7c2VydmVyUHVibGljS2V5OiBzdHJpbmd9KTogUHJvbWlzZTxQdXNoU3Vic2NyaXB0aW9uPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBwdXNoT3B0aW9uczogUHVzaFN1YnNjcmlwdGlvbk9wdGlvbnNJbml0ID0ge3VzZXJWaXNpYmxlT25seTogdHJ1ZX07XG4gICAgbGV0IGtleSA9IHRoaXMuZGVjb2RlQmFzZTY0KG9wdGlvbnMuc2VydmVyUHVibGljS2V5LnJlcGxhY2UoL18vZywgJy8nKS5yZXBsYWNlKC8tL2csICcrJykpO1xuICAgIGxldCBhcHBsaWNhdGlvblNlcnZlcktleSA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihrZXkubGVuZ3RoKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFwcGxpY2F0aW9uU2VydmVyS2V5W2ldID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHB1c2hPcHRpb25zLmFwcGxpY2F0aW9uU2VydmVyS2V5ID0gYXBwbGljYXRpb25TZXJ2ZXJLZXk7XG5cbiAgICByZXR1cm4gdGhpcy5wdXNoTWFuYWdlci5waXBlKHN3aXRjaE1hcChwbSA9PiBwbS5zdWJzY3JpYmUocHVzaE9wdGlvbnMpKSwgdGFrZSgxKSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKHN1YiA9PiB7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzLm5leHQoc3ViKTtcbiAgICAgICAgICByZXR1cm4gc3ViO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZXMgZnJvbSBTZXJ2aWNlIFdvcmtlciBwdXNoIG5vdGlmaWNhdGlvbnMuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgUHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdoZW4gdGhlIG9wZXJhdGlvbiBzdWNjZWVkcywgb3IgaXMgcmVqZWN0ZWQgaWYgdGhlcmUgaXMgbm9cbiAgICogICAgICAgICAgYWN0aXZlIHN1YnNjcmlwdGlvbiBvciB0aGUgdW5zdWJzY3JpYmUgb3BlcmF0aW9uIGZhaWxzLlxuICAgKi9cbiAgdW5zdWJzY3JpYmUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cblxuICAgIGNvbnN0IGRvVW5zdWJzY3JpYmUgPSAoc3ViOiBQdXNoU3Vic2NyaXB0aW9ufG51bGwpID0+IHtcbiAgICAgIGlmIChzdWIgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3Qgc3Vic2NyaWJlZCB0byBwdXNoIG5vdGlmaWNhdGlvbnMuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdWIudW5zdWJzY3JpYmUoKS50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3Vic2NyaWJlIGZhaWxlZCEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcy5uZXh0KG51bGwpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbi5waXBlKHRha2UoMSksIHN3aXRjaE1hcChkb1Vuc3Vic2NyaWJlKSkudG9Qcm9taXNlKCk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUJhc2U2NChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYXRvYihpbnB1dCk7XG4gIH1cbn1cbiJdfQ==