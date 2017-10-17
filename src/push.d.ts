import { Observable } from 'rxjs/Observable';
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
    requestSubscription(options: {
        serverPublicKey: string;
    }): Promise<PushSubscription>;
    unsubscribe(): Promise<void>;
}
