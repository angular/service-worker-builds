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
/**
 * @experimental
*/
export declare class NgswCommChannel {
    private serviceWorker;
    constructor(serviceWorker: ServiceWorkerContainer | undefined, platformId: string);
    readonly isEnabled: boolean;
}
