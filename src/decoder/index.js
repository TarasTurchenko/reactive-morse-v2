import {BehaviorSubject, merge} from 'rxjs';
import {SPAN} from '../consts';
import {translate} from './alpabet';
import {map, distinctUntilChanged, filter, timestamp, buffer, tap} from 'rxjs/operators';
import {getMorseEvent, getWhitespace, listenKeyboardEvent, timePeriod} from "./utils";

const action$ = merge(
    listenKeyboardEvent('keydown'),
    listenKeyboardEvent('keyup')
).pipe(
    distinctUntilChanged(),
    timestamp()
);

export const signalStart$ = getMorseEvent(action$, 'start');
export const signalEnd$ = getMorseEvent(action$, 'end');

const signal$ = timePeriod(signalStart$, signalEnd$).pipe(
    map(signalLength => signalLength <= SPAN.DOT ? '.' : '-')
);

const whitespace$ = timePeriod(signalEnd$, signalStart$);

const letterWhitespaces$ = signalEnd$.pipe(
    getWhitespace(whitespace$, SPAN.LETTER),
    filter(whitespace => whitespace >= SPAN.LETTER && whitespace < SPAN.WORD)
);

function ignoreEmptyArray() {
    return filter(array => array.length);
}

const letter$ = signal$.pipe(
    buffer(letterWhitespaces$),
    ignoreEmptyArray(),
    map(symbols => symbols.join('')),
    map(translate),
);

const wordWhitespaces$ = signalEnd$.pipe(
    getWhitespace(whitespace$, SPAN.WORD),
    filter(whitespace => whitespace >= SPAN.WORD)
);

const words$ = new BehaviorSubject([]);

export const word$ = letter$.pipe(
    buffer(wordWhitespaces$),
    ignoreEmptyArray(),
    map(letters => letters.join('')),
    tap(word => {
        const sentence = words$.value;
        words$.next(sentence.concat(word));
    })
);

export const sentence$ = words$.pipe(map(words => words.join(' ')));
