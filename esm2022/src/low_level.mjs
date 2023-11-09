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
            const rawEventPayload = rawEvents.pipe(map(event => event.data));
            const eventsUnconnected = rawEventPayload.pipe(filter(event => event && event.type));
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
            .pipe(filter(event => event.nonce === nonce), take(1), map(event => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsTUFBTSxFQUF5QixLQUFLLEVBQUUsU0FBUyxFQUFjLEVBQUUsRUFBRSxVQUFVLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDakcsT0FBTyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFMUUsTUFBTSxDQUFDLE1BQU0sb0JBQW9CLEdBQUcsK0RBQStELENBQUM7QUEyR3BHLFNBQVMsZUFBZSxDQUFDLE9BQWU7SUFDdEMsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLE9BQU8sZUFBZTtJQU8xQixZQUFvQixhQUErQztRQUEvQyxrQkFBYSxHQUFiLGFBQWEsQ0FBa0M7UUFDakUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQ3hGLENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxzQkFBc0IsR0FBRyxTQUFTLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDNUUsTUFBTSxpQkFBaUIsR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzNGLE1BQU0saUJB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Q0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsZUFBZSxDQUF1QixJQUFlO1FBQ25ELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELHlCQUF5QixDQUFDLEtBQWE7UUFDckMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUEwQixxQkFBcUIsQ0FBQzthQUNuRSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUUsQ0FBQztnQkFDL0IsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDO1lBQ3RCLENBQUM7WUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFNLENBQUMsQ0FBQztRQUNoQyxDQUFDLENBQUMsQ0FBQzthQUNSLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUFJLFNBQVM7UUFDWCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvbmNhdCwgQ29ubmVjdGFibGVPYnNlcnZhYmxlLCBkZWZlciwgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBvZiwgdGhyb3dFcnJvcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgbWFwLCBwdWJsaXNoLCBzd2l0Y2hNYXAsIHRha2UsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgY29uc3QgRVJSX1NXX05PVF9TVVBQT1JURUQgPSAnU2VydmljZSB3b3JrZXJzIGFyZSBkaXNhYmxlZCBvciBub3Qgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlcic7XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBzZXJ2aWNlIHdvcmtlciBoYXMgY2hlY2tlZCB0aGUgdmVyc2lvbiBvZiB0aGUgYXBwIG9uIHRoZSBzZXJ2ZXIgYW5kIGl0XG4gKiBkaWRuJ3QgZmluZCBhIG5ldyB2ZXJzaW9uIHRoYXQgaXQgZG9lc24ndCBoYXZlIGFscmVhZHkgZG93bmxvYWRlZC5cbiAqXG4gKiBAc2VlIHtAbGluayBndWlkZS9zZXJ2aWNlLXdvcmtlci1jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOb05ld1ZlcnNpb25EZXRlY3RlZEV2ZW50IHtcbiAgdHlwZTogJ05PX05FV19WRVJTSU9OX0RFVEVDVEVEJztcbiAgdmVyc2lvbjoge2hhc2g6IHN0cmluZzsgYXBwRGF0YT86IE9iamVjdDt9O1xufVxuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgc2VydmljZSB3b3JrZXIgaGFzIGRldGVjdGVkIGEgbmV3IHZlcnNpb24gb2YgdGhlIGFwcCBvbiB0aGUgc2VydmVyIGFuZFxuICogaXMgYWJvdXQgdG8gc3RhcnQgZG93bmxvYWRpbmcgaXQuXG4gKlxuICogQHNlZSB7QGxpbmsgZ3VpZGUvc2VydmljZS13b3JrZXItY29tbXVuaWNhdGlvbnMgU2VydmljZSB3b3JrZXIgY29tbXVuaWNhdGlvbiBndWlkZX1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmVyc2lvbkRldGVjdGVkRXZlbnQge1xuICB0eXBlOiAnVkVSU0lPTl9ERVRFQ1RFRCc7XG4gIHZlcnNpb246IHtoYXNoOiBzdHJpbmc7IGFwcERhdGE/OiBvYmplY3Q7fTtcbn1cblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGluc3RhbGxhdGlvbiBvZiBhIG5ldyB2ZXJzaW9uIGZhaWxlZC5cbiAqIEl0IG1heSBiZSB1c2VkIGZvciBsb2dnaW5nL21vbml0b3JpbmcgcHVycG9zZXMuXG4gKlxuICogQHNlZSB7QGxpbmsgZ3VpZGUvc2VydmljZS13b3JrZXItY29tbXVuaWNhdGlvbnMgU2VydmljZSB3b3JrZXIgY29tbXVuaWNhdGlvbiBndWlkZX1cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVmVyc2lvbkluc3RhbGxhdGlvbkZhaWxlZEV2ZW50IHtcbiAgdHlwZTogJ1ZFUlNJT05fSU5TVEFMTEFUSU9OX0ZBSUxFRCc7XG4gIHZlcnNpb246IHtoYXNoOiBzdHJpbmc7IGFwcERhdGE/OiBvYmplY3Q7fTtcbiAgZXJyb3I6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gYSBuZXcgdmVyc2lvbiBvZiB0aGUgYXBwIGlzIGF2YWlsYWJsZS5cbiAqXG4gKiBAc2VlIHtAbGluayBndWlkZS9zZXJ2aWNlLXdvcmtlci1jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWZXJzaW9uUmVhZHlFdmVudCB7XG4gIHR5cGU6ICdWRVJTSU9OX1JFQURZJztcbiAgY3VycmVudFZlcnNpb246IHtoYXNoOiBzdHJpbmc7IGFwcERhdGE/OiBvYmplY3Q7fTtcbiAgbGF0ZXN0VmVyc2lvbjoge2hhc2g6IHN0cmluZzsgYXBwRGF0YT86IG9iamVjdDt9O1xufVxuXG5cbi8qKlxuICogQSB1bmlvbiBvZiBhbGwgZXZlbnQgdHlwZXMgdGhhdCBjYW4gYmUgZW1pdHRlZCBieVxuICoge0BsaW5rIGFwaS9zZXJ2aWNlLXdvcmtlci9Td1VwZGF0ZSN2ZXJzaW9uVXBkYXRlcyBTd1VwZGF0ZSN2ZXJzaW9uVXBkYXRlc30uXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgdHlwZSBWZXJzaW9uRXZlbnQgPVxuICAgIFZlcnNpb25EZXRlY3RlZEV2ZW50fFZlcnNpb25JbnN0YWxsYXRpb25GYWlsZWRFdmVudHxWZXJzaW9uUmVhZHlFdmVudHxOb05ld1ZlcnNpb25EZXRlY3RlZEV2ZW50O1xuXG4vKipcbiAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgdmVyc2lvbiBvZiB0aGUgYXBwIHVzZWQgYnkgdGhlIHNlcnZpY2Ugd29ya2VyIHRvIHNlcnZlIHRoaXMgY2xpZW50IGlzXG4gKiBpbiBhIGJyb2tlbiBzdGF0ZSB0aGF0IGNhbm5vdCBiZSByZWNvdmVyZWQgZnJvbSBhbmQgYSBmdWxsIHBhZ2UgcmVsb2FkIGlzIHJlcXVpcmVkLlxuICpcbiAqIEZvciBleGFtcGxlLCB0aGUgc2VydmljZSB3b3JrZXIgbWF5IG5vdCBiZSBhYmxlIHRvIHJldHJpZXZlIGEgcmVxdWlyZWQgcmVzb3VyY2UsIG5laXRoZXIgZnJvbSB0aGVcbiAqIGNhY2hlIG5vciBmcm9tIHRoZSBzZXJ2ZXIuIFRoaXMgY291bGQgaGFwcGVuIGlmIGEgbmV3IHZlcnNpb24gaXMgZGVwbG95ZWQgdG8gdGhlIHNlcnZlciBhbmQgdGhlXG4gKiBzZXJ2aWNlIHdvcmtlciBjYWNoZSBoYXMgYmVlbiBwYXJ0aWFsbHkgY2xlYW5lZCBieSB0aGUgYnJvd3NlciwgcmVtb3Zpbmcgc29tZSBmaWxlcyBvZiBhIHByZXZpb3VzXG4gKiBhcHAgdmVyc2lvbiBidXQgbm90IGFsbC5cbiAqXG4gKiBAc2VlIHtAbGluayBndWlkZS9zZXJ2aWNlLXdvcmtlci1jb21tdW5pY2F0aW9ucyBTZXJ2aWNlIHdvcmtlciBjb21tdW5pY2F0aW9uIGd1aWRlfVxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVbnJlY292ZXJhYmxlU3RhdGVFdmVudCB7XG4gIHR5cGU6ICdVTlJFQ09WRVJBQkxFX1NUQVRFJztcbiAgcmVhc29uOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIGEgYFB1c2hFdmVudGAgaXMgcmVjZWl2ZWQgYnkgdGhlIHNlcnZpY2Ugd29ya2VyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFB1c2hFdmVudCB7XG4gIHR5cGU6ICdQVVNIJztcbiAgZGF0YTogYW55O1xufVxuXG5leHBvcnQgdHlwZSBJbmNvbWluZ0V2ZW50ID0gVW5yZWNvdmVyYWJsZVN0YXRlRXZlbnR8VmVyc2lvbkV2ZW50O1xuXG5leHBvcnQgaW50ZXJmYWNlIFR5cGVkRXZlbnQge1xuICB0eXBlOiBzdHJpbmc7XG59XG5cbnR5cGUgT3BlcmF0aW9uQ29tcGxldGVkRXZlbnQgPSB7XG4gIHR5cGU6ICdPUEVSQVRJT05fQ09NUExFVEVEJzsgbm9uY2U6IG51bWJlcjsgcmVzdWx0OiBib29sZWFuO1xufXx7XG4gIHR5cGU6ICdPUEVSQVRJT05fQ09NUExFVEVEJztcbiAgbm9uY2U6IG51bWJlcjtcbiAgcmVzdWx0PzogdW5kZWZpbmVkO1xuICBlcnJvcjogc3RyaW5nO1xufTtcblxuXG5mdW5jdGlvbiBlcnJvck9ic2VydmFibGUobWVzc2FnZTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgcmV0dXJuIGRlZmVyKCgpID0+IHRocm93RXJyb3IobmV3IEVycm9yKG1lc3NhZ2UpKSk7XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICovXG5leHBvcnQgY2xhc3MgTmdzd0NvbW1DaGFubmVsIHtcbiAgcmVhZG9ubHkgd29ya2VyOiBPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXI+O1xuXG4gIHJlYWRvbmx5IHJlZ2lzdHJhdGlvbjogT2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPjtcblxuICByZWFkb25seSBldmVudHM6IE9ic2VydmFibGU8VHlwZWRFdmVudD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZXJ2aWNlV29ya2VyOiBTZXJ2aWNlV29ya2VyQ29udGFpbmVyfHVuZGVmaW5lZCkge1xuICAgIGlmICghc2VydmljZVdvcmtlcikge1xuICAgICAgdGhpcy53b3JrZXIgPSB0aGlzLmV2ZW50cyA9IHRoaXMucmVnaXN0cmF0aW9uID0gZXJyb3JPYnNlcnZhYmxlKEVSUl9TV19OT1RfU1VQUE9SVEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZUV2ZW50cyA9IGZyb21FdmVudChzZXJ2aWNlV29ya2VyLCAnY29udHJvbGxlcmNoYW5nZScpO1xuICAgICAgY29uc3QgY29udHJvbGxlckNoYW5nZXMgPSBjb250cm9sbGVyQ2hhbmdlRXZlbnRzLnBpcGUobWFwKCgpID0+IHNlcnZpY2VXb3JrZXIuY29udHJvbGxlcikpO1xuICAgICAgY29uc3QgY3VycmVudENvbnRyb2xsZXIgPSBkZWZlcigoKSA9PiBvZihzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKTtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcyA9IGNvbmNhdChjdXJyZW50Q29udHJvbGxlciwgY29udHJvbGxlckNoYW5nZXMpO1xuXG4gICAgICB0aGlzLndvcmtlciA9IGNvbnRyb2xsZXJXaXRoQ2hhbmdlcy5waXBlKGZpbHRlcigoYyk6IGMgaXMgU2VydmljZVdvcmtlciA9PiAhIWMpKTtcblxuICAgICAgdGhpcy5yZWdpc3RyYXRpb24gPSA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyUmVnaXN0cmF0aW9uPj4oXG4gICAgICAgICAgdGhpcy53b3JrZXIucGlwZShzd2l0Y2hNYXAoKCkgPT4gc2VydmljZVdvcmtlci5nZXRSZWdpc3RyYXRpb24oKSkpKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRzID0gZnJvbUV2ZW50PE1lc3NhZ2VFdmVudD4oc2VydmljZVdvcmtlciwgJ21lc3NhZ2UnKTtcbiAgICAgIGNvbnN0IHJhd0V2ZW50UGF5bG9hZCA9IHJhd0V2ZW50cy5waXBlKG1hcChldmVudCA9PiBldmVudC5kYXRhKSk7XG4gICAgICBjb25zdCBldmVudHNVbmNvbm5lY3RlZCA9IHJhd0V2ZW50UGF5bG9hZC5waXBlKGZpbHRlcihldmVudCA9PiBldmVudCAmJiBldmVudC50eXBlKSk7XG4gICAgICBjb25zdCBldmVudHMgPSBldmVudHNVbmNvbm5lY3RlZC5waXBlKHB1Ymxpc2goKSkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPEluY29taW5nRXZlbnQ+O1xuICAgICAgZXZlbnRzLmNvbm5lY3QoKTtcblxuICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgfVxuICB9XG5cbiAgcG9zdE1lc3NhZ2UoYWN0aW9uOiBzdHJpbmcsIHBheWxvYWQ6IE9iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLndvcmtlclxuICAgICAgICAucGlwZSh0YWtlKDEpLCB0YXAoKHN3OiBTZXJ2aWNlV29ya2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgc3cucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgYWN0aW9uLFxuICAgICAgICAgICAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKVxuICAgICAgICAudGhlbigoKSA9PiB1bmRlZmluZWQpO1xuICB9XG5cbiAgcG9zdE1lc3NhZ2VXaXRoT3BlcmF0aW9uKHR5cGU6IHN0cmluZywgcGF5bG9hZDogT2JqZWN0LCBvcGVyYXRpb25Ob25jZTogbnVtYmVyKTpcbiAgICAgIFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHdhaXRGb3JPcGVyYXRpb25Db21wbGV0ZWQgPSB0aGlzLndhaXRGb3JPcGVyYXRpb25Db21wbGV0ZWQob3BlcmF0aW9uTm9uY2UpO1xuICAgIGNvbnN0IHBvc3RNZXNzYWdlID0gdGhpcy5wb3N0TWVzc2FnZSh0eXBlLCBwYXlsb2FkKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoW3Bvc3RNZXNzYWdlLCB3YWl0Rm9yT3BlcmF0aW9uQ29tcGxldGVkXSkudGhlbigoWywgcmVzdWx0XSkgPT4gcmVzdWx0KTtcbiAgfVxuXG4gIGdlbmVyYXRlTm9uY2UoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDAwMDApO1xuICB9XG5cbiAgZXZlbnRzT2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBUWyd0eXBlJ118VFsndHlwZSddW10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBsZXQgZmlsdGVyRm46IChldmVudDogVHlwZWRFdmVudCkgPT4gZXZlbnQgaXMgVDtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBmaWx0ZXJGbiA9IChldmVudDogVHlwZWRFdmVudCk6IGV2ZW50IGlzIFQgPT4gZXZlbnQudHlwZSA9PT0gdHlwZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlsdGVyRm4gPSAoZXZlbnQ6IFR5cGVkRXZlbnQpOiBldmVudCBpcyBUID0+IHR5cGUuaW5jbHVkZXMoZXZlbnQudHlwZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmV2ZW50cy5waXBlKGZpbHRlcihmaWx0ZXJGbikpO1xuICB9XG5cbiAgbmV4dEV2ZW50T2ZUeXBlPFQgZXh0ZW5kcyBUeXBlZEV2ZW50Pih0eXBlOiBUWyd0eXBlJ10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNPZlR5cGUodHlwZSkucGlwZSh0YWtlKDEpKTtcbiAgfVxuXG4gIHdhaXRGb3JPcGVyYXRpb25Db21wbGV0ZWQobm9uY2U6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmV2ZW50c09mVHlwZTxPcGVyYXRpb25Db21wbGV0ZWRFdmVudD4oJ09QRVJBVElPTl9DT01QTEVURUQnKVxuICAgICAgICAucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQubm9uY2UgPT09IG5vbmNlKSwgdGFrZSgxKSwgbWFwKGV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQucmVzdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBldmVudC5yZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihldmVudC5lcnJvciEpO1xuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgLnRvUHJvbWlzZSgpO1xuICB9XG5cbiAgZ2V0IGlzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnNlcnZpY2VXb3JrZXI7XG4gIH1cbn1cbiJdfQ==