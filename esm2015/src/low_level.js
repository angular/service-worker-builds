/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
 * @record
 */
export function Version() { }
/** @type {?} */
Version.prototype.hash;
/** @type {?|undefined} */
Version.prototype.appData;
/**
 * \@experimental
 * @record
 */
export function UpdateAvailableEvent() { }
/** @type {?} */
UpdateAvailableEvent.prototype.type;
/** @type {?} */
UpdateAvailableEvent.prototype.current;
/** @type {?} */
UpdateAvailableEvent.prototype.available;
/**
 * \@experimental
 * @record
 */
export function UpdateActivatedEvent() { }
/** @type {?} */
UpdateActivatedEvent.prototype.type;
/** @type {?|undefined} */
UpdateActivatedEvent.prototype.previous;
/** @type {?} */
UpdateActivatedEvent.prototype.current;
/** @typedef {?} */
var IncomingEvent;
export { IncomingEvent };
/**
 * @record
 */
export function TypedEvent() { }
/** @type {?} */
TypedEvent.prototype.type;
/**
 * @record
 */
function StatusEvent() { }
/** @type {?} */
StatusEvent.prototype.type;
/** @type {?} */
StatusEvent.prototype.nonce;
/** @type {?} */
StatusEvent.prototype.status;
/** @type {?|undefined} */
StatusEvent.prototype.error;
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
     */
    constructor(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            /** @type {?} */
            const controllerChangeEvents = /** @type {?} */ ((fromEvent(serviceWorker, 'controllerchange')));
            /** @type {?} */
            const controllerChanges = /** @type {?} */ ((controllerChangeEvents.pipe(map(() => serviceWorker.controller))));
            /** @type {?} */
            const currentController = /** @type {?} */ ((defer(() => of(serviceWorker.controller))));
            /** @type {?} */
            const controllerWithChanges = /** @type {?} */ ((concat(currentController, controllerChanges)));
            this.worker = /** @type {?} */ ((controllerWithChanges.pipe(filter((c) => !!c))));
            this.registration = /** @type {?} */ ((this.worker.pipe(switchMap(() => serviceWorker.getRegistration()))));
            /** @type {?} */
            const rawEvents = fromEvent(serviceWorker, 'message');
            /** @type {?} */
            const rawEventPayload = rawEvents.pipe(map((event) => event.data));
            /** @type {?} */
            const eventsUnconnected = (rawEventPayload.pipe(filter((event) => !!event && !!(/** @type {?} */ (event))['type'])));
            /** @type {?} */
            const events = /** @type {?} */ (eventsUnconnected.pipe(publish()));
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
        /** @type {?} */
        const waitForStatus = this.waitForStatus(nonce);
        /** @type {?} */
        const postMessage = this.postMessage(type, payload);
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
if (false) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBb0MsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFHLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsRyxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFMUUsYUFBYSxvQkFBb0IsR0FBRywrREFBK0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ3BHLFNBQVMsZUFBZSxDQUFDLE9BQWU7SUFDdEMsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUNwRDs7OztBQUtELE1BQU0sT0FBTyxlQUFlOzs7O0lBZ0IxQixZQUFvQixhQUErQztRQUEvQyxrQkFBYSxHQUFiLGFBQWEsQ0FBa0M7UUFDakUsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxlQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQztTQUN2RjthQUFNOztZQUNMLE1BQU0sc0JBQXNCLHFCQUNQLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLEVBQUM7O1lBQ3BFLE1BQU0saUJBQWlCLHFCQUFtQyxDQUN0RCxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEs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QUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUM7S0FDL0Q7Ozs7OztJQUtELGFBQWEsQ0FBQyxLQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBYyxRQUFRLENBQUM7YUFDMUMsSUFBSSxDQUNELE1BQU0sQ0FBQyxDQUFDLEtBQWtCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUM5RCxHQUFHLENBQUMsQ0FBQyxLQUFrQixFQUFFLEVBQUU7WUFDekIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNoQixPQUFPLFNBQVMsQ0FBQzthQUNsQjtZQUNELE1BQU0sSUFBSSxLQUFLLG9CQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQztTQUNoQyxDQUFDLENBQUM7YUFDTixTQUFTLEVBQUUsQ0FBQztLQUNsQjs7OztJQUVELElBQUksU0FBUyxLQUFjLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtDQUMxRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25uZWN0YWJsZU9ic2VydmFibGUsIE9ic2VydmFibGUsIGNvbmNhdCwgZGVmZXIsIGZyb21FdmVudCwgb2YgLCB0aHJvd0Vycm9yfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXAsIHB1Ymxpc2gsIHN3aXRjaE1hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBFUlJfU1dfTk9UX1NVUFBPUlRFRCA9ICdTZXJ2aWNlIHdvcmtlcnMgYXJlIGRpc2FibGVkIG9yIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyJztcblxuZXhwb3J0IGludGVyZmFjZSBWZXJzaW9uIHtcbiAgaGFzaDogc3RyaW5nO1xuICBhcHBEYXRhPzogT2JqZWN0O1xufVxuXG4vKipcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVBdmFpbGFibGVFdmVudCB7XG4gIHR5cGU6ICdVUERBVEVfQVZBSUxBQkxFJztcbiAgY3VycmVudDogVmVyc2lvbjtcbiAgYXZhaWxhYmxlOiBWZXJzaW9uO1xufVxuXG4vKipcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVBY3RpdmF0ZWRFdmVudCB7XG4gIHR5cGU6ICdVUERBVEVfQUNUSVZBVEVEJztcbiAgcHJldmlvdXM/OiBWZXJzaW9uO1xuICBjdXJyZW50OiBWZXJzaW9uO1xufVxuXG5leHBvcnQgdHlwZSBJbmNvbWluZ0V2ZW50ID0gVXBkYXRlQXZhaWxhYmxlRXZlbnQgfCBVcGRhdGVBY3RpdmF0ZWRFdmVudDtcblxuZXhwb3J0IGludGVyZmFjZSBUeXBlZEV2ZW50IHsgdHlwZTogc3RyaW5nOyB9XG5cbmludGVyZmFjZSBTdGF0dXNFdmVudCB7XG4gIHR5cGU6ICdTVEFUVVMnO1xuICBub25jZTogbnVtYmVyO1xuICBzdGF0dXM6IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufVxuXG5cbmZ1bmN0aW9uIGVycm9yT2JzZXJ2YWJsZShtZXNzYWdlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICByZXR1cm4gZGVmZXIoKCkgPT4gdGhyb3dFcnJvcihuZXcgRXJyb3IobWVzc2FnZSkpKTtcbn1cblxuLyoqXG4gKiBAZXhwZXJpbWVudGFsXG4qL1xuZXhwb3J0IGNsYXNzIE5nc3dDb21tQ2hhbm5lbCB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHJlYWRvbmx5IHdvcmtlcjogT2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyPjtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICByZWFkb25seSByZWdpc3RyYXRpb246IE9ic2VydmFibGU8U2VydmljZVdvcmtlclJlZ2lzdHJhdGlvbj47XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRzOiBPYnNlcnZhYmxlPFR5cGVkRXZlbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZVdvcmtlcjogU2VydmljZVdvcmtlckNvbnRhaW5lcnx1bmRlZmluZWQpIHtcbiAgICBpZiAoIXNlcnZpY2VXb3JrZXIpIHtcbiAgICAgIHRoaXMud29ya2VyID0gdGhpcy5ldmVudHMgPSB0aGlzLnJlZ2lzdHJhdGlvbiA9IGVycm9yT2JzZXJ2YWJsZShFUlJfU1dfTk9UX1NVUFBPUlRFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJDaGFuZ2VFdmVudHMgPVxuICAgICAgICAgIDxPYnNlcnZhYmxlPGFueT4+KGZyb21FdmVudChzZXJ2aWNlV29ya2VyLCAnY29udHJvbGxlcmNoYW5nZScpKTtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJDaGFuZ2VzID0gPE9ic2VydmFibGU8U2VydmljZVdvcmtlcnxudWxsPj4oXG4gICAgICAgICAgY29udHJvbGxlckNoYW5nZUV2ZW50cy5waXBlKG1hcCgoKSA9PiBzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKSk7XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRDb250cm9sbGVyID1cbiAgICAgICAgICA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyfG51bGw+PihkZWZlcigoKSA9PiBvZiAoc2VydmljZVdvcmtlci5jb250cm9sbGVyKSkpO1xuXG4gICAgICBjb25zdCBjb250cm9sbGVyV2l0aENoYW5nZXMgPVxuICAgICAgICAgIDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJ8bnVsbD4+KGNvbmNhdChjdXJyZW50Q29udHJvbGxlciwgY29udHJvbGxlckNoYW5nZXMpKTtcbiAgICAgIHRoaXMud29ya2VyID0gPE9ic2VydmFibGU8U2VydmljZVdvcmtlcj4+KFxuICAgICAgICAgIGNvbnRyb2xsZXJXaXRoQ2hhbmdlcy5waXBlKGZpbHRlcigoYzogU2VydmljZVdvcmtlcikgPT4gISFjKSkpO1xuXG4gICAgICB0aGlzLnJlZ2lzdHJhdGlvbiA9IDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24+PihcbiAgICAgICAgICB0aGlzLndvcmtlci5waXBlKHN3aXRjaE1hcCgoKSA9PiBzZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpKSkpO1xuXG4gICAgICBjb25zdCByYXdFdmVudHMgPSBmcm9tRXZlbnQoc2VydmljZVdvcmtlciwgJ21lc3NhZ2UnKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRQYXlsb2FkID0gcmF3RXZlbnRzLnBpcGUobWFwKChldmVudDogTWVzc2FnZUV2ZW50KSA9PiBldmVudC5kYXRhKSk7XG4gICAgICBjb25zdCBldmVudHNVbmNvbm5lY3RlZCA9XG4gICAgICAgICAgKHJhd0V2ZW50UGF5bG9hZC5waXBlKGZpbHRlcigoZXZlbnQ6IE9iamVjdCkgPT4gISFldmVudCAmJiAhIShldmVudCBhcyBhbnkpWyd0eXBlJ10pKSk7XG4gICAgICBjb25zdCBldmVudHMgPSBldmVudHNVbmNvbm5lY3RlZC5waXBlKHB1Ymxpc2goKSkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPEluY29taW5nRXZlbnQ+O1xuICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgICBldmVudHMuY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHBvc3RNZXNzYWdlKGFjdGlvbjogc3RyaW5nLCBwYXlsb2FkOiBPYmplY3QpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy53b3JrZXJcbiAgICAgICAgLnBpcGUodGFrZSgxKSwgdGFwKChzdzogU2VydmljZVdvcmtlcikgPT4ge1xuICAgICAgICAgICAgICAgIHN3LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLCAuLi5wYXlsb2FkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwb3N0TWVzc2FnZVdpdGhTdGF0dXModHlwZTogc3RyaW5nLCBwYXlsb2FkOiBPYmplY3QsIG5vbmNlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB3YWl0Rm9yU3RhdHVzID0gdGhpcy53YWl0Rm9yU3RhdHVzKG5vbmNlKTtcbiAgICBjb25zdCBwb3N0TWVzc2FnZSA9IHRoaXMucG9zdE1lc3NhZ2UodHlwZSwgcGF5bG9hZCk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFt3YWl0Rm9yU3RhdHVzLCBwb3N0TWVzc2FnZV0pLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGdlbmVyYXRlTm9uY2UoKTogbnVtYmVyIHsgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwKTsgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIC8vIFRPRE8oaSk6IHRoZSB0eXBpbmdzIGFuZCBjYXN0cyBpbiB0aGlzIG1ldGhvZCBhcmUgd29ua3ksIHdlIHNob3VsZCByZXZpc2l0IGl0IGFuZCBtYWtlIHRoZVxuICAvLyB0eXBlcyBmbG93IGNvcnJlY3RseVxuICBldmVudHNPZlR5cGU8VCBleHRlbmRzIFR5cGVkRXZlbnQ+KHR5cGU6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiA8T2JzZXJ2YWJsZTxUPj50aGlzLmV2ZW50cy5waXBlKGZpbHRlcigoZXZlbnQpID0+IHsgcmV0dXJuIGV2ZW50LnR5cGUgPT09IHR5cGU7IH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIC8vIFRPRE8oaSk6IHRoZSB0eXBpbmdzIGFuZCBjYXN0cyBpbiB0aGlzIG1ldGhvZCBhcmUgd29ua3ksIHdlIHNob3VsZCByZXZpc2l0IGl0IGFuZCBtYWtlIHRoZVxuICAvLyB0eXBlcyBmbG93IGNvcnJlY3RseVxuICBuZXh0RXZlbnRPZlR5cGU8VCBleHRlbmRzIFR5cGVkRXZlbnQ+KHR5cGU6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiA8T2JzZXJ2YWJsZTxUPj4odGhpcy5ldmVudHNPZlR5cGUodHlwZSkucGlwZSh0YWtlKDEpKSk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICB3YWl0Rm9yU3RhdHVzKG5vbmNlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNPZlR5cGU8U3RhdHVzRXZlbnQ+KCdTVEFUVVMnKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAgIGZpbHRlcigoZXZlbnQ6IFN0YXR1c0V2ZW50KSA9PiBldmVudC5ub25jZSA9PT0gbm9uY2UpLCB0YWtlKDEpLFxuICAgICAgICAgICAgbWFwKChldmVudDogU3RhdHVzRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LnN0YXR1cykge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGV2ZW50LmVycm9yICEpO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKTtcbiAgfVxuXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiAhIXRoaXMuc2VydmljZVdvcmtlcjsgfVxufVxuIl19