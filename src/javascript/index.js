import {signalEnd$, signalStart$, word$, sentence$} from './decoder';
import {$el} from './elements';
import {DEFAULT_SIGNAL_ATTRIBUTES} from './consts';

const signalsEl = document.querySelector('[data-morse-signals]');
let $activeSignal;

signalStart$.subscribe(() => {
    $activeSignal = $el.createSVG('rect', DEFAULT_SIGNAL_ATTRIBUTES);
    signalsEl.appendChild($activeSignal.targetEl);
    $activeSignal.animate(el => el.targetEl.width.baseVal.value++);
});

signalEnd$.subscribe(() => {
    if ($activeSignal) {
        $activeSignal.stopAnimation();
        $activeSignal.animate(
            el => el.targetEl.x.baseVal.value++,
            el => el.targetEl.x.baseVal.value > signalsEl.clientWidth,
            el => el.targetEl.remove());
        $activeSignal = null;
    }
});

const wordEl = document.querySelector('[data-word]');
word$.subscribe(word => wordEl.innerText = word);

const sentenceEl = document.querySelector('[data-sentence]');
sentence$.subscribe(sentence => sentenceEl.innerText = sentence);
