import { Observable } from 'rxjs/Observable';
import { NgswCommChannel, UpdateActivatedEvent, UpdateAvailableEvent } from './low_level';
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @experimental
 */
export declare class SwUpdate {
    private sw;
    readonly available: Observable<UpdateAvailableEvent>;
    readonly activated: Observable<UpdateActivatedEvent>;
    constructor(sw: NgswCommChannel);
    checkForUpdate(): Promise<void>;
    activateUpdate(): Promise<void>;
}
