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
 * @experimental
 */
var SwPush = /** @class */ (function () {
    function SwPush(sw) {
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        if (!sw.isEnabled) {
            this.messages = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map(function (message) { return message.data; }));
        this.pushManager = this.sw.registration.pipe(map(function (registration) { return registration.pushManager; }));
        var workerDrivenSubscriptions = this.pushManager.pipe(switchMap(function (pm) { return pm.getSubscription().then(function (sub) { return sub; }); }));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    Object.defineProperty(SwPush.prototype, "isEnabled", {
        /**
         * Returns true if the Service Worker is enabled (supported by the browser and enabled via
         * ServiceWorkerModule).
         */
        get: function () { return this.sw.isEnabled; },
        enumerable: true,
        configurable: true
    });
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
    SwPush.prototype.decodeBase64 = function (input) { return atob(input); };
    SwPush.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    SwPush.ctorParameters = function () { return [
        { type: NgswCommChannel }
    ]; };
    return SwPush;
}());
export { SwPush };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBYyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxlQUFlLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFHbEU7Ozs7R0FJRztBQUNIO0lBVUUsZ0JBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBSC9CLHdCQUFtQixHQUN2QixJQUFJLE9BQU8sRUFBeUIsQ0FBQztRQUd2QyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxPQUFZLElBQUssT0FBQSxPQUFPLENBQUMsSUFBSSxFQUFaLENBQVksQ0FBQyxDQUFDLENBQUM7UUFFdkYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQ3hDLEdBQUcsQ0FBQyxVQUFDLFlBQXVDLElBQU8sT0FBTyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztR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QUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9FLENBQUM7SUFFTyw2QkFBWSxHQUFwQixVQUFxQixLQUFhLElBQVksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkExRXBFLFVBQVU7Ozs7Z0JBUm1CLGVBQWU7O0lBbUY3QyxhQUFDO0NBQUEsQUEzRUQsSUEyRUM7U0ExRVksTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkVWRVIsIE9ic2VydmFibGUsIFN1YmplY3QsIG1lcmdlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXAsIHRha2V9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtFUlJfU1dfTk9UX1NVUFBPUlRFRCwgTmdzd0NvbW1DaGFubmVsfSBmcm9tICcuL2xvd19sZXZlbCc7XG5cblxuLyoqXG4gKiBTdWJzY3JpYmUgYW5kIGxpc3RlbiB0byBwdXNoIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgU2VydmljZSBXb3JrZXIuXG4gKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dQdXNoIHtcbiAgcmVhZG9ubHkgbWVzc2FnZXM6IE9ic2VydmFibGU8b2JqZWN0PjtcbiAgcmVhZG9ubHkgc3Vic2NyaXB0aW9uOiBPYnNlcnZhYmxlPFB1c2hTdWJzY3JpcHRpb258bnVsbD47XG5cbiAgLy8gVE9ETyhpc3N1ZS8yNDU3MSk6IHJlbW92ZSAnIScuXG4gIHByaXZhdGUgcHVzaE1hbmFnZXIgITogT2JzZXJ2YWJsZTxQdXNoTWFuYWdlcj47XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uQ2hhbmdlczogU3ViamVjdDxQdXNoU3Vic2NyaXB0aW9ufG51bGw+ID1cbiAgICAgIG5ldyBTdWJqZWN0PFB1c2hTdWJzY3JpcHRpb258bnVsbD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHN3OiBOZ3N3Q29tbUNoYW5uZWwpIHtcbiAgICBpZiAoIXN3LmlzRW5hYmxlZCkge1xuICAgICAgdGhpcy5tZXNzYWdlcyA9IE5FVkVSO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlcyA9IHRoaXMuc3cuZXZlbnRzT2ZUeXBlKCdQVVNIJykucGlwZShtYXAoKG1lc3NhZ2U6IGFueSkgPT4gbWVzc2FnZS5kYXRhKSk7XG5cbiAgICB0aGlzLnB1c2hNYW5hZ2VyID0gdGhpcy5zdy5yZWdpc3RyYXRpb24ucGlwZShcbiAgICAgICAgbWFwKChyZWdpc3RyYXRpb246IFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24pID0+IHsgcmV0dXJuIHJlZ2lzdHJhdGlvbi5wdXNoTWFuYWdlcjsgfSkpO1xuXG4gICAgY29uc3Qgd29ya2VyRHJpdmVuU3Vic2NyaXB0aW9ucyA9IHRoaXMucHVzaE1hbmFnZXIucGlwZShcbiAgICAgICAgc3dpdGNoTWFwKChwbTogUHVzaE1hbmFnZXIpID0+IHBtLmdldFN1YnNjcmlwdGlvbigpLnRoZW4oc3ViID0+IHsgcmV0dXJuIHN1YjsgfSkpKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IG1lcmdlKHdvcmtlckRyaXZlblN1YnNjcmlwdGlvbnMsIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIFNlcnZpY2VXb3JrZXJNb2R1bGUpLlxuICAgKi9cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3cuaXNFbmFibGVkOyB9XG5cbiAgcmVxdWVzdFN1YnNjcmlwdGlvbihvcHRpb25zOiB7c2VydmVyUHVibGljS2V5OiBzdHJpbmd9KTogUHJvbWlzZTxQdXNoU3Vic2NyaXB0aW9uPiB7XG4gICAgaWYgKCF0aGlzLnN3LmlzRW5hYmxlZCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBFcnJvcihFUlJfU1dfTk9UX1NVUFBPUlRFRCkpO1xuICAgIH1cbiAgICBjb25zdCBwdXNoT3B0aW9uczogUHVzaFN1YnNjcmlwdGlvbk9wdGlvbnNJbml0ID0ge3VzZXJWaXNpYmxlT25seTogdHJ1ZX07XG4gICAgbGV0IGtleSA9IHRoaXMuZGVjb2RlQmFzZTY0KG9wdGlvbnMuc2VydmVyUHVibGljS2V5LnJlcGxhY2UoL18vZywgJy8nKS5yZXBsYWNlKC8tL2csICcrJykpO1xuICAgIGxldCBhcHBsaWNhdGlvblNlcnZlcktleSA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihrZXkubGVuZ3RoKSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFwcGxpY2F0aW9uU2VydmVyS2V5W2ldID0ga2V5LmNoYXJDb2RlQXQoaSk7XG4gICAgfVxuICAgIHB1c2hPcHRpb25zLmFwcGxpY2F0aW9uU2VydmVyS2V5ID0gYXBwbGljYXRpb25TZXJ2ZXJLZXk7XG5cbiAgICByZXR1cm4gdGhpcy5wdXNoTWFuYWdlci5waXBlKHN3aXRjaE1hcCgocG06IFB1c2hNYW5hZ2VyKSA9PiBwbS5zdWJzY3JpYmUocHVzaE9wdGlvbnMpKSwgdGFrZSgxKSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKHN1YiA9PiB7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzLm5leHQoc3ViKTtcbiAgICAgICAgICByZXR1cm4gc3ViO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG5cbiAgICBjb25zdCBkb1Vuc3Vic2NyaWJlID0gKHN1YjogUHVzaFN1YnNjcmlwdGlvbiB8IG51bGwpID0+IHtcbiAgICAgIGlmIChzdWIgPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3Qgc3Vic2NyaWJlZCB0byBwdXNoIG5vdGlmaWNhdGlvbnMuJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdWIudW5zdWJzY3JpYmUoKS50aGVuKHN1Y2Nlc3MgPT4ge1xuICAgICAgICBpZiAoIXN1Y2Nlc3MpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3Vic2NyaWJlIGZhaWxlZCEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcy5uZXh0KG51bGwpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiB0aGlzLnN1YnNjcmlwdGlvbi5waXBlKHRha2UoMSksIHN3aXRjaE1hcChkb1Vuc3Vic2NyaWJlKSkudG9Qcm9taXNlKCk7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUJhc2U2NChpbnB1dDogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIGF0b2IoaW5wdXQpOyB9XG59XG4iXX0=