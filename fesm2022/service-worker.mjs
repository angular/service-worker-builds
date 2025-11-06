/**
 * @license Angular v21.0.0-rc.1+sha-dcfd7fe
 * (c) 2010-2025 Google LLC. https://angular.dev/
 * License: MIT
 */

import * as i0 from '@angular/core';
import { ɵRuntimeError as _RuntimeError, ApplicationRef, Injectable, InjectionToken, makeEnvironmentProviders, provideAppInitializer, inject, NgZone, ɵformatRuntimeError as _formatRuntimeError, Injector, NgModule } from '@angular/core';
import { Observable, Subject, NEVER } from 'rxjs';
import { switchMap, take, filter, map } from 'rxjs/operators';

const ERR_SW_NOT_SUPPORTED = 'Service workers are disabled or not supported by this browser';
class NgswCommChannel {
  serviceWorker;
  worker;
  registration;
  events;
  constructor(serviceWorker, injector) {
    this.serviceWorker = serviceWorker;
    if (!serviceWorker) {
      this.worker = this.events = this.registration = new Observable(subscriber => subscriber.error(new _RuntimeError(5601, (typeof ngDevMode === 'undefined' || ngDevMode) && ERR_SW_NOT_SUPPORTED)));
    } else {
      let currentWorker = null;
      const workerSubject = new Subject();
      this.worker = new Observable(subscriber => {
        if (currentWorker !== null) {
          subscriber.next(currentWorker);
        }
        return workerSubject.subscribe(v => subscriber.next(v));
      });
      const updateController = () => {
        const {
          controller
        } = serviceWorker;
        if (controller === null) {
          return;
        }
        currentWorker = controller;
        workerSubject.next(currentWorker);
      };
      serviceWorker.addEventListener('controllerchange', updateController);
      updateController();
      this.registration = this.worker.pipe(switchMap(() => serviceWorker.getRegistration().then(registration => {
        if (!registration) {
          throw new _RuntimeError(5601, (typeof ngDevMode === 'undefined' || ngDevMode) && ERR_SW_NOT_SUPPORTED);
        }
        return registration;
      })));
      const _events = new Subject();
      this.events = _events.asObservable();
      const messageListener = event => {
        const {
          data
        } = event;
        if (data?.type) {
          _events.next(data);
        }
      };
      serviceWorker.addEventListener('message', messageListener);
      const appRef = injector?.get(ApplicationRef, null, {
        optional: true
      });
      appRef?.onDestroy(() => {
        serviceWorker.removeEventListener('controllerchange', updateController);
        serviceWorker.removeEventListener('message', messageListener);
      });
    }
  }
  postMessage(action, payload) {
    return new Promise(resolve => {
      this.worker.pipe(take(1)).subscribe(sw => {
        sw.postMessage({
          action,
          ...payload
        });
        resolve();
      });
    });
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
      filterFn = event => event.type === type;
    } else {
      filterFn = event => type.includes(event.type);
    }
    return this.events.pipe(filter(filterFn));
  }
  nextEventOfType(type) {
    return this.eventsOfType(type).pipe(take(1));
  }
  waitForOperationCompleted(nonce) {
    return new Promise((resolve, reject) => {
      this.eventsOfType('OPERATION_COMPLETED').pipe(filter(event => event.nonce === nonce), take(1), map(event => {
        if (event.result !== undefined) {
          return event.result;
        }
        throw new Error(event.error);
      })).subscribe({
        next: resolve,
        error: reject
      });
    });
  }
  get isEnabled() {
    return !!this.serviceWorker;
  }
}

class SwPush {
  sw;
  messages;
  notificationClicks;
  notificationCloses;
  pushSubscriptionChanges;
  subscription;
  get isEnabled() {
    return this.sw.isEnabled;
  }
  pushManager = null;
  subscriptionChanges = new Subject();
  constructor(sw) {
    this.sw = sw;
    if (!sw.isEnabled) {
      this.messages = NEVER;
      this.notificationClicks = NEVER;
      this.notificationCloses = NEVER;
      this.pushSubscriptionChanges = NEVER;
      this.subscription = NEVER;
      return;
    }
    this.messages = this.sw.eventsOfType('PUSH').pipe(map(message => message.data));
    this.notificationClicks = this.sw.eventsOfType('NOTIFICATION_CLICK').pipe(map(message => message.data));
    this.notificationCloses = this.sw.eventsOfType('NOTIFICATION_CLOSE').pipe(map(message => message.data));
    this.pushSubscriptionChanges = this.sw.eventsOfType('PUSH_SUBSCRIPTION_CHANGE').pipe(map(message => message.data));
    this.pushManager = this.sw.registration.pipe(map(registration => registration.pushManager));
    const workerDrivenSubscriptions = this.pushManager.pipe(switchMap(pm => pm.getSubscription()));
    this.subscription = new Observable(subscriber => {
      const workerDrivenSubscription = workerDrivenSubscriptions.subscribe(subscriber);
      const subscriptionChanges = this.subscriptionChanges.subscribe(subscriber);
      return () => {
        workerDrivenSubscription.unsubscribe();
        subscriptionChanges.unsubscribe();
      };
    });
  }
  requestSubscription(options) {
    if (!this.sw.isEnabled || this.pushManager === null) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const pushOptions = {
      userVisibleOnly: true
    };
    let key = this.decodeBase64(options.serverPublicKey.replace(/_/g, '/').replace(/-/g, '+'));
    let applicationServerKey = new Uint8Array(new ArrayBuffer(key.length));
    for (let i = 0; i < key.length; i++) {
      applicationServerKey[i] = key.charCodeAt(i);
    }
    pushOptions.applicationServerKey = applicationServerKey;
    return new Promise((resolve, reject) => {
      this.pushManager.pipe(switchMap(pm => pm.subscribe(pushOptions)), take(1)).subscribe({
        next: sub => {
          this.subscriptionChanges.next(sub);
          resolve(sub);
        },
        error: reject
      });
    });
  }
  unsubscribe() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    const doUnsubscribe = sub => {
      if (sub === null) {
        throw new _RuntimeError(5602, (typeof ngDevMode === 'undefined' || ngDevMode) && 'Not subscribed to push notifications.');
      }
      return sub.unsubscribe().then(success => {
        if (!success) {
          throw new _RuntimeError(5603, (typeof ngDevMode === 'undefined' || ngDevMode) && 'Unsubscribe failed!');
        }
        this.subscriptionChanges.next(null);
      });
    };
    return new Promise((resolve, reject) => {
      this.subscription.pipe(take(1), switchMap(doUnsubscribe)).subscribe({
        next: resolve,
        error: reject
      });
    });
  }
  decodeBase64(input) {
    return atob(input);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.1+sha-dcfd7fe",
    ngImport: i0,
    type: SwPush,
    deps: [{
      token: NgswCommChannel
    }],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.0-rc.1+sha-dcfd7fe",
    ngImport: i0,
    type: SwPush
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.1+sha-dcfd7fe",
  ngImport: i0,
  type: SwPush,
  decorators: [{
    type: Injectable
  }],
  ctorParameters: () => [{
    type: NgswCommChannel
  }]
});

class SwUpdate {
  sw;
  versionUpdates;
  unrecoverable;
  get isEnabled() {
    return this.sw.isEnabled;
  }
  ongoingCheckForUpdate = null;
  constructor(sw) {
    this.sw = sw;
    if (!sw.isEnabled) {
      this.versionUpdates = NEVER;
      this.unrecoverable = NEVER;
      return;
    }
    this.versionUpdates = this.sw.eventsOfType(['VERSION_DETECTED', 'VERSION_INSTALLATION_FAILED', 'VERSION_READY', 'NO_NEW_VERSION_DETECTED', 'VERSION_FAILED']);
    this.unrecoverable = this.sw.eventsOfType('UNRECOVERABLE_STATE');
  }
  checkForUpdate() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new Error(ERR_SW_NOT_SUPPORTED));
    }
    if (this.ongoingCheckForUpdate) {
      return this.ongoingCheckForUpdate;
    }
    const nonce = this.sw.generateNonce();
    this.ongoingCheckForUpdate = this.sw.postMessageWithOperation('CHECK_FOR_UPDATES', {
      nonce
    }, nonce).finally(() => {
      this.ongoingCheckForUpdate = null;
    });
    return this.ongoingCheckForUpdate;
  }
  activateUpdate() {
    if (!this.sw.isEnabled) {
      return Promise.reject(new _RuntimeError(5601, (typeof ngDevMode === 'undefined' || ngDevMode) && ERR_SW_NOT_SUPPORTED));
    }
    const nonce = this.sw.generateNonce();
    return this.sw.postMessageWithOperation('ACTIVATE_UPDATE', {
      nonce
    }, nonce);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.1+sha-dcfd7fe",
    ngImport: i0,
    type: SwUpdate,
    deps: [{
      token: NgswCommChannel
    }],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.0-rc.1+sha-dcfd7fe",
    ngImport: i0,
    type: SwUpdate
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.1+sha-dcfd7fe",
  ngImport: i0,
  type: SwUpdate,
  decorators: [{
    type: Injectable
  }],
  ctorParameters: () => [{
    type: NgswCommChannel
  }]
});

const SCRIPT = new InjectionToken(typeof ngDevMode !== undefined && ngDevMode ? 'NGSW_REGISTER_SCRIPT' : '');
function ngswAppInitializer() {
  if (typeof ngServerMode !== 'undefined' && ngServerMode) {
    return;
  }
  const options = inject(SwRegistrationOptions);
  if (!('serviceWorker' in navigator && options.enabled !== false)) {
    return;
  }
  const script = inject(SCRIPT);
  const ngZone = inject(NgZone);
  const appRef = inject(ApplicationRef);
  ngZone.runOutsideAngular(() => {
    const sw = navigator.serviceWorker;
    const onControllerChange = () => sw.controller?.postMessage({
      action: 'INITIALIZE'
    });
    sw.addEventListener('controllerchange', onControllerChange);
    appRef.onDestroy(() => {
      sw.removeEventListener('controllerchange', onControllerChange);
    });
  });
  ngZone.runOutsideAngular(() => {
    let readyToRegister;
    const {
      registrationStrategy
    } = options;
    if (typeof registrationStrategy === 'function') {
      readyToRegister = new Promise(resolve => registrationStrategy().subscribe(() => resolve()));
    } else {
      const [strategy, ...args] = (registrationStrategy || 'registerWhenStable:30000').split(':');
      switch (strategy) {
        case 'registerImmediately':
          readyToRegister = Promise.resolve();
          break;
        case 'registerWithDelay':
          readyToRegister = delayWithTimeout(+args[0] || 0);
          break;
        case 'registerWhenStable':
          readyToRegister = Promise.race([appRef.whenStable(), delayWithTimeout(+args[0])]);
          break;
        default:
          throw new _RuntimeError(5600, (typeof ngDevMode === 'undefined' || ngDevMode) && `Unknown ServiceWorker registration strategy: ${options.registrationStrategy}`);
      }
    }
    readyToRegister.then(() => {
      if (appRef.destroyed) {
        return;
      }
      navigator.serviceWorker.register(script, {
        scope: options.scope,
        updateViaCache: options.updateViaCache,
        type: options.type
      }).catch(err => console.error(_formatRuntimeError(5604, (typeof ngDevMode === 'undefined' || ngDevMode) && 'Service worker registration failed with: ' + err)));
    });
  });
}
function delayWithTimeout(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
function ngswCommChannelFactory() {
  const opts = inject(SwRegistrationOptions);
  const injector = inject(Injector);
  const isBrowser = !(typeof ngServerMode !== 'undefined' && ngServerMode);
  return new NgswCommChannel(isBrowser && opts.enabled !== false ? navigator.serviceWorker : undefined, injector);
}
class SwRegistrationOptions {
  enabled;
  updateViaCache;
  type;
  scope;
  registrationStrategy;
}
function provideServiceWorker(script, options = {}) {
  return makeEnvironmentProviders([SwPush, SwUpdate, {
    provide: SCRIPT,
    useValue: script
  }, {
    provide: SwRegistrationOptions,
    useValue: options
  }, {
    provide: NgswCommChannel,
    useFactory: ngswCommChannelFactory
  }, provideAppInitializer(ngswAppInitializer)]);
}

class ServiceWorkerModule {
  static register(script, options = {}) {
    return {
      ngModule: ServiceWorkerModule,
      providers: [provideServiceWorker(script, options)]
    };
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0-rc.1+sha-dcfd7fe",
    ngImport: i0,
    type: ServiceWorkerModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.0-rc.1+sha-dcfd7fe",
    ngImport: i0,
    type: ServiceWorkerModule
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.0-rc.1+sha-dcfd7fe",
    ngImport: i0,
    type: ServiceWorkerModule,
    providers: [SwPush, SwUpdate]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0-rc.1+sha-dcfd7fe",
  ngImport: i0,
  type: ServiceWorkerModule,
  decorators: [{
    type: NgModule,
    args: [{
      providers: [SwPush, SwUpdate]
    }]
  }]
});

export { ServiceWorkerModule, SwPush, SwRegistrationOptions, SwUpdate, provideServiceWorker };
//# sourceMappingURL=service-worker.mjs.map
