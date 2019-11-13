let logger = require('../libs/logger');
let Adaptation = require('./Adaptation');

class CSI {

    constructor() {
        if (!CSI.instance) {
            CSI.instance = this;
            this.init();
        }
        return CSI.instance;
    }

    init() {
        this._adaptationsPool = [];
        this._signalInterfacePool = [];
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
        adap.name = adap.name || "Adaptation_" + (this._adaptationsPool.length + 1);

        this._adaptationsPool.push(adap);
        this._receiveSignalForSignalInterface(adap);
    }

    exhibit(object, signalInterface) {
        this._addSignalInterface(object, signalInterface);
        this._addIdSignal(signalInterface);
        this._exhibitAnInterface(signalInterface);
    }

    _receiveSignalForSignalInterface(adap) {
        this._signalInterfacePool.forEach(function (si) {
            for (let field in si[1]) {
                if (si[1].hasOwnProperty(field)) {
                    adap.addSignal(si[1][field]);
                }
            }
        });
    }

    _addSignalInterface(object, signalInterface) {
        this._signalInterfacePool.push([object, signalInterface]);
    }

    _addIdSignal(signalInterface) {
        for (let field in signalInterface) {
            if (signalInterface.hasOwnProperty(field)) {
                signalInterface[field].id = field;
            }
        }
    }

    _exhibitAnInterface(signalInterface) {
        for (let field in signalInterface) {
            if (signalInterface.hasOwnProperty(field)) {

                this._adaptationsPool.forEach(function (adap) {
                    adap.addSignal(signalInterface[field]);
                });
            }
        }
    }
}

module.exports = new CSI();