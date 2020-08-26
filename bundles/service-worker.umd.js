/**
 * @license Angular v10.0.14
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('@angular/service-worker', ['exports', '@angular/common', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory((global.ng = global.ng || {}, global.ng.serviceWorker = {}), global.ng.common, global.ng.core, global.rxjs, global.rxjs.operators));
}(this, (function (exports, common, core, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, exports) {
        for (var p in m)
            if (p !== "default" && !exports.hasOwnProperty(p))
                __createBinding(exports, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
    function errorObservable(message) {
        return rxjs.defer(function () { return rxjs.throwError(new Error(message)); });
    }
    /**
     * @publicApi
     */
    var NgswCommChannel = /** @class */ (function () {
        function NgswCommChannel(serviceWorker) {
            this.serviceWorker = serviceWorker;
            if (!serviceWorker) {
                this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
            }
            else {
                var controllerChangeEvents = rxjs.fromEvent(serviceWorker, 'controllerchange');
                var controllerChanges = controllerChangeEvents.pipe(operators.map(function () { return serviceWorker.controller; }));
                var currentController = rxjs.defer(function () { return rxjs.of(serviceWorker.controller); });
                var controllerWithChanges = rxjs.concat(currentController, controllerChanges);
                this.worker = controllerWithChanges.pipe(operators.filter(function (c) { return !!c; }));
                this.registration = (this.worker.pipe(operators.switchMap(function () { return serviceWorker.getRegistration(); })));
                var rawEvents = rxjs.fromEvent(serviceWorker, 'message');
                var rawEventPayload = rawEvents.pipe(operators.map(function (event) { return event.data; }));
                var eventsUnconnected = rawEventPayload.pipe(operators.filter(function (event) { return event && event.type; }));
                var events = eventsUnconnected.pipe(operators.publish());
                events.connect();
                this.events = events;
            }
        }
        NgswCommChannel.prototype.postMessage = function (action, payload) {
            return this.worker
                .pipe(operators.take(1), operators.tap(function (sw) {
                sw.postMessage(Object.assign({ action: action }, payload));
            }))
                .toPromise()
                .then(function () { return undefined; });
        };
        NgswCommChannel.prototype.postMessageWithStatus = function (type, payload, nonce) {
            var waitForStatus = this.waitForStatus(nonce);
            var postMessage = this.postMessage(type, payload);
            return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
        };
        NgswCommChannel.prototype.generateNonce = function () {
            return Math.round(Math.random() * 10000000);
        };
        NgswCommChannel.prototype.eventsOfType = function (type) {
            var filterFn = function (event) { return event.type === type; };
            return this.events.pipe(operators.filter(filterFn));
        };
        NgswCommChannel.prototype.nextEventOfType = function (type) {
            return this.eventsOfType(type).pipe(operators.take(1));
        };
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
            get: function () {
                return !!this.serviceWorker;
            },
            enumerable: false,
            configurable: true
        });
        return NgswCommChannel;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Subscribe and listen to
     * [Web Push
     * Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices) through
     * Angular Service Worker.
     *
     * @usageNotes
     *
     * You can inject a `SwPush` instance into any component or service
     * as a dependency.
     *
     * <code-example path="service-worker/push/module.ts" region="inject-sw-push"
     * header="app.component.ts"></code-example>
     *
     * To subscribe, call `SwPush.requestSubscription()`, which asks the user for permission.
     * The call returns a `Promise` with a new
     * [`PushSubscription`](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
     * instance.
     *
     * <code-example path="service-worker/push/module.ts" region="subscribe-to-push"
     * header="app.component.ts"></code-example>
     *
     * A request is rejected if the user denies permission, or if the browser
     * blocks or does not support the Push API or ServiceWorkers.
     * Check `SwPush.isEnabled` to confirm status.
     *
     * Invoke Push Notifications by pushing a message with the following payload.
     *
     * ```ts
     * {
     *   "notification": {
     *     "actions": NotificationAction[],
     *     "badge": USVString
     *     "body": DOMString,
     *     "data": any,
     *     "dir": "auto"|"ltr"|"rtl",
     *     "icon": USVString,
     *     "image": USVString,
     *     "lang": DOMString,
     *     "renotify": boolean,
     *     "requireInteraction": boolean,
     *     "silent": boolean,
     *     "tag": DOMString,
     *     "timestamp": DOMTimeStamp,
     *     "title": DOMString,
     *     "vibrate": number[]
     *   }
     * }
     * ```
     *
     * Only `title` is required. See `Notification`
     * [instance
     * properties](https://developer.mozilla.org/en-US/docs/Web/API/Notification#Instance_properties).
     *
     * While the subscription is active, Service Worker listens for
     * [PushEvent](https://developer.mozilla.org/en-US/docs/Web/API/PushEvent)
     * occurrences and creates
     * [Notification](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
     * instances in response.
     *
     * Unsubscribe using `SwPush.unsubscribe()`.
     *
     * An application can subscribe to `SwPush.notificationClicks` observable to be notified when a user
     * clicks on a notification. For example:
     *
     * <code-example path="service-worker/push/module.ts" region="subscribe-to-notification-clicks"
     * header="app.component.ts"></code-example>
     *
     * @see [Push Notifications](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)
     * @see [Angular Push Notifications](https://blog.angular-university.io/angular-push-notifications/)
     * @see [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
     * @see [MDN: Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
     * @see [MDN: Web Push API Notifications best practices](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)
     *
     * @publicApi
     */
    var SwPush = /** @class */ (function () {
        function SwPush(sw) {
            this.sw = sw;
            this.subscriptionChanges = new rxjs.Subject();
            if (!sw.isEnabled) {
                this.messages = rxjs.NEVER;
                this.notificationClicks = rxjs.NEVER;
                this.subscription = rxjs.NEVER;
                return;
            }
            this.messages = this.sw.eventsOfType('PUSH').pipe(operators.map(function (message) { return message.data; }));
            this.notificationClicks =
                this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(operators.map(function (message) { return message.data; }));
            this.pushManager = this.sw.registration.pipe(operators.map(function (registration) { return registration.pushManager; }));
            var workerDrivenSubscriptions = this.pushManager.pipe(operators.switchMap(function (pm) { return pm.getSubscription(); }));
            this.subscription = rxjs.merge(workerDrivenSubscriptions, this.subscriptionChanges);
        }
        Object.defineProperty(SwPush.prototype, "isEnabled", {
            /**
             * True if the Service Worker is enabled (supported by the browser and enabled via
             * `ServiceWorkerModule`).
             */
            get: function () {
                return this.sw.isEnabled;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Subscribes to Web Push Notifications,
         * after requesting and receiving user permission.
         *
         * @param options An object containing the `serverPublicKey` string.
         * @returns A Promise that resolves to the new subscription object.
         */
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
        /**
         * Unsubscribes from Service Worker push notifications.
         *
         * @returns A Promise that is resolved when the operation succeeds, or is rejected if there is no
         *          active subscription or the unsubscribe operation fails.
         */
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
        SwPush.prototype.decodeBase64 = function (input) {
            return atob(input);
        };
        return SwPush;
    }());
    SwPush.decorators = [
        { type: core.Injectable }
    ];
    SwPush.ctorParameters = function () { return [
        { type: NgswCommChannel }
    ]; };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Subscribe to update notifications from the Service Worker, trigger update
     * checks, and forcibly activate updates.
     *
     * @publicApi
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
             * True if the Service Worker is enabled (supported by the browser and enabled via
             * `ServiceWorkerModule`).
             */
            get: function () {
                return this.sw.isEnabled;
            },
            enumerable: false,
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
        return SwUpdate;
    }());
    SwUpdate.decorators = [
        { type: core.Injectable }
    ];
    SwUpdate.ctorParameters = function () { return [
        { type: NgswCommChannel }
    ]; };

    /**
     * Token that can be used to provide options for `ServiceWorkerModule` outside of
     * `ServiceWorkerModule.register()`.
     *
     * You can use this token to define a provider that generates the registration options at runtime,
     * for example via a function call:
     *
     * {@example service-worker/registration-options/module.ts region="registration-options"
     *     header="app.module.ts"}
     *
     * @publicApi
     */
    var SwRegistrationOptions = /** @class */ (function () {
        function SwRegistrationOptions() {
        }
        return SwRegistrationOptions;
    }());
    var SCRIPT = new core.InjectionToken('NGSW_REGISTER_SCRIPT');
    function ngswAppInitializer(injector, script, options, platformId) {
        var initializer = function () {
            if (!(common.isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
                options.enabled !== false)) {
                return;
            }
            // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
            // becomes active. This allows the SW to initialize itself even if there is no application
            // traffic.
            navigator.serviceWorker.addEventListener('controllerchange', function () {
                if (navigator.serviceWorker.controller !== null) {
                    navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
                }
            });
            var readyToRegister$;
            if (typeof options.registrationStrategy === 'function') {
                readyToRegister$ = options.registrationStrategy();
            }
            else {
                var _a = __read((options.registrationStrategy || 'registerWhenStable:30000').split(':')), strategy = _a[0], args = _a.slice(1);
                switch (strategy) {
                    case 'registerImmediately':
                        readyToRegister$ = rxjs.of(null);
                        break;
                    case 'registerWithDelay':
                        readyToRegister$ = delayWithTimeout(+args[0] || 0);
                        break;
                    case 'registerWhenStable':
                        readyToRegister$ = !args[0] ? whenStable(injector) :
                            rxjs.merge(whenStable(injector), delayWithTimeout(+args[0]));
                        break;
                    default:
                        // Unknown strategy.
                        throw new Error("Unknown ServiceWorker registration strategy: " + options.registrationStrategy);
                }
            }
            // Don't return anything to avoid blocking the application until the SW is registered.
            // Also, run outside the Angular zone to avoid preventing the app from stabilizing (especially
            // given that some registration strategies wait for the app to stabilize).
            // Catch and log the error if SW registration fails to avoid uncaught rejection warning.
            var ngZone = injector.get(core.NgZone);
            ngZone.runOutsideAngular(function () { return readyToRegister$.pipe(operators.take(1)).subscribe(function () { return navigator.serviceWorker.register(script, { scope: options.scope })
                .catch(function (err) { return console.error('Service worker registration failed with:', err); }); }); });
        };
        return initializer;
    }
    function delayWithTimeout(timeout) {
        return rxjs.of(null).pipe(operators.delay(timeout));
    }
    function whenStable(injector) {
        var appRef = injector.get(core.ApplicationRef);
        return appRef.isStable.pipe(operators.filter(function (stable) { return stable; }));
    }
    function ngswCommChannelFactory(opts, platformId) {
        return new NgswCommChannel(common.isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
            undefined);
    }
    /**
     * @publicApi
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
        ServiceWorkerModule.register = function (script, opts) {
            if (opts === void 0) { opts = {}; }
            return {
                ngModule: ServiceWorkerModule,
                providers: [
                    { provide: SCRIPT, useValue: script },
                    { provide: SwRegistrationOptions, useValue: opts },
                    {
                        provide: NgswCommChannel,
                        useFactory: ngswCommChannelFactory,
                        deps: [SwRegistrationOptions, core.PLATFORM_ID]
                    },
                    {
                        provide: core.APP_INITIALIZER,
                        useFactory: ngswAppInitializer,
                        deps: [core.Injector, SCRIPT, SwRegistrationOptions, core.PLATFORM_ID],
                        multi: true,
                    },
                ],
            };
        };
        return ServiceWorkerModule;
    }());
    ServiceWorkerModule.decorators = [
        { type: core.NgModule, args: [{
                    providers: [SwPush, SwUpdate],
                },] }
    ];

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    // This file only reexports content of the `src` folder. Keep it that way.

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ServiceWorkerModule = ServiceWorkerModule;
    exports.SwPush = SwPush;
    exports.SwRegistrationOptions = SwRegistrationOptions;
    exports.SwUpdate = SwUpdate;
    exports.ɵangular_packages_service_worker_service_worker_a = NgswCommChannel;
    exports.ɵangular_packages_service_worker_service_worker_b = SCRIPT;
    exports.ɵangular_packages_service_worker_service_worker_c = ngswAppInitializer;
    exports.ɵangular_packages_service_worker_service_worker_d = ngswCommChannelFactory;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=service-worker.umd.js.map
