/**
 * @fileoverview added by tsickle
 * Generated from: packages/service-worker/config/src/glob.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** @type {?} */
const QUESTION_MARK = '[^/]';
/** @type {?} */
const WILD_SINGLE = '[^/]*';
/** @type {?} */
const WILD_OPEN = '(?:.+\\/)?';
/** @type {?} */
const TO_ESCAPE_BASE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
/** @type {?} */
const TO_ESCAPE_WILDCARD_QM = [
    ...TO_ESCAPE_BASE,
    { replace: /\?/g, with: QUESTION_MARK },
];
/** @type {?} */
const TO_ESCAPE_LITERAL_QM = [
    ...TO_ESCAPE_BASE,
    { replace: /\?/g, with: '\\?' },
];
/**
 * @param {?} glob
 * @param {?=} literalQuestionMark
 * @return {?}
 */
export function globToRegex(glob, literalQuestionMark = false) {
    /** @type {?} */
    const toEscape = literalQuestionMark ? TO_ESCAPE_LITERAL_QM : TO_ESCAPE_WILDCARD_QM;
    /** @type {?} */
    const segments = glob.split('/').reverse();
    /** @type {?} */
    let regex = '';
    while (segments.length > 0) {
        /** @type {?} */
        const segment = (/** @type {?} */ (segments.pop()));
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            /** @type {?} */
            const processed = toEscape.reduce((/**
             * @param {?} segment
             * @param {?} escape
             * @return {?}
             */
            (segment, escape) => segment.replace(escape.replace, escape.with)), segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NvbmZpZy9zcmMvZ2xvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O01BUU0sYUFBYSxHQUFHLE1BQU07O01BQ3RCLFdBQVcsR0FBRyxPQUFPOztNQUNyQixTQUFTLEdBQUcsWUFBWTs7TUFFeEIsY0FBYyxHQUFHO0lBQ3JCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0lBQzdCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0lBQzdCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFDO0NBQ3BDOztNQUNLLHFCQUFxQixHQUFHO0lBQzVCLEdBQUcsY0FBYztJQUNqQixFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLGFBQWEsRUFBQztDQUN0Qzs7TUFDSyxvQkFBb0IsR0FBRztJQUMzQixHQUFHLGNBQWM7SUFDakIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7Q0FDOUI7Ozs7OztBQUVELE1BQU0sVUFBVSxXQUFXLENBQUMsSUFBWSxFQUFFLG1CQUFtQixHQUFHLEtBQUs7O1VBQzdELFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjs7VUFDN0UsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFOztRQUN0QyxLQUFLLEdBQVcsRUFBRTtJQUN0QixPQUFPLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztjQUNwQixPQUFPLEdBQUcsbUJBQUEsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFDO1FBQy9CLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtZQUNwQixJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixLQUFLLElBQUksU0FBUyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLEtBQUssSUFBSSxJQUFJLENBQUM7YUFDZjtTQUNGO2FBQU07O2tCQUNDLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTTs7Ozs7WUFDN0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFFLE9BQU8sQ0FBQztZQUMvRSxLQUFLLElBQUksU0FBUyxDQUFDO1lBQ25CLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLEtBQUssSUFBSSxLQUFLLENBQUM7YUFDaEI7U0FDRjtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jb25zdCBRVUVTVElPTl9NQVJLID0gJ1teL10nO1xuY29uc3QgV0lMRF9TSU5HTEUgPSAnW14vXSonO1xuY29uc3QgV0lMRF9PUEVOID0gJyg/Oi4rXFxcXC8pPyc7XG5cbmNvbnN0IFRPX0VTQ0FQRV9CQVNFID0gW1xuICB7cmVwbGFjZTogL1xcLi9nLCB3aXRoOiAnXFxcXC4nfSxcbiAge3JlcGxhY2U6IC9cXCsvZywgd2l0aDogJ1xcXFwrJ30sXG4gIHtyZXBsYWNlOiAvXFwqL2csIHdpdGg6IFdJTERfU0lOR0xFfSxcbl07XG5jb25zdCBUT19FU0NBUEVfV0lMRENBUkRfUU0gPSBbXG4gIC4uLlRPX0VTQ0FQRV9CQVNFLFxuICB7cmVwbGFjZTogL1xcPy9nLCB3aXRoOiBRVUVTVElPTl9NQVJLfSxcbl07XG5jb25zdCBUT19FU0NBUEVfTElURVJBTF9RTSA9IFtcbiAgLi4uVE9fRVNDQVBFX0JBU0UsXG4gIHtyZXBsYWNlOiAvXFw/L2csIHdpdGg6ICdcXFxcPyd9LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JUb1JlZ2V4KGdsb2I6IHN0cmluZywgbGl0ZXJhbFF1ZXN0aW9uTWFyayA9IGZhbHNlKTogc3RyaW5nIHtcbiAgY29uc3QgdG9Fc2NhcGUgPSBsaXRlcmFsUXVlc3Rpb25NYXJrID8gVE9fRVNDQVBFX0xJVEVSQUxfUU0gOiBUT19FU0NBUEVfV0lMRENBUkRfUU07XG4gIGNvbnN0IHNlZ21lbnRzID0gZ2xvYi5zcGxpdCgnLycpLnJldmVyc2UoKTtcbiAgbGV0IHJlZ2V4OiBzdHJpbmcgPSAnJztcbiAgd2hpbGUgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBzZWdtZW50ID0gc2VnbWVudHMucG9wKCkhO1xuICAgIGlmIChzZWdtZW50ID09PSAnKionKSB7XG4gICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZWdleCArPSBXSUxEX09QRU47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdleCArPSAnLionO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcm9jZXNzZWQgPSB0b0VzY2FwZS5yZWR1Y2UoXG4gICAgICAgICAgKHNlZ21lbnQsIGVzY2FwZSkgPT4gc2VnbWVudC5yZXBsYWNlKGVzY2FwZS5yZXBsYWNlLCBlc2NhcGUud2l0aCksIHNlZ21lbnQpO1xuICAgICAgcmVnZXggKz0gcHJvY2Vzc2VkO1xuICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVnZXggKz0gJ1xcXFwvJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlZ2V4O1xufVxuIl19