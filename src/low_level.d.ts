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
    constructor(serviceWorker: ServiceWorkerContainer | undefined);
}
