/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/service-worker/config/src/generator" />
import { Filesystem } from './filesystem';
import { Config } from './in';
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @publicApi
 */
export declare class Generator {
    readonly fs: Filesystem;
    private baseHref;
    constructor(fs: Filesystem, baseHref: string);
    process(config: Config): Promise<Object>;
    private processAssetGroups;
    private processDataGroups;
}
export declare function processNavigationUrls(baseHref: string, urls?: string[]): {
    positive: boolean;
    regex: string;
}[];
