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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2R1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztNQVFNLGNBQWMsR0FBRyxrQkFBa0I7O01BQ25DLFVBQVUsR0FBRyxzQkFBc0I7Ozs7O0FBRXpDLE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxRQUFnQjs7VUFDMUMsT0FBTyxHQUFhLEVBQUU7O1FBRXhCLEtBQTJCO0lBQy9CLE9BQU8sQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUN2RCxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hCO0lBQ0QsT0FBTyxPQUFPO1NBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFOztjQUNMLEdBQUcsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNsQyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUNuRDs7WUFDRyxNQUFNLEdBQVcsQ0FBQztRQUN0QixRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNkLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsUUFBUSxDQUFDO2dCQUNsQixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLE1BQU0sR0FBRyxPQUFPLENBQUM7Z0JBQ2pCLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sTUFBTSxHQUFHLEtBQUssQ0FBQztnQkFDZixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2QsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsQ0FBQyxDQUFDO2dCQUNYLE1BQU07WUFDUjtnQkFDRSxNQUFNLElBQUksS0FBSyxDQUFDLDhCQUE4QixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsT0FBTyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0lBQ25DLENBQUMsQ0FBQztTQUNELE1BQU0sQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuY29uc3QgUEFSU0VfVE9fUEFJUlMgPSAvKFswLTldK1teMC05XSspL2c7XG5jb25zdCBQQUlSX1NQTElUID0gL14oWzAtOV0rKShbZGhtc3VdKykkLztcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRHVyYXRpb25Ub01zKGR1cmF0aW9uOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBtYXRjaGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGxldCBhcnJheTogUmVnRXhwRXhlY0FycmF5fG51bGw7XG4gIHdoaWxlICgoYXJyYXkgPSBQQVJTRV9UT19QQUlSUy5leGVjKGR1cmF0aW9uKSkgIT09IG51bGwpIHtcbiAgICBtYXRjaGVzLnB1c2goYXJyYXlbMF0pO1xuICB9XG4gIHJldHVybiBtYXRjaGVzXG4gICAgICAubWFwKG1hdGNoID0+IHtcbiAgICAgICAgY29uc3QgcmVzID0gUEFJUl9TUExJVC5leGVjKG1hdGNoKTtcbiAgICAgICAgaWYgKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm90IGEgdmFsaWQgZHVyYXRpb246ICR7bWF0Y2h9YCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZhY3RvcjogbnVtYmVyID0gMDtcbiAgICAgICAgc3dpdGNoIChyZXNbMl0pIHtcbiAgICAgICAgICBjYXNlICdkJzpcbiAgICAgICAgICAgIGZhY3RvciA9IDg2NDAwMDAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnaCc6XG4gICAgICAgICAgICBmYWN0b3IgPSAzNjAwMDAwO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnbSc6XG4gICAgICAgICAgICBmYWN0b3IgPSA2MDAwMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3MnOlxuICAgICAgICAgICAgZmFjdG9yID0gMTAwMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3UnOlxuICAgICAgICAgICAgZmFjdG9yID0gMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vdCBhIHZhbGlkIGR1cmF0aW9uIHVuaXQ6ICR7cmVzWzJdfWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZUludChyZXNbMV0pICogZmFjdG9yO1xuICAgICAgfSlcbiAgICAgIC5yZWR1Y2UoKHRvdGFsLCB2YWx1ZSkgPT4gdG90YWwgKyB2YWx1ZSwgMCk7XG59XG4iXX0=