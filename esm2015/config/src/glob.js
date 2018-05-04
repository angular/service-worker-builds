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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NvbmZpZy9zcmMvZ2xvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLHVCQUFNLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFDOUIsdUJBQU0sU0FBUyxHQUFHLFlBQVksQ0FBQztBQUUvQix1QkFBTSxTQUFTLEdBQUc7SUFDaEIsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7SUFDN0IsRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUM7Q0FDcEMsQ0FBQzs7Ozs7QUFFRixNQUFNLHNCQUFzQixJQUFZO0lBQ3RDLHVCQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzNDLHFCQUFJLEtBQUssR0FBVyxFQUFFLENBQUM7SUFDdkIsT0FBTyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzNCLHVCQUFNLE9BQU8sc0JBQUcsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixLQUFLLElBQUksU0FBUyxDQUFDO2FBQ3BCO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sS0FBSyxJQUFJLElBQUksQ0FBQzthQUNmO1NBQ0Y7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLHVCQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUM5QixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEYsS0FBSyxJQUFJLFNBQVMsQ0FBQztZQUNuQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLEtBQUssSUFBSSxLQUFLLENBQUM7YUFDaEI7U0FDRjtLQUNGO0lBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztDQUNkIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jb25zdCBXSUxEX1NJTkdMRSA9ICdbXlxcXFwvXSonO1xuY29uc3QgV0lMRF9PUEVOID0gJyg/Oi4rXFxcXC8pPyc7XG5cbmNvbnN0IFRPX0VTQ0FQRSA9IFtcbiAge3JlcGxhY2U6IC9cXC4vZywgd2l0aDogJ1xcXFwuJ30sXG4gIHtyZXBsYWNlOiAvXFw/L2csIHdpdGg6ICdcXFxcPyd9LFxuICB7cmVwbGFjZTogL1xcKy9nLCB3aXRoOiAnXFxcXCsnfSxcbiAge3JlcGxhY2U6IC9cXCovZywgd2l0aDogV0lMRF9TSU5HTEV9LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdsb2JUb1JlZ2V4KGdsb2I6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHNlZ21lbnRzID0gZ2xvYi5zcGxpdCgnLycpLnJldmVyc2UoKTtcbiAgbGV0IHJlZ2V4OiBzdHJpbmcgPSAnJztcbiAgd2hpbGUgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBzZWdtZW50ID0gc2VnbWVudHMucG9wKCkgITtcbiAgICBpZiAoc2VnbWVudCA9PT0gJyoqJykge1xuICAgICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVnZXggKz0gV0lMRF9PUEVOO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVnZXggKz0gJy4qJztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgcHJvY2Vzc2VkID0gVE9fRVNDQVBFLnJlZHVjZShcbiAgICAgICAgICAoc2VnbWVudCwgZXNjYXBlKSA9PiBzZWdtZW50LnJlcGxhY2UoZXNjYXBlLnJlcGxhY2UsIGVzY2FwZS53aXRoKSwgc2VnbWVudCk7XG4gICAgICByZWdleCArPSBwcm9jZXNzZWQ7XG4gICAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICByZWdleCArPSAnXFxcXC8nO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcmVnZXg7XG59XG4iXX0=