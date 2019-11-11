let logger = require('../libs/logger');

//todo: probably to remove this class!

function evaluate(obj, expresion) {
    let result;
    try {
        with (obj) {
            result = eval(expresion);
        }
    } catch (error) {
        if (error instanceof ReferenceError) {
            return undefined;
        } else {
            throw error;
        }
    }
    return result;
}


class CompositeSignal {

    constructor(expression, signals, val, sym) {
        this._expresion = expression;
        this._signals = signals !== undefined? signals: [];
        this._val = val;
        this._sym = sym !== undefined ? sym : "_";
        this.callbacks = [];

        this.enableSignals();
    }

    addSignal(signal) {
        this._signals.push(signal);
        this.enableSignal(signal);
    }

    on(callback) {
        this.callbacks.push(callback);
    }

    evaluate() {
        let sym = this._sym;
        let evalContext = this.prepareExpressionContext();
        this._val = evaluate(evalContext, this._expresion);

        this.callbacks.forEach(function (callback) {
            callback(sym);
        });

        return this._val; //todo: remove?
    }

    set id(sym) {
        this._sym = sym;
    }

    get value() {
        return this.evaluate();
    }

    get id() {
        return this._sym;
    }

    enableSignal(signal) {
        let thiz = this; // a patch to evaluate a condition with a context
        signal.on(function () {
            return thiz.evaluate.apply(thiz);
        });
    }

    enableSignals() {
        for (let i = 0; i < this._signals.length; ++i) {
            this.enableSignal(this._signals[i]);
        }
    }

    prepareExpressionContext() {
        let obj = {}; //object context
        for (let i = 0; i < this._signals.length; ++i) {
            obj[this._signals[i].id] = this._signals[i].value;
        }
        return obj;
    }
}

module.exports = CompositeSignal;