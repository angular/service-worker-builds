import { Observable } from 'rxjs';
import { NgswCommChannel, UnrecoverableStateEvent, UpdateActivatedEvent, UpdateAvailableEvent } from './low_level';
import * as i0 from "@angular/core";
/**
 * Subscribe to update notifications from the Service Worker, trigger update
 * checks, and forcibly activate updates.
 *
 * @see {@link guide/service-worker-communications Service worker communication guide}
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
    checkForUpdate(): Promise<void>;
    activateUpdate(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwUpdate, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SwUpdate>;
}
