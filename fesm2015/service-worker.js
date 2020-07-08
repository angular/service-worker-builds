/**
 * @license Angular v9.1.12
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */

import { isPlatformBrowser } from '@angular/common';
import { Injectable, InjectionToken, ApplicationRef, PLATFORM_ID, APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { defer, throwError, fromEvent, of, concat, Subject, NEVER, merge } from 'rxjs';
import { map, filter, switchMap, publish, take, tap, delay } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/low_level.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
/**
 * An event emitted when a new version of the app is available.
 *
 * \@publicApi
 * @record
 */
function UpdateAvailableEvent() { }
if (false) {
    /** @type {?} */
    UpdateAvailableEvent.prototype.type;
    /** @type {?} */
    UpdateAvailableEvent.prototype.current;
    /** @type {?} */
    UpdateAvailableEvent.prototype.available;
}
/**
 * An event emitted when a new version of the app has been downloaded and activated.
 *
 * \@publicApi
 * @record
 */
function UpdateActivatedEvent() { }
if (false) {
    /** @type {?} */
    UpdateActivatedEvent.prototype.type;
    /** @type {?|undefined} */
    UpdateActivatedEvent.prototype.previous;
    /** @type {?} */
    UpdateActivatedEvent.prototype.current;
}
/**
 * An event emitted when a `PushEvent` is received by the service worker.
 * @record
 */
function PushEvent() { }
if (false) {
    /** @type {?} */
    PushEvent.prototype.type;
    /** @type {?} */
    PushEvent.prototype.data;
}
/**
 * @record
 */
function TypedEvent() { }
if (false) {
    /** @type {?} */
    TypedEvent.prototype.type;
}
/**
 * @record
 */
function StatusEvent() { }
if (false) {
    /** @type {?} */
    StatusEvent.prototype.type;
    /** @type {?} */
    StatusEvent.prototype.nonce;
    /** @type {?} */
    StatusEvent.prototype.status;
    /** @type {?|undefined} */
    StatusEvent.prototype.error;
}
/**
 * @param {?} message
 * @return {?}
 */
function errorObservable(message) {
    return defer((/**
     * @return {?}
     */
    () => throwError(new Error(message))));
}
/**
 * \@publicApi
 */
class NgswCommChannel {
    /**
     * @param {?} serviceWorker
     */
    constructor(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            /** @type {?} */
            const controllerChangeEvents = fromEvent(serviceWorker, 'controllerchange');
            /** @type {?} */
            const controllerChanges = controllerChangeEvents.pipe(map((/**
             * @return {?}
             */
            () => serviceWorker.controller)));
            /** @type {?} */
            const currentController = defer((/**
             * @return {?}
             */
            () => of(serviceWorker.controller)));
            /** @type {?} */
            const controllerWithChanges = concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(filter((/**
             * @param {?} c
             * @return {?}
             */
            (c) => !!c)));
            this.registration = (/** @type {?} */ ((this.worker.pipe(switchMap((/**
             * @return {?}
             */
            () => serviceWorker.getRegistration()))))));
            /** @type {?} */
            const rawEvents = fromEvent(serviceWorker, 'message');
            /** @type {?} */
            const rawEventPayload = rawEvents.pipe(map((/**
             * @param {?} event
             * @return {?}
             */
            event => event.data)));
            /** @type {?} */
            const eventsUnconnected = rawEventPayload.pipe(filter((/**
             * @param {?} event
             * @return {?}
             */
            event => event && event.type)));
            /** @type {?} */
            const events = (/** @type {?} */ (eventsUnconnected.pipe(publish())));
            events.connect();
            this.events = events;
        }
    }
    /**
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    postMessage(action, payload) {
        return this.worker
            .pipe(take(1), tap((/**
         * @param {?} sw
         * @return {?}
         */
        (sw) => {
            sw.postMessage(Object.assign({ action }, payload));
        })))
            .toPromise()
            .then((/**
         * @return {?}
         */
        () => undefined));
    }
    /**
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    postMessageWithStatus(type, payload, nonce) {
        /** @type {?} */
        const waitForStatus = this.waitForStatus(nonce);
        /** @type {?} */
        const postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then((/**
         * @return {?}
         */
        () => undefined));
    }
    /**
     * @return {?}
     */
    generateNonce() {
        return Math.round(Math.random() * 10000000);
    }
    /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    eventsOfType(type) {
        /** @type {?} */
        const filterFn = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => event.type === type);
        return this.events.pipe(filter(filterFn));
    }
    /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    nextEventOfType(type) {
        return this.eventsOfType(type).pipe(take(1));
    }
    /**
     * @param {?} nonce
     * @return {?}
     */
    waitForStatus(nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event.nonce === nonce)), take(1), map((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (event.status) {
                return undefined;
            }
            throw new Error((/** @type {?} */ (event.error)));
        })))
            .toPromise();
    }
    /**
     * @return {?}
     */
    get isEnabled() {
        return !!this.serviceWorker;
    }
}
if (false) {
    /** @type {?} */
    NgswCommChannel.prototype.worker;
    /** @type {?} */
    NgswCommChannel.prototype.registration;
    /** @type {?} */
    NgswCommChannel.prototype.events;
    /**
     * @type {?}
     * @private
     */
    NgswCommChannel.prototype.serviceWorker;
}

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/push.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Subscribe and listen to
 * [Web Push
 * Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices) through
 * Angular Service Worker.
 *
 * \@usageNotes
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
 * \@publicApi
 */
class SwPush {
    /**
     * @param {?} sw
     */
    constructor(sw) {
        this.sw = sw;
        this.subscriptionChanges = new Subject();
        if (!sw.isEnabled) {
            this.messages = NEVER;
            this.notificationClicks = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map((/**
         * @param {?} message
         * @return {?}
         */
        message => message.data)));
        this.notificationClicks =
            this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(map((/**
             * @param {?} message
             * @return {?}
             */
            (message) => message.data)));
        this.pushManager = this.sw.registration.pipe(map((/**
         * @param {?} registration
         * @return {?}
         */
        registration => registration.pushManager)));
        /** @type {?} */
        const workerDrivenSubscriptions = this.pushManager.pipe(switchMap((/**
         * @param {?} pm
         * @return {?}
         */
        pm => pm.getSubscription())));
        this.subscription = merge(workerDrivenSubscriptions, this.subscriptionChanges);
    }
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     * @return {?}
     */
    get isEnabled() {
        return this.sw.isEnabled;
    }
    /**
     * Subscribes to Web Push Notifications,
     * after requesting and receiving user permission.
     *
     * @param {?} options An object containing the `serverPublicKey` string.
     * @return {?} A Promise that resolves to the new subscription object.
     */
    requestSubscription(options) {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        const pushOptions = { userVisibleOnly: true };
        /** @type {?} */
        let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        /** @type {?} */
        let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (let i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return this.pushManager.pipe(switchMap((/**
         * @param {?} pm
         * @return {?}
         */
        pm => pm.subscribe(pushOptions))), take(1))
            .toPromise()
            .then((/**
         * @param {?} sub
         * @return {?}
         */
        sub => {
            this.subscriptionChanges.next(sub);
            return sub;
        }));
    }
    /**
     * Unsubscribes from Service Worker push notifications.
     *
     * @return {?} A Promise that is resolved when the operation succeeds, or is rejected if there is no
     *          active subscription or the unsubscribe operation fails.
     */
    unsubscribe() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        const doUnsubscribe = (/**
         * @param {?} sub
         * @return {?}
         */
        (sub) => {
            if (sub === null) {
                throw new Error('Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then((/**
             * @param {?} success
             * @return {?}
             */
            success => {
                if (!success) {
                    throw new Error('Unsubscribe failed!');
                }
                this.subscriptionChanges.next(null);
            }));
        });
        return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
    }
    /**
     * @private
     * @param {?} input
     * @return {?}
     */
    decodeBase64(input) {
        return atob(input);
    }
}
SwPush.decorators = [
    { type: Injectable }
];
/** @nocollapse */
SwPush.ctorParameters = () => [
    { type: NgswCommChannel }
];
if (false) {
    /**
     * Emits the payloads of the received push notification messages.
     * @type {?}
     */
    SwPush.prototype.messages;
    /**
     * Emits the payloads of the received push notification messages as well as the action the user
     * interacted with. If no action was used the `action` property contains an empty string `''`.
     *
     * Note that the `notification` property does **not** contain a
     * [Notification][Mozilla Notification] object but rather a
     * [NotificationOptions](https://notifications.spec.whatwg.org/#dictdef-notificationoptions)
     * object that also includes the `title` of the [Notification][Mozilla Notification] object.
     *
     * [Mozilla Notification]: https://developer.mozilla.org/en-US/docs/Web/API/Notification
     * @type {?}
     */
    SwPush.prototype.notificationClicks;
    /**
     * Emits the currently active
     * [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
     * associated to the Service Worker registration or `null` if there is no subscription.
     * @type {?}
     */
    SwPush.prototype.subscription;
    /**
     * @type {?}
     * @private
     */
    SwPush.prototype.pushManager;
    /**
     * @type {?}
     * @private
     */
    SwPush.prototype.subscriptionChanges;
    /**
     * @type {?}
     * @private
     */
    SwPush.prototype.sw;
}

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/update.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * \@publicApi
 */
class SwUpdate {
    /**
     * @param {?} sw
     */
    constructor(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.available = NEVER;
            this.activated = NEVER;
            return;
        }
        this.available = this.sw.eventsOfType('UPDATE_AVAILABLE');
        this.activated = this.sw.eventsOfType('UPDATE_ACTIVATED');
    }
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     * @return {?}
     */
    get isEnabled() {
        return this.sw.isEnabled;
    }
    /**
     * @return {?}
     */
    checkForUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        const statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('CHECK_FOR_UPDATES', { statusNonce }, statusNonce);
    }
    /**
     * @return {?}
     */
    activateUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        /** @type {?} */
        const statusNonce = this.sw.generateNonce();
        return this.sw.postMessageWithStatus('ACTIVATE_UPDATE', { statusNonce }, statusNonce);
    }
}
SwUpdate.decorators = [
    { type: Injectable }
];
/** @nocollapse */
SwUpdate.ctorParameters = () => [
    { type: NgswCommChannel }
];
if (false) {
    /**
     * Emits an `UpdateAvailableEvent` event whenever a new app version is available.
     * @type {?}
     */
    SwUpdate.prototype.available;
    /**
     * Emits an `UpdateActivatedEvent` event whenever the app has been updated to a new version.
     * @type {?}
     */
    SwUpdate.prototype.activated;
    /**
     * @type {?}
     * @private
     */
    SwUpdate.prototype.sw;
}

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * Token that can be used to provide options for `ServiceWorkerModule` outside of
 * `ServiceWorkerModule.register()`.
 *
 * You can use this token to define a provider that generates the registration options at runtime,
 * for example via a function call:
 *
 * {\@example service-worker/registration-options/module.ts region="registration-options"
 *     header="app.module.ts"}
 *
 * \@publicApi
 * @abstract
 */
class SwRegistrationOptions {
}
if (false) {
    /**
     * Whether the ServiceWorker will be registered and the related services (such as `SwPush` and
     * `SwUpdate`) will attempt to communicate and interact with it.
     *
     * Default: true
     * @type {?}
     */
    SwRegistrationOptions.prototype.enabled;
    /**
     * A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
     * control. It will be used when calling
     * [ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
     * @type {?}
     */
    SwRegistrationOptions.prototype.scope;
    /**
     * Defines the ServiceWorker registration strategy, which determines when it will be registered
     * with the browser.
     *
     * The default behavior of registering once the application stabilizes (i.e. as soon as there are
     * no pending micro- and macro-tasks), is designed register the ServiceWorker as soon as possible
     * but without affecting the application's first time load.
     *
     * Still, there might be cases where you want more control over when the ServiceWorker is
     * registered (e.g. there might be a long-running timeout or polling interval, preventing the app
     * to stabilize). The available option are:
     *
     * - `registerWhenStable`: Register as soon as the application stabilizes (no pending
     *      micro-/macro-tasks).
     * - `registerImmediately`: Register immediately.
     * - `registerWithDelay:<timeout>`: Register with a delay of `<timeout>` milliseconds. For
     *     example, use `registerWithDelay:5000` to register the ServiceWorker after 5 seconds. If
     *     `<timeout>` is omitted, is defaults to `0`, which will register the ServiceWorker as soon
     *     as possible but still asynchronously, once all pending micro-tasks are completed.
     * - An [Observable](guide/observables) factory function: A function that returns an `Observable`.
     *     The function will be used at runtime to obtain and subscribe to the `Observable` and the
     *     ServiceWorker will be registered as soon as the first value is emitted.
     *
     * Default: 'registerWhenStable'
     * @type {?}
     */
    SwRegistrationOptions.prototype.registrationStrategy;
}
/** @type {?} */
const SCRIPT = new InjectionToken('NGSW_REGISTER_SCRIPT');
/**
 * @param {?} injector
 * @param {?} script
 * @param {?} options
 * @param {?} platformId
 * @return {?}
 */
function ngswAppInitializer(injector, script, options, platformId) {
    /** @type {?} */
    const initializer = (/**
     * @return {?}
     */
    () => {
        if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        navigator.serviceWorker.addEventListener('controllerchange', (/**
         * @return {?}
         */
        () => {
            if (navigator.serviceWorker.controller !== null) {
                navigator.serviceWorker.controller.postMessage({ action: 'INITIALIZE' });
            }
        }));
        /** @type {?} */
        let readyToRegister$;
        if (typeof options.registrationStrategy === 'function') {
            readyToRegister$ = options.registrationStrategy();
        }
        else {
            const [strategy, ...args] = (options.registrationStrategy || 'registerWhenStable').split(':');
            switch (strategy) {
                case 'registerImmediately':
                    readyToRegister$ = of(null);
                    break;
                case 'registerWithDelay':
                    readyToRegister$ = of(null).pipe(delay(+args[0] || 0));
                    break;
                case 'registerWhenStable':
                    /** @type {?} */
                    const appRef = injector.get(ApplicationRef);
                    readyToRegister$ = appRef.isStable.pipe(filter((/**
                     * @param {?} stable
                     * @return {?}
                     */
                    stable => stable)));
                    break;
                default:
                    // Unknown strategy.
                    throw new Error(`Unknown ServiceWorker registration strategy: ${options.registrationStrategy}`);
            }
        }
        // Don't return anything to avoid blocking the application until the SW is registered.
        // Catch and log the error if SW registration fails to avoid uncaught rejection warning.
        readyToRegister$.pipe(take(1)).subscribe((/**
         * @return {?}
         */
        () => navigator.serviceWorker.register(script, { scope: options.scope })
            .catch((/**
         * @param {?} err
         * @return {?}
         */
        err => console.error('Service worker registration failed with:', err)))));
    });
    return initializer;
}
/**
 * @param {?} opts
 * @param {?} platformId
 * @return {?}
 */
function ngswCommChannelFactory(opts, platformId) {
    return new NgswCommChannel(isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
        undefined);
}
/**
 * \@publicApi
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
                { provide: SwRegistrationOptions, useValue: opts },
                {
                    provide: NgswCommChannel,
                    useFactory: ngswCommChannelFactory,
                    deps: [SwRegistrationOptions, PLATFORM_ID]
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: ngswAppInitializer,
                    deps: [Injector, SCRIPT, SwRegistrationOptions, PLATFORM_ID],
                    multi: true,
                },
            ],
        };
    }
}
ServiceWorkerModule.decorators = [
    { type: NgModule, args: [{
                providers: [SwPush, SwUpdate],
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/public_api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ServiceWorkerModule, SwPush, SwRegistrationOptions, SwUpdate, NgswCommChannel as ɵangular_packages_service_worker_service_worker_a, SCRIPT as ɵangular_packages_service_worker_service_worker_b, ngswAppInitializer as ɵangular_packages_service_worker_service_worker_c, ngswCommChannelFactory as ɵangular_packages_service_worker_service_worker_d };
//# sourceMappingURL=service-worker.js.map
