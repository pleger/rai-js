const SignalComp = require('./SignalComp');

//Just avoid writing many times an empty function
let emptyFunction = function () {
};

function getCallStack() {
    let stack = [];
    let caller = getCallStack.caller;

    while (caller !== null) {
        stack.push(caller.name);
        //console.log("f:"+caller);
        caller = caller.caller;
        //console.log("f_DESPUES:"+caller);
    }
    return stack;
}

function filterScope(f) {
    //console.log("FFF1:"+filterScope.caller);
    //console.log("FFF2:"+arguments.callee.caller);
    let stack = getCallStack();
    //console.trace();
    console.log(stack);
    return stack.some(funName => f(funName));
}


function Layer(adap) {

    /*constructor(adap) {
        this._cond = adap.condition === undefined ?
            new SignalComp("false") : typeof (adap.condition) === "string" ?
                new SignalComp(adap.condition) : adap.condition; //it should be already a signal composition

        this._enter = adap.enter || emptyFunction;
        this._exit = adap.exit || emptyFunction;
        this._active = false;
        this._name = adap.name || "_";
        this._scope = adap.scope || false;
        this.__original__ = adap;

        this._variations = [];
        this.enableCondition();
    //}*/

    Object.defineProperty(this,'name', {
        set: function(name) {
            this._name = name;
        },
        get: function() {
            return this._name;
        }
    });

    Object.defineProperty(this,'condition', {
        get: function() {
            return this._cond;
        }
    });
/*
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
 */

    this.cleanCondition = function() { //this method is reused when you re-init the condition
        this._cond = new SignalComp(this._cond.expression);
    };

    this.addVariation = function(obj, methodName, variation, originalMethod) {
        this._variations.push([obj, methodName, variation, originalMethod]);
    };

    this._installVariations = function() {
        let thiz = this;
        this._variations.forEach(function (variation) {
            let obj = variation[0];
            let methodName = variation[1];
            let variationMethod = variation[2];
            let originalMethod = variation[3];

            obj[methodName] = function () {
                Layer.proceed = function () {
                    return originalMethod.apply(obj, arguments);
                };

                //magic!!!!
                Object.defineProperty(arguments.callee,"name",{get:function() {return methodName;}});

                let result;
                //console.log(["MOSTRANDO STACK", getCallStack()]);
                if (typeof(thiz._scope) === "function" && !filterScope(thiz._scope)) {
                    result = originalMethod.apply(obj, arguments);
                } else {
                    result = variationMethod.apply(obj, arguments);
                }

                Layer.proceed = undefined;
                return result;
            };
        });
    };

    this._uninstallVariations = function() {
        this._variations.forEach(function (variation) {
            let obj = variation[0];
            let methodName = variation[1];
            let originalMethod = variation[3];
            obj[methodName] = originalMethod;
        });
    };

    this.enableCondition = function() { //todo: when a condition is added, Should it check its predicate?
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
    };

    this.isActive = function() { //This may be used only for debugging
        return this._active;
    };

    this.addSignal = function(signal) {
        this._cond.addSignal(signal);
    };

    this._cond = adap.condition === undefined ?
        new SignalComp("false") : typeof (adap.condition) === "string" ?
            new SignalComp(adap.condition) : adap.condition; //it should be already a signal composition

    this._enter = adap.enter || emptyFunction;
    this._exit = adap.exit || emptyFunction;
    this._active = false;
    this._name = adap.name || "_";
    this._scope = adap.scope || false;
    this.__original__ = adap;

    this._variations = [];
    this.enableCondition();
    //}
}

module.exports = Layer;


