let logger = require('../libs/logger');

class Adaptation {

    constructor(cond, adaptation, options) {
        if (adaptation === undefined) {
            ({condition: cond, adaptation, options} = cond);
        }
        this.init(cond, adaptation, options);
    }

    init(condition, adaptation, options) {
        this._cond = condition;
        this._adaptation = adaptation;
        this._options = options !== undefined? options: {};
        this._active = false;

        this.enableCondition();
    }

    enableCondition() {
        let thiz = this;
        this._cond.on(function (active) {
            return thiz._active = active;
        });
    }

    get condition() {
        return this._cond;
    }

    isActive() {
        return this._active;
    }
}

module.exports = Adaptation;


