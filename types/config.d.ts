/**
 * @license Angular v21.0.8+sha-a6efb77
 * (c) 2010-2025 Google LLC. https://angular.dev/
 * License: MIT
 */

/**
 * An abstraction over a virtual file system used to enable testing and operation
 * of the config generator in different environments.
 *
 * @publicApi
 */
interface Filesystem {
    list(dir: string): Promise<string[]>;
    read(file: string): Promise<string>;
    hash(file: string): Promise<string>;
    write(file: string, contents: string): Promise<void>;
}

/**
 * @publicApi
 */
type Glob = string;
/**
 * @publicApi
 */
type Duration = string;
/**
 * A top-level Angular Service Worker configuration object.
 *
 * @publicApi
 */
interface Config {
    appData?: {};
    index: string;
    assetGroups?: AssetGroup[];
    dataGroups?: DataGroup[];
    navigationUrls?: string[];
    navigationRequestStrategy?: 'freshness' | 'performance';
    applicationMaxAge?: Duration;
}
/**
 * Configuration for a particular group of assets.
 *
 * @publicApi
 */
interface AssetGroup {
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
 * Configuration for a particular group of dynamic URLs.
 *
 * @publicApi
 */
interface DataGroup {
    name: string;
    urls: Glob[];
    version?: number;
    cacheConfig: {
        maxSize: number;
        maxAge: Duration;
        timeout?: Duration;
        refreshAhead?: Duration;
        strategy?: 'freshness' | 'performance';
        cacheOpaqueResponses?: boolean;
    };
    cacheQueryOptions?: Pick<CacheQueryOptions, 'ignoreSearch'>;
}

/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @publicApi
 */
declare class Generator {
    readonly fs: Filesystem;
    private baseHref;
    constructor(fs: Filesystem, baseHref: string);
    process(config: Config): Promise<Object>;
    private processAssetGroups;
    private processDataGroups;
}

export { Generator };
export type { AssetGroup, Config, DataGroup, Duration, Filesystem, Glob };
