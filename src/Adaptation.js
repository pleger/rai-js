let logger = require('../libs/logger');
let SignalComp = require('./SignalComp');

//todo: avoid write many times an empty function
let emptyFunction = function () {
};

class Adaptation {

    constructor(adap) {
        this._cond = adap.condition === undefined ?
            new SignalComp("false"): typeof(adap.condition) === "string"?
            new SignalComp(adap.condition): adap.condition; //it should be already a signal composition

        this._variation = adap.variation || emptyFunction;
        this._enter = adap.enter || emptyFunction;
        this._exit = adap.exit || emptyFunction;
        this._active = false;
        this._name = adap.name || "_";

        this.enableCondition();
    }

    set name(name) {
        this._name = name;
    }

    //todo: this method is only used for debugging
    get condition() {
        return this._cond;
    }

    enableCondition() {
        let thiz = this;
        this._cond.on(function (active) {
            if (active) {
                thiz._variation();
            }

            if (active !== thiz._active) {
                thiz._active = active;
                if (thiz._active) thiz._enter();
                else thiz._exit();
            }
            return thiz._active; //todo: Is it really necessary?
        });
    }

    isActive() { //todo: this may be used only for debugging
        return this._active;
    }

    //todo: check if this method is really used
    addSignal(signal) {
        this._cond.addSignal(signal);
    }
}

module.exports = Adaptation;


