let logger = require('../libs/logger');
let Adaptation = require('./Adaptation');

class COPR {

    constructor() {
        if (!COPR.instance) {
            COPR.instance = this;
            this.init();
        }
        return COPR.instance;
    }

    init() {
        this._adaptationsPool = [];
    }

    deploy(adap) {
        adap.name = adap.name || "Context " + this._adaptationsPool.length + 1;
        this._adaptationsPool.push(adap);
    }

    exhibit(signalInterface, object) {
        object._signalInteface = signalInterface;

        for (let field in signalInterface) {
            if (signalInterface.hasOwnProperty(field)) {
                signalInterface[field].id = field;

                this._adaptationsPool.forEach(function (adap) {
                    adap.addSignal(signalInterface[field]);
                });
            }
        }
    }
}

module.exports = new COPR();