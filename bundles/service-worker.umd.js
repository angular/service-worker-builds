/**
 * @license Angular v6.1.9
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@angular/service-worker', ['exports', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/common'], factory) :
    (factory((global.ng = global.ng || {}, global.ng.serviceWorker = {}),global.rxjs,global.rxjs.operators,global.ng.core,global.ng.common));
}(this, (function (exports,rxjs,operators,core,common) { 'use strict';

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

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
    function errorObservable(message) {
        return rxjs.defer(function () { return rxjs.throwError(new Error(message)); });
    }
    /**
     * @experimental
    */
    var NgswCommChannel = /** @class */ (function () {
        function NgswCommChannel(serviceWorker) {
            this.serviceWorker = serviceWorker;
            if (!serviceWorker) {
                this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
            }
            else {
                var controllerChangeEvents = (rxjs.fromEvent(serviceWorker, 'controllerchange'));
                var controllerChanges = (controllerChangeEvents.pipe(operators.map(function () { return serviceWorker.controller; })));
                var currentController = (rxjs.defer(function () { return rxjs.of(serviceWorker.controller); }));
                var controllerWithChanges = (rxjs.concat(currentController, controllerChanges));
                this.worker = (controllerWithChanges.pipe(operators.filter(function (c) { return !!c; })));
                this.registration = (this.worker.pipe(operators.switchMap(function () { return serviceWorker.getRegistration(); })));
                var rawEvents = rxjs.fromEvent(serviceWorker, 'message');
                var rawEventPayload = rawEvents.pipe(operators.map(function (event) { return event.data; }));
                var eventsUnconnected = (rawEventPayload.pipe(operators.filter(function (event) { return !!event && !!event['type']; })));
                var events = eventsUnconnected.pipe(operators.publish());
                this.events = events;
                events.connect();
            }
        }
        /**
         * @internal
         */
        NgswCommChannel.prototype.postMessage = function (action, payload) {
            return this.worker
                .pipe(operators.take(1), operators.tap(function (sw) {
                sw.postMessage(__assign({ action: action }, payload));
            }))
                .toPromise()
                .then(function () { return undefined; });
        };
        /**
         * @internal
         */
        NgswCommChannel.prototype.postMessageWithStatus = function (type, payload, nonce) {
            var waitForStatus = this.waitForStatus(nonce);
            var postMessage = this.postMessage(type, payload);
            return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
        };
        /**
         * @internal
         */
        NgswCommChannel.prototype.generateNonce = function () { return Math.round(Math.random() * 10000000); };
        /**
         * @internal
         */
        // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
        // types flow correctly
        NgswCommChannel.prototype.eventsOfType = function (type) {
            return this.events.pipe(operators.filter(function (event) { return event.type === type; }));
        };
        /**
         * @internal
         */
        // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
        // types flow correctly
        NgswCommChannel.prototype.nextEventOfType = function (type) {
            return (this.eventsOfType(type).pipe(operators.take(1)));
        };
        /**
         * @internal
         */
        NgswCommChannel.prototype.waitForStatus = function (nonce) {
            return this.eventsOfType('STATUS')
                .pipe(operators.filter(function (event) { return event.nonce === nonce; }), operators.take(1), operators.map(function (event) {
                if (event.status) {
                    return undefined;
                }
                throw new Error(event.error);
            }))
                .toPromise();
        };
        Object.defineProperty(NgswCommChannel.prototype, "isEnabled", {
            get: function () { return !!this.serviceWorker; },
            enumerable: true,
            configurable: true
        });
        return NgswCommChannel;
    }());

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
     * @experimental
     */
    var SwPush = /** @class */ (function () {
        function SwPush(sw) {
            this.sw = sw;
            this.subscriptionChanges = new rxjs.Subject();
            if (!sw.isEnabled) {
                this.messages = rxjs.NEVER;
                this.subscription = rxjs.NEVER;
                return;
            }
            this.messages = this.sw.eventsOfType('PUSH').pipe(operators.map(function (message) { return message.data; }));
            this.pushManager = this.sw.registration.pipe(operators.map(function (registration) { return registration.pushManager; }));
            var workerDrivenSubscriptions = this.pushManager.pipe(operators.switchMap(function (pm) { return pm.getSubscription().then(function (sub) { return sub; }); }));
            this.subscription = rxjs.merge(workerDrivenSubscriptions, this.subscriptionChanges);
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
            return this.pushManager.pipe(operators.switchMap(function (pm) { return pm.subscribe(pushOptions); }), operators.take(1))
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
            return this.subscription.pipe(operators.take(1), operators.switchMap(doUnsubscribe)).toPromise();
        };
        SwPush.prototype.decodeBase64 = function (input) { return atob(input); };
        SwPush = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [NgswCommChannel])
        ], SwPush);
        return SwPush;
    }());

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
     * @experimental
     */
    var SwUpdate = /** @class */ (function () {
        function SwUpdate(sw) {
            this.sw = sw;
            if (!sw.isEnabled) {
                this.available = rxjs.NEVER;
                this.activated = rxjs.NEVER;
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
            get: function () { return this.sw.isEnabled; },
            enumerable: true,
            configurable: true
        });
        SwUpdate.prototype.checkForUpdate = function () {
            if (!this.sw.isEnabled) {
                return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
            }
            var statusNonce = this.sw.generateNonce();
            return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce: statusNonce }, statusNonce);
        };
        SwUpdate.prototype.activateUpdate = function () {
            if (!this.sw.isEnabled) {
                return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
            }
            var statusNonce = this.sw.generateNonce();
            return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce: statusNonce }, statusNonce);
        };
        SwUpdate = __decorate([
            core.Injectable(),
            __metadata("design:paramtypes", [NgswCommChannel])
        ], SwUpdate);
        return SwUpdate;
    }());

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var RegistrationOptions = /** @class */ (function () {
        function RegistrationOptions() {
        }
        return RegistrationOptions;
    }());
    var SCRIPT = new core.InjectionToken('NGSW_REGISTER_SCRIPT');
    function ngswAppInitializer(injector, script, options, platformId) {
        var initializer = function () {
            var app = injector.get(core.ApplicationRef);
            if (!(common.isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
                options.enabled !== false)) {
                return;
            }
            var whenStable = app.isStable.pipe(operators.filter(function (stable) { return !!stable; }), operators.take(1)).toPromise();
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
    function ngswCommChannelFactory(opts, platformId) {
        return new NgswCommChannel(common.isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
            undefined);
    }
    /**
     * @experimental
     */
    var ServiceWorkerModule = /** @class */ (function () {
        function ServiceWorkerModule() {
        }
        ServiceWorkerModule_1 = ServiceWorkerModule;
        /**
         * Register the given Angular Service Worker script.
         *
         * If `enabled` is set to `false` in the given options, the module will behave as if service
         * workers are not supported by the browser, and the service worker will not be registered.
         */
        ServiceWorkerModule.register = function (script, opts) {
            if (opts === void 0) { opts = {}; }
            return {
                ngModule: ServiceWorkerModule_1,
                providers: [
                    { provide: SCRIPT, useValue: script },
                    { provide: RegistrationOptions, useValue: opts },
                    {
                        provide: NgswCommChannel,
                        useFactory: ngswCommChannelFactory,
                        deps: [RegistrationOptions, core.PLATFORM_ID]
                    },
                    {
                        provide: core.APP_INITIALIZER,
                        useFactory: ngswAppInitializer,
                        deps: [core.Injector, SCRIPT, RegistrationOptions, core.PLATFORM_ID],
                        multi: true,
                    },
                ],
            };
        };
        var ServiceWorkerModule_1;
        ServiceWorkerModule = ServiceWorkerModule_1 = __decorate([
            core.NgModule({
                providers: [SwPush, SwUpdate],
            })
        ], ServiceWorkerModule);
        return ServiceWorkerModule;
    }());

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
    // This file only reexports content of the `src` folder. Keep it that way.

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ɵangular_packages_service_worker_service_worker_e = NgswCommChannel;
    exports.ɵangular_packages_service_worker_service_worker_a = RegistrationOptions;
    exports.ɵangular_packages_service_worker_service_worker_b = SCRIPT;
    exports.ɵangular_packages_service_worker_service_worker_c = ngswAppInitializer;
    exports.ɵangular_packages_service_worker_service_worker_d = ngswCommChannelFactory;
    exports.ServiceWorkerModule = ServiceWorkerModule;
    exports.SwPush = SwPush;
    exports.SwUpdate = SwUpdate;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=service-worker.umd.js.map
