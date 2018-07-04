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
const WILD_SINGLE = '[^\\/]*';
/** @type {?} */
const WILD_OPEN = '(?:.+\\/)?';
/** @type {?} */
const TO_ESCAPE = [
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
            const processed = TO_ESCAPE.reduce((segment, escape) => segment.replace(escape.replace, escape.with), segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NvbmZpZy9zcmMvZ2xvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFRQSxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUM7O0FBQzlCLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQzs7QUFFL0IsTUFBTSxTQUFTLEdBQUc7SUFDaEIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7Q0FDcEMsQ0FBQzs7Ozs7QUFFRixNQUFNLHNCQUFzQixJQUFZOztJQUN0QyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDOztJQUMzQyxJQUFJLEtBQUssR0FBVyxFQUFFLENBQUM7SUFDdkIsT0FBTyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7UUFDMUIsTUFBTSxPQUFPLHNCQUFHLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRztRQUNqQyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7WUFDcEIsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdkIsS0FBSyxJQUFJLFNBQVMsQ0FBQzthQUNwQjtpQkFBTTtnQkFDTCxLQUFLLElBQUksSUFBSSxDQUFDO2FBQ2Y7U0FDRjthQUFNOztZQUNMLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQzlCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNoRixLQUFLLElBQUksU0FBUyxDQUFDO1lBQ25CLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZCLEtBQUssSUFBSSxLQUFLLENBQUM7YUFDaEI7U0FDRjtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7Q0FDZCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuY29uc3QgV0lMRF9TSU5HTEUgPSAnW15cXFxcL10qJztcbmNvbnN0IFdJTERfT1BFTiA9ICcoPzouK1xcXFwvKT8nO1xuXG5jb25zdCBUT19FU0NBUEUgPSBbXG4gIHtyZXBsYWNlOiAvXFwuL2csIHdpdGg6ICdcXFxcLid9LFxuICB7cmVwbGFjZTogL1xcPy9nLCB3aXRoOiAnXFxcXD8nfSxcbiAge3JlcGxhY2U6IC9cXCsvZywgd2l0aDogJ1xcXFwrJ30sXG4gIHtyZXBsYWNlOiAvXFwqL2csIHdpdGg6IFdJTERfU0lOR0xFfSxcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBnbG9iVG9SZWdleChnbG9iOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBzZWdtZW50cyA9IGdsb2Iuc3BsaXQoJy8nKS5yZXZlcnNlKCk7XG4gIGxldCByZWdleDogc3RyaW5nID0gJyc7XG4gIHdoaWxlIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgY29uc3Qgc2VnbWVudCA9IHNlZ21lbnRzLnBvcCgpICE7XG4gICAgaWYgKHNlZ21lbnQgPT09ICcqKicpIHtcbiAgICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJlZ2V4ICs9IFdJTERfT1BFTjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZ2V4ICs9ICcuKic7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHByb2Nlc3NlZCA9IFRPX0VTQ0FQRS5yZWR1Y2UoXG4gICAgICAgICAgKHNlZ21lbnQsIGVzY2FwZSkgPT4gc2VnbWVudC5yZXBsYWNlKGVzY2FwZS5yZXBsYWNlLCBlc2NhcGUud2l0aCksIHNlZ21lbnQpO1xuICAgICAgcmVnZXggKz0gcHJvY2Vzc2VkO1xuICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVnZXggKz0gJ1xcXFwvJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlZ2V4O1xufVxuIl19