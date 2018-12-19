/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
export declare const ERR_SW_NOT_SUPPORTED = "Service workers are disabled or not supported by this browser";
/**
 * An event emitted when a new version of the app is available.
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
 * An event emitted when a `PushEvent` is received by the service worker.
 */
export interface PushEvent {
    type: 'PUSH';
    data: any;
}
export declare type IncomingEvent = UpdateAvailableEvent | UpdateActivatedEvent;
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
    readonly isEnabled: boolean;
}
