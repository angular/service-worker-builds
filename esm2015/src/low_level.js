/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
export const /** @type {?} */ ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
/**
 * @record
 */
export function Version() { }
function Version_tsickle_Closure_declarations() {
    /** @type {?} */
    Version.prototype.hash;
    /** @type {?|undefined} */
    Version.prototype.appData;
}
/**
 * \@experimental
 * @record
 */
export function UpdateAvailableEvent() { }
function UpdateAvailableEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    UpdateAvailableEvent.prototype.type;
    /** @type {?} */
    UpdateAvailableEvent.prototype.current;
    /** @type {?} */
    UpdateAvailableEvent.prototype.available;
}
/**
 * \@experimental
 * @record
 */
export function UpdateActivatedEvent() { }
function UpdateActivatedEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    UpdateActivatedEvent.prototype.type;
    /** @type {?|undefined} */
    UpdateActivatedEvent.prototype.previous;
    /** @type {?} */
    UpdateActivatedEvent.prototype.current;
}
/**
 * @record
 */
export function TypedEvent() { }
function TypedEvent_tsickle_Closure_declarations() {
    /** @type {?} */
    TypedEvent.prototype.type;
}
/**
 * @record
 */
function StatusEvent() { }
function StatusEvent_tsickle_Closure_declarations() {
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
 * \@experimental
 */
export class NgswCommChannel {
    /**
     * @param {?} serviceWorker
     * @param {?} platformId
     */
    constructor(serviceWorker, platformId) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker || !isPlatformBrowser(platformId)) {
            this.serviceWorker = undefined;
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            const /** @type {?} */ controllerChangeEvents = /** @type {?} */ ((fromEvent(serviceWorker, 'controllerchange')));
            const /** @type {?} */ controllerChanges = /** @type {?} */ ((controllerChangeEvents.pipe(map(() => serviceWorker.controller))));
            const /** @type {?} */ currentController = /** @type {?} */ ((defer(() => of(serviceWorker.controller))));
            const /** @type {?} */ controllerWithChanges = /** @type {?} */ ((concat(currentController, controllerChanges)));
            this.worker = /** @type {?} */ ((controllerWithChanges.pipe(filter((c) => !!c))));
            this.registration = /** @type {?} */ ((this.worker.pipe(switchMap(() => serviceWorker.getRegistration()))));
            const /** @type {?} */ rawEvents = fromEvent(serviceWorker, 'message');
            const /** @type {?} */ rawEventPayload = rawEvents.pipe(map((event) => event.data));
            const /** @type {?} */ eventsUnconnected = (rawEventPayload.pipe(filter((event) => !!event && !!(/** @type {?} */ (event))['type'])));
            const /** @type {?} */ events = /** @type {?} */ (eventsUnconnected.pipe(publish()));
            this.events = events;
            events.connect();
        }
    }
    /**
     * \@internal
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
     * \@internal
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    postMessageWithStatus(type, payload, nonce) {
        const /** @type {?} */ waitForStatus = this.waitForStatus(nonce);
        const /** @type {?} */ postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(() => undefined);
    }
    /**
     * \@internal
     * @return {?}
     */
    generateNonce() { return Math.round(Math.random() * 10000000); }
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    eventsOfType(type) {
        return /** @type {?} */ (this.events.pipe(filter((event) => { return event.type === type; })));
    }
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    nextEventOfType(type) {
        return /** @type {?} */ ((this.eventsOfType(type).pipe(take(1))));
    }
    /**
     * \@internal
     * @param {?} nonce
     * @return {?}
     */
    waitForStatus(nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter((event) => event.nonce === nonce), take(1), map((event) => {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        }))
            .toPromise();
    }
    /**
     * @return {?}
     */
    get isEnabled() { return !!this.serviceWorker; }
}
/** @nocollapse */
NgswCommChannel.ctorParameters = () => [
    null,
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
];
function NgswCommChannel_tsickle_Closure_declarations() {
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    NgswCommChannel.ctorParameters;
    /**
     * \@internal
     * @type {?}
     */
    NgswCommChannel.prototype.worker;
    /**
     * \@internal
     * @type {?}
     */
    NgswCommChannel.prototype.registration;
    /**
     * \@internal
     * @type {?}
     */
    NgswCommChannel.prototype.events;
    /** @type {?} */
    NgswCommChannel.prototype.serviceWorker;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxNQUFNLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBb0MsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFHLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsRyxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUUxRSxNQUFNLENBQUMsdUJBQU0sb0JBQW9CLEdBQUcsK0RBQStELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFDcEcseUJBQXlCLE9BQWU7SUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3BEOzs7O0FBS0QsTUFBTTs7Ozs7SUFnQkosWUFDWSxlQUNhO1FBRGIsa0JBQWEsR0FBYixhQUFhO1FBRXZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JELElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQyxvQkFB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UUFBUSxDQUFDLENBQUMsRUFBRTs7Ozs7OztJQU94RSxZQUFZLENBQXVCLElBQVk7UUFDN0MsTUFBTSxtQkFBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBQztLQUM1Rjs7Ozs7OztJQU9ELGVBQWUsQ0FBdUIsSUFBWTtRQUNoRCxNQUFNLG1CQUFnQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7S0FDL0Q7Ozs7OztJQUtELGFBQWEsQ0FBQyxLQUFhO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFjLFFBQVEsQ0FBQzthQUMxQyxJQUFJLENBQ0QsTUFBTSxDQUFDLENBQUMsS0FBa0IsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQzlELEdBQUcsQ0FBQyxDQUFDLEtBQWtCLEVBQUUsRUFBRTtZQUN6QixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDakIsTUFBTSxDQUFDLFNBQVMsQ0FBQzthQUNsQjtZQUNELE1BQU0sSUFBSSxLQUFLLG9CQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQztTQUNoQyxDQUFDLENBQUM7YUFDTixTQUFTLEVBQUUsQ0FBQztLQUNsQjs7OztJQUVELElBQUksU0FBUyxLQUFjLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFOzs7Ozs0Q0E5RnBELE1BQU0sU0FBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtJbmplY3QsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29ubmVjdGFibGVPYnNlcnZhYmxlLCBPYnNlcnZhYmxlLCBjb25jYXQsIGRlZmVyLCBmcm9tRXZlbnQsIG9mICwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgbWFwLCBwdWJsaXNoLCBzd2l0Y2hNYXAsIHRha2UsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgY29uc3QgRVJSX1NXX05PVF9TVVBQT1JURUQgPSAnU2VydmljZSB3b3JrZXJzIGFyZSBkaXNhYmxlZCBvciBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyc2lvbiB7XG4gIGhhc2g6IHN0cmluZztcbiAgYXBwRGF0YT86IE9iamVjdDtcbn1cblxuLyoqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQXZhaWxhYmxlRXZlbnQge1xuICB0eXBlOiAnVVBEQVRFX0FWQUlMQUJMRSc7XG4gIGN1cnJlbnQ6IFZlcnNpb247XG4gIGF2YWlsYWJsZTogVmVyc2lvbjtcbn1cblxuLyoqXG4gKiBAZXhwZXJpbWVudGFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlQWN0aXZhdGVkRXZlbnQge1xuICB0eXBlOiAnVVBEQVRFX0FDVElWQVRFRCc7XG4gIHByZXZpb3VzPzogVmVyc2lvbjtcbiAgY3VycmVudDogVmVyc2lvbjtcbn1cblxuZXhwb3J0IHR5cGUgSW5jb21pbmdFdmVudCA9IFVwZGF0ZUF2YWlsYWJsZUV2ZW50IHwgVXBkYXRlQWN0aXZhdGVkRXZlbnQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZWRFdmVudCB7IHR5cGU6IHN0cmluZzsgfVxuXG5pbnRlcmZhY2UgU3RhdHVzRXZlbnQge1xuICB0eXBlOiAnU1RBVFVTJztcbiAgbm9uY2U6IG51bWJlcjtcbiAgc3RhdHVzOiBib29sZWFuO1xuICBlcnJvcj86IHN0cmluZztcbn1cblxuXG5mdW5jdGlvbiBlcnJvck9ic2VydmFibGUobWVzc2FnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgcmV0dXJuIGRlZmVyKCgpID0+IHRocm93RXJyb3IobmV3IEVycm9yKG1lc3NhZ2UpKSk7XG59XG5cbi8qKlxuICogQGV4cGVyaW1lbnRhbFxuKi9cbmV4cG9ydCBjbGFzcyBOZ3N3Q29tbUNoYW5uZWwge1xuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICByZWFkb25seSB3b3JrZXI6IE9ic2VydmFibGU8U2VydmljZVdvcmtlcj47XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVhZG9ubHkgcmVnaXN0cmF0aW9uOiBPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24+O1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50czogT2JzZXJ2YWJsZTxUeXBlZEV2ZW50PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgc2VydmljZVdvcmtlcjogU2VydmljZVdvcmtlckNvbnRhaW5lcnx1bmRlZmluZWQsXG4gICAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBzdHJpbmcpIHtcbiAgICBpZiAoIXNlcnZpY2VXb3JrZXIgfHwgIWlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLnNlcnZpY2VXb3JrZXIgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLndvcmtlciA9IHRoaXMuZXZlbnRzID0gdGhpcy5yZWdpc3RyYXRpb24gPSBlcnJvck9ic2VydmFibGUoRVJSX1NXX05PVF9TVVBQT1JURUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjb250cm9sbGVyQ2hhbmdlRXZlbnRzID1cbiAgICAgICAgICA8T2JzZXJ2YWJsZTxhbnk+Pihmcm9tRXZlbnQoc2VydmljZVdvcmtlciwgJ2NvbnRyb2xsZXJjaGFuZ2UnKSk7XG4gICAgICBjb25zdCBjb250cm9sbGVyQ2hhbmdlcyA9IDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJ8bnVsbD4+KFxuICAgICAgICAgIGNvbnRyb2xsZXJDaGFuZ2VFdmVudHMucGlwZShtYXAoKCkgPT4gc2VydmljZVdvcmtlci5jb250cm9sbGVyKSkpO1xuXG4gICAgICBjb25zdCBjdXJyZW50Q29udHJvbGxlciA9XG4gICAgICAgICAgPE9ic2VydmFibGU8U2VydmljZVdvcmtlcnxudWxsPj4oZGVmZXIoKCkgPT4gb2YgKHNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikpKTtcblxuICAgICAgY29uc3QgY29udHJvbGxlcldpdGhDaGFuZ2VzID1cbiAgICAgICAgICA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyfG51bGw+Pihjb25jYXQoY3VycmVudENvbnRyb2xsZXIsIGNvbnRyb2xsZXJDaGFuZ2VzKSk7XG4gICAgICB0aGlzLndvcmtlciA9IDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXI+PihcbiAgICAgICAgICBjb250cm9sbGVyV2l0aENoYW5nZXMucGlwZShmaWx0ZXIoKGM6IFNlcnZpY2VXb3JrZXIpID0+ICEhYykpKTtcblxuICAgICAgdGhpcy5yZWdpc3RyYXRpb24gPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPj4oXG4gICAgICAgICAgdGhpcy53b3JrZXIucGlwZShzd2l0Y2hNYXAoKCkgPT4gc2VydmljZVdvcmtlci5nZXRSZWdpc3RyYXRpb24oKSkpKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRzID0gZnJvbUV2ZW50KHNlcnZpY2VXb3JrZXIsICdtZXNzYWdlJyk7XG5cbiAgICAgIGNvbnN0IHJhd0V2ZW50UGF5bG9hZCA9IHJhd0V2ZW50cy5waXBlKG1hcCgoZXZlbnQ6IE1lc3NhZ2VFdmVudCkgPT4gZXZlbnQuZGF0YSkpO1xuICAgICAgY29uc3QgZXZlbnRzVW5jb25uZWN0ZWQgPVxuICAgICAgICAgIChyYXdFdmVudFBheWxvYWQucGlwZShmaWx0ZXIoKGV2ZW50OiBPYmplY3QpID0+ICEhZXZlbnQgJiYgISEoZXZlbnQgYXMgYW55KVsndHlwZSddKSkpO1xuICAgICAgY29uc3QgZXZlbnRzID0gZXZlbnRzVW5jb25uZWN0ZWQucGlwZShwdWJsaXNoKCkpIGFzIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxJbmNvbWluZ0V2ZW50PjtcbiAgICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuICAgICAgZXZlbnRzLmNvbm5lY3QoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwb3N0TWVzc2FnZShhY3Rpb246IHN0cmluZywgcGF5bG9hZDogT2JqZWN0KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMud29ya2VyXG4gICAgICAgIC5waXBlKHRha2UoMSksIHRhcCgoc3c6IFNlcnZpY2VXb3JrZXIpID0+IHtcbiAgICAgICAgICAgICAgICBzdy5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbiwgLi4ucGF5bG9hZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcG9zdE1lc3NhZ2VXaXRoU3RhdHVzKHR5cGU6IHN0cmluZywgcGF5bG9hZDogT2JqZWN0LCBub25jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgd2FpdEZvclN0YXR1cyA9IHRoaXMud2FpdEZvclN0YXR1cyhub25jZSk7XG4gICAgY29uc3QgcG9zdE1lc3NhZ2UgPSB0aGlzLnBvc3RNZXNzYWdlKHR5cGUsIHBheWxvYWQpO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChbd2FpdEZvclN0YXR1cywgcG9zdE1lc3NhZ2VdKS50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBnZW5lcmF0ZU5vbmNlKCk6IG51bWJlciB7IHJldHVybiBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAxMDAwMDAwMCk7IH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICAvLyBUT0RPKGkpOiB0aGUgdHlwaW5ncyBhbmQgY2FzdHMgaW4gdGhpcyBtZXRob2QgYXJlIHdvbmt5LCB3ZSBzaG91bGQgcmV2aXNpdCBpdCBhbmQgbWFrZSB0aGVcbiAgLy8gdHlwZXMgZmxvdyBjb3JyZWN0bHlcbiAgZXZlbnRzT2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gPE9ic2VydmFibGU8VD4+dGhpcy5ldmVudHMucGlwZShmaWx0ZXIoKGV2ZW50KSA9PiB7IHJldHVybiBldmVudC50eXBlID09PSB0eXBlOyB9KSk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICAvLyBUT0RPKGkpOiB0aGUgdHlwaW5ncyBhbmQgY2FzdHMgaW4gdGhpcyBtZXRob2QgYXJlIHdvbmt5LCB3ZSBzaG91bGQgcmV2aXNpdCBpdCBhbmQgbWFrZSB0aGVcbiAgLy8gdHlwZXMgZmxvdyBjb3JyZWN0bHlcbiAgbmV4dEV2ZW50T2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gPE9ic2VydmFibGU8VD4+KHRoaXMuZXZlbnRzT2ZUeXBlKHR5cGUpLnBpcGUodGFrZSgxKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgd2FpdEZvclN0YXR1cyhub25jZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzT2ZUeXBlPFN0YXR1c0V2ZW50PignU1RBVFVTJylcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoKGV2ZW50OiBTdGF0dXNFdmVudCkgPT4gZXZlbnQubm9uY2UgPT09IG5vbmNlKSwgdGFrZSgxKSxcbiAgICAgICAgICAgIG1hcCgoZXZlbnQ6IFN0YXR1c0V2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChldmVudC5zdGF0dXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihldmVudC5lcnJvciAhKTtcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAudG9Qcm9taXNlKCk7XG4gIH1cblxuICBnZXQgaXNFbmFibGVkKCk6IGJvb2xlYW4geyByZXR1cm4gISF0aGlzLnNlcnZpY2VXb3JrZXI7IH1cbn1cbiJdfQ==