/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/push.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
 * \@usageNotes
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
 * \@publicApi
 */
let SwPush = /** @class */ (() => {
    /**
     * Subscribe and listen to
     * [Web Push
     * Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices) through
     * Angular Service Worker.
     *
     * \@usageNotes
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
     * \@publicApi
     */
    class SwPush {
        /**
         * @param {?} sw
         */
        constructor(sw) {
            this.sw = sw;
            this.subscriptionChanges = new Subject();
            if (!sw.isEnabled) {
                this.messages = NEVER;
                this.notificationClicks = NEVER;
                this.subscription = NEVER;
                return;
            }
            this.messages = this.sw.eventsOfType('PUSH').pipe(map((/**
             * @param {?} message
             * @return {?}
             */
            message => message.data)));
            this.notificationClicks =
                this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(map((/**
                 * @param {?} message
                 * @return {?}
                 */
                (message) => message.data)));
            this.pushManager = this.sw.registration.pipe(map((/**
             * @param {?} registration
             * @return {?}
             */
            registration => registration.pushManager)));
            /** @type {?} */
            const workerDrivenSubscriptions = this.pushManager.pipe(switchMap((/**
             * @param {?} pm
             * @return {?}
             */
            pm => pm.getSubscription())));
            this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
        }
        /**
         * True if the Service Worker is enabled (supported by the browser and enabled via
         * `ServiceWorkerModule`).
         * @return {?}
         */
        get isEnabled() {
            return this.sw.isEnabled;
        }
        /**
         * Subscribes to Web Push Notifications,
         * after requesting and receiving user permission.
         *
         * @param {?} options An object containing the `serverPublicKey` string.
         * @return {?} A Promise that resolves to the new subscription object.
         */
        requestSubscription(options) {
            if (!this.sw.isEnabled) {
                return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
            }
            /** @type {?} */
            const pushOptions = { userVisibleOnly: true };
            /** @type {?} */
            let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
            /** @type {?} */
            let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
            for (let i = 0; i < key.length; i++) {
                applicationServerKey[i] = key.charCodeAt(i);
            }
            pushOptions.applicationServerKey = applicationServerKey;
            return this.pushManager.pipe(switchMap((/**
             * @param {?} pm
             * @return {?}
             */
            pm => pm.subscribe(pushOptions))), take(1))
                .toPromise()
                .then((/**
             * @param {?} sub
             * @return {?}
             */
            sub => {
                this.subscriptionChanges.next(sub);
                return sub;
            }));
        }
        /**
         * Unsubscribes from Service Worker push notifications.
         *
         * @return {?} A Promise that is resolved when the operation succeeds, or is rejected if there is no
         *          active subscription or the unsubscribe operation fails.
         */
        unsubscribe() {
            if (!this.sw.isEnabled) {
                return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
            }
            /** @type {?} */
            const doUnsubscribe = (/**
             * @param {?} sub
             * @return {?}
             */
            (sub) => {
                if (sub === null) {
                    throw new Error('Not subscribed to push notifications.');
                }
                return sub.unsubscribe().then((/**
                 * @param {?} success
                 * @return {?}
                 */
                success => {
                    if (!success) {
                        throw new Error('Unsubscribe failed!');
                    }
                    this.subscriptionChanges.next(null);
                }));
            });
            return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
        }
        /**
         * @private
         * @param {?} input
         * @return {?}
         */
        decodeBase64(input) {
            return atob(input);
        }
    }
    SwPush.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    SwPush.ctorParameters = () => [
        { type: NgswCommChannel }
    ];
    return SwPush;
})();
export { SwPush };
if (false) {
    /**
     * Emits the payloads of the received push notification messages.
     * @type {?}
     */
    SwPush.prototype.messages;
    /**
     * Emits the payloads of the received push notification messages as well as the action the user
     * interacted with. If no action was used the `action` property contains an empty string `''`.
     *
     * Note that the `notification` property does **not** contain a
     * [Notification][Mozilla Notification] object but rather a
     * [NotificationOptions](https://notifications.spec.whatwg.org/#dictdef-notificationoptions)
     * object that also includes the `title` of the [Notification][Mozilla Notification] object.
     *
     * [Mozilla Notification]: https://developer.mozilla.org/en-US/docs/Web/API/Notification
     * @type {?}
     */
    SwPush.prototype.notificationClicks;
    /**
     * Emits the currently active
     * [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
     * associated to the Service Worker registration or `null` if there is no subscription.
     * @type {?}
     */
    SwPush.prototype.subscription;
    /**
     * @type {?}
     * @private
     */
    SwPush.prototype.pushManager;
    /**
     * @type {?}
     * @private
     */
    SwPush.prototype.subscriptionChanges;
    /**
     * @type {?}
     * @private
     */
    SwPush.prototype.sw;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxlQUFlLEVBQVksTUFBTSxhQUFhLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0U3RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFBQSxNQUNhLE1BQU07Ozs7UUEyQ2pCLFlBQW9CLEVBQW1CO1lBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1lBRi9CLHdCQUFtQixHQUFHLElBQUksT0FBTyxFQUF5QixDQUFDO1lBR2pFLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO2dCQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztnQkFDdEIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLEtBQUssQ0FBQztnQkFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7Z0JBQzFCLE9BQU87YUFDUjtZQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQVksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUc7Ozs7WUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBRTNGLElBQUksQ0FBQyxrQkFBa0I7Z0JBQ25CLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUc7Ozs7Z0JBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBRXpGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEdBQUc7Ozs7WUFBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUMsQ0FBQyxDQUFDOztrQkFFdEYseUJBQXlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUzs7OztZQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLGVBQWUsRUFBRSxFQUFDLENBQUM7WUFDOUYsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDakYsQ0FBQzs7Ozs7O1FBekJELElBQUksU0FBUztZQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFDM0IsQ0FBQzs7Ozs7Ozs7UUFnQ0QsbUJBQW1CLENBQUMsT0FBa0M7WUFDcEQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO2dCQUN0QixPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2FBQ3hEOztrQkFDSyxXQUFXLEdBQWdDLEVBQUMsZUFBZSxFQUFFLElBQUksRUFBQzs7Z0JBQ3BFLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztnQkFDdEYsb0JBQW9CLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdDO1lBQ0QsV0FBVyxDQUFDLG9CQUFvQixHQUFHLG9CQUFvQixDQUFDO1lBRXhELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUzs7OztZQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDNUUsU0FBUyxFQUFFO2lCQUNYLElBQUk7Ozs7WUFBQyxHQUFHLENBQUMsRUFBRTtnQkFDVixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLEdBQUcsQ0FBQztZQUNiLENBQUMsRUFBQyxDQUFDO1FBQ1QsQ0FBQzs7Ozs7OztRQVFELFdBQVc7WUFDVCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7Z0JBQ3RCLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7YUFDeEQ7O2tCQUVLLGFBQWE7Ozs7WUFBRyxDQUFDLEdBQTBCLEVBQUUsRUFBRTtnQkFDbkQsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO29CQUNoQixNQUFNLElBQUksS0FBSyxDQUFDLHVDQUF1QyxDQUFDLENBQUM7aUJBQzFEO2dCQUVELE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUk7Ozs7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ3RDLElBQUksQ0FBQyxPQUFPLEVBQUU7d0JBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO3FCQUN4QztvQkFFRCxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN0QyxDQUFDLEVBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQTtZQUVELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQy9FLENBQUM7Ozs7OztRQUVPLFlBQVksQ0FBQyxLQUFhO1lBQ2hDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLENBQUM7OztnQkF4SEYsVUFBVTs7OztnQkEvRW1CLGVBQWU7O0lBd003QyxhQUFDO0tBQUE7U0F4SFksTUFBTTs7Ozs7O0lBSWpCLDBCQUFzQzs7Ozs7Ozs7Ozs7OztJQWF0QyxvQ0FLRzs7Ozs7OztJQU9ILDhCQUF5RDs7Ozs7SUFXekQsNkJBQThDOzs7OztJQUM5QyxxQ0FBbUU7Ozs7O0lBRXZELG9CQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7bWVyZ2UsIE5FVkVSLCBPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsLCBQdXNoRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuXG4vKipcbiAqIFN1YnNjcmliZSBhbmQgbGlzdGVuIHRvXG4gKiBbV2ViIFB1c2hcbiAqIE5vdGlmaWNhdGlvbnNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoX0FQSS9CZXN0X1ByYWN0aWNlcykgdGhyb3VnaFxuICogQW5ndWxhciBTZXJ2aWNlIFdvcmtlci5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIFlvdSBjYW4gaW5qZWN0IGEgYFN3UHVzaGAgaW5zdGFuY2UgaW50byBhbnkgY29tcG9uZW50IG9yIHNlcnZpY2VcbiAqIGFzIGEgZGVwZW5kZW5jeS5cbiAqXG4gKiA8Y29kZS1leGFtcGxlIHBhdGg9XCJzZXJ2aWNlLXdvcmtlci9wdXNoL21vZHVsZS50c1wiIHJlZ2lvbj1cImluamVjdC1zdy1wdXNoXCJcbiAqIGhlYWRlcj1cImFwcC5jb21wb25lbnQudHNcIj48L2NvZGUtZXhhbXBsZT5cbiAqXG4gKiBUbyBzdWJzY3JpYmUsIGNhbGwgYFN3UHVzaC5yZXF1ZXN0U3Vic2NyaXB0aW9uKClgLCB3aGljaCBhc2tzIHRoZSB1c2VyIGZvciBwZXJtaXNzaW9uLlxuICogVGhlIGNhbGwgcmV0dXJucyBhIGBQcm9taXNlYCB3aXRoIGEgbmV3XG4gKiBbYFB1c2hTdWJzY3JpcHRpb25gXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaFN1YnNjcmlwdGlvbilcbiAqIGluc3RhbmNlLlxuICpcbiAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cInNlcnZpY2Utd29ya2VyL3B1c2gvbW9kdWxlLnRzXCIgcmVnaW9uPVwic3Vic2NyaWJlLXRvLXB1c2hcIlxuICogaGVhZGVyPVwiYXBwLmNvbXBvbmVudC50c1wiPjwvY29kZS1leGFtcGxlPlxuICpcbiAqIEEgcmVxdWVzdCBpcyByZWplY3RlZCBpZiB0aGUgdXNlciBkZW5pZXMgcGVybWlzc2lvbiwgb3IgaWYgdGhlIGJyb3dzZXJcbiAqIGJsb2NrcyBvciBkb2VzIG5vdCBzdXBwb3J0IHRoZSBQdXNoIEFQSSBvciBTZXJ2aWNlV29ya2Vycy5cbiAqIENoZWNrIGBTd1B1c2guaXNFbmFibGVkYCB0byBjb25maXJtIHN0YXR1cy5cbiAqXG4gKiBJbnZva2UgUHVzaCBOb3RpZmljYXRpb25zIGJ5IHB1c2hpbmcgYSBtZXNzYWdlIHdpdGggdGhlIGZvbGxvd2luZyBwYXlsb2FkLlxuICpcbiAqIGBgYHRzXG4gKiB7XG4gKiAgIFwibm90aWZpY2F0aW9uXCI6IHtcbiAqICAgICBcImFjdGlvbnNcIjogTm90aWZpY2F0aW9uQWN0aW9uW10sXG4gKiAgICAgXCJiYWRnZVwiOiBVU1ZTdHJpbmdcbiAqICAgICBcImJvZHlcIjogRE9NU3RyaW5nLFxuICogICAgIFwiZGF0YVwiOiBhbnksXG4gKiAgICAgXCJkaXJcIjogXCJhdXRvXCJ8XCJsdHJcInxcInJ0bFwiLFxuICogICAgIFwiaWNvblwiOiBVU1ZTdHJpbmcsXG4gKiAgICAgXCJpbWFnZVwiOiBVU1ZTdHJpbmcsXG4gKiAgICAgXCJsYW5nXCI6IERPTVN0cmluZyxcbiAqICAgICBcInJlbm90aWZ5XCI6IGJvb2xlYW4sXG4gKiAgICAgXCJyZXF1aXJlSW50ZXJhY3Rpb25cIjogYm9vbGVhbixcbiAqICAgICBcInNpbGVudFwiOiBib29sZWFuLFxuICogICAgIFwidGFnXCI6IERPTVN0cmluZyxcbiAqICAgICBcInRpbWVzdGFtcFwiOiBET01UaW1lU3RhbXAsXG4gKiAgICAgXCJ0aXRsZVwiOiBET01TdHJpbmcsXG4gKiAgICAgXCJ2aWJyYXRlXCI6IG51bWJlcltdXG4gKiAgIH1cbiAqIH1cbiAqIGBgYFxuICpcbiAqIE9ubHkgYHRpdGxlYCBpcyByZXF1aXJlZC4gU2VlIGBOb3RpZmljYXRpb25gXG4gKiBbaW5zdGFuY2VcbiAqIHByb3BlcnRpZXNdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob3RpZmljYXRpb24jSW5zdGFuY2VfcHJvcGVydGllcykuXG4gKlxuICogV2hpbGUgdGhlIHN1YnNjcmlwdGlvbiBpcyBhY3RpdmUsIFNlcnZpY2UgV29ya2VyIGxpc3RlbnMgZm9yXG4gKiBbUHVzaEV2ZW50XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUHVzaEV2ZW50KVxuICogb2NjdXJyZW5jZXMgYW5kIGNyZWF0ZXNcbiAqIFtOb3RpZmljYXRpb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob3RpZmljYXRpb24pXG4gKiBpbnN0YW5jZXMgaW4gcmVzcG9uc2UuXG4gKlxuICogVW5zdWJzY3JpYmUgdXNpbmcgYFN3UHVzaC51bnN1YnNjcmliZSgpYC5cbiAqXG4gKiBBbiBhcHBsaWNhdGlvbiBjYW4gc3Vic2NyaWJlIHRvIGBTd1B1c2gubm90aWZpY2F0aW9uQ2xpY2tzYCBvYnNlcnZhYmxlIHRvIGJlIG5vdGlmaWVkIHdoZW4gYSB1c2VyXG4gKiBjbGlja3Mgb24gYSBub3RpZmljYXRpb24uIEZvciBleGFtcGxlOlxuICpcbiAqIDxjb2RlLWV4YW1wbGUgcGF0aD1cInNlcnZpY2Utd29ya2VyL3B1c2gvbW9kdWxlLnRzXCIgcmVnaW9uPVwic3Vic2NyaWJlLXRvLW5vdGlmaWNhdGlvbi1jbGlja3NcIlxuICogaGVhZGVyPVwiYXBwLmNvbXBvbmVudC50c1wiPjwvY29kZS1leGFtcGxlPlxuICpcbiAqIEBzZWUgW1B1c2ggTm90aWZpY2F0aW9uc10oaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vd2ViL2Z1bmRhbWVudGFscy9jb2RlbGFicy9wdXNoLW5vdGlmaWNhdGlvbnMvKVxuICogQHNlZSBbQW5ndWxhciBQdXNoIE5vdGlmaWNhdGlvbnNdKGh0dHBzOi8vYmxvZy5hbmd1bGFyLXVuaXZlcnNpdHkuaW8vYW5ndWxhci1wdXNoLW5vdGlmaWNhdGlvbnMvKVxuICogQHNlZSBbTUROOiBQdXNoIEFQSV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hfQVBJKVxuICogQHNlZSBbTUROOiBOb3RpZmljYXRpb25zIEFQSV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vdGlmaWNhdGlvbnNfQVBJKVxuICogQHNlZSBbTUROOiBXZWIgUHVzaCBBUEkgTm90aWZpY2F0aW9ucyBiZXN0IHByYWN0aWNlc10oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hfQVBJL0Jlc3RfUHJhY3RpY2VzKVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFN3UHVzaCB7XG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgcGF5bG9hZHMgb2YgdGhlIHJlY2VpdmVkIHB1c2ggbm90aWZpY2F0aW9uIG1lc3NhZ2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZXM6IE9ic2VydmFibGU8b2JqZWN0PjtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIHBheWxvYWRzIG9mIHRoZSByZWNlaXZlZCBwdXNoIG5vdGlmaWNhdGlvbiBtZXNzYWdlcyBhcyB3ZWxsIGFzIHRoZSBhY3Rpb24gdGhlIHVzZXJcbiAgICogaW50ZXJhY3RlZCB3aXRoLiBJZiBubyBhY3Rpb24gd2FzIHVzZWQgdGhlIGBhY3Rpb25gIHByb3BlcnR5IGNvbnRhaW5zIGFuIGVtcHR5IHN0cmluZyBgJydgLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIGBub3RpZmljYXRpb25gIHByb3BlcnR5IGRvZXMgKipub3QqKiBjb250YWluIGFcbiAgICogW05vdGlmaWNhdGlvbl1bTW96aWxsYSBOb3RpZmljYXRpb25dIG9iamVjdCBidXQgcmF0aGVyIGFcbiAgICogW05vdGlmaWNhdGlvbk9wdGlvbnNdKGh0dHBzOi8vbm90aWZpY2F0aW9ucy5zcGVjLndoYXR3Zy5vcmcvI2RpY3RkZWYtbm90aWZpY2F0aW9ub3B0aW9ucylcbiAgICogb2JqZWN0IHRoYXQgYWxzbyBpbmNsdWRlcyB0aGUgYHRpdGxlYCBvZiB0aGUgW05vdGlmaWNhdGlvbl1bTW96aWxsYSBOb3RpZmljYXRpb25dIG9iamVjdC5cbiAgICpcbiAgICogW01vemlsbGEgTm90aWZpY2F0aW9uXTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vdGlmaWNhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgbm90aWZpY2F0aW9uQ2xpY2tzOiBPYnNlcnZhYmxlPHtcbiAgICBhY3Rpb246IHN0cmluZzsgbm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb25PcHRpb25zICZcbiAgICAgICAge1xuICAgICAgICAgIHRpdGxlOiBzdHJpbmdcbiAgICAgICAgfVxuICB9PjtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIGN1cnJlbnRseSBhY3RpdmVcbiAgICogW1B1c2hTdWJzY3JpcHRpb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoU3Vic2NyaXB0aW9uKVxuICAgKiBhc3NvY2lhdGVkIHRvIHRoZSBTZXJ2aWNlIFdvcmtlciByZWdpc3RyYXRpb24gb3IgYG51bGxgIGlmIHRoZXJlIGlzIG5vIHN1YnNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxQdXNoU3Vic2NyaXB0aW9ufG51bGw+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnN3LmlzRW5hYmxlZDtcbiAgfVxuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIHB1c2hNYW5hZ2VyITogT2JzZXJ2YWJsZTxQdXNoTWFuYWdlcj47XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uQ2hhbmdlcyA9IG5ldyBTdWJqZWN0PFB1c2hTdWJzY3JpcHRpb258bnVsbD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN3OiBOZ3N3Q29tbUNoYW5uZWwpIHtcbiAgICBpZiAoIXN3LmlzRW5hYmxlZCkge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IE5FVkVSO1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25DbGlja3MgPSBORVZFUjtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gTkVWRVI7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5tZXNzYWdlcyA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlPFB1c2hFdmVudD4oJ1BVU0gnKS5waXBlKG1hcChtZXNzYWdlID0+IG1lc3NhZ2UuZGF0YSkpO1xuXG4gICAgdGhpcy5ub3RpZmljYXRpb25DbGlja3MgPVxuICAgICAgICB0aGlzLnN3LmV2ZW50c09mVHlwZSgnTk9USUZJQ0FUSU9OX0NMSUNLJykucGlwZShtYXAoKG1lc3NhZ2U6IGFueSkgPT4gbWVzc2FnZS5kYXRhKSk7XG5cbiAgICB0aGlzLnB1c2hNYW5hZ2VyID0gdGhpcy5zdy5yZWdpc3RyYXRpb24ucGlwZShtYXAocmVnaXN0cmF0aW9uID0+IHJlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlcikpO1xuXG4gICAgY29uc3Qgd29ya2VyRHJpdmVuU3Vic2NyaXB0aW9ucyA9IHRoaXMucHVzaE1hbmFnZXIucGlwZShzd2l0Y2hNYXAocG0gPT4gcG0uZ2V0U3Vic2NyaXB0aW9uKCkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG1lcmdlKHdvcmtlckRyaXZlblN1YnNjcmlwdGlvbnMsIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcyk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBXZWIgUHVzaCBOb3RpZmljYXRpb25zLFxuICAgKiBhZnRlciByZXF1ZXN0aW5nIGFuZCByZWNlaXZpbmcgdXNlciBwZXJtaXNzaW9uLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9ucyBBbiBvYmplY3QgY29udGFpbmluZyB0aGUgYHNlcnZlclB1YmxpY0tleWAgc3RyaW5nLlxuICAgKiBAcmV0dXJucyBBIFByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0aGUgbmV3IHN1YnNjcmlwdGlvbiBvYmplY3QuXG4gICAqL1xuICByZXF1ZXN0U3Vic2NyaXB0aW9uKG9wdGlvbnM6IHtzZXJ2ZXJQdWJsaWNLZXk6IHN0cmluZ30pOiBQcm9taXNlPFB1c2hTdWJzY3JpcHRpb24+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuICAgIGNvbnN0IHB1c2hPcHRpb25zOiBQdXNoU3Vic2NyaXB0aW9uT3B0aW9uc0luaXQgPSB7dXNlclZpc2libGVPbmx5OiB0cnVlfTtcbiAgICBsZXQga2V5ID0gdGhpcy5kZWNvZGVCYXNlNjQob3B0aW9ucy5zZXJ2ZXJQdWJsaWNLZXkucmVwbGFjZSgvXy9nLCAnLycpLnJlcGxhY2UoLy0vZywgJysnKSk7XG4gICAgbGV0IGFwcGxpY2F0aW9uU2VydmVyS2V5ID0gbmV3IFVpbnQ4QXJyYXkobmV3IEFycmF5QnVmZmVyKGtleS5sZW5ndGgpKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleS5sZW5ndGg7IGkrKykge1xuICAgICAgYXBwbGljYXRpb25TZXJ2ZXJLZXlbaV0gPSBrZXkuY2hhckNvZGVBdChpKTtcbiAgICB9XG4gICAgcHVzaE9wdGlvbnMuYXBwbGljYXRpb25TZXJ2ZXJLZXkgPSBhcHBsaWNhdGlvblNlcnZlcktleTtcblxuICAgIHJldHVybiB0aGlzLnB1c2hNYW5hZ2VyLnBpcGUoc3dpdGNoTWFwKHBtID0+IHBtLnN1YnNjcmliZShwdXNoT3B0aW9ucykpLCB0YWtlKDEpKVxuICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgLnRoZW4oc3ViID0+IHtcbiAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMubmV4dChzdWIpO1xuICAgICAgICAgIHJldHVybiBzdWI7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVuc3Vic2NyaWJlcyBmcm9tIFNlcnZpY2UgV29ya2VyIHB1c2ggbm90aWZpY2F0aW9ucy5cbiAgICpcbiAgICogQHJldHVybnMgQSBQcm9taXNlIHRoYXQgaXMgcmVzb2x2ZWQgd2hlbiB0aGUgb3BlcmF0aW9uIHN1Y2NlZWRzLCBvciBpcyByZWplY3RlZCBpZiB0aGVyZSBpcyBub1xuICAgKiAgICAgICAgICBhY3RpdmUgc3Vic2NyaXB0aW9uIG9yIHRoZSB1bnN1YnNjcmliZSBvcGVyYXRpb24gZmFpbHMuXG4gICAqL1xuICB1bnN1YnNjcmliZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZG9VbnN1YnNjcmliZSA9IChzdWI6IFB1c2hTdWJzY3JpcHRpb258bnVsbCkgPT4ge1xuICAgICAgaWYgKHN1YiA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBzdWJzY3JpYmVkIHRvIHB1c2ggbm90aWZpY2F0aW9ucy4nKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHN1Yi51bnN1YnNjcmliZSgpLnRoZW4oc3VjY2VzcyA9PiB7XG4gICAgICAgIGlmICghc3VjY2Vzcykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdWJzY3JpYmUgZmFpbGVkIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzLm5leHQobnVsbCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMuc3Vic2NyaXB0aW9uLnBpcGUodGFrZSgxKSwgc3dpdGNoTWFwKGRvVW5zdWJzY3JpYmUpKS50b1Byb21pc2UoKTtcbiAgfVxuXG4gIHByaXZhdGUgZGVjb2RlQmFzZTY0KGlucHV0OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBhdG9iKGlucHV0KTtcbiAgfVxufVxuIl19