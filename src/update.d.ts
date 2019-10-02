import { Observable } from 'rxjs';
import { NgswCommChannel, UpdateActivatedEvent, UpdateAvailableEvent } from './low_level';
import * as i0 from "@angular/core";
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
    constructor(sw: NgswCommChannel);
    checkForUpdate(): Promise<void>;
    activateUpdate(): Promise<void>;
    static ngFactoryDef: i0.ɵɵFactoryDef<SwUpdate>;
    static ngInjectableDef: i0.ɵɵInjectableDef<SwUpdate>;
}
