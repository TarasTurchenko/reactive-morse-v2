import {delay, filter, first, flatMap, map} from "rxjs/operators";
import {fromEvent, merge, of} from "rxjs";
import {KEYBOARD_EVENTS} from "../consts";

export function listenKeyboardEvent(event) {
    return fromEvent(document, event).pipe(map(() => KEYBOARD_EVENTS[event]));
}

export function getMorseEvent(action$, event) {
    return action$.pipe(filter(action => action.value === event));
}

export function timePeriod(firstSignal$, secondSignal$) {
    return firstSignal$.pipe(
        flatMap(firstSignal => secondSignal$.pipe(
            map(secondSignal => secondSignal.timestamp - firstSignal.timestamp),
            first()
        ))
    );
}

export function getWhitespace(whitespace$, timeout) {
    return flatMap(() => {
        const timeout$ = of(timeout).pipe(delay(timeout));
        return merge(whitespace$, timeout$).pipe(first());
    });
}
