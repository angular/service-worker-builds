/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
export var ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
function errorObservable(message) {
    return defer(function () { return throwError(new Error(message)); });
}
/**
 * @experimental
*/
var NgswCommChannel = /** @class */ (function () {
    function NgswCommChannel(serviceWorker) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker) {
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            var controllerChangeEvents = (fromEvent(serviceWorker, 'controllerchange'));
            var controllerChanges = (controllerChangeEvents.pipe(map(function () { return serviceWorker.controller; })));
            var currentController = (defer(function () { return of(serviceWorker.controller); }));
            var controllerWithChanges = (concat(currentController, controllerChanges));
            this.worker = (controllerWithChanges.pipe(filter(function (c) { return !!c; })));
            this.registration = (this.worker.pipe(switchMap(function () { return serviceWorker.getRegistration(); })));
            var rawEvents = fromEvent(serviceWorker, 'message');
            var rawEventPayload = rawEvents.pipe(map(function (event) { return event.data; }));
            var eventsUnconnected = (rawEventPayload.pipe(filter(function (event) { return !!event && !!event['type']; })));
            var events = eventsUnconnected.pipe(publish());
            this.events = events;
            events.connect();
        }
    }
    /**
     * @internal
     */
    NgswCommChannel.prototype.postMessage = function (action, payload) {
        return this.worker
            .pipe(take(1), tap(function (sw) {
            sw.postMessage(tslib_1.__assign({ action: action }, payload));
        }))
            .toPromise()
            .then(function () { return undefined; });
    };
    /**
     * @internal
     */
    NgswCommChannel.prototype.postMessageWithStatus = function (type, payload, nonce) {
        var waitForStatus = this.waitForStatus(nonce);
        var postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
    };
    /**
     * @internal
     */
    NgswCommChannel.prototype.generateNonce = function () { return Math.round(Math.random() * 10000000); };
    /**
     * @internal
     */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    NgswCommChannel.prototype.eventsOfType = function (type) {
        return this.events.pipe(filter(function (event) { return event.type === type; }));
    };
    /**
     * @internal
     */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    NgswCommChannel.prototype.nextEventOfType = function (type) {
        return (this.eventsOfType(type).pipe(take(1)));
    };
    /**
     * @internal
     */
    NgswCommChannel.prototype.waitForStatus = function (nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter(function (event) { return event.nonce === nonce; }), take(1), map(function (event) {
            if (event.status) {
                return undefined;
            }
            throw new Error(event.error);
        }))
            .toPromise();
    };
    Object.defineProperty(NgswCommChannel.prototype, "isEnabled", {
        get: function () { return !!this.serviceWorker; },
        enumerable: true,
        configurable: true
    });
    return NgswCommChannel;
}());
export { NgswCommChannel };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG93X2xldmVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvc3JjL2xvd19sZXZlbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7O0FBRUgsT0FBTyxFQUFvQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUcsVUFBVSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2xHLE9BQU8sRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRTFFLE1BQU0sQ0FBQyxJQUFNLG9CQUFvQixHQUFHLCtEQUErRCxDQUFDO0FBcUNwRyx5QkFBeUIsT0FBZTtJQUN0QyxPQUFPLEtBQUssQ0FBQyxjQUFNLE9BQUEsVUFBVSxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTlCLENBQThCLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRUQ7O0VBRUU7QUFDRjtJQWdCRSx5QkFBb0IsYUFBK0M7UUFBL0Msa0JBQWEsR0FBYixhQUFhLENBQWtDO1FBQ2pFLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsZUFBZSxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDdkY7YUFBTTtZQUNMLElBQU0sc0JBQXNCLEdBQ1AsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUNwRSxJQUFNLGlCQUFpQixHQUFtQyxDQUN0RCxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQU0sT0FBQSxhQUFhLENBQUMsVUFBVSxFQUF4QixDQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXRF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LENBQUM7SUFDN0YsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkZBQTZGO0lBQzdGLHVCQUF1QjtJQUN2Qix5Q0FBZSxHQUFmLFVBQXNDLElBQVk7UUFDaEQsT0FBc0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRDs7T0FFRztJQUNILHVDQUFhLEdBQWIsVUFBYyxLQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBYyxRQUFRLENBQUM7YUFDMUMsSUFBSSxDQUNELE1BQU0sQ0FBQyxVQUFDLEtBQWtCLElBQUssT0FBQSxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssRUFBckIsQ0FBcUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDOUQsR0FBRyxDQUFDLFVBQUMsS0FBa0I7WUFDckIsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO2dCQUNoQixPQUFPLFNBQVMsQ0FBQzthQUNsQjtZQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQU8sQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO2FBQ04sU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELHNCQUFJLHNDQUFTO2FBQWIsY0FBMkIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQzNELHNCQUFDO0FBQUQsQ0FBQyxBQTlHRCxJQThHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb25uZWN0YWJsZU9ic2VydmFibGUsIE9ic2VydmFibGUsIGNvbmNhdCwgZGVmZXIsIGZyb21FdmVudCwgb2YgLCB0aHJvd0Vycm9yfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXAsIHB1Ymxpc2gsIHN3aXRjaE1hcCwgdGFrZSwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBjb25zdCBFUlJfU1dfTk9UX1NVUFBPUlRFRCA9ICdTZXJ2aWNlIHdvcmtlcnMgYXJlIGRpc2FibGVkIG9yIG5vdCBzdXBwb3J0ZWQgYnkgdGhpcyBicm93c2VyJztcblxuZXhwb3J0IGludGVyZmFjZSBWZXJzaW9uIHtcbiAgaGFzaDogc3RyaW5nO1xuICBhcHBEYXRhPzogT2JqZWN0O1xufVxuXG4vKipcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVBdmFpbGFibGVFdmVudCB7XG4gIHR5cGU6ICdVUERBVEVfQVZBSUxBQkxFJztcbiAgY3VycmVudDogVmVyc2lvbjtcbiAgYXZhaWxhYmxlOiBWZXJzaW9uO1xufVxuXG4vKipcbiAqIEBleHBlcmltZW50YWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBVcGRhdGVBY3RpdmF0ZWRFdmVudCB7XG4gIHR5cGU6ICdVUERBVEVfQUNUSVZBVEVEJztcbiAgcHJldmlvdXM/OiBWZXJzaW9uO1xuICBjdXJyZW50OiBWZXJzaW9uO1xufVxuXG5leHBvcnQgdHlwZSBJbmNvbWluZ0V2ZW50ID0gVXBkYXRlQXZhaWxhYmxlRXZlbnQgfCBVcGRhdGVBY3RpdmF0ZWRFdmVudDtcblxuZXhwb3J0IGludGVyZmFjZSBUeXBlZEV2ZW50IHsgdHlwZTogc3RyaW5nOyB9XG5cbmludGVyZmFjZSBTdGF0dXNFdmVudCB7XG4gIHR5cGU6ICdTVEFUVVMnO1xuICBub25jZTogbnVtYmVyO1xuICBzdGF0dXM6IGJvb2xlYW47XG4gIGVycm9yPzogc3RyaW5nO1xufVxuXG5cbmZ1bmN0aW9uIGVycm9yT2JzZXJ2YWJsZShtZXNzYWdlOiBzdHJpbmcpOiBPYnNlcnZhYmxlPGFueT4ge1xuICByZXR1cm4gZGVmZXIoKCkgPT4gdGhyb3dFcnJvcihuZXcgRXJyb3IobWVzc2FnZSkpKTtcbn1cblxuLyoqXG4gKiBAZXhwZXJpbWVudGFsXG4qL1xuZXhwb3J0IGNsYXNzIE5nc3dDb21tQ2hhbm5lbCB7XG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHJlYWRvbmx5IHdvcmtlcjogT2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyPjtcblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICByZWFkb25seSByZWdpc3RyYXRpb246IE9ic2VydmFibGU8U2VydmljZVdvcmtlclJlZ2lzdHJhdGlvbj47XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRzOiBPYnNlcnZhYmxlPFR5cGVkRXZlbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2VydmljZVdvcmtlcjogU2VydmljZVdvcmtlckNvbnRhaW5lcnx1bmRlZmluZWQpIHtcbiAgICBpZiAoIXNlcnZpY2VXb3JrZXIpIHtcbiAgICAgIHRoaXMud29ya2VyID0gdGhpcy5ldmVudHMgPSB0aGlzLnJlZ2lzdHJhdGlvbiA9IGVycm9yT2JzZXJ2YWJsZShFUlJfU1dfTk9UX1NVUFBPUlRFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJDaGFuZ2VFdmVudHMgPVxuICAgICAgICAgIDxPYnNlcnZhYmxlPGFueT4+KGZyb21FdmVudChzZXJ2aWNlV29ya2VyLCAnY29udHJvbGxlcmNoYW5nZScpKTtcbiAgICAgIGNvbnN0IGNvbnRyb2xsZXJDaGFuZ2VzID0gPE9ic2VydmFibGU8U2VydmljZVdvcmtlcnxudWxsPj4oXG4gICAgICAgICAgY29udHJvbGxlckNoYW5nZUV2ZW50cy5waXBlKG1hcCgoKSA9PiBzZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIpKSk7XG5cbiAgICAgIGNvbnN0IGN1cnJlbnRDb250cm9sbGVyID1cbiAgICAgICAgICA8T2JzZXJ2YWJsZTxTZXJ2aWNlV29ya2VyfG51bGw+PihkZWZlcigoKSA9PiBvZiAoc2VydmljZVdvcmtlci5jb250cm9sbGVyKSkpO1xuXG4gICAgICBjb25zdCBjb250cm9sbGVyV2l0aENoYW5nZXMgPVxuICAgICAgICAgIDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJ8bnVsbD4+KGNvbmNhdChjdXJyZW50Q29udHJvbGxlciwgY29udHJvbGxlckNoYW5nZXMpKTtcbiAgICAgIHRoaXMud29ya2VyID0gPE9ic2VydmFibGU8U2VydmljZVdvcmtlcj4+KFxuICAgICAgICAgIGNvbnRyb2xsZXJXaXRoQ2hhbmdlcy5waXBlKGZpbHRlcigoYzogU2VydmljZVdvcmtlcikgPT4gISFjKSkpO1xuXG4gICAgICB0aGlzLnJlZ2lzdHJhdGlvbiA9IDxPYnNlcnZhYmxlPFNlcnZpY2VXb3JrZXJSZWdpc3RyYXRpb24+PihcbiAgICAgICAgICB0aGlzLndvcmtlci5waXBlKHN3aXRjaE1hcCgoKSA9PiBzZXJ2aWNlV29ya2VyLmdldFJlZ2lzdHJhdGlvbigpKSkpO1xuXG4gICAgICBjb25zdCByYXdFdmVudHMgPSBmcm9tRXZlbnQoc2VydmljZVdvcmtlciwgJ21lc3NhZ2UnKTtcblxuICAgICAgY29uc3QgcmF3RXZlbnRQYXlsb2FkID0gcmF3RXZlbnRzLnBpcGUobWFwKChldmVudDogTWVzc2FnZUV2ZW50KSA9PiBldmVudC5kYXRhKSk7XG4gICAgICBjb25zdCBldmVudHNVbmNvbm5lY3RlZCA9XG4gICAgICAgICAgKHJhd0V2ZW50UGF5bG9hZC5waXBlKGZpbHRlcigoZXZlbnQ6IE9iamVjdCkgPT4gISFldmVudCAmJiAhIShldmVudCBhcyBhbnkpWyd0eXBlJ10pKSk7XG4gICAgICBjb25zdCBldmVudHMgPSBldmVudHNVbmNvbm5lY3RlZC5waXBlKHB1Ymxpc2goKSkgYXMgQ29ubmVjdGFibGVPYnNlcnZhYmxlPEluY29taW5nRXZlbnQ+O1xuICAgICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG4gICAgICBldmVudHMuY29ubmVjdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHBvc3RNZXNzYWdlKGFjdGlvbjogc3RyaW5nLCBwYXlsb2FkOiBPYmplY3QpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy53b3JrZXJcbiAgICAgICAgLnBpcGUodGFrZSgxKSwgdGFwKChzdzogU2VydmljZVdvcmtlcikgPT4ge1xuICAgICAgICAgICAgICAgIHN3LnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uLCAuLi5wYXlsb2FkLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgLnRvUHJvbWlzZSgpXG4gICAgICAgIC50aGVuKCgpID0+IHVuZGVmaW5lZCk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwb3N0TWVzc2FnZVdpdGhTdGF0dXModHlwZTogc3RyaW5nLCBwYXlsb2FkOiBPYmplY3QsIG5vbmNlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB3YWl0Rm9yU3RhdHVzID0gdGhpcy53YWl0Rm9yU3RhdHVzKG5vbmNlKTtcbiAgICBjb25zdCBwb3N0TWVzc2FnZSA9IHRoaXMucG9zdE1lc3NhZ2UodHlwZSwgcGF5bG9hZCk7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKFt3YWl0Rm9yU3RhdHVzLCBwb3N0TWVzc2FnZV0pLnRoZW4oKCkgPT4gdW5kZWZpbmVkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGdlbmVyYXRlTm9uY2UoKTogbnVtYmVyIHsgcmV0dXJuIE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwKTsgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIC8vIFRPRE8oaSk6IHRoZSB0eXBpbmdzIGFuZCBjYXN0cyBpbiB0aGlzIG1ldGhvZCBhcmUgd29ua3ksIHdlIHNob3VsZCByZXZpc2l0IGl0IGFuZCBtYWtlIHRoZVxuICAvLyB0eXBlcyBmbG93IGNvcnJlY3RseVxuICBldmVudHNPZlR5cGU8VCBleHRlbmRzIFR5cGVkRXZlbnQ+KHR5cGU6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiA8T2JzZXJ2YWJsZTxUPj50aGlzLmV2ZW50cy5waXBlKGZpbHRlcigoZXZlbnQpID0+IHsgcmV0dXJuIGV2ZW50LnR5cGUgPT09IHR5cGU7IH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIC8vIFRPRE8oaSk6IHRoZSB0eXBpbmdzIGFuZCBjYXN0cyBpbiB0aGlzIG1ldGhvZCBhcmUgd29ua3ksIHdlIHNob3VsZCByZXZpc2l0IGl0IGFuZCBtYWtlIHRoZVxuICAvLyB0eXBlcyBmbG93IGNvcnJlY3RseVxuICBuZXh0RXZlbnRPZlR5cGU8VCBleHRlbmRzIFR5cGVkRXZlbnQ+KHR5cGU6IHN0cmluZyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiA8T2JzZXJ2YWJsZTxUPj4odGhpcy5ldmVudHNPZlR5cGUodHlwZSkucGlwZSh0YWtlKDEpKSk7XG4gIH1cblxuICAvKipcbiAgICogQGludGVybmFsXG4gICAqL1xuICB3YWl0Rm9yU3RhdHVzKG5vbmNlOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5ldmVudHNPZlR5cGU8U3RhdHVzRXZlbnQ+KCdTVEFUVVMnKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICAgIGZpbHRlcigoZXZlbnQ6IFN0YXR1c0V2ZW50KSA9PiBldmVudC5ub25jZSA9PT0gbm9uY2UpLCB0YWtlKDEpLFxuICAgICAgICAgICAgbWFwKChldmVudDogU3RhdHVzRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGV2ZW50LnN0YXR1cykge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGV2ZW50LmVycm9yICEpO1xuICAgICAgICAgICAgfSkpXG4gICAgICAgIC50b1Byb21pc2UoKTtcbiAgfVxuXG4gIGdldCBpc0VuYWJsZWQoKTogYm9vbGVhbiB7IHJldHVybiAhIXRoaXMuc2VydmljZVdvcmtlcjsgfVxufVxuIl19