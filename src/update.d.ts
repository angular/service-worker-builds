/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Observable } from 'rxjs';
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
    /**
     * Returns true if the Service Worker is enabled (supported by the browser and enabled via
     * ServiceWorkerModule).
     */
    readonly isEnabled: boolean;
    checkForUpdate(): Promise<void>;
    activateUpdate(): Promise<void>;
}
