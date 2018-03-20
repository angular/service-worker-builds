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
import * as tslib_1 from "tslib";
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { concat, defer, fromEvent, of, throwError } from 'rxjs';
import { filter, map, publish, switchMap, take, tap } from 'rxjs/operators';
export var /** @type {?} */ ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
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
    return defer(function () { return throwError(new Error(message)); });
}
/**
 * \@experimental
 */
var NgswCommChannel = /** @class */ (function () {
    function NgswCommChannel(serviceWorker, platformId) {
        this.serviceWorker = serviceWorker;
        if (!serviceWorker || !isPlatformBrowser(platformId)) {
            this.serviceWorker = undefined;
            this.worker = this.events = this.registration = errorObservable(ERR_SW_NOT_SUPPORTED);
        }
        else {
            var /** @type {?} */ controllerChangeEvents = /** @type {?} */ ((fromEvent(serviceWorker, 'controllerchange')));
            var /** @type {?} */ controllerChanges = /** @type {?} */ ((controllerChangeEvents.pipe(map(function () { return serviceWorker.controller; }))));
            var /** @type {?} */ currentController = /** @type {?} */ ((defer(function () { return of(serviceWorker.controller); })));
            var /** @type {?} */ controllerWithChanges = /** @type {?} */ ((concat(currentController, controllerChanges)));
            this.worker = /** @type {?} */ ((controllerWithChanges.pipe(filter(function (c) { return !!c; }))));
            this.registration = /** @type {?} */ ((this.worker.pipe(switchMap(function () { return serviceWorker.getRegistration(); }))));
            var /** @type {?} */ rawEvents = fromEvent(serviceWorker, 'message');
            var /** @type {?} */ rawEventPayload = rawEvents.pipe(map(function (event) { return event.data; }));
            var /** @type {?} */ eventsUnconnected = (rawEventPayload.pipe(filter(function (event) { return !!event && !!(/** @type {?} */ (event))['type']; })));
            var /** @type {?} */ events = /** @type {?} */ (eventsUnconnected.pipe(publish()));
            this.events = events;
            events.connect();
        }
    }
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    NgswCommChannel.prototype.postMessage = /**
     * \@internal
     * @param {?} action
     * @param {?} payload
     * @return {?}
     */
    function (action, payload) {
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
    /**
     * \@internal
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    NgswCommChannel.prototype.postMessageWithStatus = /**
     * \@internal
     * @param {?} type
     * @param {?} payload
     * @param {?} nonce
     * @return {?}
     */
    function (type, payload, nonce) {
        var /** @type {?} */ waitForStatus = this.waitForStatus(nonce);
        var /** @type {?} */ postMessage = this.postMessage(type, payload);
        return Promise.all([waitForStatus, postMessage]).then(function () { return undefined; });
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @return {?}
     */
    NgswCommChannel.prototype.generateNonce = /**
     * \@internal
     * @return {?}
     */
    function () { return Math.round(Math.random() * 10000000); };
    /**
     * @internal
     */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    NgswCommChannel.prototype.eventsOfType = /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    function (type) {
        return /** @type {?} */ (this.events.pipe(filter(function (event) { return event.type === type; })));
    };
    /**
     * @internal
     */
    // TODO(i): the typings and casts in this method are wonky, we should revisit it and make the
    // types flow correctly
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    NgswCommChannel.prototype.nextEventOfType = /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    function (type) {
        return /** @type {?} */ ((this.eventsOfType(type).pipe(take(1))));
    };
    /**
     * @internal
     */
    /**
     * \@internal
     * @param {?} nonce
     * @return {?}
     */
    NgswCommChannel.prototype.waitForStatus = /**
     * \@internal
     * @param {?} nonce
     * @return {?}
     */
    function (nonce) {
        return this.eventsOfType('STATUS')
            .pipe(filter(function (event) { return event.nonce === nonce; }), take(1), map(function (event) {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        }))
            .toPromise();
    };
    Object.defineProperty(NgswCommChannel.prototype, "isEnabled", {
        get: /**
         * @return {?}
         */
        function () { return !!this.serviceWorker; },
        enumerable: true,
        configurable: true
    });
    /** @nocollapse */
    NgswCommChannel.ctorParameters = function () { return [
        null,
        { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] },] },
    ]; };
    return NgswCommChannel;
}());
export { NgswCommChannel };
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
//# sourceMappingURL=low_level.js.map