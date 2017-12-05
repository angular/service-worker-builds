/**
 * @license Angular v5.1.0-rc.1-6911a25
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/operator/filter'), require('rxjs/operator/take'), require('rxjs/operator/toPromise'), require('rxjs/observable/concat'), require('rxjs/observable/defer'), require('rxjs/observable/fromEvent'), require('rxjs/observable/of'), require('rxjs/observable/throw'), require('rxjs/operator/do'), require('rxjs/operator/map'), require('rxjs/operator/publish'), require('rxjs/operator/switchMap'), require('rxjs/Subject'), require('rxjs/observable/merge'), require('rxjs/observable/never')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/operator/filter', 'rxjs/operator/take', 'rxjs/operator/toPromise', 'rxjs/observable/concat', 'rxjs/observable/defer', 'rxjs/observable/fromEvent', 'rxjs/observable/of', 'rxjs/observable/throw', 'rxjs/operator/do', 'rxjs/operator/map', 'rxjs/operator/publish', 'rxjs/operator/switchMap', 'rxjs/Subject', 'rxjs/observable/merge', 'rxjs/observable/never'], factory) :
	(factory((global.ng = global.ng || {}, global.ng.serviceWorker = {}),global.ng.core,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx,global.Rx.Observable,global.Rx.Observable));
}(this, (function (exports,_angular_core,rxjs_operator_filter,rxjs_operator_take,rxjs_operator_toPromise,rxjs_observable_concat,rxjs_observable_defer,rxjs_observable_fromEvent,rxjs_observable_of,rxjs_observable_throw,rxjs_operator_do,rxjs_operator_map,rxjs_operator_publish,rxjs_operator_switchMap,rxjs_Subject,rxjs_observable_merge,rxjs_observable_never) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */



var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};

/**
 * @license Angular v5.1.0-rc.1-6911a25
 * (c) 2010-2017 Google, Inc. https://angular.io/
 * License: MIT
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
var ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
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
    return rxjs_observable_defer.defer(function () { return rxjs_observable_throw._throw(new Error(message)); });
}
/**
 * \@experimental
 */
var NgswCommChannel = /** @class */ (function () {
    function NgswCommChannel(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            var /** @type {?} */ controllerChangeEvents = /** @type {?} */ ((rxjs_observable_fromEvent.fromEvent(serviceWorker, 'controllerchange')));
            var /** @type {?} */ controllerChanges = /** @type {?} */ ((rxjs_operator_map.map.call(controllerChangeEvents, function () { return serviceWorker.controller; })));
            var /** @type {?} */ currentController = /** @type {?} */ ((rxjs_observable_defer.defer(function () { return rxjs_observable_of.of(serviceWorker.controller); })));
            var /** @type {?} */ controllerWithChanges = /** @type {?} */ ((rxjs_observable_concat.concat(currentController, controllerChanges)));
            this.worker = /** @type {?} */ ((rxjs_operator_filter.filter.call(controllerWithChanges, function (c) { return !!c; })));
            this.registration = /** @type {?} */ ((rxjs_operator_switchMap.switchMap.call(this.worker, function () { return serviceWorker.getRegistration(); })));
            var /** @type {?} */ rawEvents = rxjs_observable_fromEvent.fromEvent(serviceWorker, 'message');
            var /** @type {?} */ rawEventPayload = /** @type {?} */ ((rxjs_operator_map.map.call(rawEvents, function (event) { return event.data; })));
            var /** @type {?} */ eventsUnconnected = /** @type {?} */ ((rxjs_operator_filter.filter.call(rawEventPayload, function (event) { return !!event && !!(/** @type {?} */ (event))['type']; })));
            var /** @type {?} */ events = /** @type {?} */ ((rxjs_operator_publish.publish.call(eventsUnconnected)));
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
        var /** @type {?} */ worker = rxjs_operator_take.take.call(this.worker, 1);
        var /** @type {?} */ sideEffect = rxjs_operator_do._do.call(worker, function (sw) {
            sw.postMessage(__assign({ action: action }, payload));
        });
        return /** @type {?} */ ((rxjs_operator_toPromise.toPromise.call(sideEffect).then(function () { return undefined; })));
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
        return /** @type {?} */ ((rxjs_operator_filter.filter.call(this.events, function (event) { return event.type === type; })));
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
        return /** @type {?} */ ((rxjs_operator_take.take.call(this.eventsOfType(type), 1)));
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
        var /** @type {?} */ statusEventsWithNonce = /** @type {?} */ ((rxjs_operator_filter.filter.call(this.eventsOfType('STATUS'), function (event) { return event.nonce === nonce; })));
        var /** @type {?} */ singleStatusEvent = /** @type {?} */ ((rxjs_operator_take.take.call(statusEventsWithNonce, 1)));
        var /** @type {?} */ mapErrorAndValue = /** @type {?} */ ((rxjs_operator_map.map.call(singleStatusEvent, function (event) {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        })));
        return rxjs_operator_toPromise.toPromise.call(mapErrorAndValue);
    };
    Object.defineProperty(NgswCommChannel.prototype, "isEnabled", {
        get: /**
         * @return {?}
         */
        function () { return !!this.serviceWorker; },
        enumerable: true,
        configurable: true
    });
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
var SwPush = /** @class */ (function () {
    function SwPush(sw) {
        this.sw = sw;
        this.subscriptionChanges = new rxjs_Subject.Subject();
        if (!sw.isEnabled) {
            this.messages = rxjs_observable_never.never();
            this.subscription = rxjs_observable_never.never();
            return;
        }
        this.messages =
            rxjs_operator_map.map.call(this.sw.eventsOfType('PUSH'), function (message) { return message.data; });
        this.pushManager = /** @type {?} */ ((rxjs_operator_map.map.call(this.sw.registration, function (registration) { return registration.pushManager; })));
        var /** @type {?} */ workerDrivenSubscriptions = /** @type {?} */ ((rxjs_operator_switchMap.switchMap.call(this.pushManager, function (pm) { return pm.getSubscription().then(function (sub) { return sub; }); })));
        this.subscription = rxjs_observable_merge.merge(workerDrivenSubscriptions, this.subscriptionChanges);
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
        var /** @type {?} */ subscribe = /** @type {?} */ ((rxjs_operator_switchMap.switchMap.call(this.pushManager, function (pm) { return pm.subscribe(pushOptions); })));
        var /** @type {?} */ subscribeOnce = rxjs_operator_take.take.call(subscribe, 1);
        return (/** @type {?} */ (rxjs_operator_toPromise.toPromise.call(subscribeOnce))).then(function (sub) {
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
        var /** @type {?} */ unsubscribe = rxjs_operator_switchMap.switchMap.call(this.subscription, function (sub) {
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
        var /** @type {?} */ unsubscribeOnce = rxjs_operator_take.take.call(unsubscribe, 1);
        return /** @type {?} */ (rxjs_operator_toPromise.toPromise.call(unsubscribeOnce));
    };
    SwPush.decorators = [
        { type: _angular_core.Injectable },
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
var SwUpdate = /** @class */ (function () {
    function SwUpdate(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.available = rxjs_observable_never.never();
            this.activated = rxjs_observable_never.never();
            return;
        }
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
    }
    Object.defineProperty(SwUpdate.prototype, "isEnabled", {
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
     * @return {?}
     */
    SwUpdate.prototype.checkForUpdate = /**
     * @return {?}
     */
    function () {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
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
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        var /** @type {?} */ statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce: statusNonce }, statusNonce);
    };
    SwUpdate.decorators = [
        { type: _angular_core.Injectable },
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
/**
 * @abstract
 */
var RegistrationOptions = /** @class */ (function () {
    function RegistrationOptions() {
    }
    return RegistrationOptions;
}());
var SCRIPT = new _angular_core.InjectionToken('NGSW_REGISTER_SCRIPT');
/**
 * @param {?} injector
 * @param {?} script
 * @param {?} options
 * @return {?}
 */
function ngswAppInitializer(injector, script, options) {
    var /** @type {?} */ initializer = function () {
        var /** @type {?} */ app = injector.get(_angular_core.ApplicationRef);
        if (!('serviceWorker' in navigator) || options.enabled === false) {
            return;
        }
        var /** @type {?} */ onStable = /** @type {?} */ (rxjs_operator_filter.filter.call(app.isStable, function (stable) { return !!stable; }));
        var /** @type {?} */ isStable = /** @type {?} */ (rxjs_operator_take.take.call(onStable, 1));
        var /** @type {?} */ whenStable = /** @type {?} */ (rxjs_operator_toPromise.toPromise.call(isStable));
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        navigator.serviceWorker.addEventListener('controllerchange', function () {
            if (navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }
        });
        // Don't return the Promise, as that will block the application until the SW is registered, and
        // cause a crash if the SW registration fails.
        whenStable.then(function () { return navigator.serviceWorker.register(script, { scope: options.scope }); });
    };
    return initializer;
}
/**
 * @param {?} opts
 * @return {?}
 */
function ngswCommChannelFactory(opts) {
    return new NgswCommChannel(opts.enabled !== false ? navigator.serviceWorker : undefined);
}
/**
 * \@experimental
 */
var ServiceWorkerModule = /** @class */ (function () {
    function ServiceWorkerModule() {
    }
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     * @param {?} script
     * @param {?=} opts
     * @return {?}
     */
    ServiceWorkerModule.register = /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
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
                { provide: RegistrationOptions, useValue: opts },
                { provide: NgswCommChannel, useFactory: ngswCommChannelFactory, deps: [RegistrationOptions] },
                {
                    provide: _angular_core.APP_INITIALIZER,
                    useFactory: ngswAppInitializer,
                    deps: [_angular_core.Injector, SCRIPT, RegistrationOptions],
                    multi: true,
                },
            ],
        };
    };
    ServiceWorkerModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [SwPush, SwUpdate],
                },] },
    ];
    /** @nocollapse */
    ServiceWorkerModule.ctorParameters = function () { return []; };
    return ServiceWorkerModule;
}());

exports.ServiceWorkerModule = ServiceWorkerModule;
exports.SwPush = SwPush;
exports.SwUpdate = SwUpdate;
exports.ɵe = NgswCommChannel;
exports.ɵa = RegistrationOptions;
exports.ɵb = SCRIPT;
exports.ɵc = ngswAppInitializer;
exports.ɵd = ngswCommChannelFactory;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=service-worker.umd.js.map
