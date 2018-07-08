/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
        const segment = /** @type {?} */ ((segments.pop()));
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NvbmZpZy9zcmMvZ2xvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUM7O0FBQzdCLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQzs7QUFDNUIsTUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDOztBQUUvQixNQUFNLGNBQWMsR0FBRztJQUNyQixFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztJQUM3QixFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztJQUM3QixFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBQztDQUNwQyxDQUFDOztBQUNGLE1BQU0scUJBQXFCLEdBQUc7SUFDNUIsR0FBRyxjQUFjO0lBQ2pCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDO0NBQ3RDLENBQUM7O0FBQ0YsTUFBTSxvQkFBb0IsR0FBRztJQUMzQixHQUFHLGNBQWM7SUFDakIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7Q0FDOUIsQ0FBQzs7Ozs7O0FBRUYsTUFBTSxzQkFBc0IsSUFBWSxFQUFFLG1CQUFtQixHQUFHLEtBQUs7O0lBQ25FLE1BQU0sUUFBUSxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUM7O0lBQ3BGLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7O0lBQzNDLElBQUksS0FBSyxHQUFXLEVBQUUsQ0FBQztJQUN2QixPQUFPLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOztRQUMxQixNQUFNLE9BQU8sc0JBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHO1FBQ2pDLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtZQUNwQixJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixLQUFLLElBQUksU0FBUyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLEtBQUssSUFBSSxJQUFJLENBQUM7YUFDZjtTQUNGO2FBQU07O1lBQ0wsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FDN0IsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hGLEtBQUssSUFBSSxTQUFTLENBQUM7WUFDbkIsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdkIsS0FBSyxJQUFJLEtBQUssQ0FBQzthQUNoQjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQztDQUNkIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jb25zdCBRVUVTVElPTl9NQVJLID0gJ1teL10nO1xuY29uc3QgV0lMRF9TSU5HTEUgPSAnW14vXSonO1xuY29uc3QgV0lMRF9PUEVOID0gJyg/Oi4rXFxcXC8pPyc7XG5cbmNvbnN0IFRPX0VTQ0FQRV9CQVNFID0gW1xuICB7cmVwbGFjZTogL1xcLi9nLCB3aXRoOiAnXFxcXC4nfSxcbiAge3JlcGxhY2U6IC9cXCsvZywgd2l0aDogJ1xcXFwrJ30sXG4gIHtyZXBsYWNlOiAvXFwqL2csIHdpdGg6IFdJTERfU0lOR0xFfSxcbl07XG5jb25zdCBUT19FU0NBUEVfV0lMRENBUkRfUU0gPSBbXG4gIC4uLlRPX0VTQ0FQRV9CQVNFLFxuICB7cmVwbGFjZTogL1xcPy9nLCB3aXRoOiBRVUVTVElPTl9NQVJLfSxcbl07XG5jb25zdCBUT19FU0NBUEVfTElURVJBTF9RTSA9IFtcbiAgLi4uVE9fRVNDQVBFX0JBU0UsXG4gIHtyZXBsYWNlOiAvXFw/L2csIHdpdGg6ICdcXFxcPyd9LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JUb1JlZ2V4KGdsb2I6IHN0cmluZywgbGl0ZXJhbFF1ZXN0aW9uTWFyayA9IGZhbHNlKTogc3RyaW5nIHtcbiAgY29uc3QgdG9Fc2NhcGUgPSBsaXRlcmFsUXVlc3Rpb25NYXJrID8gVE9fRVNDQVBFX0xJVEVSQUxfUU0gOiBUT19FU0NBUEVfV0lMRENBUkRfUU07XG4gIGNvbnN0IHNlZ21lbnRzID0gZ2xvYi5zcGxpdCgnLycpLnJldmVyc2UoKTtcbiAgbGV0IHJlZ2V4OiBzdHJpbmcgPSAnJztcbiAgd2hpbGUgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBzZWdtZW50ID0gc2VnbWVudHMucG9wKCkgITtcbiAgICBpZiAoc2VnbWVudCA9PT0gJyoqJykge1xuICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVnZXggKz0gV0lMRF9PUEVOO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVnZXggKz0gJy4qJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHJvY2Vzc2VkID0gdG9Fc2NhcGUucmVkdWNlKFxuICAgICAgICAgIChzZWdtZW50LCBlc2NhcGUpID0+IHNlZ21lbnQucmVwbGFjZShlc2NhcGUucmVwbGFjZSwgZXNjYXBlLndpdGgpLCBzZWdtZW50KTtcbiAgICAgIHJlZ2V4ICs9IHByb2Nlc3NlZDtcbiAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlZ2V4ICs9ICdcXFxcLyc7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByZWdleDtcbn1cbiJdfQ==