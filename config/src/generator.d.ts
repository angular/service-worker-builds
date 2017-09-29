import { Filesystem } from './filesystem';
import { Config } from './in';
/**
 * Consumes service worker configuration files and processes them into control files.
 *
 * @experimental
 */
export declare class Generator {
    readonly fs: Filesystem;
    private baseHref;
    constructor(fs: Filesystem, baseHref: string);
    process(config: Config): Promise<Object>;
    private processAssetGroups(config, hashTable);
    private processDataGroups(config);
}
