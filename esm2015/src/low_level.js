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
import { concat as obs_concat } from 'rxjs/observable/concat';
import { defer as obs_defer } from 'rxjs/observable/defer';
import { fromEvent as obs_fromEvent } from 'rxjs/observable/fromEvent';
import { of as obs_of } from 'rxjs/observable/of';
import { _throw as obs_throw } from 'rxjs/observable/throw';
import { _do as op_do } from 'rxjs/operator/do';
import { filter as op_filter } from 'rxjs/operator/filter';
import { map as op_map } from 'rxjs/operator/map';
import { publish as op_publish } from 'rxjs/operator/publish';
import { switchMap as op_switchMap } from 'rxjs/operator/switchMap';
import { take as op_take } from 'rxjs/operator/take';
import { toPromise as op_toPromise } from 'rxjs/operator/toPromise';
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
function TypedEvent() { }
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
    return obs_defer(() => obs_throw(new Error(message)));
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
            const /** @type {?} */ controllerChangeEvents = /** @type {?} */ ((obs_fromEvent(serviceWorker, 'controllerchange')));
            const /** @type {?} */ controllerChanges = /** @type {?} */ ((op_map.call(controllerChangeEvents, () => serviceWorker.controller)));
            const /** @type {?} */ currentController = /** @type {?} */ ((obs_defer(() => obs_of(serviceWorker.controller))));
            const /** @type {?} */ controllerWithChanges = /** @type {?} */ ((obs_concat(currentController, controllerChanges)));
            this.worker = /** @type {?} */ ((op_filter.call(controllerWithChanges, (c) => !!c)));
            this.registration = /** @type {?} */ ((op_switchMap.call(this.worker, () => serviceWorker.getRegistration())));
            const /** @type {?} */ rawEvents = obs_fromEvent(serviceWorker, 'message');
            const /** @type {?} */ rawEventPayload = /** @type {?} */ ((op_map.call(rawEvents, (event) => event.data)));
            const /** @type {?} */ eventsUnconnected = /** @type {?} */ ((op_filter.call(rawEventPayload, (event) => !!event && !!(/** @type {?} */ (event))['type'])));
            const /** @type {?} */ events = /** @type {?} */ ((op_publish.call(eventsUnconnected)));
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
        const /** @type {?} */ worker = op_take.call(this.worker, 1);
        const /** @type {?} */ sideEffect = op_do.call(worker, (sw) => {
            sw.postMessage(Object.assign({ action }, payload));
        });
        return /** @type {?} */ ((op_toPromise.call(sideEffect).then(() => undefined)));
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
        return /** @type {?} */ ((op_filter.call(this.events, (event) => { return event.type === type; })));
    }
    /**
     * \@internal
     * @template T
     * @param {?} type
     * @return {?}
     */
    nextEventOfType(type) {
        return /** @type {?} */ ((op_take.call(this.eventsOfType(type), 1)));
    }
    /**
     * \@internal
     * @param {?} nonce
     * @return {?}
     */
    waitForStatus(nonce) {
        const /** @type {?} */ statusEventsWithNonce = /** @type {?} */ ((op_filter.call(this.eventsOfType('STATUS'), (event) => event.nonce === nonce)));
        const /** @type {?} */ singleStatusEvent = /** @type {?} */ ((op_take.call(statusEventsWithNonce, 1)));
        const /** @type {?} */ mapErrorAndValue = /** @type {?} */ ((op_map.call(singleStatusEvent, (event) => {
            if (event.status) {
                return undefined;
            }
            throw new Error(/** @type {?} */ ((event.error)));
        })));
        return op_toPromise.call(mapErrorAndValue);
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
//# sourceMappingURL=low_level.js.map