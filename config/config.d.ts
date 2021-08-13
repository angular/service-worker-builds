/**
 * @license Angular v13.0.0-next.1+7.sha-2a1aa58.with-local-changes
 * (c) 2010-2021 Google LLC. https://angular.io/
 * License: MIT
 */

/**
 * Configuration for a particular group of assets.
 *
 * @publicApi
 */
export declare interface AssetGroup {
    name: string;
    installMode?: 'prefetch' | 'lazy';
    updateMode?: 'prefetch' | 'lazy';
    resources: {
        files?: Glob[];
        urls?: Glob[];
    };
    cacheQueryOptions?: Pick<CacheQueryOptions, 'ignoreSearch'>;
}

/**
 * A top-level Angular Service Worker configuration object.
 *
 * @publicApi
 */
export declare interface Config {
    appData?: {};
    index: string;
    assetGroups?: AssetGroup[];
    dataGroups?: DataGroup[];
    navigationUrls?: string[];
    navigationRequestStrategy?: 'freshness' | 'performance';
}

/**
 * Configuration for a particular group of dynamic URLs.
 *
 * @publicApi
 */
export declare interface DataGroup {
    name: string;
    urls: Glob[];
    version?: number;
    cacheConfig: {
        maxSize: number;
        maxAge: Duration;
        timeout?: Duration;
        strategy?: 'freshness' | 'performance';
    };
    cacheQueryOptions?: Pick<CacheQueryOptions, 'ignoreSearch'>;
}

/**
 * @publicApi
 */
export declare type Duration = string;


/**
 * An abstraction over a virtual file system used to enable testing and operation
 * of the config generator in different environments.
 *
 * @publicApi
 */
export declare interface Filesystem {
    list(dir: string): Promise<string[]>;
    read(file: string): Promise<string>;
    hash(file: string): Promise<string>;
    write(file: string, contents: string): Promise<void>;
}

/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @publicApi
 */
declare class Generator_2 {
    readonly fs: Filesystem;
    private baseHref;
    constructor(fs: Filesystem, baseHref: string);
    process(config: Config): Promise<Object>;
    private processAssetGroups;
    private processDataGroups;
}
export { Generator_2 as Generator }


/**
 * @publicApi
 */
export declare type Glob = string;

export { }
