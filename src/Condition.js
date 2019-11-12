let logger = require('../libs/logger');
const inspector = require('object-inspect');

function evaluateCondition(obj, expresion) {
    let result;
    try {
        with (obj) {
            result = eval(expresion);
        }
    } catch (error) {
        if (error instanceof ReferenceError) {
            return false;
        } else {
            throw error;
        }
    }
    return result;
}

class Condition {

    constructor(condition, signals) {
        this._condition = condition;
        //todo: in the final implementation, signals should be empty (only testing debugging)
        this._signals = signals !== undefined ? signals : [];
        this._callback = function () {return false};

        this.enableSignals();
    }

    //todo: this method should be for debugging!
    get signals() {
        return this._signals;
    }

    on(callback) {
        this._callback = callback;
        //this._callbacks.push(callback);
    }

    addSignal(signal) {
        this._signals.push(signal);
        this.enableSignal(signal);
    }

    enableSignal(signal) {
        let thiz = this; // a patch to evaluate a condition with a context
        signal.on(function () {
            return thiz.evaluate.apply(thiz);
        });

        return this.evaluate();
    }

    enableSignals() {
        for (let i = 0; i < this._signals.length; ++i) {
            this.enableSignal(this._signals[i]);
        }
    }

    evaluate() {
        let evalContext = this.prepareConditionContext();
        let result = evaluateCondition(evalContext, this._condition);
        
        this._callback(result);
        return result;
    }

    prepareConditionContext() {
        let obj = {}; //object context
        for (let i = 0; i < this._signals.length; ++i) {
            obj[this._signals[i].id] = this._signals[i].value; //todo: maybe to add different signals
        }
        return obj;
    }
}

module.exports = Condition;