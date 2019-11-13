let logger = require('../libs/logger');
const performance = require('performance-now');

function _evaluateCondition(expresion, contextObj) {
    let result;
    try {
        with (contextObj) {
            result = eval(expresion);
        }
    } catch (error) {
        if (error instanceof ReferenceError) {
            return false; //return false when it is not possible to evaluate
        } else {
            throw error; //other error
        }
    }
    return result;
}

class SignalComp {

    constructor(expression, signals, id) {
        this._expression = expression; //todo: change to expression
        this._signals = signals ||  [];
        this._id = id || "_"; //used to emit

        this._subscribers = [];
        this._enableSignals();
        this.evaluate();
    }

    get id() {
        return this._id;
    }

    get value () {
        return this._value;
    }

    get timestamp() {
        return this._timestamp;
    }

    set id(id) {
        this._id = id;
    }

    _isInExpression(id) {
        let exp = this._expression;
        let variables = exp.match(/[a-zA-Z][a-zA-Z0-9_+-]*/g);
        return variables.indexOf(id) >= 0;
    }

    addSignal(signal) {
        if (this !== signal && !this._signals.includes(signal) && this._isInExpression(signal.id)) {
            this._signals.push(signal);
            this._enableSignal(signal);
        }
    }

    _enableSignal(signal) {
        let thiz = this; // a patch to evaluate a condition with a context
        signal.on(function () {
            return thiz.evaluate.apply(thiz);
        });

        return this.evaluate(); //evaluate the expression
    }

    _enableSignals() {
        for (let i = 0; i < this._signals.length; ++i) {
            this._enableSignal(this._signals[i]);
        }
    }

    on(subscriber) {
        this._subscribers.push(subscriber);
    }

    _emit() {
        let val = this._value;
        let id = this._id;
        this._subscribers.forEach(function (subscriber) {
            subscriber(val, id);
        });
    }

    evaluate() { //todo: maybe to get change name
        let evalContext = this._prepareConditionContext();
        this._value = _evaluateCondition(this._expression, evalContext);
        this._timestamp = performance(); //todo: I can simplify this implementation

        this._emit();

        return this._value;
    }

    _prepareConditionContext() {
        this._signals.sort(function (sa, sb) {
           return sa.timestamp - sb.timestamp;
        });

        let obj = {}; //object context
        for (let i = 0; i < this._signals.length; ++i) {
            let signal = this._signals[i];
            obj[signal.id] = signal.value;
        }
        return obj;
    }
}

module.exports = SignalComp;