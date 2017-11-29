/**
 * @license Angular v5.1.0-beta.2-8bb42df
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
import { APP_INITIALIZER, ApplicationRef, Injectable, InjectionToken, Injector, NgModule } from '@angular/core';
import { filter } from 'rxjs/operator/filter';
import { take } from 'rxjs/operator/take';
import { toPromise } from 'rxjs/operator/toPromise';
import { concat } from 'rxjs/observable/concat';
import { defer } from 'rxjs/observable/defer';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { _do } from 'rxjs/operator/do';
import { map } from 'rxjs/operator/map';
import { publish } from 'rxjs/operator/publish';
import { switchMap } from 'rxjs/operator/switchMap';
import { Subject } from 'rxjs/Subject';
import { merge } from 'rxjs/observable/merge';

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
const ERR_SW_NOT_SUPPORTED = 'Service workers are not supported by this browser';
/**
 * @record
 */

/**
 * \@experimental
 * @record
 */

/**
 * \@experimental
 * @record
 */

/**
 * @param {?} message
 * @return {?}
 */
function errorObservable(message) {
    return defer(() => _throw(new Error(message)));
}
/**
 * \@experimental
 */
class NgswCommChannel {
    /**
     * @param {?} serviceWorker
     */
    constructor(serviceWorker) {
        if (!serviceWorker) {
            this.worker = this.events = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            const /** @type {?} */ controllerChangeEvents = /** @type {?} */ ((fromEvent(serviceWorker, 'controllerchange')));
            const /** @type {?} */ controllerChanges = /** @type {?} */ ((map.call(controllerChangeEvents, () => serviceWorker.controller)));
            const /** @type {?} */ currentController = /** @type {?} */ ((defer(() => of(serviceWorker.controller))));
            const /** @type {?} */ controllerWithChanges = /** @type {?} */ ((concat(currentController, controllerChanges)));
            this.worker = /** @type {?} */ ((filter.call(controllerWithChanges, (c) => !!c)));
            this.registration = /** @type {?} */ ((switchMap.call(this.worker, () => serviceWorker.getRegistration())));
            const /** @type {?} */ rawEvents = fromEvent(serviceWorker, 'message');
            const /** @type {?} */ rawEventPayload = /** @type {?} */ ((map.call(rawEvents, (event) => event.data)));
            const /** @type {?} */ eventsUnconnected = /** @type {?} */ ((filter.call(rawEventPayload, (event) => !!event && !!(/** @type {?} */ (event))['type'])));
            const /** @type {?} */ events = /** @type {?} */ ((publish.call(eventsUnconnected)));
            this.events = events;
            events.connect();
        }
    }
    /**
     * \@internal
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    postMessage(action, payload) {
        const /** @type {?} */ worker = take.call(this.worker, 1);
        const /** @type {?} */ sideEffect = _do.call(worker, (sw) => {
            sw.postMessage(Object.assign({ action }, payload));
        });
        return /** @type {?} */ ((toPromise.call(sideEffect).then(() => undefined)));
    }
    /**
     * \@internal
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    postMessageWithStatus(type, payload, nonce) {
        const /** @type {?} */ waitForStatus = this.waitForStatus(nonce);
        const /** @type {?} */ postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(() => undefined);
    }
    /**
     * \@internal
     * @return {?}
     */
    generateNonce() { return Math.round(Math.random() * 10000000); }
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    eventsOfType(type) {
        return /** @type {?} */ ((filter.call(this.events, (event) => { return event.type === type; })));
    }
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    nextEventOfType(type) {
        return /** @type {?} */ ((take.call(this.eventsOfType(type), 1)));
    }
    /**
     * \@internal
     * @param {?} nonce
     * @return {?}
     */
    waitForStatus(nonce) {
        const /** @type {?} */ statusEventsWithNonce = /** @type {?} */ ((filter.call(this.eventsOfType('STATUS'), (event) => event.nonce === nonce)));
        const /** @type {?} */ singleStatusEvent = /** @type {?} */ ((take.call(statusEventsWithNonce, 1)));
        const /** @type {?} */ mapErrorAndValue = /** @type {?} */ ((map.call(singleStatusEvent, (event) => {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        })));
        return toPromise.call(mapErrorAndValue);
    }
}

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
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * \@experimental
 */
class SwPush {
    /**
     * @param {?} sw
     */
    constructor(sw) {
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        this.messages =
            map.call(this.sw.eventsOfType('PUSH'), (message) => message.data);
        this.pushManager = /** @type {?} */ ((map.call(this.sw.registration, (registration) => { return registration.pushManager; })));
        const /** @type {?} */ workerDrivenSubscriptions = /** @type {?} */ ((switchMap.call(this.pushManager, (pm) => pm.getSubscription().then(sub => { return sub; }))));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    /**
     * @param {?} options
     * @return {?}
     */
    requestSubscription(options) {
        const /** @type {?} */ pushOptions = { userVisibleOnly: true };
        let /** @type {?} */ key = atob(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        let /** @type {?} */ applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (let /** @type {?} */ i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        const /** @type {?} */ subscribe = /** @type {?} */ ((switchMap.call(this.pushManager, (pm) => pm.subscribe(pushOptions))));
        const /** @type {?} */ subscribeOnce = take.call(subscribe, 1);
        return (/** @type {?} */ (toPromise.call(subscribeOnce))).then(sub => {
            this.subscriptionChanges.next(sub);
            return sub;
        });
    }
    /**
     * @return {?}
     */
    unsubscribe() {
        const /** @type {?} */ unsubscribe = switchMap.call(this.subscription, (sub) => {
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
        });
        const /** @type {?} */ unsubscribeOnce = take.call(unsubscribe, 1);
        return /** @type {?} */ (toPromise.call(unsubscribeOnce));
    }
}
SwPush.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SwPush.ctorParameters = () => [
    { type: NgswCommChannel, },
];

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
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * \@experimental
 */
class SwUpdate {
    /**
     * @param {?} sw
     */
    constructor(sw) {
        this.sw = sw;
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
    }
    /**
     * @return {?}
     */
    checkForUpdate() {
        const /** @type {?} */ statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce }, statusNonce);
    }
    /**
     * @return {?}
     */
    activateUpdate() {
        const /** @type {?} */ statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce }, statusNonce);
    }
}
SwUpdate.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SwUpdate.ctorParameters = () => [
    { type: NgswCommChannel, },
];

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
const SCRIPT = new InjectionToken('NGSW_REGISTER_SCRIPT');
const OPTS = new InjectionToken('NGSW_REGISTER_OPTIONS');
/**
 * @param {?} injector
 * @param {?} script
 * @param {?} options
 * @return {?}
 */
function ngswAppInitializer(injector, script, options) {
    const /** @type {?} */ initializer = () => {
        const /** @type {?} */ app = injector.get(ApplicationRef);
        if (!('serviceWorker' in navigator)) {
            return;
        }
        const /** @type {?} */ onStable = /** @type {?} */ (filter.call(app.isStable, (stable) => !!stable));
        const /** @type {?} */ isStable = /** @type {?} */ (take.call(onStable, 1));
        const /** @type {?} */ whenStable = /** @type {?} */ (toPromise.call(isStable));
        // Don't return the Promise, as that will block the application until the SW is registered, and
        // cause a crash if the SW registration fails.
        whenStable.then(() => navigator.serviceWorker.register(script, options));
    };
    return initializer;
}
/**
 * @return {?}
 */
function ngswCommChannelFactory() {
    return new NgswCommChannel(navigator.serviceWorker);
}
/**
 * \@experimental
 */
class ServiceWorkerModule {
    /**
     * @param {?} script
     * @param {?=} opts
     * @return {?}
     */
    static register(script, opts = {}) {
        return {
            ngModule: ServiceWorkerModule,
            providers: [
                { provide: SCRIPT, useValue: script },
                { provide: OPTS, useValue: opts },
                { provide: NgswCommChannel, useFactory: ngswCommChannelFactory },
                {
                    provide: APP_INITIALIZER,
                    useFactory: ngswAppInitializer,
                    deps: [Injector, SCRIPT, OPTS],
                    multi: true,
                },
            ],
        };
    }
}
ServiceWorkerModule.decorators = [
    { type: NgModule, args: [{
                providers: [SwPush, SwUpdate],
            },] },
];
/** @nocollapse */
ServiceWorkerModule.ctorParameters = () => [];

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
/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/

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
/**
 * @module
 * @description
 * Entry point for all public APIs of this package.
 */

// This file only reexports content of the `src` folder. Keep it that way.

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { ServiceWorkerModule, SwPush, SwUpdate, NgswCommChannel as ɵe, OPTS as ɵb, SCRIPT as ɵa, ngswAppInitializer as ɵc, ngswCommChannelFactory as ɵd };
//# sourceMappingURL=service-worker.js.map
