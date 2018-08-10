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
        .map(match => {
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
    })
        .reduce((total, value) => total + value, 0);
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2R1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQVFBLE1BQU0sY0FBYyxHQUFHLGtCQUFrQixDQUFDOztBQUMxQyxNQUFNLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQzs7Ozs7QUFFMUMsTUFBTSw0QkFBNEIsUUFBZ0I7O0lBQ2hELE1BQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQzs7SUFFN0IsSUFBSSxLQUFLLENBQXVCO0lBQ2hDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUN2RCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hCO0lBQ0QsT0FBTyxPQUFPO1NBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFOztRQUNYLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkMsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1lBQ2hCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDbkQ7O1FBQ0QsSUFBSSxNQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2QsS0FBSyxHQUFHO2dCQUNOLE1BQU0sR0FBRyxRQUFRLENBQUM7Z0JBQ2xCLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sTUFBTSxHQUFHLE9BQU8sQ0FBQztnQkFDakIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUNmLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDZCxNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLE1BQU0sR0FBRyxDQUFDLENBQUM7Z0JBQ1gsTUFBTTtZQUNSO2dCQUNFLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDM0Q7UUFDRCxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7S0FDbEMsQ0FBQztTQUNELE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDakQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmNvbnN0IFBBUlNFX1RPX1BBSVJTID0gLyhbMC05XStbXjAtOV0rKS9nO1xuY29uc3QgUEFJUl9TUExJVCA9IC9eKFswLTldKykoW2RobXN1XSspJC87XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUR1cmF0aW9uVG9NcyhkdXJhdGlvbjogc3RyaW5nKTogbnVtYmVyIHtcbiAgY29uc3QgbWF0Y2hlczogc3RyaW5nW10gPSBbXTtcblxuICBsZXQgYXJyYXk6IFJlZ0V4cEV4ZWNBcnJheXxudWxsO1xuICB3aGlsZSAoKGFycmF5ID0gUEFSU0VfVE9fUEFJUlMuZXhlYyhkdXJhdGlvbikpICE9PSBudWxsKSB7XG4gICAgbWF0Y2hlcy5wdXNoKGFycmF5WzBdKTtcbiAgfVxuICByZXR1cm4gbWF0Y2hlc1xuICAgICAgLm1hcChtYXRjaCA9PiB7XG4gICAgICAgIGNvbnN0IHJlcyA9IFBBSVJfU1BMSVQuZXhlYyhtYXRjaCk7XG4gICAgICAgIGlmIChyZXMgPT09IG51bGwpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBhIHZhbGlkIGR1cmF0aW9uOiAke21hdGNofWApO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmYWN0b3I6IG51bWJlciA9IDA7XG4gICAgICAgIHN3aXRjaCAocmVzWzJdKSB7XG4gICAgICAgICAgY2FzZSAnZCc6XG4gICAgICAgICAgICBmYWN0b3IgPSA4NjQwMDAwMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2gnOlxuICAgICAgICAgICAgZmFjdG9yID0gMzYwMDAwMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ20nOlxuICAgICAgICAgICAgZmFjdG9yID0gNjAwMDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdzJzpcbiAgICAgICAgICAgIGZhY3RvciA9IDEwMDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgICAgIGZhY3RvciA9IDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBOb3QgYSB2YWxpZCBkdXJhdGlvbiB1bml0OiAke3Jlc1syXX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGFyc2VJbnQocmVzWzFdKSAqIGZhY3RvcjtcbiAgICAgIH0pXG4gICAgICAucmVkdWNlKCh0b3RhbCwgdmFsdWUpID0+IHRvdGFsICsgdmFsdWUsIDApO1xufVxuIl19