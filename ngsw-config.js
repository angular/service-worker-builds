#!/usr/bin/env node
(function () {
    'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    function sha1Binary(buffer) {
        const words32 = arrayBufferToWords32(buffer, Endian.Big);
        return _sha1(words32, buffer.byteLength * 8);
    }
    function _sha1(words32, len) {
        const w = [];
        let [a, b, c, d, e] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];
        words32[len >> 5] |= 0x80 << (24 - len % 32);
        words32[((len + 64 >> 9) << 4) + 15] = len;
        for (let i = 0; i < words32.length; i += 16) {
            const [h0, h1, h2, h3, h4] = [a, b, c, d, e];
            for (let j = 0; j < 80; j++) {
                if (j < 16) {
                    w[j] = words32[i + j];
                }
                else {
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
        const low = (a & 0xffff) + (b & 0xffff);
        const high = (a >>> 16) + (b >>> 16) + (low >>> 16);
        return [high >>> 16, (high << 16) | (low & 0xffff)];
    }
    // Rotate a 32b number left `count` position
    function rol32(a, count) {
        return (a << count) | (a >>> (32 - count));
    }
    var Endian = /*@__PURE__*/ (function (Endian) {
        Endian[Endian["Little"] = 0] = "Little";
        Endian[Endian["Big"] = 1] = "Big";
        return Endian;
    })({});
    function fk(index, b, c, d) {
        if (index < 20) {
            return [(b & c) | (~b & d), 0x5a827999];
        }
        if (index < 40) {
            return [b ^ c ^ d, 0x6ed9eba1];
        }
        if (index < 60) {
            return [(b & c) | (b & d) | (c & d), 0x8f1bbcdc];
        }
        return [b ^ c ^ d, 0xca62c1d6];
    }
    function arrayBufferToWords32(buffer, endian) {
        const size = (buffer.byteLength + 3) >>> 2;
        const words32 = [];
        const view = new Uint8Array(buffer);
        for (let i = 0; i < size; i++) {
            words32[i] = wordAt(view, i * 4, endian);
        }
        return words32;
    }
    function byteAt(str, index) {
        if (typeof str === 'string') {
            return index >= str.length ? 0 : str.charCodeAt(index) & 0xff;
        }
        else {
            return index >= str.byteLength ? 0 : str[index] & 0xff;
        }
    }
    function wordAt(str, index, endian) {
        let word = 0;
        if (endian === Endian.Big) {
            for (let i = 0; i < 4; i++) {
                word += byteAt(str, index + i) << (24 - 8 * i);
            }
        }
        else {
            for (let i = 0; i < 4; i++) {
                word += byteAt(str, index + i) << 8 * i;
            }
        }
        return word;
    }
    function words32ToByteString(words32) {
        return words32.reduce((str, word) => str + word32ToByteString(word), '');
    }
    function word32ToByteString(word) {
        let str = '';
        for (let i = 0; i < 4; i++) {
            str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
        }
        return str;
    }
    function byteStringToHexString(str) {
        let hex = '';
        for (let i = 0; i < str.length; i++) {
            const b = byteAt(str, i);
            hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
        }
        return hex.toLowerCase();
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const fs = require('fs');
    const path = require('path');
    class NodeFilesystem {
        constructor(base) {
            this.base = base;
        }
        list(_path) {
            return __awaiter(this, void 0, void 0, function* () {
                const dir = this.canonical(_path);
                const entries = fs.readdirSync(dir).map((entry) => ({ entry, stats: fs.statSync(path.join(dir, entry)) }));
                const files = entries.filter((entry) => !entry.stats.isDirectory())
                    .map((entry) => path.posix.join(_path, entry.entry));
                return entries.filter((entry) => entry.stats.isDirectory())
                    .map((entry) => path.posix.join(_path, entry.entry))
                    .reduce((list, subdir) => __awaiter(this, void 0, void 0, function* () { return (yield list).concat(yield this.list(subdir)); }), Promise.resolve(files));
            });
        }
        read(_path) {
            return __awaiter(this, void 0, void 0, function* () {
                const file = this.canonical(_path);
                return fs.readFileSync(file).toString();
            });
        }
        hash(_path) {
            return __awaiter(this, void 0, void 0, function* () {
                const file = this.canonical(_path);
                const contents = fs.readFileSync(file);
                return sha1Binary(contents);
            });
        }
        write(_path, contents) {
            return __awaiter(this, void 0, void 0, function* () {
                const file = this.canonical(_path);
                fs.writeFileSync(file, contents);
            });
        }
        canonical(_path) {
            return path.posix.join(this.base, _path);
        }
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    const { Generator, NgswConfig } = require('@angular/service-worker/config');
    const fs$1 = require('fs');
    const path$1 = require('path');
    const cwd = process.cwd();
    const distDir = path$1.join(cwd, process.argv[2]);
    const config = path$1.join(cwd, process.argv[3]);
    const baseHref = process.argv[4] || '/';
    const configParsed = JSON.parse(fs$1.readFileSync(config).toString());
    const filesystem = new NodeFilesystem(distDir);
    const gen = new Generator(filesystem, baseHref);
    (() => __awaiter$1(void 0, void 0, void 0, function* () {
        const control = yield gen.process(configParsed);
        yield filesystem.write('/ngsw.json', JSON.stringify(control, null, 2));
    }))();

}());
//# sourceMappingURL=ngsw_config.js.map
