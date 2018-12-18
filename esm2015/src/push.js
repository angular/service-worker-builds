/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { NEVER, Subject, merge } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * \@publicApi
 */
export class SwPush {
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
        this.messages = this.sw.eventsOfType('PUSH').pipe(map(message => message.data));
        this.notificationClicks =
            this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(map((message) => message.data));
        this.pushManager = this.sw.registration.pipe(map(registration => registration.pushManager));
        /** @type {?} */
        const workerDrivenSubscriptions = this.pushManager.pipe(switchMap(pm => pm.getSubscription()));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     * @return {?}
     */
    get isEnabled() { return this.sw.isEnabled; }
    /**
     * @param {?} options
     * @return {?}
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
        return this.pushManager.pipe(switchMap(pm => pm.subscribe(pushOptions)), take(1))
            .toPromise()
            .then(sub => {
            this.subscriptionChanges.next(sub);
            return sub;
        });
    }
    /**
     * @return {?}
     */
    unsubscribe() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
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
    /**
     * @param {?} input
     * @return {?}
     */
    decodeBase64(input) { return atob(input); }
}
SwPush.decorators = [
    { type: Injectable }
];
/** @nocollapse */
SwPush.ctorParameters = () => [
    { type: NgswCommChannel }
];
if (false) {
    /**
     * Emits the payloads of the received push notification messages.
     * @type {?}
     */
    SwPush.prototype.messages;
    /**
     * Emits the payloads of the received push notification messages as well as the action the user
     * interacted with. If no action was used the action property will be an empty string `''`.
     *
     * Note that the `notification` property is **not** a [Notification][Mozilla Notification] object
     * but rather a
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
    /** @type {?} */
    SwPush.prototype.pushManager;
    /** @type {?} */
    SwPush.prototype.subscriptionChanges;
    /** @type {?} */
    SwPush.prototype.sw;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsS0FBSyxFQUFjLE9BQU8sRUFBRSxLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDdkQsT0FBTyxFQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEQsT0FBTyxFQUFDLG9CQUFvQixFQUFFLGVBQWUsRUFBWSxNQUFNLGFBQWEsQ0FBQzs7Ozs7O0FBUzdFLE1BQU0sT0FBTyxNQUFNOzs7O0lBd0NqQixZQUFvQixFQUFtQjtRQUFuQixPQUFFLEdBQUYsRUFBRSxDQUFpQjtRQUYvQix3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBeUIsQ0FBQztRQUdqRSxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1lBQzFCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQVksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRTNGLElBQUksQ0FBQyxrQkFBa0I7WUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBWSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMs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QUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9FLENBQUM7Ozs7O0lBRU8sWUFBWSxDQUFDLEtBQWEsSUFBWSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7OztZQXRHcEUsVUFBVTs7OztZQVJtQixlQUFlOzs7Ozs7O0lBYTNDLDBCQUFzQzs7Ozs7Ozs7Ozs7OztJQWF0QyxvQ0FJRzs7Ozs7OztJQU9ILDhCQUF5RDs7SUFTekQsNkJBQStDOztJQUMvQyxxQ0FBbUU7O0lBRXZELG9CQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkVWRVIsIE9ic2VydmFibGUsIFN1YmplY3QsIG1lcmdlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsLCBQdXNoRXZlbnR9IGZyb20gJy4vbG93X2xldmVsJztcblxuXG4vKipcbiAqIFN1YnNjcmliZSBhbmQgbGlzdGVuIHRvIHB1c2ggbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBTZXJ2aWNlIFdvcmtlci5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTd1B1c2gge1xuICAvKipcbiAgICogRW1pdHMgdGhlIHBheWxvYWRzIG9mIHRoZSByZWNlaXZlZCBwdXNoIG5vdGlmaWNhdGlvbiBtZXNzYWdlcy5cbiAgICovXG4gIHJlYWRvbmx5IG1lc3NhZ2VzOiBPYnNlcnZhYmxlPG9iamVjdD47XG5cbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBwYXlsb2FkcyBvZiB0aGUgcmVjZWl2ZWQgcHVzaCBub3RpZmljYXRpb24gbWVzc2FnZXMgYXMgd2VsbCBhcyB0aGUgYWN0aW9uIHRoZSB1c2VyXG4gICAqIGludGVyYWN0ZWQgd2l0aC4gSWYgbm8gYWN0aW9uIHdhcyB1c2VkIHRoZSBhY3Rpb24gcHJvcGVydHkgd2lsbCBiZSBhbiBlbXB0eSBzdHJpbmcgYCcnYC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBgbm90aWZpY2F0aW9uYCBwcm9wZXJ0eSBpcyAqKm5vdCoqIGEgW05vdGlmaWNhdGlvbl1bTW96aWxsYSBOb3RpZmljYXRpb25dIG9iamVjdFxuICAgKiBidXQgcmF0aGVyIGFcbiAgICogW05vdGlmaWNhdGlvbk9wdGlvbnNdKGh0dHBzOi8vbm90aWZpY2F0aW9ucy5zcGVjLndoYXR3Zy5vcmcvI2RpY3RkZWYtbm90aWZpY2F0aW9ub3B0aW9ucylcbiAgICogb2JqZWN0IHRoYXQgYWxzbyBpbmNsdWRlcyB0aGUgYHRpdGxlYCBvZiB0aGUgW05vdGlmaWNhdGlvbl1bTW96aWxsYSBOb3RpZmljYXRpb25dIG9iamVjdC5cbiAgICpcbiAgICogW01vemlsbGEgTm90aWZpY2F0aW9uXTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vdGlmaWNhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgbm90aWZpY2F0aW9uQ2xpY2tzOiBPYnNlcnZhYmxlIDwge1xuICAgIGFjdGlvbjogc3RyaW5nO1xuICAgIG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uT3B0aW9ucyZ7IHRpdGxlOiBzdHJpbmcgfVxuICB9XG4gID4gO1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgY3VycmVudGx5IGFjdGl2ZVxuICAgKiBbUHVzaFN1YnNjcmlwdGlvbl0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1B1c2hTdWJzY3JpcHRpb24pXG4gICAqIGFzc29jaWF0ZWQgdG8gdGhlIFNlcnZpY2UgV29ya2VyIHJlZ2lzdHJhdGlvbiBvciBgbnVsbGAgaWYgdGhlcmUgaXMgbm8gc3Vic2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgc3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPFB1c2hTdWJzY3JpcHRpb258bnVsbD47XG5cbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIFNlcnZpY2UgV29ya2VyIGlzIGVuYWJsZWQgKHN1cHBvcnRlZCBieSB0aGUgYnJvd3NlciBhbmQgZW5hYmxlZCB2aWFcbiAgICogYFNlcnZpY2VXb3JrZXJNb2R1bGVgKS5cbiAgICovXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN3LmlzRW5hYmxlZDsgfVxuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIHB1c2hNYW5hZ2VyICE6IE9ic2VydmFibGU8UHVzaE1hbmFnZXI+O1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbkNoYW5nZXMgPSBuZXcgU3ViamVjdDxQdXNoU3Vic2NyaXB0aW9ufG51bGw+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzdzogTmdzd0NvbW1DaGFubmVsKSB7XG4gICAgaWYgKCFzdy5pc0VuYWJsZWQpIHtcbiAgICAgIHRoaXMubWVzc2FnZXMgPSBORVZFUjtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9uQ2xpY2tzID0gTkVWRVI7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IE5FVkVSO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMubWVzc2FnZXMgPSB0aGlzLnN3LmV2ZW50c09mVHlwZTxQdXNoRXZlbnQ+KCdQVVNIJykucGlwZShtYXAobWVzc2FnZSA9PiBtZXNzYWdlLmRhdGEpKTtcblxuICAgIHRoaXMubm90aWZpY2F0aW9uQ2xpY2tzID1cbiAgICAgICAgdGhpcy5zdy5ldmVudHNPZlR5cGUoJ05PVElGSUNBVElPTl9DTElDSycpLnBpcGUobWFwKChtZXNzYWdlOiBhbnkpID0+IG1lc3NhZ2UuZGF0YSkpO1xuXG4gICAgdGhpcy5wdXNoTWFuYWdlciA9IHRoaXMuc3cucmVnaXN0cmF0aW9uLnBpcGUobWFwKHJlZ2lzdHJhdGlvbiA9PiByZWdpc3RyYXRpb24ucHVzaE1hbmFnZXIpKTtcblxuICAgIGNvbnN0IHdvcmtlckRyaXZlblN1YnNjcmlwdGlvbnMgPSB0aGlzLnB1c2hNYW5hZ2VyLnBpcGUoc3dpdGNoTWFwKHBtID0+IHBtLmdldFN1YnNjcmlwdGlvbigpKSk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSBtZXJnZSh3b3JrZXJEcml2ZW5TdWJzY3JpcHRpb25zLCB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMpO1xuICB9XG5cbiAgcmVxdWVzdFN1YnNjcmlwdGlvbihvcHRpb25zOiB7c2VydmVyUHVibGljS2V5OiBzdHJpbmd9KTogUHJvbWlzZTxQdXNoU3Vic2NyaXB0aW9uPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBwdXNoT3B0aW9uczogUHVzaFN1YnNjcmlwdGlvbk9wdGlvbnNJbml0ID0ge3VzZXJWaXNpYmxlT25seTogdHJ1ZX07XG4gICAgbGV0IGtleSA9IHRoaXMuZGVjb2RlQmFzZTY0KG9wdGlvbnMuc2VydmVyUHVibGljS2V5LnJlcGxhY2UoL18vZywgJy8nKS5yZXBsYWNlKC8tL2csICcrJykpO1xuICAgIGxldCBhcHBsaWNhdGlvblNlcnZlcktleSA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihrZXkubGVuZ3RoKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFwcGxpY2F0aW9uU2VydmVyS2V5W2ldID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHB1c2hPcHRpb25zLmFwcGxpY2F0aW9uU2VydmVyS2V5ID0gYXBwbGljYXRpb25TZXJ2ZXJLZXk7XG5cbiAgICByZXR1cm4gdGhpcy5wdXNoTWFuYWdlci5waXBlKHN3aXRjaE1hcChwbSA9PiBwbS5zdWJzY3JpYmUocHVzaE9wdGlvbnMpKSwgdGFrZSgxKSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKHN1YiA9PiB7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzLm5leHQoc3ViKTtcbiAgICAgICAgICByZXR1cm4gc3ViO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG5cbiAgICBjb25zdCBkb1Vuc3Vic2NyaWJlID0gKHN1YjogUHVzaFN1YnNjcmlwdGlvbiB8IG51bGwpID0+IHtcbiAgICAgIGlmIChzdWIgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3Qgc3Vic2NyaWJlZCB0byBwdXNoIG5vdGlmaWNhdGlvbnMuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdWIudW5zdWJzY3JpYmUoKS50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3Vic2NyaWJlIGZhaWxlZCEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcy5uZXh0KG51bGwpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbi5waXBlKHRha2UoMSksIHN3aXRjaE1hcChkb1Vuc3Vic2NyaWJlKSkudG9Qcm9taXNlKCk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUJhc2U2NChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIGF0b2IoaW5wdXQpOyB9XG59XG4iXX0=