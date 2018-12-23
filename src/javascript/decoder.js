import {BehaviorSubject, fromEvent, merge, of} from 'rxjs';
import {KEYBOARD_EVENTS, SPAN} from './consts';
import {parseMorseCode} from './alpabet';
import {
    map,
    distinctUntilChanged,
    filter,
    flatMap,
    timestamp,
    first,
    delay,
    buffer,
    takeUntil, tap
} from 'rxjs/operators';

function listenKeyboardEvent(event) {
    return fromEvent(document, event).pipe(map(() => KEYBOARD_EVENTS[event]));
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

export const signalStart$ = getMorseEvent('start');
export const signalEnd$ = getMorseEvent('end');

const signal$ = signalStart$
    .pipe(flatMap(start => signalEnd$
        .pipe(
            map(end => end.timestamp - start.timestamp),
            first(),
            map(signalLength => signalLength <= SPAN.DOT ? '.' : '-')
        )
    ));

const whitespace$ = signalEnd$
    .pipe(flatMap(end => {
        const timeout = of(SPAN.LETTER).pipe(delay(SPAN.LETTER));
        const whitespace = signalEnd$.pipe(
            map(start => start.timestamp - end.timestamp),
            first()
        );
        return merge(whitespace, timeout).pipe(first());
    }));

const letterWhitespaces$ = whitespace$.pipe(
    filter(whitespace => whitespace >= SPAN.LETTER && whitespace < SPAN.WORD)
);

const letter$ = signal$.pipe(
    buffer(letterWhitespaces$),
    map(symbols => symbols.join('')),
    map(parseMorseCode)
);

const wordWhitespaces$ = letterWhitespaces$
    .pipe(flatMap(whitespace => {
        const ms = SPAN.WORD - whitespace;
        return of(ms).pipe(
            delay(ms),
            first(),
            takeUntil(signalStart$)
        );
    }));

const words$ = new BehaviorSubject([]);

export const word$ = letter$.pipe(
    buffer(wordWhitespaces$),
    map(letters => letters.join('')),
    tap(word => {
        const sentence = words$.value;
        words$.next(sentence.concat(word));
    })
);

export const sentence$ = words$.pipe(
    map(words => words.join(' '))
);
