/**
 * @license Angular v8.0.0-beta.6+51.sha-dcafdde.with-local-changes
 * (c) 2010-2019 Google LLC. https://angular.io/
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
    static register(script: string, opts?: {
        scope?: string;
        enabled?: boolean;
    }): ModuleWithProviders<ServiceWorkerModule>;
}

/**
 * Subscribe and listen to push notifications from the Service Worker.
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
     * interacted with. If no action was used the action property will be an empty string `''`.
     *
     * Note that the `notification` property is **not** a [Notification][Mozilla Notification] object
     * but rather a
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
    readonly isEnabled: boolean;
    private pushManager;
    private subscriptionChanges;
    constructor(sw: ɵangular_packages_service_worker_service_worker_a);
    requestSubscription(options: {
        serverPublicKey: string;
    }): Promise<PushSubscription>;
    unsubscribe(): Promise<void>;
    private decodeBase64;
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
    readonly isEnabled: boolean;
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
    readonly isEnabled: boolean;
}

export declare abstract class ɵangular_packages_service_worker_service_worker_b {
    scope?: string;
    enabled?: boolean;
}

export declare const ɵangular_packages_service_worker_service_worker_c: InjectionToken<string>;

export declare function ɵangular_packages_service_worker_service_worker_d(injector: Injector, script: string, options: ɵangular_packages_service_worker_service_worker_b, platformId: string): Function;

export declare function ɵangular_packages_service_worker_service_worker_e(opts: ɵangular_packages_service_worker_service_worker_b, platformId: string): ɵangular_packages_service_worker_service_worker_a;

export { }
