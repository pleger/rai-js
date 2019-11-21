const expInter = require('./ExpressionInterpreter');
const performance = require('performance-now');

class NO_STATE_MACHINE_SignalComp {

    constructor(expression, signals, id) {
        this._expression = expression;
        this._signals = signals ||  [];
        this._id = id || "_"; //used to emit

        this._subscribers = [];
        this._enableSignals();
        this._lastVal = undefined;
    }

    get id() {
        return this._id;
    }

    get value () {
        return this._value;
    }

    get expression () {
        return this._expression;
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
        //if prevents of reentrancy issues (A in A, A in [A], A in B && B in A)
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

    evaluate() { //this method replaces set value
        let evalContext = this._prepareConditionContext();
        this._value = expInter(this._expression, evalContext);
        this._timestamp = performance();

        if (this._value !== this._lastVal) {
            this._emit();
            this._lastVal = this._value;
        }

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

module.exports = NO_STATE_MACHINE_SignalComp;