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
var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var fs$1 = require('fs');
var path$1 = require('path');
var NodeFilesystem = (function () {
    function NodeFilesystem(base) {
        this.base = base;
    }
    NodeFilesystem.prototype.list = function (_path) {
        return __awaiter$1(this, void 0, void 0, function () {
            var _this = this;
            var dir, entries, files;
            return __generator$1(this, function (_a) {
                dir = this.canonical(_path);
                entries = fs$1.readdirSync(dir).map(function (entry) { return ({ entry: entry, stats: fs$1.statSync(path$1.join(dir, entry)) }); });
                files = entries.filter(function (entry) { return !entry.stats.isDirectory(); })
                    .map(function (entry) { return path$1.join(_path, entry.entry); });
                return [2 /*return*/, entries.filter(function (entry) { return entry.stats.isDirectory(); })
                        .map(function (entry) { return path$1.join(_path, entry.entry); })
                        .reduce(function (list, subdir) { return __awaiter$1(_this, void 0, void 0, function () { var _a, _b; return __generator$1(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, list];
                            case 1:
                                _b = (_a = (_c.sent())).concat;
                                return [4 /*yield*/, this.list(subdir)];
                            case 2: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                        }
                    }); }); }, Promise.resolve(files))];
            });
        });
    };
    NodeFilesystem.prototype.read = function (_path) {
        return __awaiter$1(this, void 0, void 0, function () {
            var file;
            return __generator$1(this, function (_a) {
                file = this.canonical(_path);
                return [2 /*return*/, fs$1.readFileSync(file).toString()];
            });
        });
    };
    NodeFilesystem.prototype.write = function (_path, contents) {
        return __awaiter$1(this, void 0, void 0, function () {
            var file;
            return __generator$1(this, function (_a) {
                file = this.canonical(_path);
                fs$1.writeFileSync(file, contents);
                return [2 /*return*/];
            });
        });
    };
    NodeFilesystem.prototype.canonical = function (_path) { return path$1.join(this.base, _path); };
    return NodeFilesystem;
}());

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = undefined;
var _a = require('@angular/service-worker/config');
var Generator = _a.Generator;
var NgswConfig = _a.NgswConfig;
var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var distDir = path.join(cwd, process.argv[2]);
var config = path.join(cwd, process.argv[3]);
var baseHref = process.argv[4] || '/';
var configParsed = JSON.parse(fs.readFileSync(config).toString());
var filesystem = new NodeFilesystem(distDir);
var gen = new Generator(filesystem, baseHref);
(function () { return __awaiter(_this, void 0, void 0, function () {
    var control;
    return __generator(this, function (_a) {
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
}); })();

}());
