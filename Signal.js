let logger = require('./libs/logger');

class Signal {
    #sym; //string
    #value;  //value

    #callbacks;

    constructor(sym, initialValue) {
        this.#sym = sym;
        this.#value = initialValue;

        this.#callbacks = [];
    }

    /*
    _on(callback) {
        this.#s.on(this.#signal, callback);
    }
    */


    on(callback) {
        this.#callbacks.push(callback);
    }

    /*
    set _value(val) {
        this.#value = val;
        this.#s.emit(this.#signal, val);
    }
     */

    set value(val) {
        this.#value = val;
        let sym = this.#sym;
        this.#callbacks.forEach(function(callback) {
            callback(sym);
        });
    }

    get value() {
        return this.#value;
    }

    get id() {
        return this.#sym;
    }
}

module.exports = Signal;