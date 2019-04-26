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
const PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
/** @type {?} */
const PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
/**
 * @param {?} duration
 * @return {?}
 */
export function parseDurationToMs(duration) {
    /** @type {?} */
    const matches = [];
    /** @type {?} */
    let array;
    while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
        matches.push(array[0]);
    }
    return matches
        .map((/**
     * @param {?} match
     * @return {?}
     */
    match => {
        /** @type {?} */
        const res = PAIR_SPLIT.exec(match);
        if (res === null) {
            throw new Error(`Not a valid duration: ${match}`);
        }
        /** @type {?} */
        let factor = 0;
        switch (res[2]) {
            case 'd':
                factor = 86400000;
                break;
            case 'h':
                factor = 3600000;
                break;
            case 'm':
                factor = 60000;
                break;
            case 's':
                factor = 1000;
                break;
            case 'u':
                factor = 1;
                break;
            default:
                throw new Error(`Not a valid duration unit: ${res[2]}`);
        }
        return parseInt(res[1]) * factor;
    }))
        .reduce((/**
     * @param {?} total
     * @param {?} value
     * @return {?}
     */
    (total, value) => total + value), 0);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2R1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztNQVFNLGNBQWMsR0FBRyxrQkFBa0I7O01BQ25DLFVBQVUsR0FBRyxzQkFBc0I7Ozs7O0FBRXpDLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxRQUFnQjs7VUFDMUMsT0FBTyxHQUFhLEVBQUU7O1FBRXhCLEtBQTJCO0lBQy9CLE9BQU8sQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUN2RCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hCO0lBQ0QsT0FBTyxPQUFPO1NBQ1QsR0FBRzs7OztJQUFDLEtBQUssQ0FBQyxFQUFFOztjQUNMLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsQyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNuRDs7WUFDRyxNQUFNLEdBQVcsQ0FBQztRQUN0QixRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNkLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsUUFBUSxDQUFDO2dCQUNsQixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLE1BQU0sR0FBRyxPQUFPLENBQUM7Z0JBQ2pCLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDZixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2QsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNYLE1BQU07WUFDUjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ25DLENBQUMsRUFBQztTQUNELE1BQU07Ozs7O0lBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmNvbnN0IFBBUlNFX1RPX1BBSVJTID0gLyhbMC05XStbXjAtOV0rKS9nO1xuY29uc3QgUEFJUl9TUExJVCA9IC9eKFswLTldKykoW2RobXN1XSspJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUR1cmF0aW9uVG9NcyhkdXJhdGlvbjogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgbWF0Y2hlczogc3RyaW5nW10gPSBbXTtcblxuICBsZXQgYXJyYXk6IFJlZ0V4cEV4ZWNBcnJheXxudWxsO1xuICB3aGlsZSAoKGFycmF5ID0gUEFSU0VfVE9fUEFJUlMuZXhlYyhkdXJhdGlvbikpICE9PSBudWxsKSB7XG4gICAgbWF0Y2hlcy5wdXNoKGFycmF5WzBdKTtcbiAgfVxuICByZXR1cm4gbWF0Y2hlc1xuICAgICAgLm1hcChtYXRjaCA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFBBSVJfU1BMSVQuZXhlYyhtYXRjaCk7XG4gICAgICAgIGlmIChyZXMgPT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBhIHZhbGlkIGR1cmF0aW9uOiAke21hdGNofWApO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmYWN0b3I6IG51bWJlciA9IDA7XG4gICAgICAgIHN3aXRjaCAocmVzWzJdKSB7XG4gICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICBmYWN0b3IgPSA4NjQwMDAwMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2gnOlxuICAgICAgICAgICAgZmFjdG9yID0gMzYwMDAwMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgZmFjdG9yID0gNjAwMDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgIGZhY3RvciA9IDEwMDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgICAgIGZhY3RvciA9IDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgYSB2YWxpZCBkdXJhdGlvbiB1bml0OiAke3Jlc1syXX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQocmVzWzFdKSAqIGZhY3RvcjtcbiAgICAgIH0pXG4gICAgICAucmVkdWNlKCh0b3RhbCwgdmFsdWUpID0+IHRvdGFsICsgdmFsdWUsIDApO1xufVxuIl19