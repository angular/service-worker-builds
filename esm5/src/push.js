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
import * as i0 from "@angular/core";
import * as i1 from "./low_level";
/**
 * Subscribe and listen to push notifications from the Service Worker.
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
    SwPush.ngInjectableDef = i0.ΔdefineInjectable({ token: SwPush, factory: function SwPush_Factory(t) { return new (t || SwPush)(i0.Δinject(i1.NgswCommChannel)); }, providedIn: null });
    return SwPush;
}());
export { SwPush };
/*@__PURE__*/ i0.ɵsetClassMetadata(SwPush, [{
        type: Injectable
    }], function () { return [{ type: i1.NgswCommChannel }]; }, null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3NyYy9wdXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLEtBQUssRUFBYyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBELE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxlQUFlLEVBQVksTUFBTSxhQUFhLENBQUM7OztBQUc3RTs7OztHQUlHO0FBQ0g7SUF5Q0UsZ0JBQW9CLEVBQW1CO1FBQW5CLE9BQUUsR0FBRixFQUFFLENBQWlCO1FBRi9CLHdCQUFtQixHQUFHLElBQUksT0FBTyxFQUF5QixDQUFDO1FBR2pFLElBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7WUFDaEMsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFDMUIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBWSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUEsT0FBTyxJQUFJLE9BQUEsT0FBTyxDQUFDLElBQUksRUFBWixDQUFZLENBQUMsQ0FBQyxDQUFDO1FBRTNGLElBQUksQ0FBQyxrQkFBa0I7WUFDbkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsT0FB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Q0FBQztpQkFDeEM7Z0JBRUQsS0FBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQy9FLENBQUM7SUFFTyw2QkFBWSxHQUFwQixVQUFxQixLQUFhLElBQVksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDOzJEQXJHeEQsTUFBTSx5REFBTixNQUFNO2lCQXJCbkI7Q0EySEMsQUF2R0QsSUF1R0M7U0F0R1ksTUFBTTttQ0FBTixNQUFNO2NBRGxCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05FVkVSLCBPYnNlcnZhYmxlLCBTdWJqZWN0LCBtZXJnZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge21hcCwgc3dpdGNoTWFwLCB0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7RVJSX1NXX05PVF9TVVBQT1JURUQsIE5nc3dDb21tQ2hhbm5lbCwgUHVzaEV2ZW50fSBmcm9tICcuL2xvd19sZXZlbCc7XG5cblxuLyoqXG4gKiBTdWJzY3JpYmUgYW5kIGxpc3RlbiB0byBwdXNoIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgU2VydmljZSBXb3JrZXIuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3dQdXNoIHtcbiAgLyoqXG4gICAqIEVtaXRzIHRoZSBwYXlsb2FkcyBvZiB0aGUgcmVjZWl2ZWQgcHVzaCBub3RpZmljYXRpb24gbWVzc2FnZXMuXG4gICAqL1xuICByZWFkb25seSBtZXNzYWdlczogT2JzZXJ2YWJsZTxvYmplY3Q+O1xuXG4gIC8qKlxuICAgKiBFbWl0cyB0aGUgcGF5bG9hZHMgb2YgdGhlIHJlY2VpdmVkIHB1c2ggbm90aWZpY2F0aW9uIG1lc3NhZ2VzIGFzIHdlbGwgYXMgdGhlIGFjdGlvbiB0aGUgdXNlclxuICAgKiBpbnRlcmFjdGVkIHdpdGguIElmIG5vIGFjdGlvbiB3YXMgdXNlZCB0aGUgYWN0aW9uIHByb3BlcnR5IHdpbGwgYmUgYW4gZW1wdHkgc3RyaW5nIGAnJ2AuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgYG5vdGlmaWNhdGlvbmAgcHJvcGVydHkgaXMgKipub3QqKiBhIFtOb3RpZmljYXRpb25dW01vemlsbGEgTm90aWZpY2F0aW9uXSBvYmplY3RcbiAgICogYnV0IHJhdGhlciBhXG4gICAqIFtOb3RpZmljYXRpb25PcHRpb25zXShodHRwczovL25vdGlmaWNhdGlvbnMuc3BlYy53aGF0d2cub3JnLyNkaWN0ZGVmLW5vdGlmaWNhdGlvbm9wdGlvbnMpXG4gICAqIG9iamVjdCB0aGF0IGFsc28gaW5jbHVkZXMgdGhlIGB0aXRsZWAgb2YgdGhlIFtOb3RpZmljYXRpb25dW01vemlsbGEgTm90aWZpY2F0aW9uXSBvYmplY3QuXG4gICAqXG4gICAqIFtNb3ppbGxhIE5vdGlmaWNhdGlvbl06IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob3RpZmljYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IG5vdGlmaWNhdGlvbkNsaWNrczogT2JzZXJ2YWJsZSA8IHtcbiAgICBhY3Rpb246IHN0cmluZztcbiAgICBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbk9wdGlvbnMmeyB0aXRsZTogc3RyaW5nIH1cbiAgfVxuICA+IDtcblxuICAvKipcbiAgICogRW1pdHMgdGhlIGN1cnJlbnRseSBhY3RpdmVcbiAgICogW1B1c2hTdWJzY3JpcHRpb25dKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9QdXNoU3Vic2NyaXB0aW9uKVxuICAgKiBhc3NvY2lhdGVkIHRvIHRoZSBTZXJ2aWNlIFdvcmtlciByZWdpc3RyYXRpb24gb3IgYG51bGxgIGlmIHRoZXJlIGlzIG5vIHN1YnNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IHN1YnNjcmlwdGlvbjogT2JzZXJ2YWJsZTxQdXNoU3Vic2NyaXB0aW9ufG51bGw+O1xuXG4gIC8qKlxuICAgKiBUcnVlIGlmIHRoZSBTZXJ2aWNlIFdvcmtlciBpcyBlbmFibGVkIChzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgYW5kIGVuYWJsZWQgdmlhXG4gICAqIGBTZXJ2aWNlV29ya2VyTW9kdWxlYCkuXG4gICAqL1xuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdy5pc0VuYWJsZWQ7IH1cblxuICAvLyBUT0RPKGlzc3VlLzI0NTcxKTogcmVtb3ZlICchJy5cbiAgcHJpdmF0ZSBwdXNoTWFuYWdlciAhOiBPYnNlcnZhYmxlPFB1c2hNYW5hZ2VyPjtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25DaGFuZ2VzID0gbmV3IFN1YmplY3Q8UHVzaFN1YnNjcmlwdGlvbnxudWxsPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3c6IE5nc3dDb21tQ2hhbm5lbCkge1xuICAgIGlmICghc3cuaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLm1lc3NhZ2VzID0gTkVWRVI7XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbkNsaWNrcyA9IE5FVkVSO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBORVZFUjtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm1lc3NhZ2VzID0gdGhpcy5zdy5ldmVudHNPZlR5cGU8UHVzaEV2ZW50PignUFVTSCcpLnBpcGUobWFwKG1lc3NhZ2UgPT4gbWVzc2FnZS5kYXRhKSk7XG5cbiAgICB0aGlzLm5vdGlmaWNhdGlvbkNsaWNrcyA9XG4gICAgICAgIHRoaXMuc3cuZXZlbnRzT2ZUeXBlKCdOT1RJRklDQVRJT05fQ0xJQ0snKS5waXBlKG1hcCgobWVzc2FnZTogYW55KSA9PiBtZXNzYWdlLmRhdGEpKTtcblxuICAgIHRoaXMucHVzaE1hbmFnZXIgPSB0aGlzLnN3LnJlZ2lzdHJhdGlvbi5waXBlKG1hcChyZWdpc3RyYXRpb24gPT4gcmVnaXN0cmF0aW9uLnB1c2hNYW5hZ2VyKSk7XG5cbiAgICBjb25zdCB3b3JrZXJEcml2ZW5TdWJzY3JpcHRpb25zID0gdGhpcy5wdXNoTWFuYWdlci5waXBlKHN3aXRjaE1hcChwbSA9PiBwbS5nZXRTdWJzY3JpcHRpb24oKSkpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uID0gbWVyZ2Uod29ya2VyRHJpdmVuU3Vic2NyaXB0aW9ucywgdGhpcy5zdWJzY3JpcHRpb25DaGFuZ2VzKTtcbiAgfVxuXG4gIHJlcXVlc3RTdWJzY3JpcHRpb24ob3B0aW9uczoge3NlcnZlclB1YmxpY0tleTogc3RyaW5nfSk6IFByb21pc2U8UHVzaFN1YnNjcmlwdGlvbj4ge1xuICAgIGlmICghdGhpcy5zdy5pc0VuYWJsZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoRVJSX1NXX05PVF9TVVBQT1JURUQpKTtcbiAgICB9XG4gICAgY29uc3QgcHVzaE9wdGlvbnM6IFB1c2hTdWJzY3JpcHRpb25PcHRpb25zSW5pdCA9IHt1c2VyVmlzaWJsZU9ubHk6IHRydWV9O1xuICAgIGxldCBrZXkgPSB0aGlzLmRlY29kZUJhc2U2NChvcHRpb25zLnNlcnZlclB1YmxpY0tleS5yZXBsYWNlKC9fL2csICcvJykucmVwbGFjZSgvLS9nLCAnKycpKTtcbiAgICBsZXQgYXBwbGljYXRpb25TZXJ2ZXJLZXkgPSBuZXcgVWludDhBcnJheShuZXcgQXJyYXlCdWZmZXIoa2V5Lmxlbmd0aCkpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcHBsaWNhdGlvblNlcnZlcktleVtpXSA9IGtleS5jaGFyQ29kZUF0KGkpO1xuICAgIH1cbiAgICBwdXNoT3B0aW9ucy5hcHBsaWNhdGlvblNlcnZlcktleSA9IGFwcGxpY2F0aW9uU2VydmVyS2V5O1xuXG4gICAgcmV0dXJuIHRoaXMucHVzaE1hbmFnZXIucGlwZShzd2l0Y2hNYXAocG0gPT4gcG0uc3Vic2NyaWJlKHB1c2hPcHRpb25zKSksIHRha2UoMSkpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbihzdWIgPT4ge1xuICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uQ2hhbmdlcy5uZXh0KHN1Yik7XG4gICAgICAgICAgcmV0dXJuIHN1YjtcbiAgICAgICAgfSk7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIXRoaXMuc3cuaXNFbmFibGVkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKEVSUl9TV19OT1RfU1VQUE9SVEVEKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZG9VbnN1YnNjcmliZSA9IChzdWI6IFB1c2hTdWJzY3JpcHRpb24gfCBudWxsKSA9PiB7XG4gICAgICBpZiAoc3ViID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IHN1YnNjcmliZWQgdG8gcHVzaCBub3RpZmljYXRpb25zLicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gc3ViLnVuc3Vic2NyaWJlKCkudGhlbihzdWNjZXNzID0+IHtcbiAgICAgICAgaWYgKCFzdWNjZXNzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1YnNjcmliZSBmYWlsZWQhJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbkNoYW5nZXMubmV4dChudWxsKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4gdGhpcy5zdWJzY3JpcHRpb24ucGlwZSh0YWtlKDEpLCBzd2l0Y2hNYXAoZG9VbnN1YnNjcmliZSkpLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVCYXNlNjQoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7IHJldHVybiBhdG9iKGlucHV0KTsgfVxufVxuIl19