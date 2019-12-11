const SMP = require('./StateMachineParser');
const expInter = require('./ExpressionInterpreter');
const performance = require('performance-now');

let SM_NAME = "__SM__";
let SM_OBJECT_CONTEXT = "objectContext";

class SignalComp {

    constructor(expression, signals, id) {
        this._expression = expression; //it is a parsed expression
        this._signals = signals || [];
        this._id = id || "_"; //used to emit

        this._subscribers = [];

        //to support state machine
        this._originalExpression = expression; //conserving state machine process variables
        this._sms = SMP.getSMExp(expression).map(function (smexp) {
            return SMP.createFromExp(smexp);
        });
        this._expression = SMP.replaceSmexpWithSM(this._expression, this._sms, SM_NAME, SM_OBJECT_CONTEXT);
        //end of state machine support

        this._enableSignals();
        this._lastVal = undefined;
    }

    get id() {
        return this._id;
    }

    get value() {
        return this._value;
    }

    get expression() {
        return this._expression;
    }

    get timestamp() {
        return this._timestamp;
    }

    set id(id) {
        this._id = id;
    }

    _isInExpression(id) {
        let exp = this._originalExpression;
        let variables = exp.match(/[a-zA-Z][a-zA-Z0-9_+-]*/g);
        return variables.indexOf(id) >= 0;
    }

    addSignals(signals) {
        let thiz = this;
        signals.forEach(signal => thiz.addSignal(signal));
    }

    addSignal(signal) {
        //if prevents of reentrancy issues (A in A, A in B && B in A)
        if (this._isInExpression(signal.id)) {
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
        evalContext = this._addingStateMachine(evalContext);
        this._value = expInter(this._expression, evalContext);
        this._timestamp = performance();

        //console.log("\n------------");
        //console.log("EVALUATE:" + this._value + "--" + this._lastVal + " exp:"+this._originalExpression);
        if (this._value !== this._lastVal) {
            // console.log("UNA VEZ:" + this._value+ "--"+this._lastVal);
            this._lastVal = this._value;
            //    console.log("UNA VEZ (((2))):" + this._value+ "--"+this._lastVal);
            this._emit();
            //      console.log("LLEGO ACÁ:" + this._originalExpression);
        }

        return this._value;
    }

    _addingStateMachine(obj) {
        this._sms.forEach(function (sm, index) {
            obj[SM_NAME + index] = sm;
        });

        obj[SM_OBJECT_CONTEXT] = obj;
        return obj;
    };

    _prepareConditionContext() {
        this._signals.sort(function (sa, sb) {
            return sa.timestamp - sb.timestamp;
        });

        let obj = {}; //object context
        if (this._id !== "_") obj[this._id] = this.value;
        for (let i = 0; i < this._signals.length; ++i) {
            let signal = this._signals[i];
            obj[signal.id] = signal.value;
        }
        return obj;
    }
}

module.exports = SignalComp;