let logger = require('../libs/logger');
const performance = require('performance-now');

class Signal {

    constructor(initialValue, id) {
        //todo: Always signal should start with id '_'?
        this._id = id || "_";
        this._subcribers = [];

        this.value = initialValue;
    }

    get value() {
        return this._val;
    }

    get id() {
        return this._id;
    }

    get timestamp() {
        return this._timestamp;
    }

    set id(id) { //id to emit
        this._id = id;
    }

    set value(val) {
        this._val = val;
        this._timestamp = performance(); //todo: I can simplify this implementation
        this._emit();
    }

    on(subscriber) {
        this._subcribers.push(subscriber);
    }

    _emit() {
        let val = this._val;
        let id = this._id;
        this._subcribers.forEach(function (subscriber) {
            subscriber(val, id);
        });
    }
}

module.exports = Signal;