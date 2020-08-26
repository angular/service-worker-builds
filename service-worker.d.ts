/**
 * @license Angular v10.0.14
 * (c) 2010-2020 Google LLC. https://angular.io/
 * License: MIT
 */

import { InjectionToken } from '@angular/core';
import { Injector } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * @publicApi
 */
export declare class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    static register(script: string, opts?: SwRegistrationOptions): ModuleWithProviders<ServiceWorkerModule>;
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
export declare class SwPush {
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
    constructor(sw: ɵangular_packages_service_worker_service_worker_a);
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
export declare abstract class SwRegistrationOptions {
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
     * - An [Observable](guide/observables) factory function: A function that returns an `Observable`.
     *     The function will be used at runtime to obtain and subscribe to the `Observable` and the
     *     ServiceWorker will be registered as soon as the first value is emitted.
     *
     * Default: 'registerWhenStable:30000'
     */
    registrationStrategy?: string | (() => Observable<unknown>);
}

/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @publicApi
 */
export declare class SwUpdate {
    private sw;
    /**
     * Emits an `UpdateAvailableEvent` event whenever a new app version is available.
     */
    readonly available: Observable<UpdateAvailableEvent>;
    /**
     * Emits an `UpdateActivatedEvent` event whenever the app has been updated to a new version.
     */
    readonly activated: Observable<UpdateActivatedEvent>;
    /**
     * True if the Service Worker is enabled (supported by the browser and enabled via
     * `ServiceWorkerModule`).
     */
    get isEnabled(): boolean;
    constructor(sw: ɵangular_packages_service_worker_service_worker_a);
    checkForUpdate(): Promise<void>;
    activateUpdate(): Promise<void>;
}

declare interface TypedEvent {
    type: string;
}

/**
 * An event emitted when a new version of the app has been downloaded and activated.
 *
 * @publicApi
 */
export declare interface UpdateActivatedEvent {
    type: 'UPDATE_ACTIVATED';
    previous?: {
        hash: string;
        appData?: Object;
    };
    current: {
        hash: string;
        appData?: Object;
    };
}

/**
 * An event emitted when a new version of the app is available.
 *
 * @publicApi
 */
export declare interface UpdateAvailableEvent {
    type: 'UPDATE_AVAILABLE';
    current: {
        hash: string;
        appData?: Object;
    };
    available: {
        hash: string;
        appData?: Object;
    };
}

/**
 * @publicApi
 */
export declare class ɵangular_packages_service_worker_service_worker_a {
    private serviceWorker;
    readonly worker: Observable<ServiceWorker>;
    readonly registration: Observable<ServiceWorkerRegistration>;
    readonly events: Observable<TypedEvent>;
    constructor(serviceWorker: ServiceWorkerContainer | undefined);
    postMessage(action: string, payload: Object): Promise<void>;
    postMessageWithStatus(type: string, payload: Object, nonce: number): Promise<void>;
    generateNonce(): number;
    eventsOfType<T extends TypedEvent>(type: T['type']): Observable<T>;
    nextEventOfType<T extends TypedEvent>(type: T['type']): Observable<T>;
    waitForStatus(nonce: number): Promise<void>;
    get isEnabled(): boolean;
}

export declare const ɵangular_packages_service_worker_service_worker_b: InjectionToken<string>;

export declare function ɵangular_packages_service_worker_service_worker_c(injector: Injector, script: string, options: SwRegistrationOptions, platformId: string): Function;

export declare function ɵangular_packages_service_worker_service_worker_d(opts: SwRegistrationOptions, platformId: string): ɵangular_packages_service_worker_service_worker_a;

export { }
