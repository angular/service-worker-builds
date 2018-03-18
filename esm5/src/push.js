/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { merge as obs_merge } from 'rxjs/observable/merge';
import { never as obs_never } from 'rxjs/observable/never';
import { map as op_map } from 'rxjs/operator/map';
import { switchMap as op_switchMap } from 'rxjs/operator/switchMap';
import { take as op_take } from 'rxjs/operator/take';
import { toPromise as op_toPromise } from 'rxjs/operator/toPromise';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * \@experimental
 */
var SwPush = /** @class */ (function () {
    function SwPush(sw) {
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        if (!sw.isEnabled) {
            this.messages = obs_never();
            this.subscription = obs_never();
            return;
        }
        this.messages =
            op_map.call(this.sw.eventsOfType('PUSH'), function (message) { return message.data; });
        this.pushManager = /** @type {?} */ ((op_map.call(this.sw.registration, function (registration) { return registration.pushManager; })));
        var /** @type {?} */ workerDrivenSubscriptions = /** @type {?} */ ((op_switchMap.call(this.pushManager, function (pm) { return pm.getSubscription().then(function (sub) { return sub; }); })));
        this.subscription = obs_merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    Object.defineProperty(SwPush.prototype, "isEnabled", {
        /**
         * Returns true if the Service Worker is enabled (supported by the browser and enabled via
         * ServiceWorkerModule).
         */
        get: /**
         * Returns true if the Service Worker is enabled (supported by the browser and enabled via
         * ServiceWorkerModule).
         * @return {?}
         */
        function () { return this.sw.isEnabled; },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @return {?}
     */
    SwPush.prototype.requestSubscription = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var /** @type {?} */ pushOptions = { userVisibleOnly: true };
        var /** @type {?} */ key = atob(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        var /** @type {?} */ applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (var /** @type {?} */ i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        var /** @type {?} */ subscribe = /** @type {?} */ ((op_switchMap.call(this.pushManager, function (pm) { return pm.subscribe(pushOptions); })));
        var /** @type {?} */ subscribeOnce = op_take.call(subscribe, 1);
        return (/** @type {?} */ (op_toPromise.call(subscribeOnce))).then(function (sub) {
            _this.subscriptionChanges.next(sub);
            return sub;
        });
    };
    /**
     * @return {?}
     */
    SwPush.prototype.unsubscribe = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var /** @type {?} */ unsubscribe = op_switchMap.call(this.subscription, function (sub) {
            if (sub !== null) {
                return sub.unsubscribe().then(function (success) {
                    if (success) {
                        _this.subscriptionChanges.next(null);
                        return undefined;
                    }
                    else {
                        throw new Error('Unsubscribe failed!');
                    }
                });
            }
            else {
                throw new Error('Not subscribed to push notifications.');
            }
        });
        var /** @type {?} */ unsubscribeOnce = op_take.call(unsubscribe, 1);
        return /** @type {?} */ (op_toPromise.call(unsubscribeOnce));
    };
    SwPush.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SwPush.ctorParameters = function () { return [
        { type: NgswCommChannel, },
    ]; };
    return SwPush;
}());
export { SwPush };
function SwPush_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    SwPush.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    SwPush.ctorParameters;
    /** @type {?} */
    SwPush.prototype.messages;
    /** @type {?} */
    SwPush.prototype.subscription;
    /** @type {?} */
    SwPush.prototype.pushManager;
    /** @type {?} */
    SwPush.prototype.subscriptionChanges;
    /** @type {?} */
    SwPush.prototype.sw;
}
//# sourceMappingURL=push.js.map