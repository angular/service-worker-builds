/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/src/low_level.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
            (c) => !!c)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQW9DLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRyxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDbEcsT0FBTyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRTFFLE1BQU0sT0FBTyxvQkFBb0IsR0FBRywrREFBK0Q7Ozs7Ozs7QUFPbkcsMENBSUM7OztJQUhDLG9DQUF5Qjs7SUFDekIsdUNBQTBDOztJQUMxQyx5Q0FBNEM7Ozs7Ozs7O0FBUTlDLDBDQUlDOzs7SUFIQyxvQ0FBeUI7O0lBQ3pCLHdDQUE0Qzs7SUFDNUMsdUNBQTBDOzs7Ozs7QUFNNUMsK0JBR0M7OztJQUZDLHlCQUFhOztJQUNiLHlCQUFVOzs7OztBQUtaLGdDQUE2Qzs7O0lBQWYsMEJBQWE7Ozs7O0FBRTNDLDBCQUtDOzs7SUFKQywyQkFBZTs7SUFDZiw0QkFBYzs7SUFDZCw2QkFBZ0I7O0lBQ2hCLDRCQUFlOzs7Ozs7QUFJakIsU0FBUyxlQUFlLENBQUMsT0FBZTtJQUN0QyxPQUFPLEtBQUs7OztJQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFDLENBQUM7QUFDckQsQ0FBQzs7OztBQUtELE1BQU0sT0FBTyxlQUFlOzs7O0lBTzFCLFlBQW9CLGFBQStDO1FBQS9DLGtCQUFhLEdBQWIsYUFBYSxDQUFrQztRQUNqRSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FB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UUFBUSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7Ozs7SUFFRCxlQUFlLENBQXVCLElBQWU7UUFDbkQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7OztJQUVELGFBQWEsQ0FBQyxLQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBYyxRQUFRLENBQUM7YUFDMUMsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUc7Ozs7UUFBQyxLQUFLLENBQUMsRUFBRTtZQUMzRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBQSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNqQyxDQUFDLEVBQUMsQ0FBQzthQUNSLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7SUFFRCxJQUFJLFNBQVMsS0FBYyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztDQUMxRDs7O0lBdEVDLGlDQUEyQzs7SUFFM0MsdUNBQTZEOztJQUU3RCxpQ0FBd0M7Ozs7O0lBRTVCLHdDQUF1RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25uZWN0YWJsZU9ic2VydmFibGUsIE9ic2VydmFibGUsIGNvbmNhdCwgZGVmZXIsIGZyb21FdmVudCwgb2YgLCB0aHJvd0Vycm9yfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXAsIHB1Ymxpc2gsIHN3aXRjaE1hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBFUlJfU1dfTk9UX1NVUFBPUlRFRCA9ICdTZXJ2aWNlIHdvcmtlcnMgYXJlIGRpc2FibGVkIG9yIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyJztcblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gYSBuZXcgdmVyc2lvbiBvZiB0aGUgYXBwIGlzIGF2YWlsYWJsZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQXZhaWxhYmxlRXZlbnQge1xuICB0eXBlOiAnVVBEQVRFX0FWQUlMQUJMRSc7XG4gIGN1cnJlbnQ6IHtoYXNoOiBzdHJpbmcsIGFwcERhdGE/OiBPYmplY3R9O1xuICBhdmFpbGFibGU6IHtoYXNoOiBzdHJpbmcsIGFwcERhdGE/OiBPYmplY3R9O1xufVxuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIG5ldyB2ZXJzaW9uIG9mIHRoZSBhcHAgaGFzIGJlZW4gZG93bmxvYWRlZCBhbmQgYWN0aXZhdGVkLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVBY3RpdmF0ZWRFdmVudCB7XG4gIHR5cGU6ICdVUERBVEVfQUNUSVZBVEVEJztcbiAgcHJldmlvdXM/OiB7aGFzaDogc3RyaW5nLCBhcHBEYXRhPzogT2JqZWN0fTtcbiAgY3VycmVudDoge2hhc2g6IHN0cmluZywgYXBwRGF0YT86IE9iamVjdH07XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIGEgYFB1c2hFdmVudGAgaXMgcmVjZWl2ZWQgYnkgdGhlIHNlcnZpY2Ugd29ya2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFB1c2hFdmVudCB7XG4gIHR5cGU6ICdQVVNIJztcbiAgZGF0YTogYW55O1xufVxuXG5leHBvcnQgdHlwZSBJbmNvbWluZ0V2ZW50ID0gVXBkYXRlQXZhaWxhYmxlRXZlbnQgfCBVcGRhdGVBY3RpdmF0ZWRFdmVudDtcblxuZXhwb3J0IGludGVyZmFjZSBUeXBlZEV2ZW50IHsgdHlwZTogc3RyaW5nOyB9XG5cbmludGVyZmFjZSBTdGF0dXNFdmVudCB7XG4gIHR5cGU6ICdTVEFUVVMnO1xuICBub25jZTogbnVtYmVyO1xuICBzdGF0dXM6IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufVxuXG5cbmZ1bmN0aW9uIGVycm9yT2JzZXJ2YWJsZShtZXNzYWdlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICByZXR1cm4gZGVmZXIoKCkgPT4gdGhyb3dFcnJvcihuZXcgRXJyb3IobWVzc2FnZSkpKTtcbn1cblxuLyoqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBjbGFzcyBOZ3N3Q29tbUNoYW5uZWwge1xuICByZWFkb25seSB3b3JrZXI6IE9ic2VydmFibGU8U2VydmljZVdvcmtlcj47XG5cbiAgcmVhZG9ubHkgcmVnaXN0cmF0aW9uOiBPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24+O1xuXG4gIHJlYWRvbmx5IGV2ZW50czogT2JzZXJ2YWJsZTxUeXBlZEV2ZW50PjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNlcnZpY2VXb3JrZXI6IFNlcnZpY2VXb3JrZXJDb250YWluZXJ8dW5kZWZpbmVkKSB7XG4gICAgaWYgKCFzZXJ2aWNlV29ya2VyKSB7XG4gICAgICB0aGlzLndvcmtlciA9IHRoaXMuZXZlbnRzID0gdGhpcy5yZWdpc3RyYXRpb24gPSBlcnJvck9ic2VydmFibGUoRVJSX1NXX05PVF9TVVBQT1JURUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb250cm9sbGVyQ2hhbmdlRXZlbnRzID0gZnJvbUV2ZW50KHNlcnZpY2VXb3JrZXIsICdjb250cm9sbGVyY2hhbmdlJyk7XG4gICAgICBjb25zdCBjb250cm9sbGVyQ2hhbmdlcyA9IGNvbnRyb2xsZXJDaGFuZ2VFdmVudHMucGlwZShtYXAoKCkgPT4gc2VydmljZVdvcmtlci5jb250cm9sbGVyKSk7XG4gICAgICBjb25zdCBjdXJyZW50Q29udHJvbGxlciA9IGRlZmVyKCgpID0+IG9mIChzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKTtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcyA9IGNvbmNhdChjdXJyZW50Q29udHJvbGxlciwgY29udHJvbGxlckNoYW5nZXMpO1xuXG4gICAgICB0aGlzLndvcmtlciA9IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcy5waXBlKGZpbHRlcigoYyk6IGMgaXMgU2VydmljZVdvcmtlciA9PiAhIWMpKTtcblxuICAgICAgdGhpcy5yZWdpc3RyYXRpb24gPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPj4oXG4gICAgICAgICAgdGhpcy53b3JrZXIucGlwZShzd2l0Y2hNYXAoKCkgPT4gc2VydmljZVdvcmtlci5nZXRSZWdpc3RyYXRpb24oKSkpKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRzID0gZnJvbUV2ZW50PE1lc3NhZ2VFdmVudD4oc2VydmljZVdvcmtlciwgJ21lc3NhZ2UnKTtcbiAgICAgIGNvbnN0IHJhd0V2ZW50UGF5bG9hZCA9IHJhd0V2ZW50cy5waXBlKG1hcChldmVudCA9PiBldmVudC5kYXRhKSk7XG4gICAgICBjb25zdCBldmVudHNVbmNvbm5lY3RlZCA9IHJhd0V2ZW50UGF5bG9hZC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudCAmJiBldmVudC50eXBlKSk7XG4gICAgICBjb25zdCBldmVudHMgPSBldmVudHNVbmNvbm5lY3RlZC5waXBlKHB1Ymxpc2goKSkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPEluY29taW5nRXZlbnQ+O1xuICAgICAgZXZlbnRzLmNvbm5lY3QoKTtcblxuICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgfVxuICB9XG5cbiAgcG9zdE1lc3NhZ2UoYWN0aW9uOiBzdHJpbmcsIHBheWxvYWQ6IE9iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLndvcmtlclxuICAgICAgICAucGlwZSh0YWtlKDEpLCB0YXAoKHN3OiBTZXJ2aWNlV29ya2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgc3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb24sIC4uLnBheWxvYWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIHBvc3RNZXNzYWdlV2l0aFN0YXR1cyh0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IE9iamVjdCwgbm9uY2U6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHdhaXRGb3JTdGF0dXMgPSB0aGlzLndhaXRGb3JTdGF0dXMobm9uY2UpO1xuICAgIGNvbnN0IHBvc3RNZXNzYWdlID0gdGhpcy5wb3N0TWVzc2FnZSh0eXBlLCBwYXlsb2FkKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3dhaXRGb3JTdGF0dXMsIHBvc3RNZXNzYWdlXSkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgZ2VuZXJhdGVOb25jZSgpOiBudW1iZXIgeyByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDAwMDApOyB9XG5cbiAgZXZlbnRzT2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBUWyd0eXBlJ10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBmaWx0ZXJGbiA9IChldmVudDogVHlwZWRFdmVudCk6IGV2ZW50IGlzIFQgPT4gZXZlbnQudHlwZSA9PT0gdHlwZTtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMucGlwZShmaWx0ZXIoZmlsdGVyRm4pKTtcbiAgfVxuXG4gIG5leHRFdmVudE9mVHlwZTxUIGV4dGVuZHMgVHlwZWRFdmVudD4odHlwZTogVFsndHlwZSddKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzT2ZUeXBlKHR5cGUpLnBpcGUodGFrZSgxKSk7XG4gIH1cblxuICB3YWl0Rm9yU3RhdHVzKG5vbmNlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNPZlR5cGU8U3RhdHVzRXZlbnQ+KCdTVEFUVVMnKVxuICAgICAgICAucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQubm9uY2UgPT09IG5vbmNlKSwgdGFrZSgxKSwgbWFwKGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXZlbnQuZXJyb3IgISk7XG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gIH1cblxuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLnNlcnZpY2VXb3JrZXI7IH1cbn1cbiJdfQ==