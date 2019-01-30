export class $el {
    constructor(target) {
        this.targetEl = target;
    }

    static createSVG(tagName, attributes = {}) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        return new $el(svg).setAttributes(attributes);
    }

    setAttributes(attributes = {}) {
        Object.keys(attributes).forEach(attr =>
            this.targetEl.setAttribute(attr, attributes[attr])
        );
        return this;
    }

    animate(animate, stopPredicate = () => {}, onStop = () => {}) {
        this.animation = setInterval(()  => {
            if (stopPredicate(this.targetEl)) {
                this.stopAnimation();
                onStop(this.targetEl);
            }
            animate(this.targetEl);
        }, 10);
    }

    stopAnimation() {
        clearInterval(this.animation);
    }
}
