/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const /** @type {?} */ WILD_SINGLE = '[^\\/]*';
const /** @type {?} */ WILD_OPEN = '(?:.+\\/)?';
const /** @type {?} */ TO_ESCAPE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\?/g, with: '\\?' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
/**
 * @param {?} glob
 * @return {?}
 */
export function globToRegex(glob) {
    const /** @type {?} */ segments = glob.split('/').reverse();
    let /** @type {?} */ regex = '';
    while (segments.length > 0) {
        const /** @type {?} */ segment = /** @type {?} */ ((segments.pop()));
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            const /** @type {?} */ processed = TO_ESCAPE.reduce((segment, escape) => segment.replace(escape.replace, escape.with), segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}
//# sourceMappingURL=glob.js.map