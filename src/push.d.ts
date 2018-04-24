import { Observable } from 'rxjs';
import { NgswCommChannel } from './low_level';
/**
 * Subscribe and listen to push notifications from the Service Worker.
 *
 * @experimental
 */
export declare class SwPush {
    private sw;
    readonly messages: Observable<object>;
    readonly subscription: Observable<PushSubscription | null>;
    private pushManager;
    private subscriptionChanges;
    constructor(sw: NgswCommChannel);
    /**
     * Returns true if the Service Worker is enabled (supported by the browser and enabled via
     * ServiceWorkerModule).
     */
    readonly isEnabled: boolean;
    requestSubscription(options: {
        serverPublicKey: string;
    }): Promise<PushSubscription>;
    unsubscribe(): Promise<void>;
}
