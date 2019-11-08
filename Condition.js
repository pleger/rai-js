let logger = require('./libs/logger');
const inspector = require('object-inspect');

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

            let thiz = this;
            s.on(sym, function() {thiz.evaluate.apply(thiz)});
        }
    }

    evaluate() {
        logger.debug("Starting condition evaluation");

        let evalContext = this.prepareCondition();
        logger.debug("Object EVAL:" + inspector(evalContext));
        let b = eval.call(evalContext, this.#condition);
        //let b = this.#condition.eval.call(evalContext);
        logger.debug("Condition (%s): %s", this.#condition, b);

        return b;
    }

    prepareCondition() {
        let obj = {};
        for (let i = 0; i < this.#signals.length; ++i) {
            logger.debug(this.#signals[i].id + " " + this.#signals[i].value);
            obj[this.#signals[i].id] = this.#signals[i].value;
        }
        return obj;
    }
}

module.exports = Condition;