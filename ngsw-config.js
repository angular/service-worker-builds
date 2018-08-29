#!/usr/bin/env node
(function () {
    'use strict';

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __read = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    };
    function sha1Binary(buffer) {
        var words32 = arrayBufferToWords32(buffer, Endian.Big);
        return _sha1(words32, buffer.byteLength * 8);
    }
    function _sha1(words32, len) {
        var _a, _b;
        var w = new Array(80);
        var _c = __read([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0], 5), a = _c[0], b = _c[1], c = _c[2], d = _c[3], e = _c[4];
        words32[len >> 5] |= 0x80 << (24 - len % 32);
        words32[((len + 64 >> 9) << 4) + 15] = len;
        for (var i = 0; i < words32.length; i += 16) {
            var _d = __read([a, b, c, d, e], 5), h0 = _d[0], h1 = _d[1], h2 = _d[2], h3 = _d[3], h4 = _d[4];
            for (var j = 0; j < 80; j++) {
                if (j < 16) {
                    w[j] = words32[i + j];
                }
                else {
                    w[j] = rol32(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                }
                var _e = __read(fk(j, b, c, d), 2), f = _e[0], k = _e[1];
                var temp = [rol32(a, 5), f, e, k, w[j]].reduce(add32);
                _a = __read([d, c, rol32(b, 30), a, temp], 5), e = _a[0], d = _a[1], c = _a[2], b = _a[3], a = _a[4];
            }
            _b = __read([add32(a, h0), add32(b, h1), add32(c, h2), add32(d, h3), add32(e, h4)], 5), a = _b[0], b = _b[1], c = _b[2], d = _b[3], e = _b[4];
        }
        return byteStringToHexString(words32ToByteString([a, b, c, d, e]));
    }
    function add32(a, b) {
        return add32to64(a, b)[1];
    }
    function add32to64(a, b) {
        var low = (a & 0xffff) + (b & 0xffff);
        var high = (a >>> 16) + (b >>> 16) + (low >>> 16);
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
        var words32 = Array((buffer.byteLength + 3) >>> 2);
        var view = new Uint8Array(buffer);
        for (var i = 0; i < words32.length; i++) {
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
        var word = 0;
        if (endian === Endian.Big) {
            for (var i = 0; i < 4; i++) {
                word += byteAt(str, index + i) << (24 - 8 * i);
            }
        }
        else {
            for (var i = 0; i < 4; i++) {
                word += byteAt(str, index + i) << 8 * i;
            }
        }
        return word;
    }
    function words32ToByteString(words32) {
        return words32.reduce(function (str, word) { return str + word32ToByteString(word); }, '');
    }
    function word32ToByteString(word) {
        var str = '';
        for (var i = 0; i < 4; i++) {
            str += String.fromCharCode((word >>> 8 * (3 - i)) & 0xff);
        }
        return str;
    }
    function byteStringToHexString(str) {
        var hex = '';
        for (var i = 0; i < str.length; i++) {
            var b = byteAt(str, i);
            hex += (b >>> 4).toString(16) + (b & 0x0f).toString(16);
        }
        return hex.toLowerCase();
    }

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
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
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var fs = require('fs');
    var path = require('path');
    var NodeFilesystem = /*@__PURE__*/ (function () {
        function NodeFilesystem(base) {
            this.base = base;
        }
        NodeFilesystem.prototype.list = function (_path) {
            return __awaiter(this, void 0, void 0, function () {
                var dir, entries, files;
                var _this = this;
                return __generator(this, function (_a) {
                    dir = this.canonical(_path);
                    entries = fs.readdirSync(dir).map(function (entry) { return ({ entry: entry, stats: fs.statSync(path.join(dir, entry)) }); });
                    files = entries.filter(function (entry) { return !entry.stats.isDirectory(); })
                        .map(function (entry) { return path.posix.join(_path, entry.entry); });
                    return [2 /*return*/, entries.filter(function (entry) { return entry.stats.isDirectory(); })
                            .map(function (entry) { return path.posix.join(_path, entry.entry); })
                            .reduce(function (list, subdir) {
                            return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, list];
                                        case 1:
                                            _b = (_a = (_c.sent())).concat;
                                            return [4 /*yield*/, this.list(subdir)];
                                        case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                                    }
                                });
                            });
                        }, Promise.resolve(files))];
                });
            });
        };
        NodeFilesystem.prototype.read = function (_path) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    file = this.canonical(_path);
                    return [2 /*return*/, fs.readFileSync(file).toString()];
                });
            });
        };
        NodeFilesystem.prototype.hash = function (_path) {
            return __awaiter(this, void 0, void 0, function () {
                var file, contents;
                return __generator(this, function (_a) {
                    file = this.canonical(_path);
                    contents = fs.readFileSync(file);
                    return [2 /*return*/, sha1Binary(contents)];
                });
            });
        };
        NodeFilesystem.prototype.write = function (_path, contents) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    file = this.canonical(_path);
                    fs.writeFileSync(file, contents);
                    return [2 /*return*/];
                });
            });
        };
        NodeFilesystem.prototype.canonical = function (_path) { return path.posix.join(this.base, _path); };
        return NodeFilesystem;
    }());

    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
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
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var _this = undefined;
    var _a = require('@angular/service-worker/config'), Generator = _a.Generator, NgswConfig = _a.NgswConfig;
    var fs$1 = require('fs');
    var path$1 = require('path');
    var cwd = process.cwd();
    var distDir = path$1.join(cwd, process.argv[2]);
    var config = path$1.join(cwd, process.argv[3]);
    var baseHref = process.argv[4] || '/';
    var configParsed = JSON.parse(fs$1.readFileSync(config).toString());
    var filesystem = new NodeFilesystem(distDir);
    var gen = new Generator(filesystem, baseHref);
    (function () {
        return __awaiter$1(_this, void 0, void 0, function () {
            var control;
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, gen.process(configParsed)];
                    case 1:
                        control = _a.sent();
                        return [4 /*yield*/, filesystem.write('/ngsw.json', JSON.stringify(control, null, 2))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    })();

}());
//# sourceMappingURL=ngsw_config.js.map
