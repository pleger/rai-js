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

    getAdaps(filter) {
        filter = filter || function () {
            return true;
        };
        return this._adaptationsPool.filter(filter);
    }

    getActiveAdaps() {
        return this.getAdaps(function (adaptation) {
            return adaptation.isActive()
        })
    };

    getInactiveAdaps() {
        return this.getAdaps(function (adaptation) {
            return !adaptation.isActive()
        })
    };


    deploy(adap) {
        adap = new Adaptation(adap);
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