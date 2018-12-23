export class $el {
    constructor(target) {
        if (typeof target === 'string') {
            this.targetEl = document.querySelector(target);
            return;
        }
        this.targetEl = target;
    }

    static createSVG(tagName, attributes = {}) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        const $svg = new $el(svg);
        return $svg.setAttributes(attributes);
    }

    setAttributes(attributes = {}) {
        Object.keys(attributes).forEach(attr => this.targetEl.setAttribute(attr, attributes[attr]));
        return this;
    }

    animate(animate, stopPredicate = () => {}, onStop = () => {}) {
        this.animation = setInterval(()  => {
            if (stopPredicate(this)) {
                this.stopAnimation();
                onStop(this);
            }
            animate(this);
        }, 10);
    }

    stopAnimation() {
        clearInterval(this.animation);
    }
}