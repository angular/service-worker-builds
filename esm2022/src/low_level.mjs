/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
export const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
function errorObservable(message) {
    return defer(() => throwError(new Error(message)));
}
/**
 * @publicApi
 */
export class NgswCommChannel {
    constructor(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            const controllerChangeEvents = fromEvent(serviceWorker, 'controllerchange');
            const controllerChanges = controllerChangeEvents.pipe(map(() => serviceWorker.controller));
            const currentController = defer(() => of(serviceWorker.controller));
            const controllerWithChanges = concat(currentController, controllerChanges);
            this.worker = controllerWithChanges.pipe(filter((c) => !!c));
            this.registration = (this.worker.pipe(switchMap(() => serviceWorker.getRegistration())));
            const rawEvents = fromEvent(serviceWorker, 'message');
            const rawEventPayload = rawEvents.pipe(map((event) => event.data));
            const eventsUnconnected = rawEventPayload.pipe(filter((event) => event && event.type));
            const events = eventsUnconnected.pipe(publish());
            events.connect();
            this.events = events;
        }
    }
    postMessage(action, payload) {
        return this.worker
            .pipe(take(1), tap((sw) => {
            sw.postMessage({
                action,
                ...payload,
            });
        }))
            .toPromise()
            .then(() => undefined);
    }
    postMessageWithOperation(type, payload, operationNonce) {
        const waitForOperationCompleted = this.waitForOperationCompleted(operationNonce);
        const postMessage = this.postMessage(type, payload);
        return Promise.all([postMessage, waitForOperationCompleted]).then(([, result]) => result);
    }
    generateNonce() {
        return Math.round(Math.random() * 10000000);
    }
    eventsOfType(type) {
        let filterFn;
        if (typeof type === 'string') {
            filterFn = (event) => event.type === type;
        }
        else {
            filterFn = (event) => type.includes(event.type);
        }
        return this.events.pipe(filter(filterFn));
    }
    nextEventOfType(type) {
        return this.eventsOfType(type).pipe(take(1));
    }
    waitForOperationCompleted(nonce) {
        return this.eventsOfType('OPERATION_COMPLETED')
            .pipe(filter((event) => event.nonce === nonce), take(1), map((event) => {
            if (event.result !== undefined) {
                return event.result;
            }
            throw new Error(event.error);
        }))
            .toPromise();
    }
    get isEnabled() {
        return !!this.serviceWorker;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUF5QixLQUFLLEVBQUUsU0FBUyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDakcsT0FBTyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUUsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsK0RBQStELENBQUM7QUFnSHBHLFNBQVMsZUFBZSxDQUFDLE9BQWU7SUFDdEMsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQU8xQixZQUFvQixhQUFpRDtRQUFqRCxrQkFBYSxHQUFiLGFBQWEsQ0FBb0M7UUFDbkUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3hGLENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxzQkFBc0IsR0FBRyxTQUFTLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDNUUsTUFBTSxpQkFBaUIsR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzNGLE1BQU0saUJB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LENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxlQUFlLENBQXVCLElBQWU7UUFDbkQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQseUJBQXlCLENBQUMsS0FBYTtRQUNyQyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQTBCLHFCQUFxQixDQUFDO2FBQ3JFLElBQUksQ0FDSCxNQUFNLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLEVBQ3hDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUNaLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDL0IsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3RCLENBQUM7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FDSDthQUNBLFNBQVMsRUFBc0IsQ0FBQztJQUNyQyxDQUFDO0lBRUQsSUFBSSxTQUFTO1FBQ1gsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM5QixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtjb25jYXQsIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSwgZGVmZXIsIGZyb21FdmVudCwgT2JzZXJ2YWJsZSwgb2YsIHRocm93RXJyb3J9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIG1hcCwgcHVibGlzaCwgc3dpdGNoTWFwLCB0YWtlLCB0YXB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZXhwb3J0IGNvbnN0IEVSUl9TV19OT1RfU1VQUE9SVEVEID0gJ1NlcnZpY2Ugd29ya2VycyBhcmUgZGlzYWJsZWQgb3Igbm90IHN1cHBvcnRlZCBieSB0aGlzIGJyb3dzZXInO1xuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VydmljZSB3b3JrZXIgaGFzIGNoZWNrZWQgdGhlIHZlcnNpb24gb2YgdGhlIGFwcCBvbiB0aGUgc2VydmVyIGFuZCBpdFxuICogZGlkbid0IGZpbmQgYSBuZXcgdmVyc2lvbiB0aGF0IGl0IGRvZXNuJ3QgaGF2ZSBhbHJlYWR5IGRvd25sb2FkZWQuXG4gKlxuICogQHNlZSB7QGxpbmsgZWNvc3lzdGVtL3NlcnZpY2Utd29ya2Vycy9jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb05ld1ZlcnNpb25EZXRlY3RlZEV2ZW50IHtcbiAgdHlwZTogJ05PX05FV19WRVJTSU9OX0RFVEVDVEVEJztcbiAgdmVyc2lvbjoge2hhc2g6IHN0cmluZzsgYXBwRGF0YT86IE9iamVjdH07XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZXJ2aWNlIHdvcmtlciBoYXMgZGV0ZWN0ZWQgYSBuZXcgdmVyc2lvbiBvZiB0aGUgYXBwIG9uIHRoZSBzZXJ2ZXIgYW5kXG4gKiBpcyBhYm91dCB0byBzdGFydCBkb3dubG9hZGluZyBpdC5cbiAqXG4gKiBAc2VlIHtAbGluayBlY29zeXN0ZW0vc2VydmljZS13b3JrZXJzL2NvbW11bmljYXRpb25zIFNlcnZpY2Ugd29ya2VyIGNvbW11bmljYXRpb24gZ3VpZGV9XG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZlcnNpb25EZXRlY3RlZEV2ZW50IHtcbiAgdHlwZTogJ1ZFUlNJT05fREVURUNURUQnO1xuICB2ZXJzaW9uOiB7aGFzaDogc3RyaW5nOyBhcHBEYXRhPzogb2JqZWN0fTtcbn1cblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGluc3RhbGxhdGlvbiBvZiBhIG5ldyB2ZXJzaW9uIGZhaWxlZC5cbiAqIEl0IG1heSBiZSB1c2VkIGZvciBsb2dnaW5nL21vbml0b3JpbmcgcHVycG9zZXMuXG4gKlxuICogQHNlZSB7QGxpbmsgZWNvc3lzdGVtL3NlcnZpY2Utd29ya2Vycy9jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWZXJzaW9uSW5zdGFsbGF0aW9uRmFpbGVkRXZlbnQge1xuICB0eXBlOiAnVkVSU0lPTl9JTlNUQUxMQVRJT05fRkFJTEVEJztcbiAgdmVyc2lvbjoge2hhc2g6IHN0cmluZzsgYXBwRGF0YT86IG9iamVjdH07XG4gIGVycm9yOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIGEgbmV3IHZlcnNpb24gb2YgdGhlIGFwcCBpcyBhdmFpbGFibGUuXG4gKlxuICogQHNlZSB7QGxpbmsgZWNvc3lzdGVtL3NlcnZpY2Utd29ya2Vycy9jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWZXJzaW9uUmVhZHlFdmVudCB7XG4gIHR5cGU6ICdWRVJTSU9OX1JFQURZJztcbiAgY3VycmVudFZlcnNpb246IHtoYXNoOiBzdHJpbmc7IGFwcERhdGE/OiBvYmplY3R9O1xuICBsYXRlc3RWZXJzaW9uOiB7aGFzaDogc3RyaW5nOyBhcHBEYXRhPzogb2JqZWN0fTtcbn1cblxuLyoqXG4gKiBBIHVuaW9uIG9mIGFsbCBldmVudCB0eXBlcyB0aGF0IGNhbiBiZSBlbWl0dGVkIGJ5XG4gKiB7QGxpbmsgU3dVcGRhdGUjdmVyc2lvblVwZGF0ZXN9LlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IHR5cGUgVmVyc2lvbkV2ZW50ID1cbiAgfCBWZXJzaW9uRGV0ZWN0ZWRFdmVudFxuICB8IFZlcnNpb25JbnN0YWxsYXRpb25GYWlsZWRFdmVudFxuICB8IFZlcnNpb25SZWFkeUV2ZW50XG4gIHwgTm9OZXdWZXJzaW9uRGV0ZWN0ZWRFdmVudDtcblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIHZlcnNpb24gb2YgdGhlIGFwcCB1c2VkIGJ5IHRoZSBzZXJ2aWNlIHdvcmtlciB0byBzZXJ2ZSB0aGlzIGNsaWVudCBpc1xuICogaW4gYSBicm9rZW4gc3RhdGUgdGhhdCBjYW5ub3QgYmUgcmVjb3ZlcmVkIGZyb20gYW5kIGEgZnVsbCBwYWdlIHJlbG9hZCBpcyByZXF1aXJlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgdGhlIHNlcnZpY2Ugd29ya2VyIG1heSBub3QgYmUgYWJsZSB0byByZXRyaWV2ZSBhIHJlcXVpcmVkIHJlc291cmNlLCBuZWl0aGVyIGZyb20gdGhlXG4gKiBjYWNoZSBub3IgZnJvbSB0aGUgc2VydmVyLiBUaGlzIGNvdWxkIGhhcHBlbiBpZiBhIG5ldyB2ZXJzaW9uIGlzIGRlcGxveWVkIHRvIHRoZSBzZXJ2ZXIgYW5kIHRoZVxuICogc2VydmljZSB3b3JrZXIgY2FjaGUgaGFzIGJlZW4gcGFydGlhbGx5IGNsZWFuZWQgYnkgdGhlIGJyb3dzZXIsIHJlbW92aW5nIHNvbWUgZmlsZXMgb2YgYSBwcmV2aW91c1xuICogYXBwIHZlcnNpb24gYnV0IG5vdCBhbGwuXG4gKlxuICogQHNlZSB7QGxpbmsgZWNvc3lzdGVtL3NlcnZpY2Utd29ya2Vycy9jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVbnJlY292ZXJhYmxlU3RhdGVFdmVudCB7XG4gIHR5cGU6ICdVTlJFQ09WRVJBQkxFX1NUQVRFJztcbiAgcmVhc29uOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIGEgYFB1c2hFdmVudGAgaXMgcmVjZWl2ZWQgYnkgdGhlIHNlcnZpY2Ugd29ya2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFB1c2hFdmVudCB7XG4gIHR5cGU6ICdQVVNIJztcbiAgZGF0YTogYW55O1xufVxuXG5leHBvcnQgdHlwZSBJbmNvbWluZ0V2ZW50ID0gVW5yZWNvdmVyYWJsZVN0YXRlRXZlbnQgfCBWZXJzaW9uRXZlbnQ7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVHlwZWRFdmVudCB7XG4gIHR5cGU6IHN0cmluZztcbn1cblxudHlwZSBPcGVyYXRpb25Db21wbGV0ZWRFdmVudCA9XG4gIHwge1xuICAgICAgdHlwZTogJ09QRVJBVElPTl9DT01QTEVURUQnO1xuICAgICAgbm9uY2U6IG51bWJlcjtcbiAgICAgIHJlc3VsdDogYm9vbGVhbjtcbiAgICB9XG4gIHwge1xuICAgICAgdHlwZTogJ09QRVJBVElPTl9DT01QTEVURUQnO1xuICAgICAgbm9uY2U6IG51bWJlcjtcbiAgICAgIHJlc3VsdD86IHVuZGVmaW5lZDtcbiAgICAgIGVycm9yOiBzdHJpbmc7XG4gICAgfTtcblxuZnVuY3Rpb24gZXJyb3JPYnNlcnZhYmxlKG1lc3NhZ2U6IHN0cmluZyk6IE9ic2VydmFibGU8YW55PiB7XG4gIHJldHVybiBkZWZlcigoKSA9PiB0aHJvd0Vycm9yKG5ldyBFcnJvcihtZXNzYWdlKSkpO1xufVxuXG4vKipcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGNsYXNzIE5nc3dDb21tQ2hhbm5lbCB7XG4gIHJlYWRvbmx5IHdvcmtlcjogT2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyPjtcblxuICByZWFkb25seSByZWdpc3RyYXRpb246IE9ic2VydmFibGU8U2VydmljZVdvcmtlclJlZ2lzdHJhdGlvbj47XG5cbiAgcmVhZG9ubHkgZXZlbnRzOiBPYnNlcnZhYmxlPFR5cGVkRXZlbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZVdvcmtlcjogU2VydmljZVdvcmtlckNvbnRhaW5lciB8IHVuZGVmaW5lZCkge1xuICAgIGlmICghc2VydmljZVdvcmtlcikge1xuICAgICAgdGhpcy53b3JrZXIgPSB0aGlzLmV2ZW50cyA9IHRoaXMucmVnaXN0cmF0aW9uID0gZXJyb3JPYnNlcnZhYmxlKEVSUl9TV19OT1RfU1VQUE9SVEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZUV2ZW50cyA9IGZyb21FdmVudChzZXJ2aWNlV29ya2VyLCAnY29udHJvbGxlcmNoYW5nZScpO1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZXMgPSBjb250cm9sbGVyQ2hhbmdlRXZlbnRzLnBpcGUobWFwKCgpID0+IHNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikpO1xuICAgICAgY29uc3QgY3VycmVudENvbnRyb2xsZXIgPSBkZWZlcigoKSA9PiBvZihzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKTtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcyA9IGNvbmNhdChjdXJyZW50Q29udHJvbGxlciwgY29udHJvbGxlckNoYW5nZXMpO1xuXG4gICAgICB0aGlzLndvcmtlciA9IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcy5waXBlKGZpbHRlcigoYyk6IGMgaXMgU2VydmljZVdvcmtlciA9PiAhIWMpKTtcblxuICAgICAgdGhpcy5yZWdpc3RyYXRpb24gPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPj4oXG4gICAgICAgIHRoaXMud29ya2VyLnBpcGUoc3dpdGNoTWFwKCgpID0+IHNlcnZpY2VXb3JrZXIuZ2V0UmVnaXN0cmF0aW9uKCkpKVxuICAgICAgKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRzID0gZnJvbUV2ZW50PE1lc3NhZ2VFdmVudD4oc2VydmljZVdvcmtlciwgJ21lc3NhZ2UnKTtcbiAgICAgIGNvbnN0IHJhd0V2ZW50UGF5bG9hZCA9IHJhd0V2ZW50cy5waXBlKG1hcCgoZXZlbnQpID0+IGV2ZW50LmRhdGEpKTtcbiAgICAgIGNvbnN0IGV2ZW50c1VuY29ubmVjdGVkID0gcmF3RXZlbnRQYXlsb2FkLnBpcGUoZmlsdGVyKChldmVudCkgPT4gZXZlbnQgJiYgZXZlbnQudHlwZSkpO1xuICAgICAgY29uc3QgZXZlbnRzID0gZXZlbnRzVW5jb25uZWN0ZWQucGlwZShwdWJsaXNoKCkpIGFzIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxJbmNvbWluZ0V2ZW50PjtcbiAgICAgIGV2ZW50cy5jb25uZWN0KCk7XG5cbiAgICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuICAgIH1cbiAgfVxuXG4gIHBvc3RNZXNzYWdlKGFjdGlvbjogc3RyaW5nLCBwYXlsb2FkOiBPYmplY3QpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy53b3JrZXJcbiAgICAgIC5waXBlKFxuICAgICAgICB0YWtlKDEpLFxuICAgICAgICB0YXAoKHN3OiBTZXJ2aWNlV29ya2VyKSA9PiB7XG4gICAgICAgICAgc3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSksXG4gICAgICApXG4gICAgICAudG9Qcm9taXNlKClcbiAgICAgIC50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICBwb3N0TWVzc2FnZVdpdGhPcGVyYXRpb24oXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIHBheWxvYWQ6IE9iamVjdCxcbiAgICBvcGVyYXRpb25Ob25jZTogbnVtYmVyLFxuICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCB3YWl0Rm9yT3BlcmF0aW9uQ29tcGxldGVkID0gdGhpcy53YWl0Rm9yT3BlcmF0aW9uQ29tcGxldGVkKG9wZXJhdGlvbk5vbmNlKTtcbiAgICBjb25zdCBwb3N0TWVzc2FnZSA9IHRoaXMucG9zdE1lc3NhZ2UodHlwZSwgcGF5bG9hZCk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFtwb3N0TWVzc2FnZSwgd2FpdEZvck9wZXJhdGlvbkNvbXBsZXRlZF0pLnRoZW4oKFssIHJlc3VsdF0pID0+IHJlc3VsdCk7XG4gIH1cblxuICBnZW5lcmF0ZU5vbmNlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwKTtcbiAgfVxuXG4gIGV2ZW50c09mVHlwZTxUIGV4dGVuZHMgVHlwZWRFdmVudD4odHlwZTogVFsndHlwZSddIHwgVFsndHlwZSddW10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBsZXQgZmlsdGVyRm46IChldmVudDogVHlwZWRFdmVudCkgPT4gZXZlbnQgaXMgVDtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBmaWx0ZXJGbiA9IChldmVudDogVHlwZWRFdmVudCk6IGV2ZW50IGlzIFQgPT4gZXZlbnQudHlwZSA9PT0gdHlwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyRm4gPSAoZXZlbnQ6IFR5cGVkRXZlbnQpOiBldmVudCBpcyBUID0+IHR5cGUuaW5jbHVkZXMoZXZlbnQudHlwZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV2ZW50cy5waXBlKGZpbHRlcihmaWx0ZXJGbikpO1xuICB9XG5cbiAgbmV4dEV2ZW50T2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBUWyd0eXBlJ10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNPZlR5cGUodHlwZSkucGlwZSh0YWtlKDEpKTtcbiAgfVxuXG4gIHdhaXRGb3JPcGVyYXRpb25Db21wbGV0ZWQobm9uY2U6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50c09mVHlwZTxPcGVyYXRpb25Db21wbGV0ZWRFdmVudD4oJ09QRVJBVElPTl9DT01QTEVURUQnKVxuICAgICAgLnBpcGUoXG4gICAgICAgIGZpbHRlcigoZXZlbnQpID0+IGV2ZW50Lm5vbmNlID09PSBub25jZSksXG4gICAgICAgIHRha2UoMSksXG4gICAgICAgIG1hcCgoZXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQucmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBldmVudC5yZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihldmVudC5lcnJvciEpO1xuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIC50b1Byb21pc2UoKSBhcyBQcm9taXNlPGJvb2xlYW4+O1xuICB9XG5cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnNlcnZpY2VXb3JrZXI7XG4gIH1cbn1cbiJdfQ==