import {fromEvent, merge} from 'rxjs';
import {map, distinctUntilChanged, filter, flatMap, timestamp, first} from 'rxjs/operators';

const keyboardEvents = {
    keydown: 'start',
    keyup: 'end'
};

function listenKeyboardEvent(event) {
    return fromEvent(document, event).pipe(map(() => keyboardEvents[event]));
}

const morseAction$ = merge(
    listenKeyboardEvent('keydown'),
    listenKeyboardEvent('keyup')
).pipe(
    distinctUntilChanged(),
    timestamp()
);

function getMorseEvent(event) {
    return morseAction$.pipe(filter(action => action.value === event));
}

const signalStart$ = getMorseEvent('start');
const signalEnd$ = getMorseEvent('end');

function getDistanceBetweenActions(firstAction$, secondAction$) {
    return firstAction$.pipe(
        flatMap(firstAction => secondAction$
            .pipe(
                map(secondAction => secondAction.timestamp - firstAction.timestamp),
                first()
            )
        )
    );
}

const signal$ = getDistanceBetweenActions(signalStart$, signalEnd$);
const whitespace$ = getDistanceBetweenActions(signalEnd$, signalStart$);
