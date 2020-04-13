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
    generateNonce() {
        return Math.round(Math.random() * 10000000);
    }
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
    get isEnabled() {
        return !!this.serviceWorker;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsTUFBTSxFQUF5QixLQUFLLEVBQUUsU0FBUyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDakcsT0FBTyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7O0FBRTFFLE1BQU0sT0FBTyxvQkFBb0IsR0FBRywrREFBK0Q7Ozs7Ozs7QUFPbkcsMENBSUM7OztJQUhDLG9DQUF5Qjs7SUFDekIsdUNBQTBDOztJQUMxQyx5Q0FBNEM7Ozs7Ozs7O0FBUTlDLDBDQUlDOzs7SUFIQyxvQ0FBeUI7O0lBQ3pCLHdDQUE0Qzs7SUFDNUMsdUNBQTBDOzs7Ozs7QUFNNUMsK0JBR0M7OztJQUZDLHlCQUFhOztJQUNiLHlCQUFVOzs7OztBQUtaLGdDQUVDOzs7SUFEQywwQkFBYTs7Ozs7QUFHZiwwQkFLQzs7O0lBSkMsMkJBQWU7O0lBQ2YsNEJBQWM7O0lBQ2QsNkJBQWdCOztJQUNoQiw0QkFBZTs7Ozs7O0FBSWpCLFNBQVMsZUFBZSxDQUFDLE9BQWU7SUFDdEMsT0FBTyxLQUFLOzs7SUFBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBQyxDQUFDO0FBQ3JELENBQUM7Ozs7QUFLRCxNQUFNLE9BQU8sZUFBZTs7OztJQU8xQixZQUFvQixhQUErQztRQUEvQyxrQkFBYSxHQUFiLGFBQWEsQ0FBa0M7UUFDakUsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcs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USxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7Ozs7SUFFRCxlQUFlLENBQXVCLElBQWU7UUFDbkQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7OztJQUVELGFBQWEsQ0FBQyxLQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBYyxRQUFRLENBQUM7YUFDMUMsSUFBSSxDQUFDLE1BQU07Ozs7UUFBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUc7Ozs7UUFBQyxLQUFLLENBQUMsRUFBRTtZQUMzRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBQSxLQUFLLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNoQyxDQUFDLEVBQUMsQ0FBQzthQUNSLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7Ozs7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7Q0FDRjs7O0lBM0VDLGlDQUEyQzs7SUFFM0MsdUNBQTZEOztJQUU3RCxpQ0FBd0M7Ozs7O0lBRTVCLHdDQUF1RCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb25jYXQsIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSwgZGVmZXIsIGZyb21FdmVudCwgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIG1hcCwgcHVibGlzaCwgc3dpdGNoTWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGNvbnN0IEVSUl9TV19OT1RfU1VQUE9SVEVEID0gJ1NlcnZpY2Ugd29ya2VycyBhcmUgZGlzYWJsZWQgb3Igbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXInO1xuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIG5ldyB2ZXJzaW9uIG9mIHRoZSBhcHAgaXMgYXZhaWxhYmxlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVBdmFpbGFibGVFdmVudCB7XG4gIHR5cGU6ICdVUERBVEVfQVZBSUxBQkxFJztcbiAgY3VycmVudDoge2hhc2g6IHN0cmluZywgYXBwRGF0YT86IE9iamVjdH07XG4gIGF2YWlsYWJsZToge2hhc2g6IHN0cmluZywgYXBwRGF0YT86IE9iamVjdH07XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIGEgbmV3IHZlcnNpb24gb2YgdGhlIGFwcCBoYXMgYmVlbiBkb3dubG9hZGVkIGFuZCBhY3RpdmF0ZWQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0ZUFjdGl2YXRlZEV2ZW50IHtcbiAgdHlwZTogJ1VQREFURV9BQ1RJVkFURUQnO1xuICBwcmV2aW91cz86IHtoYXNoOiBzdHJpbmcsIGFwcERhdGE/OiBPYmplY3R9O1xuICBjdXJyZW50OiB7aGFzaDogc3RyaW5nLCBhcHBEYXRhPzogT2JqZWN0fTtcbn1cblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gYSBgUHVzaEV2ZW50YCBpcyByZWNlaXZlZCBieSB0aGUgc2VydmljZSB3b3JrZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHVzaEV2ZW50IHtcbiAgdHlwZTogJ1BVU0gnO1xuICBkYXRhOiBhbnk7XG59XG5cbmV4cG9ydCB0eXBlIEluY29taW5nRXZlbnQgPSBVcGRhdGVBdmFpbGFibGVFdmVudHxVcGRhdGVBY3RpdmF0ZWRFdmVudDtcblxuZXhwb3J0IGludGVyZmFjZSBUeXBlZEV2ZW50IHtcbiAgdHlwZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgU3RhdHVzRXZlbnQge1xuICB0eXBlOiAnU1RBVFVTJztcbiAgbm9uY2U6IG51bWJlcjtcbiAgc3RhdHVzOiBib29sZWFuO1xuICBlcnJvcj86IHN0cmluZztcbn1cblxuXG5mdW5jdGlvbiBlcnJvck9ic2VydmFibGUobWVzc2FnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgcmV0dXJuIGRlZmVyKCgpID0+IHRocm93RXJyb3IobmV3IEVycm9yKG1lc3NhZ2UpKSk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgTmdzd0NvbW1DaGFubmVsIHtcbiAgcmVhZG9ubHkgd29ya2VyOiBPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXI+O1xuXG4gIHJlYWRvbmx5IHJlZ2lzdHJhdGlvbjogT2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPjtcblxuICByZWFkb25seSBldmVudHM6IE9ic2VydmFibGU8VHlwZWRFdmVudD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlV29ya2VyOiBTZXJ2aWNlV29ya2VyQ29udGFpbmVyfHVuZGVmaW5lZCkge1xuICAgIGlmICghc2VydmljZVdvcmtlcikge1xuICAgICAgdGhpcy53b3JrZXIgPSB0aGlzLmV2ZW50cyA9IHRoaXMucmVnaXN0cmF0aW9uID0gZXJyb3JPYnNlcnZhYmxlKEVSUl9TV19OT1RfU1VQUE9SVEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZUV2ZW50cyA9IGZyb21FdmVudChzZXJ2aWNlV29ya2VyLCAnY29udHJvbGxlcmNoYW5nZScpO1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZXMgPSBjb250cm9sbGVyQ2hhbmdlRXZlbnRzLnBpcGUobWFwKCgpID0+IHNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikpO1xuICAgICAgY29uc3QgY3VycmVudENvbnRyb2xsZXIgPSBkZWZlcigoKSA9PiBvZihzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKTtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcyA9IGNvbmNhdChjdXJyZW50Q29udHJvbGxlciwgY29udHJvbGxlckNoYW5nZXMpO1xuXG4gICAgICB0aGlzLndvcmtlciA9IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcy5waXBlKGZpbHRlcigoYyk6IGMgaXMgU2VydmljZVdvcmtlciA9PiAhIWMpKTtcblxuICAgICAgdGhpcy5yZWdpc3RyYXRpb24gPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPj4oXG4gICAgICAgICAgdGhpcy53b3JrZXIucGlwZShzd2l0Y2hNYXAoKCkgPT4gc2VydmljZVdvcmtlci5nZXRSZWdpc3RyYXRpb24oKSkpKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRzID0gZnJvbUV2ZW50PE1lc3NhZ2VFdmVudD4oc2VydmljZVdvcmtlciwgJ21lc3NhZ2UnKTtcbiAgICAgIGNvbnN0IHJhd0V2ZW50UGF5bG9hZCA9IHJhd0V2ZW50cy5waXBlKG1hcChldmVudCA9PiBldmVudC5kYXRhKSk7XG4gICAgICBjb25zdCBldmVudHNVbmNvbm5lY3RlZCA9IHJhd0V2ZW50UGF5bG9hZC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudCAmJiBldmVudC50eXBlKSk7XG4gICAgICBjb25zdCBldmVudHMgPSBldmVudHNVbmNvbm5lY3RlZC5waXBlKHB1Ymxpc2goKSkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPEluY29taW5nRXZlbnQ+O1xuICAgICAgZXZlbnRzLmNvbm5lY3QoKTtcblxuICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgfVxuICB9XG5cbiAgcG9zdE1lc3NhZ2UoYWN0aW9uOiBzdHJpbmcsIHBheWxvYWQ6IE9iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLndvcmtlclxuICAgICAgICAucGlwZSh0YWtlKDEpLCB0YXAoKHN3OiBTZXJ2aWNlV29ya2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgc3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgcG9zdE1lc3NhZ2VXaXRoU3RhdHVzKHR5cGU6IHN0cmluZywgcGF5bG9hZDogT2JqZWN0LCBub25jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgd2FpdEZvclN0YXR1cyA9IHRoaXMud2FpdEZvclN0YXR1cyhub25jZSk7XG4gICAgY29uc3QgcG9zdE1lc3NhZ2UgPSB0aGlzLnBvc3RNZXNzYWdlKHR5cGUsIHBheWxvYWQpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbd2FpdEZvclN0YXR1cywgcG9zdE1lc3NhZ2VdKS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICBnZW5lcmF0ZU5vbmNlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwKTtcbiAgfVxuXG4gIGV2ZW50c09mVHlwZTxUIGV4dGVuZHMgVHlwZWRFdmVudD4odHlwZTogVFsndHlwZSddKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgZmlsdGVyRm4gPSAoZXZlbnQ6IFR5cGVkRXZlbnQpOiBldmVudCBpcyBUID0+IGV2ZW50LnR5cGUgPT09IHR5cGU7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLnBpcGUoZmlsdGVyKGZpbHRlckZuKSk7XG4gIH1cblxuICBuZXh0RXZlbnRPZlR5cGU8VCBleHRlbmRzIFR5cGVkRXZlbnQ+KHR5cGU6IFRbJ3R5cGUnXSk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50c09mVHlwZSh0eXBlKS5waXBlKHRha2UoMSkpO1xuICB9XG5cbiAgd2FpdEZvclN0YXR1cyhub25jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzT2ZUeXBlPFN0YXR1c0V2ZW50PignU1RBVFVTJylcbiAgICAgICAgLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50Lm5vbmNlID09PSBub25jZSksIHRha2UoMSksIG1hcChldmVudCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGV2ZW50LmVycm9yISk7XG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gIH1cblxuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuc2VydmljZVdvcmtlcjtcbiAgfVxufVxuIl19