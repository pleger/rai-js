let logger = require('../libs/logger');
let Condition = require('../src/Condition');

var emptyFunction = function () {
};


class Adaptation {

    constructor(adap) {
        this._cond = adap.condition === undefined ? "false" :
            adap.condition.constructor.name === "Condition" ? adap.condition : //todo: this for debugging!
                new Condition(adap.condition);
        this._adaptation = adap.adaptation || emptyFunction;
        this._enter = adap.enter || emptyFunction;
        this._exit = adap.exit || emptyFunction;
        this._active = false;

        this.enableCondition();
    }

    //todo: this method is only used for debugging
    get condition() {
        return this._cond;
    }

    enableCondition() {
        let thiz = this;
        this._cond.on(function (active) {
            thiz._active = active;
            return thiz._active;
        });
    }

    isActive() {
        return this._active;
    }

    //todo: check if this method is really used
    addSignal(signal) {
        this._cond.addSignal(signal);
    }
}

module.exports = Adaptation;


