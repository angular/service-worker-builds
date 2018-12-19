/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
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
    return defer(() => throwError(new Error(message)));
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
            const controllerChanges = controllerChangeEvents.pipe(map(() => serviceWorker.controller));
            /** @type {?} */
            const currentController = defer(() => of(serviceWorker.controller));
            /** @type {?} */
            const controllerWithChanges = concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(filter(c => !!c));
            this.registration = (/** @type {?} */ ((this.worker.pipe(switchMap(() => serviceWorker.getRegistration())))));
            /** @type {?} */
            const rawEvents = fromEvent(serviceWorker, 'message');
            /** @type {?} */
            const rawEventPayload = rawEvents.pipe(map(event => event.data));
            /** @type {?} */
            const eventsUnconnected = rawEventPayload.pipe(filter(event => event && event.type));
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
            .pipe(take(1), tap((sw) => {
            sw.postMessage(Object.assign({ action }, payload));
        }))
            .toPromise()
            .then(() => undefined);
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
        return Promise.all([waitForStatus, postMessage]).then(() => undefined);
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
        const filterFn = (event) => event.type === type;
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
            .pipe(filter(event => event.nonce === nonce), take(1), map(event => {
            if (event.status) {
                return undefined;
            }
            throw new Error((/** @type {?} */ (event.error)));
        }))
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
    /** @type {?} */
    NgswCommChannel.prototype.serviceWorker;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBb0MsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFHLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsRyxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFMUUsTUFBTSxPQUFPLG9CQUFvQixHQUFHLCtEQUErRDs7Ozs7OztBQU9uRywwQ0FJQzs7O0lBSEMsb0NBQXlCOztJQUN6Qix1Q0FBMEM7O0lBQzFDLHlDQUE0Qzs7Ozs7Ozs7QUFROUMsMENBSUM7OztJQUhDLG9DQUF5Qjs7SUFDekIsd0NBQTRDOztJQUM1Qyx1Q0FBMEM7Ozs7OztBQU01QywrQkFHQzs7O0lBRkMseUJBQWE7O0lBQ2IseUJBQVU7Ozs7O0FBS1osZ0NBQTZDOzs7SUFBZiwwQkFBYTs7Ozs7QUFFM0MsMEJBS0M7OztJQUpDLDJCQUFlOztJQUNmLDRCQUFjOztJQUNkLDZCQUFnQjs7SUFDaEIsNEJBQWU7Ozs7OztBQUlqQixTQUFTLGVBQWUsQ0FBQyxPQUFlO0lBQ3RDLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckQsQ0FBQzs7OztBQUtELE1BQU0sT0FBTyxlQUFlOzs7O0lBTzFCLFlBQW9CLGFBQStDO1FBQS9DLGtCQUFhLEdBQWIsYUFBYSxDQUFrQztRQUNqRSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFB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QixJQUFlO1FBQ25ELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7Ozs7SUFFRCxhQUFhLENBQUMsS0FBYTtRQUN6QixPQUFPLElBQUksQ0FBQyxZQUFZLENBQWMsUUFBUSxDQUFDO2FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0QsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNoQixPQUFPLFNBQVMsQ0FBQzthQUNsQjtZQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsbUJBQUEsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDLENBQUM7YUFDUixTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDOzs7O0lBRUQsSUFBSSxTQUFTLEtBQWMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7Q0FDMUQ7OztJQXRFQyxpQ0FBMkM7O0lBRTNDLHVDQUE2RDs7SUFFN0QsaUNBQXdDOztJQUU1Qix3Q0FBdUQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29ubmVjdGFibGVPYnNlcnZhYmxlLCBPYnNlcnZhYmxlLCBjb25jYXQsIGRlZmVyLCBmcm9tRXZlbnQsIG9mICwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgbWFwLCBwdWJsaXNoLCBzd2l0Y2hNYXAsIHRha2UsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgY29uc3QgRVJSX1NXX05PVF9TVVBQT1JURUQgPSAnU2VydmljZSB3b3JrZXJzIGFyZSBkaXNhYmxlZCBvciBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlcic7XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIGEgbmV3IHZlcnNpb24gb2YgdGhlIGFwcCBpcyBhdmFpbGFibGUuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0ZUF2YWlsYWJsZUV2ZW50IHtcbiAgdHlwZTogJ1VQREFURV9BVkFJTEFCTEUnO1xuICBjdXJyZW50OiB7aGFzaDogc3RyaW5nLCBhcHBEYXRhPzogT2JqZWN0fTtcbiAgYXZhaWxhYmxlOiB7aGFzaDogc3RyaW5nLCBhcHBEYXRhPzogT2JqZWN0fTtcbn1cblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gYSBuZXcgdmVyc2lvbiBvZiB0aGUgYXBwIGhhcyBiZWVuIGRvd25sb2FkZWQgYW5kIGFjdGl2YXRlZC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQWN0aXZhdGVkRXZlbnQge1xuICB0eXBlOiAnVVBEQVRFX0FDVElWQVRFRCc7XG4gIHByZXZpb3VzPzoge2hhc2g6IHN0cmluZywgYXBwRGF0YT86IE9iamVjdH07XG4gIGN1cnJlbnQ6IHtoYXNoOiBzdHJpbmcsIGFwcERhdGE/OiBPYmplY3R9O1xufVxuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIGBQdXNoRXZlbnRgIGlzIHJlY2VpdmVkIGJ5IHRoZSBzZXJ2aWNlIHdvcmtlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBQdXNoRXZlbnQge1xuICB0eXBlOiAnUFVTSCc7XG4gIGRhdGE6IGFueTtcbn1cblxuZXhwb3J0IHR5cGUgSW5jb21pbmdFdmVudCA9IFVwZGF0ZUF2YWlsYWJsZUV2ZW50IHwgVXBkYXRlQWN0aXZhdGVkRXZlbnQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZWRFdmVudCB7IHR5cGU6IHN0cmluZzsgfVxuXG5pbnRlcmZhY2UgU3RhdHVzRXZlbnQge1xuICB0eXBlOiAnU1RBVFVTJztcbiAgbm9uY2U6IG51bWJlcjtcbiAgc3RhdHVzOiBib29sZWFuO1xuICBlcnJvcj86IHN0cmluZztcbn1cblxuXG5mdW5jdGlvbiBlcnJvck9ic2VydmFibGUobWVzc2FnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgcmV0dXJuIGRlZmVyKCgpID0+IHRocm93RXJyb3IobmV3IEVycm9yKG1lc3NhZ2UpKSk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgTmdzd0NvbW1DaGFubmVsIHtcbiAgcmVhZG9ubHkgd29ya2VyOiBPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXI+O1xuXG4gIHJlYWRvbmx5IHJlZ2lzdHJhdGlvbjogT2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPjtcblxuICByZWFkb25seSBldmVudHM6IE9ic2VydmFibGU8VHlwZWRFdmVudD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlV29ya2VyOiBTZXJ2aWNlV29ya2VyQ29udGFpbmVyfHVuZGVmaW5lZCkge1xuICAgIGlmICghc2VydmljZVdvcmtlcikge1xuICAgICAgdGhpcy53b3JrZXIgPSB0aGlzLmV2ZW50cyA9IHRoaXMucmVnaXN0cmF0aW9uID0gZXJyb3JPYnNlcnZhYmxlKEVSUl9TV19OT1RfU1VQUE9SVEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZUV2ZW50cyA9IGZyb21FdmVudChzZXJ2aWNlV29ya2VyLCAnY29udHJvbGxlcmNoYW5nZScpO1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZXMgPSBjb250cm9sbGVyQ2hhbmdlRXZlbnRzLnBpcGUobWFwKCgpID0+IHNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikpO1xuICAgICAgY29uc3QgY3VycmVudENvbnRyb2xsZXIgPSBkZWZlcigoKSA9PiBvZiAoc2VydmljZVdvcmtlci5jb250cm9sbGVyKSk7XG4gICAgICBjb25zdCBjb250cm9sbGVyV2l0aENoYW5nZXMgPSBjb25jYXQoY3VycmVudENvbnRyb2xsZXIsIGNvbnRyb2xsZXJDaGFuZ2VzKTtcblxuICAgICAgdGhpcy53b3JrZXIgPSBjb250cm9sbGVyV2l0aENoYW5nZXMucGlwZShmaWx0ZXI8U2VydmljZVdvcmtlcj4oYyA9PiAhIWMpKTtcblxuICAgICAgdGhpcy5yZWdpc3RyYXRpb24gPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPj4oXG4gICAgICAgICAgdGhpcy53b3JrZXIucGlwZShzd2l0Y2hNYXAoKCkgPT4gc2VydmljZVdvcmtlci5nZXRSZWdpc3RyYXRpb24oKSkpKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRzID0gZnJvbUV2ZW50PE1lc3NhZ2VFdmVudD4oc2VydmljZVdvcmtlciwgJ21lc3NhZ2UnKTtcbiAgICAgIGNvbnN0IHJhd0V2ZW50UGF5bG9hZCA9IHJhd0V2ZW50cy5waXBlKG1hcChldmVudCA9PiBldmVudC5kYXRhKSk7XG4gICAgICBjb25zdCBldmVudHNVbmNvbm5lY3RlZCA9IHJhd0V2ZW50UGF5bG9hZC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudCAmJiBldmVudC50eXBlKSk7XG4gICAgICBjb25zdCBldmVudHMgPSBldmVudHNVbmNvbm5lY3RlZC5waXBlKHB1Ymxpc2goKSkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPEluY29taW5nRXZlbnQ+O1xuICAgICAgZXZlbnRzLmNvbm5lY3QoKTtcblxuICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgfVxuICB9XG5cbiAgcG9zdE1lc3NhZ2UoYWN0aW9uOiBzdHJpbmcsIHBheWxvYWQ6IE9iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLndvcmtlclxuICAgICAgICAucGlwZSh0YWtlKDEpLCB0YXAoKHN3OiBTZXJ2aWNlV29ya2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgc3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb24sIC4uLnBheWxvYWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIHBvc3RNZXNzYWdlV2l0aFN0YXR1cyh0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IE9iamVjdCwgbm9uY2U6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHdhaXRGb3JTdGF0dXMgPSB0aGlzLndhaXRGb3JTdGF0dXMobm9uY2UpO1xuICAgIGNvbnN0IHBvc3RNZXNzYWdlID0gdGhpcy5wb3N0TWVzc2FnZSh0eXBlLCBwYXlsb2FkKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3dhaXRGb3JTdGF0dXMsIHBvc3RNZXNzYWdlXSkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgZ2VuZXJhdGVOb25jZSgpOiBudW1iZXIgeyByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDAwMDApOyB9XG5cbiAgZXZlbnRzT2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBUWyd0eXBlJ10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBmaWx0ZXJGbiA9IChldmVudDogVHlwZWRFdmVudCk6IGV2ZW50IGlzIFQgPT4gZXZlbnQudHlwZSA9PT0gdHlwZTtcbiAgICByZXR1cm4gdGhpcy5ldmVudHMucGlwZShmaWx0ZXIoZmlsdGVyRm4pKTtcbiAgfVxuXG4gIG5leHRFdmVudE9mVHlwZTxUIGV4dGVuZHMgVHlwZWRFdmVudD4odHlwZTogVFsndHlwZSddKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzT2ZUeXBlKHR5cGUpLnBpcGUodGFrZSgxKSk7XG4gIH1cblxuICB3YWl0Rm9yU3RhdHVzKG5vbmNlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNPZlR5cGU8U3RhdHVzRXZlbnQ+KCdTVEFUVVMnKVxuICAgICAgICAucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQubm9uY2UgPT09IG5vbmNlKSwgdGFrZSgxKSwgbWFwKGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXZlbnQuZXJyb3IgISk7XG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gIH1cblxuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLnNlcnZpY2VXb3JrZXI7IH1cbn1cbiJdfQ==