/**
 * @license Angular v20.0.0-rc.1+sha-545bd3e
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */

import * as i0 from '@angular/core';
import { ɵRuntimeError as _RuntimeError, ApplicationRef, Injectable, makeEnvironmentProviders, InjectionToken, Injector, provideAppInitializer, inject, NgZone, ɵformatRuntimeError as _formatRuntimeError, NgModule } from '@angular/core';
import { Observable, Subject, NEVER } from 'rxjs';
import { switchMap, take, filter, map } from 'rxjs/operators';

const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
/**
 * @publicApi
 */
class NgswCommChannel {
    serviceWorker;
    worker;
    registration;
    events;
    constructor(serviceWorker, injector) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker =
                this.events =
                    this.registration =
                        new Observable((subscriber) => subscriber.error(new _RuntimeError(5601 /* RuntimeErrorCode.SERVICE_WORKER_DISABLED_OR_NOT_SUPPORTED_BY_THIS_BROWSER */, (typeof ngDevMode === 'undefined' || ngDevMode) && ERR_SW_NOT_SUPPORTED)));
        }
        else {
            let currentWorker = null;
            const workerSubject = new Subject();
            this.worker = new Observable((subscriber) => {
                if (currentWorker !== null) {
                    subscriber.next(currentWorker);
                }
                return workerSubject.subscribe((v) => subscriber.next(v));
            });
            const updateController = () => {
                const { controller } = serviceWorker;
                if (controller === null) {
                    return;
                }
                currentWorker = controller;
                workerSubject.next(currentWorker);
            };
            serviceWorker.addEventListener('controllerchange', updateController);
            updateController();
            this.registration = (this.worker.pipe(switchMap(() => serviceWorker.getRegistration())));
            const _events = new Subject();
            this.events = _events.asObservable();
            const messageListener = (event) => {
                const { data } = event;
                if (data?.type) {
                    _events.next(data);
                }
            };
            serviceWorker.addEventListener('message', messageListener);
            // The injector is optional to avoid breaking changes.
            const appRef = injector?.get(ApplicationRef, null, { optional: true });
            appRef?.onDestroy(() => {
                serviceWorker.removeEventListener('controllerchange', updateController);
                serviceWorker.removeEventListener('message', messageListener);
            });
        }
    }
    postMessage(action, payload) {
        return new Promise((resolve) => {
            this.worker.pipe(take(1)).subscribe((sw) => {
                sw.postMessage({
                    action,
                    ...payload,
                });
                resolve();
            });
        });
    }
    postMessageWithOperation(type, payload, operationNonce) {
        const waitForOperationCompleted = this.waitForOperationCompleted(operationNonce);
        const postMessage = this.postMessage(type, payload);
        return Promise.all([postMessage, waitForOperationCompleted]).then(([, result]) => result);
    }
    generateNonce() {
        return Math.round(Math.random() * 10000000);
    }
    eventsOfType(type) {
        let filterFn;
        if (typeof type === 'string') {
            filterFn = (event) => event.type === type;
        }
        else {
            filterFn = (event) => type.includes(event.type);
        }
        return this.events.pipe(filter(filterFn));
    }
    nextEventOfType(type) {
        return this.eventsOfType(type).pipe(take(1));
    }
    waitForOperationCompleted(nonce) {
        return new Promise((resolve, reject) => {
            this.eventsOfType('OPERATION_COMPLETED')
                .pipe(filter((event) => event.nonce === nonce), take(1), map((event) => {
                if (event.result !== undefined) {
                    return event.result;
                }
                throw new Error(event.error);
            }))
                .subscribe({
                next: resolve,
                error: reject,
            });
        });
    }
    get isEnabled() {
        return !!this.serviceWorker;
    }
}

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
 *     "badge": USVString,
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
 * You can read more on handling notification clicks in the [Service worker notifications
 * guide](ecosystem/service-workers/push-notifications).
 *
 * @see [Push Notifications](https://developers.google.com/web/fundamentals/codelabs/push-notifications/)
 * @see [Angular Push Notifications](https://blog.angular-university.io/angular-push-notifications/)
 * @see [MDN: Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
 * @see [MDN: Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
 * @see [MDN: Web Push API Notifications best practices](https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices)
 *
 * @publicApi
 */
class SwPush {
    sw;
    /**
     * Emits the payloads of the received push notification messages.
     */
    messages;
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
     */
    notificationClicks;
    /**
     * Emits the currently active
     * [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
     * associated to the Service Worker registration or `null` if there is no subscription.
     */
    subscription;
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    get isEnabled() {
        return this.sw.isEnabled;
    }
    pushManager = null;
    subscriptionChanges = new Subject();
    constructor(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.messages = NEVER;
            this.notificationClicks = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map((message) => message.data));
        this.notificationClicks = this.sw
            .eventsOfType('NOTIFICATION_CLICK')
            .pipe(map((message) => message.data));
        this.pushManager = this.sw.registration.pipe(map((registration) => registration.pushManager));
        const workerDrivenSubscriptions = this.pushManager.pipe(switchMap((pm) => pm.getSubscription()));
        this.subscription = new Observable((subscriber) => {
            const workerDrivenSubscription = workerDrivenSubscriptions.subscribe(subscriber);
            const subscriptionChanges = this.subscriptionChanges.subscribe(subscriber);
            return () => {
                workerDrivenSubscription.unsubscribe();
                subscriptionChanges.unsubscribe();
            };
        });
    }
    /**
     * Subscribes to Web Push Notifications,
     * after requesting and receiving user permission.
     *
     * @param options An object containing the `serverPublicKey` string.
     * @returns A Promise that resolves to the new subscription object.
     */
    requestSubscription(options) {
        if (!this.sw.isEnabled || this.pushManager === null) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const pushOptions = { userVisibleOnly: true };
        let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
        let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
        for (let i = 0; i < key.length; i++) {
            applicationServerKey[i] = key.charCodeAt(i);
        }
        pushOptions.applicationServerKey = applicationServerKey;
        return new Promise((resolve, reject) => {
            this.pushManager.pipe(switchMap((pm) => pm.subscribe(pushOptions)), take(1)).subscribe({
                next: (sub) => {
                    this.subscriptionChanges.next(sub);
                    resolve(sub);
                },
                error: reject,
            });
        });
    }
    /**
     * Unsubscribes from Service Worker push notifications.
     *
     * @returns A Promise that is resolved when the operation succeeds, or is rejected if there is no
     *          active subscription or the unsubscribe operation fails.
     */
    unsubscribe() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const doUnsubscribe = (sub) => {
            if (sub === null) {
                throw new _RuntimeError(5602 /* RuntimeErrorCode.NOT_SUBSCRIBED_TO_PUSH_NOTIFICATIONS */, (typeof ngDevMode === 'undefined' || ngDevMode) &&
                    'Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then((success) => {
                if (!success) {
                    throw new _RuntimeError(5603 /* RuntimeErrorCode.PUSH_SUBSCRIPTION_UNSUBSCRIBE_FAILED */, (typeof ngDevMode === 'undefined' || ngDevMode) && 'Unsubscribe failed!');
                }
                this.subscriptionChanges.next(null);
            });
        };
        return new Promise((resolve, reject) => {
            this.subscription
                .pipe(take(1), switchMap(doUnsubscribe))
                .subscribe({ next: resolve, error: reject });
        });
    }
    decodeBase64(input) {
        return atob(input);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: SwPush, deps: [{ token: NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: SwPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: SwPush, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: NgswCommChannel }] });

/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @see {@link /ecosystem/service-workers/communications Service Worker Communication Guide}
 *
 * @publicApi
 */
class SwUpdate {
    sw;
    /**
     * Emits a `VersionDetectedEvent` event whenever a new version is detected on the server.
     *
     * Emits a `VersionInstallationFailedEvent` event whenever checking for or downloading a new
     * version fails.
     *
     * Emits a `VersionReadyEvent` event whenever a new version has been downloaded and is ready for
     * activation.
     */
    versionUpdates;
    /**
     * Emits an `UnrecoverableStateEvent` event whenever the version of the app used by the service
     * worker to serve this client is in a broken state that cannot be recovered from without a full
     * page reload.
     */
    unrecoverable;
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    get isEnabled() {
        return this.sw.isEnabled;
    }
    constructor(sw) {
        this.sw = sw;
        if (!sw.isEnabled) {
            this.versionUpdates = NEVER;
            this.unrecoverable = NEVER;
            return;
        }
        this.versionUpdates = this.sw.eventsOfType([
            'VERSION_DETECTED',
            'VERSION_INSTALLATION_FAILED',
            'VERSION_READY',
            'NO_NEW_VERSION_DETECTED',
        ]);
        this.unrecoverable = this.sw.eventsOfType('UNRECOVERABLE_STATE');
    }
    /**
     * Checks for an update and waits until the new version is downloaded from the server and ready
     * for activation.
     *
     * @returns a promise that
     * - resolves to `true` if a new version was found and is ready to be activated.
     * - resolves to `false` if no new version was found
     * - rejects if any error occurs
     */
    checkForUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
        }
        const nonce = this.sw.generateNonce();
        return this.sw.postMessageWithOperation('CHECK_FOR_UPDATES', { nonce }, nonce);
    }
    /**
     * Updates the current client (i.e. browser tab) to the latest version that is ready for
     * activation.
     *
     * In most cases, you should not use this method and instead should update a client by reloading
     * the page.
     *
     * <div class="docs-alert docs-alert-important">
     *
     * Updating a client without reloading can easily result in a broken application due to a version
     * mismatch between the application shell and other page resources,
     * such as lazy-loaded chunks, whose filenames may change between
     * versions.
     *
     * Only use this method, if you are certain it is safe for your specific use case.
     *
     * </div>
     *
     * @returns a promise that
     *  - resolves to `true` if an update was activated successfully
     *  - resolves to `false` if no update was available (for example, the client was already on the
     *    latest version).
     *  - rejects if any error occurs
     */
    activateUpdate() {
        if (!this.sw.isEnabled) {
            return Promise.reject(new _RuntimeError(5601 /* RuntimeErrorCode.SERVICE_WORKER_DISABLED_OR_NOT_SUPPORTED_BY_THIS_BROWSER */, (typeof ngDevMode === 'undefined' || ngDevMode) && ERR_SW_NOT_SUPPORTED));
        }
        const nonce = this.sw.generateNonce();
        return this.sw.postMessageWithOperation('ACTIVATE_UPDATE', { nonce }, nonce);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: SwUpdate, deps: [{ token: NgswCommChannel }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: SwUpdate });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: SwUpdate, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: NgswCommChannel }] });

/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
const SCRIPT = new InjectionToken(ngDevMode ? 'NGSW_REGISTER_SCRIPT' : '');
function ngswAppInitializer() {
    if (typeof ngServerMode !== 'undefined' && ngServerMode) {
        return;
    }
    const options = inject(SwRegistrationOptions);
    if (!('serviceWorker' in navigator && options.enabled !== false)) {
        return;
    }
    const script = inject(SCRIPT);
    const ngZone = inject(NgZone);
    const appRef = inject(ApplicationRef);
    // Set up the `controllerchange` event listener outside of
    // the Angular zone to avoid unnecessary change detections,
    // as this event has no impact on view updates.
    ngZone.runOutsideAngular(() => {
        // Wait for service worker controller changes, and fire an INITIALIZE action when a new SW
        // becomes active. This allows the SW to initialize itself even if there is no application
        // traffic.
        const sw = navigator.serviceWorker;
        const onControllerChange = () => sw.controller?.postMessage({ action: 'INITIALIZE' });
        sw.addEventListener('controllerchange', onControllerChange);
        appRef.onDestroy(() => {
            sw.removeEventListener('controllerchange', onControllerChange);
        });
    });
    // Run outside the Angular zone to avoid preventing the app from stabilizing (especially
    // given that some registration strategies wait for the app to stabilize).
    ngZone.runOutsideAngular(() => {
        let readyToRegister;
        const { registrationStrategy } = options;
        if (typeof registrationStrategy === 'function') {
            readyToRegister = new Promise((resolve) => registrationStrategy().subscribe(() => resolve()));
        }
        else {
            const [strategy, ...args] = (registrationStrategy || 'registerWhenStable:30000').split(':');
            switch (strategy) {
                case 'registerImmediately':
                    readyToRegister = Promise.resolve();
                    break;
                case 'registerWithDelay':
                    readyToRegister = delayWithTimeout(+args[0] || 0);
                    break;
                case 'registerWhenStable':
                    readyToRegister = Promise.race([appRef.whenStable(), delayWithTimeout(+args[0])]);
                    break;
                default:
                    // Unknown strategy.
                    throw new _RuntimeError(5600 /* RuntimeErrorCode.UNKNOWN_REGISTRATION_STRATEGY */, (typeof ngDevMode === 'undefined' || ngDevMode) &&
                        `Unknown ServiceWorker registration strategy: ${options.registrationStrategy}`);
            }
        }
        // Don't return anything to avoid blocking the application until the SW is registered.
        // Catch and log the error if SW registration fails to avoid uncaught rejection warning.
        readyToRegister.then(() => navigator.serviceWorker
            .register(script, { scope: options.scope })
            .catch((err) => console.error(_formatRuntimeError(5604 /* RuntimeErrorCode.SERVICE_WORKER_REGISTRATION_FAILED */, (typeof ngDevMode === 'undefined' || ngDevMode) &&
            'Service worker registration failed with: ' + err))));
    });
}
function delayWithTimeout(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}
function ngswCommChannelFactory(opts, injector) {
    const isBrowser = !(typeof ngServerMode !== 'undefined' && ngServerMode);
    return new NgswCommChannel(isBrowser && opts.enabled !== false ? navigator.serviceWorker : undefined, injector);
}
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
class SwRegistrationOptions {
    /**
     * Whether the ServiceWorker will be registered and the related services (such as `SwPush` and
     * `SwUpdate`) will attempt to communicate and interact with it.
     *
     * Default: true
     */
    enabled;
    /**
     * A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
     * control. It will be used when calling
     * [ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
     */
    scope;
    /**
     * Defines the ServiceWorker registration strategy, which determines when it will be registered
     * with the browser.
     *
     * The default behavior of registering once the application stabilizes (i.e. as soon as there are
     * no pending micro- and macro-tasks) is designed to register the ServiceWorker as soon as
     * possible but without affecting the application's first time load.
     *
     * Still, there might be cases where you want more control over when the ServiceWorker is
     * registered (for example, there might be a long-running timeout or polling interval, preventing
     * the app from stabilizing). The available option are:
     *
     * - `registerWhenStable:<timeout>`: Register as soon as the application stabilizes (no pending
     *     micro-/macro-tasks) but no later than `<timeout>` milliseconds. If the app hasn't
     *     stabilized after `<timeout>` milliseconds (for example, due to a recurrent asynchronous
     *     task), the ServiceWorker will be registered anyway.
     *     If `<timeout>` is omitted, the ServiceWorker will only be registered once the app
     *     stabilizes.
     * - `registerImmediately`: Register immediately.
     * - `registerWithDelay:<timeout>`: Register with a delay of `<timeout>` milliseconds. For
     *     example, use `registerWithDelay:5000` to register the ServiceWorker after 5 seconds. If
     *     `<timeout>` is omitted, is defaults to `0`, which will register the ServiceWorker as soon
     *     as possible but still asynchronously, once all pending micro-tasks are completed.
     * - An Observable factory function: A function that returns an `Observable`.
     *     The function will be used at runtime to obtain and subscribe to the `Observable` and the
     *     ServiceWorker will be registered as soon as the first value is emitted.
     *
     * Default: 'registerWhenStable:30000'
     */
    registrationStrategy;
}
/**
 * @publicApi
 *
 * Sets up providers to register the given Angular Service Worker script.
 *
 * If `enabled` is set to `false` in the given options, the module will behave as if service
 * workers are not supported by the browser, and the service worker will not be registered.
 *
 * Example usage:
 * ```ts
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideServiceWorker('ngsw-worker.js')
 *   ],
 * });
 * ```
 */
function provideServiceWorker(script, options = {}) {
    return makeEnvironmentProviders([
        SwPush,
        SwUpdate,
        { provide: SCRIPT, useValue: script },
        { provide: SwRegistrationOptions, useValue: options },
        {
            provide: NgswCommChannel,
            useFactory: ngswCommChannelFactory,
            deps: [SwRegistrationOptions, Injector],
        },
        provideAppInitializer(ngswAppInitializer),
    ]);
}

/**
 * @publicApi
 */
class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    static register(script, options = {}) {
        return {
            ngModule: ServiceWorkerModule,
            providers: [provideServiceWorker(script, options)],
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: ServiceWorkerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: ServiceWorkerModule });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: ServiceWorkerModule, providers: [SwPush, SwUpdate] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.0.0-rc.1+sha-545bd3e", ngImport: i0, type: ServiceWorkerModule, decorators: [{
            type: NgModule,
            args: [{ providers: [SwPush, SwUpdate] }]
        }] });

export { ServiceWorkerModule, SwPush, SwRegistrationOptions, SwUpdate, provideServiceWorker };
//# sourceMappingURL=service-worker.mjs.map
