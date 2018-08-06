/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare const ERR_SW_NOT_SUPPORTED = "Service workers are disabled or not supported by this browser";
export interface Version {
    hash: string;
    appData?: Object;
}
/**
 * @experimental
 */
export interface UpdateAvailableEvent {
    type: 'UPDATE_AVAILABLE';
    current: Version;
    available: Version;
}
/**
 * @experimental
 */
export interface UpdateActivatedEvent {
    type: 'UPDATE_ACTIVATED';
    previous?: Version;
    current: Version;
}
export declare type IncomingEvent = UpdateAvailableEvent | UpdateActivatedEvent;
export interface TypedEvent {
    type: string;
}
/**
 * @experimental
*/
export declare class NgswCommChannel {
    private serviceWorker;
    constructor(serviceWorker: ServiceWorkerContainer | undefined);
    readonly isEnabled: boolean;
}
