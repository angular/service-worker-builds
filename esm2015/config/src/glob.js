/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
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
            const processed = toEscape.reduce((segment, escape) => segment.replace(escape.replace, escape.with), segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NvbmZpZy9zcmMvZ2xvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7TUFRTSxhQUFhLEdBQUcsTUFBTTs7TUFDdEIsV0FBVyxHQUFHLE9BQU87O01BQ3JCLFNBQVMsR0FBRyxZQUFZOztNQUV4QixjQUFjLEdBQUc7SUFDckIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7Q0FDcEM7O01BQ0sscUJBQXFCLEdBQUc7SUFDNUIsR0FBRyxjQUFjO0lBQ2pCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDO0NBQ3RDOztNQUNLLG9CQUFvQixHQUFHO0lBQzNCLEdBQUcsY0FBYztJQUNqQixFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztDQUM5Qjs7Ozs7O0FBRUQsTUFBTSxVQUFVLFdBQVcsQ0FBQyxJQUFZLEVBQUUsbUJBQW1CLEdBQUcsS0FBSzs7VUFDN0QsUUFBUSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMscUJBQXFCOztVQUM3RSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7O1FBQ3RDLEtBQUssR0FBVyxFQUFFO0lBQ3RCLE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7O2NBQ3BCLE9BQU8sR0FBRyxtQkFBQSxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDaEMsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO1lBQ3BCLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLEtBQUssSUFBSSxTQUFTLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsS0FBSyxJQUFJLElBQUksQ0FBQzthQUNmO1NBQ0Y7YUFBTTs7a0JBQ0MsU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQzdCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUM7WUFDL0UsS0FBSyxJQUFJLFNBQVMsQ0FBQztZQUNuQixJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixLQUFLLElBQUksS0FBSyxDQUFDO2FBQ2hCO1NBQ0Y7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuY29uc3QgUVVFU1RJT05fTUFSSyA9ICdbXi9dJztcbmNvbnN0IFdJTERfU0lOR0xFID0gJ1teL10qJztcbmNvbnN0IFdJTERfT1BFTiA9ICcoPzouK1xcXFwvKT8nO1xuXG5jb25zdCBUT19FU0NBUEVfQkFTRSA9IFtcbiAge3JlcGxhY2U6IC9cXC4vZywgd2l0aDogJ1xcXFwuJ30sXG4gIHtyZXBsYWNlOiAvXFwrL2csIHdpdGg6ICdcXFxcKyd9LFxuICB7cmVwbGFjZTogL1xcKi9nLCB3aXRoOiBXSUxEX1NJTkdMRX0sXG5dO1xuY29uc3QgVE9fRVNDQVBFX1dJTERDQVJEX1FNID0gW1xuICAuLi5UT19FU0NBUEVfQkFTRSxcbiAge3JlcGxhY2U6IC9cXD8vZywgd2l0aDogUVVFU1RJT05fTUFSS30sXG5dO1xuY29uc3QgVE9fRVNDQVBFX0xJVEVSQUxfUU0gPSBbXG4gIC4uLlRPX0VTQ0FQRV9CQVNFLFxuICB7cmVwbGFjZTogL1xcPy9nLCB3aXRoOiAnXFxcXD8nfSxcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iVG9SZWdleChnbG9iOiBzdHJpbmcsIGxpdGVyYWxRdWVzdGlvbk1hcmsgPSBmYWxzZSk6IHN0cmluZyB7XG4gIGNvbnN0IHRvRXNjYXBlID0gbGl0ZXJhbFF1ZXN0aW9uTWFyayA/IFRPX0VTQ0FQRV9MSVRFUkFMX1FNIDogVE9fRVNDQVBFX1dJTERDQVJEX1FNO1xuICBjb25zdCBzZWdtZW50cyA9IGdsb2Iuc3BsaXQoJy8nKS5yZXZlcnNlKCk7XG4gIGxldCByZWdleDogc3RyaW5nID0gJyc7XG4gIHdoaWxlIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3Qgc2VnbWVudCA9IHNlZ21lbnRzLnBvcCgpICE7XG4gICAgaWYgKHNlZ21lbnQgPT09ICcqKicpIHtcbiAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlZ2V4ICs9IFdJTERfT1BFTjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2V4ICs9ICcuKic7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByb2Nlc3NlZCA9IHRvRXNjYXBlLnJlZHVjZShcbiAgICAgICAgICAoc2VnbWVudCwgZXNjYXBlKSA9PiBzZWdtZW50LnJlcGxhY2UoZXNjYXBlLnJlcGxhY2UsIGVzY2FwZS53aXRoKSwgc2VnbWVudCk7XG4gICAgICByZWdleCArPSBwcm9jZXNzZWQ7XG4gICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZWdleCArPSAnXFxcXC8nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVnZXg7XG59XG4iXX0=