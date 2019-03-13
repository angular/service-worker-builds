/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NvbmZpZy9zcmMvZ2xvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7TUFRTSxhQUFhLEdBQUcsTUFBTTs7TUFDdEIsV0FBVyxHQUFHLE9BQU87O01BQ3JCLFNBQVMsR0FBRyxZQUFZOztNQUV4QixjQUFjLEdBQUc7SUFDckIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7Q0FDcEM7O01BQ0sscUJBQXFCLEdBQUc7SUFDNUIsR0FBRyxjQUFjO0lBQ2pCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDO0NBQ3RDOztNQUNLLG9CQUFvQixHQUFHO0lBQzNCLEdBQUcsY0FBYztJQUNqQixFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztDQUM5Qjs7Ozs7O0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxJQUFZLEVBQUUsbUJBQW1CLEdBQUcsS0FBSzs7VUFDN0QsUUFBUSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMscUJBQXFCOztVQUM3RSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7O1FBQ3RDLEtBQUssR0FBVyxFQUFFO0lBQ3RCLE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O2NBQ3BCLE9BQU8sR0FBRyxtQkFBQSxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDaEMsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQ3BCLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLEtBQUssSUFBSSxTQUFTLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsS0FBSyxJQUFJLElBQUksQ0FBQzthQUNmO1NBQ0Y7YUFBTTs7a0JBQ0MsU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNOzs7OztZQUM3QixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUUsT0FBTyxDQUFDO1lBQy9FLEtBQUssSUFBSSxTQUFTLENBQUM7WUFDbkIsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdkIsS0FBSyxJQUFJLEtBQUssQ0FBQzthQUNoQjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmNvbnN0IFFVRVNUSU9OX01BUksgPSAnW14vXSc7XG5jb25zdCBXSUxEX1NJTkdMRSA9ICdbXi9dKic7XG5jb25zdCBXSUxEX09QRU4gPSAnKD86LitcXFxcLyk/JztcblxuY29uc3QgVE9fRVNDQVBFX0JBU0UgPSBbXG4gIHtyZXBsYWNlOiAvXFwuL2csIHdpdGg6ICdcXFxcLid9LFxuICB7cmVwbGFjZTogL1xcKy9nLCB3aXRoOiAnXFxcXCsnfSxcbiAge3JlcGxhY2U6IC9cXCovZywgd2l0aDogV0lMRF9TSU5HTEV9LFxuXTtcbmNvbnN0IFRPX0VTQ0FQRV9XSUxEQ0FSRF9RTSA9IFtcbiAgLi4uVE9fRVNDQVBFX0JBU0UsXG4gIHtyZXBsYWNlOiAvXFw/L2csIHdpdGg6IFFVRVNUSU9OX01BUkt9LFxuXTtcbmNvbnN0IFRPX0VTQ0FQRV9MSVRFUkFMX1FNID0gW1xuICAuLi5UT19FU0NBUEVfQkFTRSxcbiAge3JlcGxhY2U6IC9cXD8vZywgd2l0aDogJ1xcXFw/J30sXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2xvYlRvUmVnZXgoZ2xvYjogc3RyaW5nLCBsaXRlcmFsUXVlc3Rpb25NYXJrID0gZmFsc2UpOiBzdHJpbmcge1xuICBjb25zdCB0b0VzY2FwZSA9IGxpdGVyYWxRdWVzdGlvbk1hcmsgPyBUT19FU0NBUEVfTElURVJBTF9RTSA6IFRPX0VTQ0FQRV9XSUxEQ0FSRF9RTTtcbiAgY29uc3Qgc2VnbWVudHMgPSBnbG9iLnNwbGl0KCcvJykucmV2ZXJzZSgpO1xuICBsZXQgcmVnZXg6IHN0cmluZyA9ICcnO1xuICB3aGlsZSAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHNlZ21lbnQgPSBzZWdtZW50cy5wb3AoKSAhO1xuICAgIGlmIChzZWdtZW50ID09PSAnKionKSB7XG4gICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZWdleCArPSBXSUxEX09QRU47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWdleCArPSAnLionO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBwcm9jZXNzZWQgPSB0b0VzY2FwZS5yZWR1Y2UoXG4gICAgICAgICAgKHNlZ21lbnQsIGVzY2FwZSkgPT4gc2VnbWVudC5yZXBsYWNlKGVzY2FwZS5yZXBsYWNlLCBlc2NhcGUud2l0aCksIHNlZ21lbnQpO1xuICAgICAgcmVnZXggKz0gcHJvY2Vzc2VkO1xuICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVnZXggKz0gJ1xcXFwvJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlZ2V4O1xufVxuIl19