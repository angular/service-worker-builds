/**
 * @license Angular v6.1.9
 * (c) 2010-2018 Google, Inc. https://angular.io/
 * License: MIT
 */

import { concat, defer, fromEvent, of, throwError, NEVER, Subject, merge } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
import { Injectable, APP_INITIALIZER, ApplicationRef, InjectionToken, Injector, NgModule, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
/**
 * @param {?} message
 * @return {?}
 */
function errorObservable(message) {
    return defer(() => throwError(new Error(message)));
}
/**
 * \@experimental
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
            const controllerChangeEvents = /** @type {?} */ ((fromEvent(serviceWorker, 'controllerchange')));
            /** @type {?} */
            const controllerChanges = /** @type {?} */ ((controllerChangeEvents.pipe(map(() => serviceWorker.controller))));
            /** @type {?} */
            const currentController = /** @type {?} */ ((defer(() => of(serviceWorker.controller))));
            /** @type {?} */
            const controllerWithChanges = /** @type {?} */ ((concat(currentController, controllerChanges)));
            this.worker = /** @type {?} */ ((controllerWithChanges.pipe(filter((c) => !!c))));
            this.registration = /** @type {?} */ ((this.worker.pipe(switchMap(() => serviceWorker.getRegistration()))));
            /** @type {?} */
            const rawEvents = fromEvent(serviceWorker, 'message');
            /** @type {?} */
            const rawEventPayload = rawEvents.pipe(map((event) => event.data));
            /** @type {?} */
            const eventsUnconnected = (rawEventPayload.pipe(filter((event) => !!event && !!(/** @type {?} */ (event))['type'])));
            /** @type {?} */
            const events = /** @type {?} */ (eventsUnconnected.pipe(publish()));
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
        return this.worker
            .pipe(take(1), tap((sw) => {
            sw.postMessage(Object.assign({ action }, payload));
        }))
            .toPromise()
            .then(() => undefined);
    }
    /**
     * \@internal
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
        return /** @type {?} */ (this.events.pipe(filter((event) => { return event.type === type; })));
    }
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    nextEventOfType(type) {
        return /** @type {?} */ ((this.eventsOfType(type).pipe(take(1))));
    }
    /**
     * \@internal
     * @param {?} nonce
     * @return {?}
     */
    waitForStatus(nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter((event) => event.nonce === nonce), take(1), map((event) => {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        }))
            .toPromise();
    }
    /**
     * @return {?}
     */
    get isEnabled() { return !!this.serviceWorker; }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
            this.messages = NEVER;
            this.subscription = NEVER;
            return;
        }
        this.messages = this.sw.eventsOfType('PUSH').pipe(map((message) => message.data));
        this.pushManager = this.sw.registration.pipe(map((registration) => { return registration.pushManager; }));
        /** @type {?} */
        const workerDrivenSubscriptions = this.pushManager.pipe(switchMap((pm) => pm.getSubscription().then(sub => { return sub; })));
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
        /** @type {?} */
        const doUnsubscribe = (sub) => {
            if (sub === null) {
                throw new Error('Not subscribed to push notifications.');
            }
            return sub.unsubscribe().then(success => {
                if (!success) {
                    throw new Error('Unsubscribe failed!');
                }
                this.subscriptionChanges.next(null);
            });
        };
        return this.subscription.pipe(take(1), switchMap(doUnsubscribe)).toPromise();
    }
    /**
     * @param {?} input
     * @return {?}
     */
    decodeBase64(input) { return atob(input); }
}
SwPush.decorators = [
    { type: Injectable }
];
/** @nocollapse */
SwPush.ctorParameters = () => [
    { type: NgswCommChannel }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
            this.available = NEVER;
            this.activated = NEVER;
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class RegistrationOptions {
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
    const initializer = () => {
        /** @type {?} */
        const app = injector.get(ApplicationRef);
        if (!(isPlatformBrowser(platformId) && ('serviceWorker' in navigator) &&
            options.enabled !== false)) {
            return;
        }
        /** @type {?} */
        const whenStable = app.isStable.pipe(filter((stable) => !!stable), take(1)).toPromise();
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
    return new NgswCommChannel(isPlatformBrowser(platformId) && opts.enabled !== false ? navigator.serviceWorker :
        undefined);
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
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
// This file only reexports content of the `src` folder. Keep it that way.

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NgswCommChannel as ɵangular_packages_service_worker_service_worker_e, RegistrationOptions as ɵangular_packages_service_worker_service_worker_a, SCRIPT as ɵangular_packages_service_worker_service_worker_b, ngswAppInitializer as ɵangular_packages_service_worker_service_worker_c, ngswCommChannelFactory as ɵangular_packages_service_worker_service_worker_d, ServiceWorkerModule, SwPush, SwUpdate };
//# sourceMappingURL=service-worker.js.map
