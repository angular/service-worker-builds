#!/usr/bin/env node

      import {createRequire as __cjsCompatRequire} from 'module';
      const require = __cjsCompatRequire(import.meta.url);
    

// packages/service-worker/config/src/duration.js
var PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
var PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
function parseDurationToMs(duration) {
  const matches2 = [];
  let array;
  while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
    matches2.push(array[0]);
  }
  return matches2.map((match) => {
    const res = PAIR_SPLIT.exec(match);
    if (res === null) {
      throw new Error(`Not a valid duration: ${match}`);
    }
    let factor = 0;
    switch (res[2]) {
      case "d":
        factor = 864e5;
        break;
      case "h":
        factor = 36e5;
        break;
      case "m":
        factor = 6e4;
        break;
      case "s":
        factor = 1e3;
        break;
      case "u":
        factor = 1;
        break;
      default:
        throw new Error(`Not a valid duration unit: ${res[2]}`);
    }
    return parseInt(res[1]) * factor;
  }).reduce((total, value) => total + value, 0);
}

// packages/service-worker/config/src/glob.js
var QUESTION_MARK = "[^/]";
var WILD_SINGLE = "[^/]*";
var WILD_OPEN = "(?:.+\\/)?";
var TO_ESCAPE_BASE = [
  { replace: /\./g, with: "\\." },
  { replace: /\+/g, with: "\\+" },
  { replace: /\*/g, with: WILD_SINGLE }
];
var TO_ESCAPE_WILDCARD_QM = [...TO_ESCAPE_BASE, { replace: /\?/g, with: QUESTION_MARK }];
var TO_ESCAPE_LITERAL_QM = [...TO_ESCAPE_BASE, { replace: /\?/g, with: "\\?" }];
function globToRegex(glob, literalQuestionMark = false) {
  const toEscape = literalQuestionMark ? TO_ESCAPE_LITERAL_QM : TO_ESCAPE_WILDCARD_QM;
  const segments = glob.split("/").reverse();
  let regex = "";
  while (segments.length > 0) {
    const segment = segments.pop();
    if (segment === "**") {
      if (segments.length > 0) {
        regex += WILD_OPEN;
      } else {
        regex += ".*";
      }
    } else {
      const processed = toEscape.reduce((segment2, escape) => segment2.replace(escape.replace, escape.with), segment);
      regex += processed;
      if (segments.length > 0) {
        regex += "\\/";
      }
    }
  }
  return regex;
}

// packages/service-worker/config/src/generator.js
var DEFAULT_NAVIGATION_URLS = [
  "/**",
  // Include all URLs.
  "!/**/*.*",
  // Exclude URLs to files (containing a file extension in the last segment).
  "!/**/*__*",
  // Exclude URLs containing `__` in the last segment.
  "!/**/*__*/**"
  // Exclude URLs containing `__` in any other segment.
];
var Generator = class {
  fs;
  baseHref;
  constructor(fs3, baseHref2) {
    this.fs = fs3;
    this.baseHref = baseHref2;
  }
  async process(config2) {
    const unorderedHashTable = {};
    const assetGroups = await this.processAssetGroups(config2, unorderedHashTable);
    return {
      configVersion: 1,
      timestamp: Date.now(),
      appData: config2.appData,
      index: joinUrls(this.baseHref, config2.index),
      assetGroups,
      dataGroups: this.processDataGroups(config2),
      hashTable: withOrderedKeys(unorderedHashTable),
      navigationUrls: processNavigationUrls(this.baseHref, config2.navigationUrls),
      navigationRequestStrategy: config2.navigationRequestStrategy ?? "performance",
      applicationMaxAge: config2.applicationMaxAge ? parseDurationToMs(config2.applicationMaxAge) : void 0
    };
  }
  async processAssetGroups(config2, hashTable) {
    const allFiles = await this.fs.list("/");
    const seenMap = /* @__PURE__ */ new Set();
    const filesPerGroup = /* @__PURE__ */ new Map();
    for (const group of config2.assetGroups || []) {
      if (group.resources.versionedFiles) {
        throw new Error(`Asset-group '${group.name}' in 'ngsw-config.json' uses the 'versionedFiles' option, which is no longer supported. Use 'files' instead.`);
      }
      const fileMatcher = globListToMatcher(group.resources.files || []);
      const matchedFiles = allFiles.filter(fileMatcher).filter((file) => !seenMap.has(file)).sort();
      matchedFiles.forEach((file) => seenMap.add(file));
      filesPerGroup.set(group, matchedFiles);
    }
    const allMatchedFiles = [].concat(...Array.from(filesPerGroup.values())).sort();
    const allMatchedHashes = await processInBatches(allMatchedFiles, 500, (file) => this.fs.hash(file));
    allMatchedFiles.forEach((file, idx) => {
      hashTable[joinUrls(this.baseHref, file)] = allMatchedHashes[idx];
    });
    return Array.from(filesPerGroup.entries()).map(([group, matchedFiles]) => ({
      name: group.name,
      installMode: group.installMode || "prefetch",
      updateMode: group.updateMode || group.installMode || "prefetch",
      cacheQueryOptions: buildCacheQueryOptions(group.cacheQueryOptions),
      urls: matchedFiles.map((url) => joinUrls(this.baseHref, url)),
      patterns: (group.resources.urls || []).map((url) => urlToRegex(url, this.baseHref, true))
    }));
  }
  processDataGroups(config2) {
    return (config2.dataGroups || []).map((group) => {
      return {
        name: group.name,
        patterns: group.urls.map((url) => urlToRegex(url, this.baseHref, true)),
        strategy: group.cacheConfig.strategy || "performance",
        maxSize: group.cacheConfig.maxSize,
        maxAge: parseDurationToMs(group.cacheConfig.maxAge),
        timeoutMs: group.cacheConfig.timeout && parseDurationToMs(group.cacheConfig.timeout),
        refreshAheadMs: group.cacheConfig.refreshAhead && parseDurationToMs(group.cacheConfig.refreshAhead),
        cacheOpaqueResponses: group.cacheConfig.cacheOpaqueResponses,
        cacheQueryOptions: buildCacheQueryOptions(group.cacheQueryOptions),
        version: group.version !== void 0 ? group.version : 1
      };
    });
  }
};
function processNavigationUrls(baseHref2, urls = DEFAULT_NAVIGATION_URLS) {
  return urls.map((url) => {
    const positive = !url.startsWith("!");
    url = positive ? url : url.slice(1);
    return { positive, regex: `^${urlToRegex(url, baseHref2)}$` };
  });
}
async function processInBatches(items, batchSize, processFn) {
  const batches = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches.reduce(async (prev, batch) => (await prev).concat(await Promise.all(batch.map((item) => processFn(item)))), Promise.resolve([]));
}
function globListToMatcher(globs) {
  const patterns = globs.map((pattern) => {
    if (pattern.startsWith("!")) {
      return {
        positive: false,
        regex: new RegExp("^" + globToRegex(pattern.slice(1)) + "$")
      };
    } else {
      return {
        positive: true,
        regex: new RegExp("^" + globToRegex(pattern) + "$")
      };
    }
  });
  return (file) => matches(file, patterns);
}
function matches(file, patterns) {
  return patterns.reduce((isMatch, pattern) => {
    if (pattern.positive) {
      return isMatch || pattern.regex.test(file);
    } else {
      return isMatch && !pattern.regex.test(file);
    }
  }, false);
}
function urlToRegex(url, baseHref2, literalQuestionMark) {
  if (!url.startsWith("/") && url.indexOf("://") === -1) {
    url = joinUrls(baseHref2.replace(/^\.(?=\/)/, ""), url);
  }
  return globToRegex(url, literalQuestionMark);
}
function joinUrls(a, b) {
  if (a.endsWith("/") && b.startsWith("/")) {
    return a + b.slice(1);
  } else if (!a.endsWith("/") && !b.startsWith("/")) {
    return a + "/" + b;
  }
  return a + b;
}
function withOrderedKeys(unorderedObj) {
  const orderedObj = {};
  Object.keys(unorderedObj).sort().forEach((key) => orderedObj[key] = unorderedObj[key]);
  return orderedObj;
}
function buildCacheQueryOptions(inOptions) {
  return {
    ignoreVary: true,
    ...inOptions
  };
}

// packages/service-worker/cli/main.ts
import * as fs2 from "fs";
import * as path2 from "path";

// packages/service-worker/cli/filesystem.js
import * as fs from "fs";
import * as path from "path";

// packages/service-worker/cli/sha1.js
function sha1Binary(buffer) {
  const words32 = arrayBufferToWords32(buffer, Endian.Big);
  return _sha1(words32, buffer.byteLength * 8);
}
function _sha1(words32, len) {
  const w = [];
  let [a, b, c, d, e] = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  words32[len >> 5] |= 128 << 24 - len % 32;
  words32[(len + 64 >> 9 << 4) + 15] = len;
  for (let i = 0; i < words32.length; i += 16) {
    const [h0, h1, h2, h3, h4] = [a, b, c, d, e];
    for (let j = 0; j < 80; j++) {
      if (j < 16) {
        w[j] = words32[i + j];
      } else {
        w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
      }
      const [f, k] = fk(j, b, c, d);
      const temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
      [e, d, c, b, a] = [d, c, rol32(b, 30), a, temp];
    }
    [a, b, c, d, e] = [add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)];
  }
  return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
}
function add32(a, b) {
  return add32to64(a, b)[1];
}
function add32to64(a, b) {
  const low = (a & 65535) + (b & 65535);
  const high = (a >>> 16) + (b >>> 16) + (low >>> 16);
  return [high >>> 16, high << 16 | low & 65535];
}
function rol32(a, count) {
  return a << count | a >>> 32 - count;
}
var Endian;
(function(Endian2) {
  Endian2[Endian2["Little"] = 0] = "Little";
  Endian2[Endian2["Big"] = 1] = "Big";
})(Endian || (Endian = {}));
function fk(index, b, c, d) {
  if (index < 20) {
    return [b & c | ~b & d, 1518500249];
  }
  if (index < 40) {
    return [b ^ c ^ d, 1859775393];
  }
  if (index < 60) {
    return [b & c | b & d | c & d, 2400959708];
  }
  return [b ^ c ^ d, 3395469782];
}
function arrayBufferToWords32(buffer, endian) {
  const size = buffer.byteLength + 3 >>> 2;
  const words32 = [];
  const view = new Uint8Array(buffer);
  for (let i = 0; i < size; i++) {
    words32[i] = wordAt(view, i * 4, endian);
  }
  return words32;
}
function byteAt(str, index) {
  if (typeof str === "string") {
    return index >= str.length ? 0 : str.charCodeAt(index) & 255;
  } else {
    return index >= str.byteLength ? 0 : str[index] & 255;
  }
}
function wordAt(str, index, endian) {
  let word = 0;
  if (endian === Endian.Big) {
    for (let i = 0; i < 4; i++) {
      word += byteAt(str, index + i) << 24 - 8 * i;
    }
  } else {
    for (let i = 0; i < 4; i++) {
      word += byteAt(str, index + i) << 8 * i;
    }
  }
  return word;
}
function words32ToByteString(words32) {
  return words32.reduce((str, word) => str + word32ToByteString(word), "");
}
function word32ToByteString(word) {
  let str = "";
  for (let i = 0; i < 4; i++) {
    str += String.fromCharCode(word >>> 8 * (3 - i) & 255);
  }
  return str;
}
function byteStringToHexString(str) {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    const b = byteAt(str, i);
    hex += (b >>> 4).toString(16) + (b & 15).toString(16);
  }
  return hex.toLowerCase();
}

// packages/service-worker/cli/filesystem.js
var NodeFilesystem = class {
  base;
  constructor(base) {
    this.base = base;
  }
  async list(_path) {
    const dir = this.canonical(_path);
    const entries = fs.readdirSync(dir).map((entry) => ({ entry, stats: fs.statSync(path.join(dir, entry)) }));
    const files = entries.filter((entry) => !entry.stats.isDirectory()).map((entry) => path.posix.join(_path, entry.entry));
    return entries.filter((entry) => entry.stats.isDirectory()).map((entry) => path.posix.join(_path, entry.entry)).reduce(async (list, subdir) => (await list).concat(await this.list(subdir)), Promise.resolve(files));
  }
  async read(_path) {
    const file = this.canonical(_path);
    return fs.readFileSync(file).toString();
  }
  async hash(_path) {
    const file = this.canonical(_path);
    const contents = fs.readFileSync(file);
    return sha1Binary(contents);
  }
  async write(_path, contents) {
    const file = this.canonical(_path);
    fs.writeFileSync(file, contents);
  }
  canonical(_path) {
    return path.posix.join(this.base, _path);
  }
};

// packages/service-worker/cli/main.ts
var cwd = process.cwd();
var distDir = path2.join(cwd, process.argv[2]);
var config = path2.join(cwd, process.argv[3]);
var baseHref = process.argv[4] || "/";
var configParsed = JSON.parse(fs2.readFileSync(config).toString());
var filesystem = new NodeFilesystem(distDir);
var gen = new Generator(filesystem, baseHref);
(async () => {
  const control = await gen.process(configParsed);
  await filesystem.write("/ngsw.json", JSON.stringify(control, null, 2));
})();
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
//# sourceMappingURL=ngsw_config.js.map
