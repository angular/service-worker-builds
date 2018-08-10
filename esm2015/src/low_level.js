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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBb0MsTUFBTSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFHLFVBQVUsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNsRyxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFMUUsYUFBYSxvQkFBb0IsR0FBRywrREFBK0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ3BHLHlCQUF5QixPQUFlO0lBQ3RDLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDcEQ7Ozs7QUFLRCxNQUFNOzs7O0lBZ0JKLFlBQW9CLGFBQStDO1FBQS9DLGtCQUFhLEdBQWIsYUFBYSxDQUFrQztRQUNqRSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ3ZGO2FBQU07O1lBQ0wsTUFBTSxzQkFBc0IscUJBQ1AsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUMsRUFBQzs7WUFDcEUsTUFBTSxpQkFBaUIscUJBQW1DLENBQ3RELHNCQUFzQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFD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QUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQztLQUMvRDs7Ozs7O0lBS0QsYUFBYSxDQUFDLEtBQWE7UUFDekIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFjLFFBQVEsQ0FBQzthQUMxQyxJQUFJLENBQ0QsTUFBTSxDQUFDLENBQUMsS0FBa0IsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQzlELEdBQUcsQ0FBQyxDQUFDLEtBQWtCLEVBQUUsRUFBRTtZQUN6QixJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7Z0JBQ2hCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO1lBQ0QsTUFBTSxJQUFJLEtBQUssb0JBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxDQUFDO1NBQ2hDLENBQUMsQ0FBQzthQUNOLFNBQVMsRUFBRSxDQUFDO0tBQ2xCOzs7O0lBRUQsSUFBSSxTQUFTLEtBQWMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO0NBQzFEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSwgT2JzZXJ2YWJsZSwgY29uY2F0LCBkZWZlciwgZnJvbUV2ZW50LCBvZiAsIHRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIG1hcCwgcHVibGlzaCwgc3dpdGNoTWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGNvbnN0IEVSUl9TV19OT1RfU1VQUE9SVEVEID0gJ1NlcnZpY2Ugd29ya2VycyBhcmUgZGlzYWJsZWQgb3Igbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIFZlcnNpb24ge1xuICBoYXNoOiBzdHJpbmc7XG4gIGFwcERhdGE/OiBPYmplY3Q7XG59XG5cbi8qKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0ZUF2YWlsYWJsZUV2ZW50IHtcbiAgdHlwZTogJ1VQREFURV9BVkFJTEFCTEUnO1xuICBjdXJyZW50OiBWZXJzaW9uO1xuICBhdmFpbGFibGU6IFZlcnNpb247XG59XG5cbi8qKlxuICogQGV4cGVyaW1lbnRhbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFVwZGF0ZUFjdGl2YXRlZEV2ZW50IHtcbiAgdHlwZTogJ1VQREFURV9BQ1RJVkFURUQnO1xuICBwcmV2aW91cz86IFZlcnNpb247XG4gIGN1cnJlbnQ6IFZlcnNpb247XG59XG5cbmV4cG9ydCB0eXBlIEluY29taW5nRXZlbnQgPSBVcGRhdGVBdmFpbGFibGVFdmVudCB8IFVwZGF0ZUFjdGl2YXRlZEV2ZW50O1xuXG5leHBvcnQgaW50ZXJmYWNlIFR5cGVkRXZlbnQgeyB0eXBlOiBzdHJpbmc7IH1cblxuaW50ZXJmYWNlIFN0YXR1c0V2ZW50IHtcbiAgdHlwZTogJ1NUQVRVUyc7XG4gIG5vbmNlOiBudW1iZXI7XG4gIHN0YXR1czogYm9vbGVhbjtcbiAgZXJyb3I/OiBzdHJpbmc7XG59XG5cblxuZnVuY3Rpb24gZXJyb3JPYnNlcnZhYmxlKG1lc3NhZ2U6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gIHJldHVybiBkZWZlcigoKSA9PiB0aHJvd0Vycm9yKG5ldyBFcnJvcihtZXNzYWdlKSkpO1xufVxuXG4vKipcbiAqIEBleHBlcmltZW50YWxcbiovXG5leHBvcnQgY2xhc3MgTmdzd0NvbW1DaGFubmVsIHtcbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVhZG9ubHkgd29ya2VyOiBPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXI+O1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHJlYWRvbmx5IHJlZ2lzdHJhdGlvbjogT2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPjtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICByZWFkb25seSBldmVudHM6IE9ic2VydmFibGU8VHlwZWRFdmVudD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlV29ya2VyOiBTZXJ2aWNlV29ya2VyQ29udGFpbmVyfHVuZGVmaW5lZCkge1xuICAgIGlmICghc2VydmljZVdvcmtlcikge1xuICAgICAgdGhpcy53b3JrZXIgPSB0aGlzLmV2ZW50cyA9IHRoaXMucmVnaXN0cmF0aW9uID0gZXJyb3JPYnNlcnZhYmxlKEVSUl9TV19OT1RfU1VQUE9SVEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZUV2ZW50cyA9XG4gICAgICAgICAgPE9ic2VydmFibGU8YW55Pj4oZnJvbUV2ZW50KHNlcnZpY2VXb3JrZXIsICdjb250cm9sbGVyY2hhbmdlJykpO1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZXMgPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyfG51bGw+PihcbiAgICAgICAgICBjb250cm9sbGVyQ2hhbmdlRXZlbnRzLnBpcGUobWFwKCgpID0+IHNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikpKTtcblxuICAgICAgY29uc3QgY3VycmVudENvbnRyb2xsZXIgPVxuICAgICAgICAgIDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJ8bnVsbD4+KGRlZmVyKCgpID0+IG9mIChzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKSk7XG5cbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcyA9XG4gICAgICAgICAgPE9ic2VydmFibGU8U2VydmljZVdvcmtlcnxudWxsPj4oY29uY2F0KGN1cnJlbnRDb250cm9sbGVyLCBjb250cm9sbGVyQ2hhbmdlcykpO1xuICAgICAgdGhpcy53b3JrZXIgPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyPj4oXG4gICAgICAgICAgY29udHJvbGxlcldpdGhDaGFuZ2VzLnBpcGUoZmlsdGVyKChjOiBTZXJ2aWNlV29ya2VyKSA9PiAhIWMpKSk7XG5cbiAgICAgIHRoaXMucmVnaXN0cmF0aW9uID0gPE9ic2VydmFibGU8U2VydmljZVdvcmtlclJlZ2lzdHJhdGlvbj4+KFxuICAgICAgICAgIHRoaXMud29ya2VyLnBpcGUoc3dpdGNoTWFwKCgpID0+IHNlcnZpY2VXb3JrZXIuZ2V0UmVnaXN0cmF0aW9uKCkpKSk7XG5cbiAgICAgIGNvbnN0IHJhd0V2ZW50cyA9IGZyb21FdmVudChzZXJ2aWNlV29ya2VyLCAnbWVzc2FnZScpO1xuXG4gICAgICBjb25zdCByYXdFdmVudFBheWxvYWQgPSByYXdFdmVudHMucGlwZShtYXAoKGV2ZW50OiBNZXNzYWdlRXZlbnQpID0+IGV2ZW50LmRhdGEpKTtcbiAgICAgIGNvbnN0IGV2ZW50c1VuY29ubmVjdGVkID1cbiAgICAgICAgICAocmF3RXZlbnRQYXlsb2FkLnBpcGUoZmlsdGVyKChldmVudDogT2JqZWN0KSA9PiAhIWV2ZW50ICYmICEhKGV2ZW50IGFzIGFueSlbJ3R5cGUnXSkpKTtcbiAgICAgIGNvbnN0IGV2ZW50cyA9IGV2ZW50c1VuY29ubmVjdGVkLnBpcGUocHVibGlzaCgpKSBhcyBDb25uZWN0YWJsZU9ic2VydmFibGU8SW5jb21pbmdFdmVudD47XG4gICAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcbiAgICAgIGV2ZW50cy5jb25uZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcG9zdE1lc3NhZ2UoYWN0aW9uOiBzdHJpbmcsIHBheWxvYWQ6IE9iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLndvcmtlclxuICAgICAgICAucGlwZSh0YWtlKDEpLCB0YXAoKHN3OiBTZXJ2aWNlV29ya2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgc3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICBhY3Rpb24sIC4uLnBheWxvYWQsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pKVxuICAgICAgICAudG9Qcm9taXNlKClcbiAgICAgICAgLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHBvc3RNZXNzYWdlV2l0aFN0YXR1cyh0eXBlOiBzdHJpbmcsIHBheWxvYWQ6IE9iamVjdCwgbm9uY2U6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHdhaXRGb3JTdGF0dXMgPSB0aGlzLndhaXRGb3JTdGF0dXMobm9uY2UpO1xuICAgIGNvbnN0IHBvc3RNZXNzYWdlID0gdGhpcy5wb3N0TWVzc2FnZSh0eXBlLCBwYXlsb2FkKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3dhaXRGb3JTdGF0dXMsIHBvc3RNZXNzYWdlXSkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZ2VuZXJhdGVOb25jZSgpOiBudW1iZXIgeyByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDAwMDApOyB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgLy8gVE9ETyhpKTogdGhlIHR5cGluZ3MgYW5kIGNhc3RzIGluIHRoaXMgbWV0aG9kIGFyZSB3b25reSwgd2Ugc2hvdWxkIHJldmlzaXQgaXQgYW5kIG1ha2UgdGhlXG4gIC8vIHR5cGVzIGZsb3cgY29ycmVjdGx5XG4gIGV2ZW50c09mVHlwZTxUIGV4dGVuZHMgVHlwZWRFdmVudD4odHlwZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIDxPYnNlcnZhYmxlPFQ+PnRoaXMuZXZlbnRzLnBpcGUoZmlsdGVyKChldmVudCkgPT4geyByZXR1cm4gZXZlbnQudHlwZSA9PT0gdHlwZTsgfSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgLy8gVE9ETyhpKTogdGhlIHR5cGluZ3MgYW5kIGNhc3RzIGluIHRoaXMgbWV0aG9kIGFyZSB3b25reSwgd2Ugc2hvdWxkIHJldmlzaXQgaXQgYW5kIG1ha2UgdGhlXG4gIC8vIHR5cGVzIGZsb3cgY29ycmVjdGx5XG4gIG5leHRFdmVudE9mVHlwZTxUIGV4dGVuZHMgVHlwZWRFdmVudD4odHlwZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIDxPYnNlcnZhYmxlPFQ+Pih0aGlzLmV2ZW50c09mVHlwZSh0eXBlKS5waXBlKHRha2UoMSkpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHdhaXRGb3JTdGF0dXMobm9uY2U6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50c09mVHlwZTxTdGF0dXNFdmVudD4oJ1NUQVRVUycpXG4gICAgICAgIC5waXBlKFxuICAgICAgICAgICAgZmlsdGVyKChldmVudDogU3RhdHVzRXZlbnQpID0+IGV2ZW50Lm5vbmNlID09PSBub25jZSksIHRha2UoMSksXG4gICAgICAgICAgICBtYXAoKGV2ZW50OiBTdGF0dXNFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXZlbnQuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXZlbnQuZXJyb3IgISk7XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHsgcmV0dXJuICEhdGhpcy5zZXJ2aWNlV29ya2VyOyB9XG59XG4iXX0=