/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, Injector, ModuleWithProviders } from '@angular/core';
import { NgswCommChannel } from './low_level';
export declare abstract class RegistrationOptions {
    scope?: string;
    enabled?: boolean;
}
export declare const SCRIPT: InjectionToken<string>;
export declare function ngswAppInitializer(injector: Injector, script: string, options: RegistrationOptions, platformId: string): Function;
export declare function ngswCommChannelFactory(opts: RegistrationOptions, platformId: string): NgswCommChannel;
/**
 * @experimental
 */
export declare class ServiceWorkerModule {
    /**
     * Register the given Angular Service Worker script.
     *
     * If `enabled` is set to `false` in the given options, the module will behave as if service
     * workers are not supported by the browser, and the service worker will not be registered.
     */
    static register(script: string, opts?: {
        scope?: string;
        enabled?: boolean;
    }): ModuleWithProviders;
}
