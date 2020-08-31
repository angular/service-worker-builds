/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
export declare const ERR_SW_NOT_SUPPORTED = "Service workers are disabled or not supported by this browser";
/**
 * An event emitted when a new version of the app is available.
 *
 * @see {@link guide/service-worker-communications Service worker communication guide}
 *
 * @publicApi
 */
export interface UpdateAvailableEvent {
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
 * An event emitted when a new version of the app has been downloaded and activated.
 *
 * @see {@link guide/service-worker-communications Service worker communication guide}
 *
 * @publicApi
 */
export interface UpdateActivatedEvent {
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
 * An event emitted when the version of the app used by the service worker to serve this client is
 * in a broken state that cannot be recovered from and a full page reload is required.
 *
 * For example, the service worker may not be able to retrieve a required resource, neither from the
 * cache nor from the server. This could happen if a new version is deployed to the server and the
 * service worker cache has been partially cleaned by the browser, removing some files of a previous
 * app version but not all.
 *
 * @see {@link guide/service-worker-communications Service worker communication guide}
 *
 * @publicApi
 */
export interface UnrecoverableStateEvent {
    type: 'UNRECOVERABLE_STATE';
    reason: string;
}
/**
 * An event emitted when a `PushEvent` is received by the service worker.
 */
export interface PushEvent {
    type: 'PUSH';
    data: any;
}
export declare type IncomingEvent = UpdateAvailableEvent | UpdateActivatedEvent | UnrecoverableStateEvent;
export interface TypedEvent {
    type: string;
}
/**
 * @publicApi
 */
export declare class NgswCommChannel {
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
