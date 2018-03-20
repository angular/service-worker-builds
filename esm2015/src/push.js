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
import { NEVER, Subject, merge } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { ERR_SW_NOT_SUPPORTED, NgswCommChannel } from './low_level';
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * \@experimental
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
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map((message) => message.data));
        this.pushManager = this.sw.registration.pipe(map((registration) => { return registration.pushManager; }));
        const /** @type {?} */ workerDrivenSubscriptions = this.pushManager.pipe(switchMap((pm) => pm.getSubscription().then(sub => { return sub; })));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    /**
     * Returns true if the Service Worker is enabled (supported by the browser and enabled via
     * ServiceWorkerModule).
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
        const /** @type {?} */ pushOptions = { userVisibleOnly: true };
        let /** @type {?} */ key = atob(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        let /** @type {?} */ applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (let /** @type {?} */ i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return this.pushManager.pipe(switchMap((pm) => pm.subscribe(pushOptions)), take(1))
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
        const /** @type {?} */ unsubscribe = this.subscription.pipe(switchMap((sub) => {
            if (sub !== null) {
                return sub.unsubscribe().then(success => {
                    if (success) {
                        this.subscriptionChanges.next(null);
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
        }));
        return unsubscribe.pipe(take(1)).toPromise();
    }
}
SwPush.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SwPush.ctorParameters = () => [
    { type: NgswCommChannel, },
];
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