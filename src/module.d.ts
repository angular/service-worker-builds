import { InjectionToken, Injector, ModuleWithProviders } from '@angular/core';
import { Observable } from 'rxjs';
import { NgswCommChannel } from './low_level';
import * as i0 from "@angular/core";
/**
 * Token that can be used to provide options for `ServiceWorkerModule` outside of
 * `ServiceWorkerModule.register()`.
 *
 * You can use this token to define a provider that generates the registration options at runtime,
 * for example via a function call:
 *
 * {@example service-worker/registration-options/module.ts region="registration-options"
 *     header="app.module.ts"}
 *
 * @publicApi
 */
export declare abstract class SwRegistrationOptions {
    /**
     * Whether the ServiceWorker will be registered and the related services (such as `SwPush` and
     * `SwUpdate`) will attempt to communicate and interact with it.
     *
     * Default: true
     */
    enabled?: boolean;
    /**
     * A URL that defines the ServiceWorker's registration scope; that is, what range of URLs it can
     * control. It will be used when calling
     * [ServiceWorkerContainer#register()](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register).
     */
    scope?: string;
    /**
     * Defines the ServiceWorker registration strategy, which determines when it will be registered
     * with the browser.
     *
     * The default behavior of registering once the application stabilizes (i.e. as soon as there are
     * no pending micro- and macro-tasks) is designed to register the ServiceWorker as soon as
     * possible but without affecting the application's first time load.
     *
     * Still, there might be cases where you want more control over when the ServiceWorker is
     * registered (for example, there might be a long-running timeout or polling interval, preventing
     * the app from stabilizing). The available option are:
     *
     * - `registerWhenStable:<timeout>`: Register as soon as the application stabilizes (no pending
     *     micro-/macro-tasks) but no later than `<timeout>` milliseconds. If the app hasn't
     *     stabilized after `<timeout>` milliseconds (for example, due to a recurrent asynchronous
     *     task), the ServiceWorker will be registered anyway.
     *     If `<timeout>` is omitted, the ServiceWorker will only be registered once the app
     *     stabilizes.
     * - `registerImmediately`: Register immediately.
     * - `registerWithDelay:<timeout>`: Register with a delay of `<timeout>` milliseconds. For
     *     example, use `registerWithDelay:5000` to register the ServiceWorker after 5 seconds. If
     *     `<timeout>` is omitted, is defaults to `0`, which will register the ServiceWorker as soon
     *     as possible but still asynchronously, once all pending micro-tasks are completed.
     * - An [Observable](guide/observables) factory function: A function that returns an `Observable`.
     *     The function will be used at runtime to obtain and subscribe to the `Observable` and the
     *     ServiceWorker will be registered as soon as the first value is emitted.
     *
     * Default: 'registerWhenStable:30000'
     */
    registrationStrategy?: string | (() => Observable<unknown>);
}
export declare const SCRIPT: InjectionToken<string>;
export declare function ngswAppInitializer(injector: Injector, script: string, options: SwRegistrationOptions, platformId: string): Function;
export declare function ngswCommChannelFactory(opts: SwRegistrationOptions, platformId: string): NgswCommChannel;
/**
 * @publicApi
 */
export declare class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    static register(script: string, opts?: SwRegistrationOptions): ModuleWithProviders<ServiceWorkerModule>;
    static ɵfac: i0.ɵɵFactoryDef<ServiceWorkerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<ServiceWorkerModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDef<ServiceWorkerModule>;
}
