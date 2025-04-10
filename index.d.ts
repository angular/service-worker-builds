/**
 * @license Angular v19.2.6+sha-77c6041
 * (c) 2010-2025 Google LLC. https://angular.io/
 * License: MIT
 */

import * as i0 from '@angular/core';
import { Injector, EnvironmentProviders, ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * An event emitted when the service worker has checked the version of the app on the server and it
 * didn't find a new version that it doesn't have already downloaded.
 *
 * @see {@link /ecosystem/service-workers/communications Service Worker Communication Guide}

 *
 * @publicApi
 */
interface NoNewVersionDetectedEvent {
    type: 'NO_NEW_VERSION_DETECTED';
    version: {
        hash: string;
        appData?: Object;
    };
}
/**
 * An event emitted when the service worker has detected a new version of the app on the server and
 * is about to start downloading it.
 *
 * @see {@link /ecosystem/service-workers/communications Service Worker Communication Guide}

 *
 * @publicApi
 */
interface VersionDetectedEvent {
    type: 'VERSION_DETECTED';
    version: {
        hash: string;
        appData?: object;
    };
}
/**
 * An event emitted when the installation of a new version failed.
 * It may be used for logging/monitoring purposes.
 *
 * @see {@link /ecosystem/service-workers/communications Service Worker Communication Guide}
 *a
 * @publicApi
 */
interface VersionInstallationFailedEvent {
    type: 'VERSION_INSTALLATION_FAILED';
    version: {
        hash: string;
        appData?: object;
    };
    error: string;
}
/**
 * An event emitted when a new version of the app is available.
 *
 * @see {@link /ecosystem/service-workers/communications Service Worker Communication Guide}

 *
 * @publicApi
 */
interface VersionReadyEvent {
    type: 'VERSION_READY';
    currentVersion: {
        hash: string;
        appData?: object;
    };
    latestVersion: {
        hash: string;
        appData?: object;
    };
}
/**
 * A union of all event types that can be emitted by
 * {@link SwUpdate#versionUpdates}.
 *
 * @publicApi
 */
type VersionEvent = VersionDetectedEvent | VersionInstallationFailedEvent | VersionReadyEvent | NoNewVersionDetectedEvent;
/**
 * An event emitted when the version of the app used by the service worker to serve this client is
 * in a broken state that cannot be recovered from and a full page reload is required.
 *
 * For example, the service worker may not be able to retrieve a required resource, neither from the
 * cache nor from the server. This could happen if a new version is deployed to the server and the
 * service worker cache has been partially cleaned by the browser, removing some files of a previous
 * app version but not all.
 *
 * @see {@link /ecosystem/service-workers/communications Service Worker Communication Guide}

 *
 * @publicApi
 */
interface UnrecoverableStateEvent {
    type: 'UNRECOVERABLE_STATE';
    reason: string;
}
interface TypedEvent {
    type: string;
}
/**
 * @publicApi
 */
declare class NgswCommChannel {
    private serviceWorker;
    readonly worker: Observable<ServiceWorker>;
    readonly registration: Observable<ServiceWorkerRegistration>;
    readonly events: Observable<TypedEvent>;
    constructor(serviceWorker: ServiceWorkerContainer | undefined, injector?: Injector);
    postMessage(action: string, payload: Object): Promise<void>;
    postMessageWithOperation(type: string, payload: Object, operationNonce: number): Promise<boolean>;
    generateNonce(): number;
    eventsOfType<T extends TypedEvent>(type: T['type'] | T['type'][]): Observable<T>;
    nextEventOfType<T extends TypedEvent>(type: T['type']): Observable<T>;
    waitForOperationCompleted(nonce: number): Promise<boolean>;
    get isEnabled(): boolean;
}

/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

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
declare abstract class SwRegistrationOptions {
    /**
     * Whether the ServiceWorker will be registered and the related services (such as `SwPush` and
     * `SwUpdate`) will attempt to communicate and interact with it.
     *
     * Default: true
     */
    enabled?: boolean;
    /**
     * A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
     * control. It will be used when calling
     * [ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
     */
    scope?: string;
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
    registrationStrategy?: string | (() => Observable<unknown>);
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
declare function provideServiceWorker(script: string, options?: SwRegistrationOptions): EnvironmentProviders;

/**
 * @publicApi
 */
declare class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    static register(script: string, options?: SwRegistrationOptions): ModuleWithProviders<ServiceWorkerModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ServiceWorkerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ServiceWorkerModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ServiceWorkerModule>;
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
declare class SwPush {
    private sw;
    /**
     * Emits the payloads of the received push notification messages.
     */
    readonly messages: Observable<object>;
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
    readonly notificationClicks: Observable<{
        action: string;
        notification: NotificationOptions & {
            title: string;
        };
    }>;
    /**
     * Emits the currently active
     * [PushSubscription](https://developer.mozilla.org/en-US/docs/Web/API/PushSubscription)
     * associated to the Service Worker registration or `null` if there is no subscription.
     */
    readonly subscription: Observable<PushSubscription | null>;
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    get isEnabled(): boolean;
    private pushManager;
    private subscriptionChanges;
    constructor(sw: NgswCommChannel);
    /**
     * Subscribes to Web Push Notifications,
     * after requesting and receiving user permission.
     *
     * @param options An object containing the `serverPublicKey` string.
     * @returns A Promise that resolves to the new subscription object.
     */
    requestSubscription(options: {
        serverPublicKey: string;
    }): Promise<PushSubscription>;
    /**
     * Unsubscribes from Service Worker push notifications.
     *
     * @returns A Promise that is resolved when the operation succeeds, or is rejected if there is no
     *          active subscription or the unsubscribe operation fails.
     */
    unsubscribe(): Promise<void>;
    private decodeBase64;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwPush, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SwPush>;
}

/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @see {@link /ecosystem/service-workers/communications Service Worker Communication Guide}
 *
 * @publicApi
 */
declare class SwUpdate {
    private sw;
    /**
     * Emits a `VersionDetectedEvent` event whenever a new version is detected on the server.
     *
     * Emits a `VersionInstallationFailedEvent` event whenever checking for or downloading a new
     * version fails.
     *
     * Emits a `VersionReadyEvent` event whenever a new version has been downloaded and is ready for
     * activation.
     */
    readonly versionUpdates: Observable<VersionEvent>;
    /**
     * Emits an `UnrecoverableStateEvent` event whenever the version of the app used by the service
     * worker to serve this client is in a broken state that cannot be recovered from without a full
     * page reload.
     */
    readonly unrecoverable: Observable<UnrecoverableStateEvent>;
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    get isEnabled(): boolean;
    constructor(sw: NgswCommChannel);
    /**
     * Checks for an update and waits until the new version is downloaded from the server and ready
     * for activation.
     *
     * @returns a promise that
     * - resolves to `true` if a new version was found and is ready to be activated.
     * - resolves to `false` if no new version was found
     * - rejects if any error occurs
     */
    checkForUpdate(): Promise<boolean>;
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
    activateUpdate(): Promise<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwUpdate, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SwUpdate>;
}

export { ServiceWorkerModule, SwPush, SwRegistrationOptions, SwUpdate, provideServiceWorker };
export type { NoNewVersionDetectedEvent, UnrecoverableStateEvent, VersionDetectedEvent, VersionEvent, VersionInstallationFailedEvent, VersionReadyEvent };
