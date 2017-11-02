/**
 * @license Angular v5.1.0-beta.0-613a9e3
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
import { APP_INITIALIZER, ApplicationRef, Injectable, InjectionToken, Injector, NgModule } from '@angular/core';
import { filter } from 'rxjs/operator/filter';
import { take } from 'rxjs/operator/take';
import { toPromise } from 'rxjs/operator/toPromise';
import { __assign } from 'tslib';
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
var ERR_SW_NOT_SUPPORTED = 'Service workers are not supported by this browser';
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
    return defer(function () { return _throw(new Error(message)); });
}
/**
 * \@experimental
 */
var NgswCommChannel = (function () {
    function NgswCommChannel(serviceWorker) {
        if (!serviceWorker) {
            this.worker = this.events = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            var /** @type {?} */ controllerChangeEvents = /** @type {?} */ ((fromEvent(serviceWorker, 'controllerchange')));
            var /** @type {?} */ controllerChanges = /** @type {?} */ ((map.call(controllerChangeEvents, function () { return serviceWorker.controller; })));
            var /** @type {?} */ currentController = /** @type {?} */ ((defer(function () { return of(serviceWorker.controller); })));
            var /** @type {?} */ controllerWithChanges = /** @type {?} */ ((concat(currentController, controllerChanges)));
            this.worker = /** @type {?} */ ((filter.call(controllerWithChanges, function (c) { return !!c; })));
            this.registration = /** @type {?} */ ((switchMap.call(this.worker, function () { return serviceWorker.getRegistration(); })));
            var /** @type {?} */ rawEvents = fromEvent(serviceWorker, 'message');
            var /** @type {?} */ rawEventPayload = /** @type {?} */ ((map.call(rawEvents, function (event) { return event.data; })));
            var /** @type {?} */ eventsUnconnected = /** @type {?} */ ((filter.call(rawEventPayload, function (event) { return !!event && !!(/** @type {?} */ (event))['type']; })));
            var /** @type {?} */ events = /** @type {?} */ ((publish.call(eventsUnconnected)));
            this.events = events;
            events.connect();
        }
    }
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    NgswCommChannel.prototype.postMessage = /**
     * \@internal
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    function (action, payload) {
        var /** @type {?} */ worker = take.call(this.worker, 1);
        var /** @type {?} */ sideEffect = _do.call(worker, function (sw) {
            sw.postMessage(__assign({ action: action }, payload));
        });
        return /** @type {?} */ ((toPromise.call(sideEffect).then(function () { return undefined; })));
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    NgswCommChannel.prototype.postMessageWithStatus = /**
     * \@internal
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    function (type, payload, nonce) {
        var /** @type {?} */ waitForStatus = this.waitForStatus(nonce);
        var /** @type {?} */ postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @return {?}
     */
    NgswCommChannel.prototype.generateNonce = /**
     * \@internal
     * @return {?}
     */
    function () { return Math.round(Math.random() * 10000000); };
    /**
     * @internal
     */
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    NgswCommChannel.prototype.eventsOfType = /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    function (type) {
        return /** @type {?} */ ((filter.call(this.events, function (event) { return event.type === type; })));
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    NgswCommChannel.prototype.nextEventOfType = /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    function (type) {
        return /** @type {?} */ ((take.call(this.eventsOfType(type), 1)));
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} nonce
     * @return {?}
     */
    NgswCommChannel.prototype.waitForStatus = /**
     * \@internal
     * @param {?} nonce
     * @return {?}
     */
    function (nonce) {
        var /** @type {?} */ statusEventsWithNonce = /** @type {?} */ ((filter.call(this.eventsOfType('STATUS'), function (event) { return event.nonce === nonce; })));
        var /** @type {?} */ singleStatusEvent = /** @type {?} */ ((take.call(statusEventsWithNonce, 1)));
        var /** @type {?} */ mapErrorAndValue = /** @type {?} */ ((map.call(singleStatusEvent, function (event) {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        })));
        return toPromise.call(mapErrorAndValue);
    };
    return NgswCommChannel;
}());

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
var SwPush = (function () {
    function SwPush(sw) {
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        this.messages =
            map.call(this.sw.eventsOfType('PUSH'), function (message) { return message.data; });
        this.pushManager = /** @type {?} */ ((map.call(this.sw.registration, function (registration) { return registration.pushManager; })));
        var /** @type {?} */ workerDrivenSubscriptions = /** @type {?} */ ((switchMap.call(this.pushManager, function (pm) { return pm.getSubscription().then(function (sub) { return sub; }); })));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
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
        var /** @type {?} */ pushOptions = { userVisibleOnly: true };
        var /** @type {?} */ key = atob(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        var /** @type {?} */ applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (var /** @type {?} */ i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        var /** @type {?} */ subscribe = /** @type {?} */ ((switchMap.call(this.pushManager, function (pm) { return pm.subscribe(pushOptions); })));
        var /** @type {?} */ subscribeOnce = take.call(subscribe, 1);
        return (/** @type {?} */ (toPromise.call(subscribeOnce))).then(function (sub) {
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
        var /** @type {?} */ unsubscribe = switchMap.call(this.subscription, function (sub) {
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
        var /** @type {?} */ unsubscribeOnce = take.call(unsubscribe, 1);
        return /** @type {?} */ (toPromise.call(unsubscribeOnce));
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
var SwUpdate = (function () {
    function SwUpdate(sw) {
        this.sw = sw;
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
    }
    /**
     * @return {?}
     */
    SwUpdate.prototype.checkForUpdate = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce: statusNonce }, statusNonce);
    };
    /**
     * @return {?}
     */
    SwUpdate.prototype.activateUpdate = /**
     * @return {?}
     */
    function () {
        var /** @type {?} */ statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce: statusNonce }, statusNonce);
    };
    SwUpdate.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    SwUpdate.ctorParameters = function () { return [
        { type: NgswCommChannel, },
    ]; };
    return SwUpdate;
}());

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
var SCRIPT = new InjectionToken('NGSW_REGISTER_SCRIPT');
var OPTS = new InjectionToken('NGSW_REGISTER_OPTIONS');
/**
 * @param {?} injector
 * @param {?} script
 * @param {?} options
 * @return {?}
 */
function ngswAppInitializer(injector, script, options) {
    var /** @type {?} */ initializer = function () {
        var /** @type {?} */ app = injector.get(ApplicationRef);
        if (!('serviceWorker' in navigator)) {
            return;
        }
        var /** @type {?} */ onStable = /** @type {?} */ (filter.call(app.isStable, function (stable) { return !!stable; }));
        var /** @type {?} */ isStable = /** @type {?} */ (take.call(onStable, 1));
        var /** @type {?} */ whenStable = /** @type {?} */ (toPromise.call(isStable));
        // Don't return the Promise, as that will block the application until the SW is registered, and
        // cause a crash if the SW registration fails.
        whenStable.then(function () { return navigator.serviceWorker.register(script, options); });
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
var ServiceWorkerModule = (function () {
    function ServiceWorkerModule() {
    }
    /**
     * @param {?} script
     * @param {?=} opts
     * @return {?}
     */
    ServiceWorkerModule.register = /**
     * @param {?} script
     * @param {?=} opts
     * @return {?}
     */
    function (script, opts) {
        if (opts === void 0) { opts = {}; }
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
    };
    ServiceWorkerModule.decorators = [
        { type: NgModule, args: [{
                    providers: [SwPush, SwUpdate],
                },] },
    ];
    /** @nocollapse */
    ServiceWorkerModule.ctorParameters = function () { return []; };
    return ServiceWorkerModule;
}());

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
