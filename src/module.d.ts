/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken, Injector, ModuleWithProviders } from '@angular/core';
import { NgswCommChannel } from './low_level';
export declare const SCRIPT: InjectionToken<string>;
export declare const OPTS: InjectionToken<Object>;
export declare function ngswAppInitializer(injector: Injector, script: string, options: RegistrationOptions): Function;
export declare function ngswCommChannelFactory(): NgswCommChannel;
/**
 * @experimental
 */
export declare class ServiceWorkerModule {
    static register(script: string, opts?: RegistrationOptions): ModuleWithProviders;
}
