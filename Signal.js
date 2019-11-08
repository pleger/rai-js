let logger = require('./libs/logger');
const signalrt = require('signal-js');

class Signal {
    #s;

    #signal; //string
    #value;  //value

    constructor(signal) {
        this.#signal = signal;
        this.#s = new signalrt.default();
    }

    set value(val) {
        this.#value = val;
        this.#s.emit(this.#signal,val);
    }

    get value() {
        return this.#value;
    }

    getS() {
        return this.#s;
    }

    get id() {
        return this.#signal;
    }
}

module.exports = Signal;