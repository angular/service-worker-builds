/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
/** @type {?} */
export const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
/**
 * An event emitted when a new version of the app is available.
 *
 * \@publicApi
 * @record
 */
export function UpdateAvailableEvent() { }
if (false) {
    /** @type {?} */
    UpdateAvailableEvent.prototype.type;
    /** @type {?} */
    UpdateAvailableEvent.prototype.current;
    /** @type {?} */
    UpdateAvailableEvent.prototype.available;
}
/**
 * An event emitted when a new version of the app has been downloaded and activated.
 *
 * \@publicApi
 * @record
 */
export function UpdateActivatedEvent() { }
if (false) {
    /** @type {?} */
    UpdateActivatedEvent.prototype.type;
    /** @type {?|undefined} */
    UpdateActivatedEvent.prototype.previous;
    /** @type {?} */
    UpdateActivatedEvent.prototype.current;
}
/**
 * An event emitted when a `PushEvent` is received by the service worker.
 * @record
 */
export function PushEvent() { }
if (false) {
    /** @type {?} */
    PushEvent.prototype.type;
    /** @type {?} */
    PushEvent.prototype.data;
}
/**
 * @record
 */
export function TypedEvent() { }
if (false) {
    /** @type {?} */
    TypedEvent.prototype.type;
}
/**
 * @record
 */
function StatusEvent() { }
if (false) {
    /** @type {?} */
    StatusEvent.prototype.type;
    /** @type {?} */
    StatusEvent.prototype.nonce;
    /** @type {?} */
    StatusEvent.prototype.status;
    /** @type {?|undefined} */
    StatusEvent.prototype.error;
}
/**
 * @param {?} message
 * @return {?}
 */
function errorObservable(message) {
    return defer((/**
     * @return {?}
     */
    () => throwError(new Error(message))));
}
/**
 * \@publicApi
 */
export class NgswCommChannel {
    /**
     * @param {?} serviceWorker
     */
    constructor(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            /** @type {?} */
            const controllerChangeEvents = fromEvent(serviceWorker, 'controllerchange');
            /** @type {?} */
            const controllerChanges = controllerChangeEvents.pipe(map((/**
             * @return {?}
             */
            () => serviceWorker.controller)));
            /** @type {?} */
            const currentController = defer((/**
             * @return {?}
             */
            () => of(serviceWorker.controller)));
            /** @type {?} */
            const controllerWithChanges = concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(filter((/**
             * @param {?} c
             * @return {?}
             */
            c => !!c)));
            this.registration = (/** @type {?} */ ((this.worker.pipe(switchMap((/**
             * @return {?}
             */
            () => serviceWorker.getRegistration()))))));
            /** @type {?} */
            const rawEvents = fromEvent(serviceWorker, 'message');
            /** @type {?} */
            const rawEventPayload = rawEvents.pipe(map((/**
             * @param {?} event
             * @return {?}
             */
            event => event.data)));
            /** @type {?} */
            const eventsUnconnected = rawEventPayload.pipe(filter((/**
             * @param {?} event
             * @return {?}
             */
            event => event && event.type)));
            /** @type {?} */
            const events = (/** @type {?} */ (eventsUnconnected.pipe(publish())));
            events.connect();
            this.events = events;
        }
    }
    /**
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    postMessage(action, payload) {
        return this.worker
            .pipe(take(1), tap((/**
         * @param {?} sw
         * @return {?}
         */
        (sw) => {
            sw.postMessage(Object.assign({ action }, payload));
        })))
            .toPromise()
            .then((/**
         * @return {?}
         */
        () => undefined));
    }
    /**
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    postMessageWithStatus(type, payload, nonce) {
        /** @type {?} */
        const waitForStatus = this.waitForStatus(nonce);
        /** @type {?} */
        const postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then((/**
         * @return {?}
         */
        () => undefined));
    }
    /**
     * @return {?}
     */
    generateNonce() { return Math.round(Math.random() * 10000000); }
    /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    eventsOfType(type) {
        /** @type {?} */
        const filterFn = (/**
         * @param {?} event
         * @return {?}
         */
        (event) => event.type === type);
        return this.events.pipe(filter(filterFn));
    }
    /**
     * @template T
     * @param {?} type
     * @return {?}
     */
    nextEventOfType(type) {
        return this.eventsOfType(type).pipe(take(1));
    }
    /**
     * @param {?} nonce
     * @return {?}
     */
    waitForStatus(nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter((/**
         * @param {?} event
         * @return {?}
         */
        event => event.nonce === nonce)), take(1), map((/**
         * @param {?} event
         * @return {?}
         */
        event => {
            if (event.status) {
                return undefined;
            }
            throw new Error((/** @type {?} */ (event.error)));
        })))
            .toPromise();
    }
    /**
     * @return {?}
     */
    get isEnabled() { return !!this.serviceWorker; }
}
if (false) {
    /** @type {?} */
    NgswCommChannel.prototype.worker;
    /** @type {?} */
    NgswCommChannel.prototype.registration;
    /** @type {?} */
    NgswCommChannel.prototype.events;
    /**
     * @type {?}
     * @private
     */
    NgswCommChannel.prototype.serviceWorker;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBb0MsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFHLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsRyxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFMUUsTUFBTSxPQUFPLG9CQUFvQixHQUFHLCtEQUErRDs7Ozs7OztBQU9uRywwQ0FJQzs7O0lBSEMsb0NBQXlCOztJQUN6Qix1Q0FBMEM7O0lBQzFDLHlDQUE0Qzs7Ozs7Ozs7QUFROUMsMENBSUM7OztJQUhDLG9DQUF5Qjs7SUFDekIsd0NBQTRDOztJQUM1Qyx1Q0FBMEM7Ozs7OztBQU01QywrQkFHQzs7O0lBRkMseUJBQWE7O0lBQ2IseUJBQVU7Ozs7O0FBS1osZ0NBQTZDOzs7SUFBZiwwQkFBYTs7Ozs7QUFFM0MsMEJBS0M7OztJQUpDLDJCQUFlOztJQUNmLDRCQUFjOztJQUNkLDZCQUFnQjs7SUFDaEIsNEJBQWU7Ozs7OztBQUlqQixTQUFTLGVBQWUsQ0FBQyxPQUFlO0lBQ3RDLE9BQU8sS0FBSzs7O0lBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUMsQ0FBQztBQUNyRCxDQUFDOzs7O0FBS0QsTUFBTSxPQUFPLGVBQWU7Ozs7SUFPMUIsWUFBb0IsYUFBK0M7UUFBL0Msa0JBQWEsR0FBYixhQUFhLENBQWtDO1FBQ2pFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFH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QUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7Ozs7SUFFRCxlQUFlLENBQXVCLElBQWU7UUFDbkQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7OztJQUVELGFBQWEsQ0FBQyxLQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBYyxRQUFRLENBQUM7YUFDMUMsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUc7Ozs7UUFBQyxLQUFLLENBQUMsRUFBRTtZQUMzRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBQSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNqQyxDQUFDLEVBQUMsQ0FBQzthQUNSLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7SUFFRCxJQUFJLFNBQVMsS0FBYyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztDQUMxRDs7O0lBdEVDLGlDQUEyQzs7SUFFM0MsdUNBQTZEOztJQUU3RCxpQ0FBd0M7Ozs7O0lBRTVCLHdDQUF1RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25uZWN0YWJsZU9ic2VydmFibGUsIE9ic2VydmFibGUsIGNvbmNhdCwgZGVmZXIsIGZyb21FdmVudCwgb2YgLCB0aHJvd0Vycm9yfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXAsIHB1Ymxpc2gsIHN3aXRjaE1hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBFUlJfU1dfTk9UX1NVUFBPUlRFRCA9ICdTZXJ2aWNlIHdvcmtlcnMgYXJlIGRpc2FibGVkIG9yIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyJztcblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gYSBuZXcgdmVyc2lvbiBvZiB0aGUgYXBwIGlzIGF2YWlsYWJsZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQXZhaWxhYmxlRXZlbnQge1xuICB0eXBlOiAnVVBEQVRFX0FWQUlMQUJMRSc7XG4gIGN1cnJlbnQ6IHtoYXNoOiBzdHJpbmcsIGFwcERhdGE/OiBPYmplY3R9O1xuICBhdmFpbGFibGU6IHtoYXNoOiBzdHJpbmcsIGFwcERhdGE/OiBPYmplY3R9O1xufVxuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIG5ldyB2ZXJzaW9uIG9mIHRoZSBhcHAgaGFzIGJlZW4gZG93bmxvYWRlZCBhbmQgYWN0aXZhdGVkLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVBY3RpdmF0ZWRFdmVudCB7XG4gIHR5cGU6ICdVUERBVEVfQUNUSVZBVEVEJztcbiAgcHJldmlvdXM/OiB7aGFzaDogc3RyaW5nLCBhcHBEYXRhPzogT2JqZWN0fTtcbiAgY3VycmVudDoge2hhc2g6IHN0cmluZywgYXBwRGF0YT86IE9iamVjdH07XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIGEgYFB1c2hFdmVudGAgaXMgcmVjZWl2ZWQgYnkgdGhlIHNlcnZpY2Ugd29ya2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFB1c2hFdmVudCB7XG4gIHR5cGU6ICdQVVNIJztcbiAgZGF0YTogYW55O1xufVxuXG5leHBvcnQgdHlwZSBJbmNvbWluZ0V2ZW50ID0gVXBkYXRlQXZhaWxhYmxlRXZlbnQgfCBVcGRhdGVBY3RpdmF0ZWRFdmVudDtcblxuZXhwb3J0IGludGVyZmFjZSBUeXBlZEV2ZW50IHsgdHlwZTogc3RyaW5nOyB9XG5cbmludGVyZmFjZSBTdGF0dXNFdmVudCB7XG4gIHR5cGU6ICdTVEFUVVMnO1xuICBub25jZTogbnVtYmVyO1xuICBzdGF0dXM6IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufVxuXG5cbmZ1bmN0aW9uIGVycm9yT2JzZXJ2YWJsZShtZXNzYWdlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICByZXR1cm4gZGVmZXIoKCkgPT4gdGhyb3dFcnJvcihuZXcgRXJyb3IobWVzc2FnZSkpKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ3N3Q29tbUNoYW5uZWwge1xuICByZWFkb25seSB3b3JrZXI6IE9ic2VydmFibGU8U2VydmljZVdvcmtlcj47XG5cbiAgcmVhZG9ubHkgcmVnaXN0cmF0aW9uOiBPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24+O1xuXG4gIHJlYWRvbmx5IGV2ZW50czogT2JzZXJ2YWJsZTxUeXBlZEV2ZW50PjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2VXb3JrZXI6IFNlcnZpY2VXb3JrZXJDb250YWluZXJ8dW5kZWZpbmVkKSB7XG4gICAgaWYgKCFzZXJ2aWNlV29ya2VyKSB7XG4gICAgICB0aGlzLndvcmtlciA9IHRoaXMuZXZlbnRzID0gdGhpcy5yZWdpc3RyYXRpb24gPSBlcnJvck9ic2VydmFibGUoRVJSX1NXX05PVF9TVVBQT1JURUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb250cm9sbGVyQ2hhbmdlRXZlbnRzID0gZnJvbUV2ZW50KHNlcnZpY2VXb3JrZXIsICdjb250cm9sbGVyY2hhbmdlJyk7XG4gICAgICBjb25zdCBjb250cm9sbGVyQ2hhbmdlcyA9IGNvbnRyb2xsZXJDaGFuZ2VFdmVudHMucGlwZShtYXAoKCkgPT4gc2VydmljZVdvcmtlci5jb250cm9sbGVyKSk7XG4gICAgICBjb25zdCBjdXJyZW50Q29udHJvbGxlciA9IGRlZmVyKCgpID0+IG9mIChzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKTtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcyA9IGNvbmNhdChjdXJyZW50Q29udHJvbGxlciwgY29udHJvbGxlckNoYW5nZXMpO1xuXG4gICAgICB0aGlzLndvcmtlciA9IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcy5waXBlKGZpbHRlcjxTZXJ2aWNlV29ya2VyPihjID0+ICEhYykpO1xuXG4gICAgICB0aGlzLnJlZ2lzdHJhdGlvbiA9IDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24+PihcbiAgICAgICAgICB0aGlzLndvcmtlci5waXBlKHN3aXRjaE1hcCgoKSA9PiBzZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpKSkpO1xuXG4gICAgICBjb25zdCByYXdFdmVudHMgPSBmcm9tRXZlbnQ8TWVzc2FnZUV2ZW50PihzZXJ2aWNlV29ya2VyLCAnbWVzc2FnZScpO1xuICAgICAgY29uc3QgcmF3RXZlbnRQYXlsb2FkID0gcmF3RXZlbnRzLnBpcGUobWFwKGV2ZW50ID0+IGV2ZW50LmRhdGEpKTtcbiAgICAgIGNvbnN0IGV2ZW50c1VuY29ubmVjdGVkID0gcmF3RXZlbnRQYXlsb2FkLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50ICYmIGV2ZW50LnR5cGUpKTtcbiAgICAgIGNvbnN0IGV2ZW50cyA9IGV2ZW50c1VuY29ubmVjdGVkLnBpcGUocHVibGlzaCgpKSBhcyBDb25uZWN0YWJsZU9ic2VydmFibGU8SW5jb21pbmdFdmVudD47XG4gICAgICBldmVudHMuY29ubmVjdCgpO1xuXG4gICAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcbiAgICB9XG4gIH1cblxuICBwb3N0TWVzc2FnZShhY3Rpb246IHN0cmluZywgcGF5bG9hZDogT2JqZWN0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud29ya2VyXG4gICAgICAgIC5waXBlKHRha2UoMSksIHRhcCgoc3c6IFNlcnZpY2VXb3JrZXIpID0+IHtcbiAgICAgICAgICAgICAgICBzdy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiwgLi4ucGF5bG9hZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgcG9zdE1lc3NhZ2VXaXRoU3RhdHVzKHR5cGU6IHN0cmluZywgcGF5bG9hZDogT2JqZWN0LCBub25jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgd2FpdEZvclN0YXR1cyA9IHRoaXMud2FpdEZvclN0YXR1cyhub25jZSk7XG4gICAgY29uc3QgcG9zdE1lc3NhZ2UgPSB0aGlzLnBvc3RNZXNzYWdlKHR5cGUsIHBheWxvYWQpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbd2FpdEZvclN0YXR1cywgcG9zdE1lc3NhZ2VdKS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICBnZW5lcmF0ZU5vbmNlKCk6IG51bWJlciB7IHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMCk7IH1cblxuICBldmVudHNPZlR5cGU8VCBleHRlbmRzIFR5cGVkRXZlbnQ+KHR5cGU6IFRbJ3R5cGUnXSk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IGZpbHRlckZuID0gKGV2ZW50OiBUeXBlZEV2ZW50KTogZXZlbnQgaXMgVCA9PiBldmVudC50eXBlID09PSB0eXBlO1xuICAgIHJldHVybiB0aGlzLmV2ZW50cy5waXBlKGZpbHRlcihmaWx0ZXJGbikpO1xuICB9XG5cbiAgbmV4dEV2ZW50T2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBUWyd0eXBlJ10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNPZlR5cGUodHlwZSkucGlwZSh0YWtlKDEpKTtcbiAgfVxuXG4gIHdhaXRGb3JTdGF0dXMobm9uY2U6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50c09mVHlwZTxTdGF0dXNFdmVudD4oJ1NUQVRVUycpXG4gICAgICAgIC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudC5ub25jZSA9PT0gbm9uY2UpLCB0YWtlKDEpLCBtYXAoZXZlbnQgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihldmVudC5lcnJvciAhKTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKTtcbiAgfVxuXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiAhIXRoaXMuc2VydmljZVdvcmtlcjsgfVxufVxuIl19