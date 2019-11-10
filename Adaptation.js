let logger = require('./libs/logger');

class Adaptation {
    #condition;
    #adaptation;
    #options;

    constructor(condition, adaptation, options) {
        if (adaptation === undefined) {
            ({condition: condition, adaptation, options} = condition);
        }
        this.init(condition, adaptation, options);
    }

    init(condition, adaptation, options) {
        this.#condition = condition;
        this.#adaptation = adaptation;
        this.#options = options;
    }
}

module.exports = Adaptation;


