let logger = require('./libs/logger');
const inspector = require('object-inspect');

function evaluateCondition(obj, expresion) {
    let result;
    with (obj) {
        result = eval(expresion);
    }
    return result;
}


class Condition {
    #signals;

    #condition; //for now, a string

    constructor(signals, condition) {
        this.#signals = signals;
        this.#condition = condition;

        this.enableSignals();
    }

    enableSignals() {

        for (let i = 0; i < this.#signals.length; ++i) {
            logger.debug("THIS:" + inspector(this.#signals[i]));
            let s = this.#signals[i].getS();
            let sym = this.#signals[i].id;

            let thiz = this; // a patch to evaluate a condition with a context
            s.on(sym, function() {thiz.evaluate.apply(thiz)});
        }
    }

    evaluate() {
        let evalContext = this.prepareConditionContext();
        let b = evaluateCondition(evalContext, this.#condition);
        logger.debug("Condition (%s): %s", this.#condition, b);

        return b;
    }

    prepareConditionContext() {
        let obj = {}; //object context
        for (let i = 0; i < this.#signals.length; ++i) {
            logger.debug(this.#signals[i].id + " " + this.#signals[i].value);
            obj[this.#signals[i].id] = this.#signals[i].value;
        }
        return obj;
    }
}

module.exports = Condition;