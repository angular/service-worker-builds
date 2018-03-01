/**
 * @license Angular v6.0.0-beta.6-b8fe121
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */
import { isPlatformBrowser } from '@angular/common';
import { APP_INITIALIZER, ApplicationRef, Inject, Injectable, InjectionToken, Injector, NgModule, PLATFORM_ID } from '@angular/core';
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
import { never } from 'rxjs/observable/never';

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
const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
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
     * @param {?} platformId
     */
    constructor(serviceWorker, platformId) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker || !isPlatformBrowser(platformId)) {
            this.serviceWorker = undefined;
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
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
    /**
     * @return {?}
     */
    get isEnabled() { return !!this.serviceWorker; }
}
/** @nocollapse */
NgswCommChannel.ctorParameters = () => [
    null,
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
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
        if (!sw.isEnabled) {
            this.messages = never();
            this.subscription = never();
            return;
        }
        this.messages =
            map.call(this.sw.eventsOfType('PUSH'), (message) => message.data);
        this.pushManager = /** @type {?} */ ((map.call(this.sw.registration, (registration) => { return registration.pushManager; })));
        const /** @type {?} */ workerDrivenSubscriptions = /** @type {?} */ ((switchMap.call(this.pushManager, (pm) => pm.getSubscription().then(sub => { return sub; }))));
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
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
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
        if (!sw.isEnabled) {
            this.available = never();
            this.activated = never();
            return;
        }
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
    }
    /**
     * Returns true if the Service Worker is enabled (supported by the browser and enabled via
     * ServiceWorkerModule).
     * @return {?}
     */
    get isEnabled() { return this.sw.isEnabled; }
    /**
     * @return {?}
     */
    checkForUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const /** @type {?} */ statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce }, statusNonce);
    }
    /**
     * @return {?}
     */
    activateUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
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
/**
 * @abstract
 */
class RegistrationOptions {
}
const SCRIPT = new InjectionToken('NGSW_REGISTER_SCRIPT');
/**
 * @param {?} injector
 * @param {?} script
 * @param {?} options
 * @param {?} platformId
 * @return {?}
 */
function ngswAppInitializer(injector, script, options, platformId) {
    const /** @type {?} */ initializer = () => {
        const /** @type {?} */ app = injector.get(ApplicationRef);
        if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        const /** @type {?} */ onStable = /** @type {?} */ (filter.call(app.isStable, (stable) => !!stable));
        const /** @type {?} */ isStable = /** @type {?} */ (take.call(onStable, 1));
        const /** @type {?} */ whenStable = /** @type {?} */ (toPromise.call(isStable));
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }
        });
        // Don't return the Promise, as that will block the application until the SW is registered, and
        // cause a crash if the SW registration fails.
        whenStable.then(() => navigator.serviceWorker.register(script, { scope: options.scope }));
    };
    return initializer;
}
/**
 * @param {?} opts
 * @param {?} platformId
 * @return {?}
 */
function ngswCommChannelFactory(opts, platformId) {
    return new NgswCommChannel(opts.enabled !== false ? navigator.serviceWorker : undefined, platformId);
}
/**
 * \@experimental
 */
class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     * @param {?} script
     * @param {?=} opts
     * @return {?}
     */
    static register(script, opts = {}) {
        return {
            ngModule: ServiceWorkerModule,
            providers: [
                { provide: SCRIPT, useValue: script },
                { provide: RegistrationOptions, useValue: opts },
                {
                    provide: NgswCommChannel,
                    useFactory: ngswCommChannelFactory,
                    deps: [RegistrationOptions, PLATFORM_ID]
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: ngswAppInitializer,
                    deps: [Injector, SCRIPT, RegistrationOptions, PLATFORM_ID],
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

export { ServiceWorkerModule, SwPush, SwUpdate, NgswCommChannel as ɵe, RegistrationOptions as ɵa, SCRIPT as ɵb, ngswAppInitializer as ɵc, ngswCommChannelFactory as ɵd };
//# sourceMappingURL=service-worker.js.map
