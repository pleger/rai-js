let logger = require('../libs/logger');
let Condition = require('../src/Condition');

let emptyFunction = function () {
};


class Adaptation {

    constructor(adap) {
        this._cond = adap.condition === undefined ? "false" :
            typeof(adap.condition) === "string"?  new Condition(adap.condition):
            adap.condition; //todo: this for debugging! (condition is already created)

        this._variation = adap.variation || emptyFunction;
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


