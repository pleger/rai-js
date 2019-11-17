let logger = require('../libs/logger');
const SignalComp = require('./SignalComp');

//Just avoid write many times an empty function
let emptyFunction = function () {
};

class Adaptation {

    constructor(adap) {
        this._cond = adap.condition === undefined ?
            new SignalComp("false") : typeof (adap.condition) === "string" ?
                new SignalComp(adap.condition) : adap.condition; //it should be already a signal composition

        this._enter = adap.enter || emptyFunction;
        this._exit = adap.exit || emptyFunction;
        this._active = false;
        this._name = adap.name || "_";
        this.__original__ = adap;

        this._variations = [];
        this.enableCondition();
    }

    set name(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }

    //This method is only used for debugging
    get condition() {
        return this._cond;
    }

    addVariation(obj, methodName, variation, originalMethod) {
        this._variations.push([obj, methodName, variation, originalMethod]);
    }

    _installVariations() {
        this._variations.forEach(function (variation) {
            let obj = variation[0];
            let methodName = variation[1];
            let variationMethod = variation[2];
            let originalMethod = variation[3];

            obj[methodName] = function () {
                Adaptation.proceed = function () {
                    return originalMethod.apply(obj, arguments);
                };
                let result = variationMethod.apply(obj, arguments);
                Adaptation.proceed = undefined;
                return result;
            };
        });
    }

    _uninstallVariations() {
        this._variations.forEach(function (variation) {
            let obj = variation[0];
            let methodName = variation[1];
            let originalMethod = variation[3];
            obj[methodName] = originalMethod;
        });
    }

    enableCondition() {
        let thiz = this;
        this._cond.on(function (active) {
            if (active !== thiz._active) {
                thiz._active = active;
                if (thiz._active) {
                    thiz._enter();
                    thiz._installVariations();
                } else {
                    thiz._exit();
                    thiz._uninstallVariations();
                }
            }
        });
    }

    isActive() { //This may be used only for debugging
        return this._active;
    }

    addSignal(signal) {
        this._cond.addSignal(signal);
    }
}

module.exports = Adaptation;


