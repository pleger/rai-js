let logger = require('./libs/logger');
const inspector = require('object-inspect');

function evaluateCondition(obj, expresion) {
    let result;
    try {
        with (obj) {
            result = eval(expresion);
        }
    } catch (error) {
        if (error instanceof ReferenceError) {
            console.error("Some variables in Condition are undefined:", error);
            throw error;
        }
        else {
            throw error;
        }
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
            let thiz = this; // a patch to evaluate a condition with a context
            this.#signals[i].on(function () {
                thiz.evaluate.apply(thiz)
            });
        }
    }

    evaluate() {
        let evalContext = this.prepareConditionContext();
        return evaluateCondition(evalContext, this.#condition);
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