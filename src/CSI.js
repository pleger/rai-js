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
        this._variations = [];
    }

    deploy(adap) {
        adap = new Adaptation(adap);
        adap.name = adap.name || "Adaptation_" + (this._adaptationsPool.length + 1);

        this._adaptationsPool.push(adap);
        this._receiveSignalsForSignalInterfaces(adap);
        this._addSavedLayers(adap);
    }

    undeploy(originalAdap) { //todo test!
        this._adaptationsPool = this._adaptationsPool.filter(function (adap) {
            return adap.__original__ !== originalAdap;
        });
    }

    _addSavedLayers(adap) {
        let variations = this._variations.filter(function (variation) {
            return adap.__original__ === variation[0];
        });

        console.log(variations.length);

        variations.forEach(function (variation) {
            adap.addVariation(variation[1], variation[2], variation[3]);
        });

        //removing added layers
        this._variations = this._variations.filter(function (variation) {
            return adap.__original__ !== variation[0];
        });
    }

    exhibit(object, signalInterface) {
        this._addSignalInterface(object, signalInterface);
        this._addIdSignal(signalInterface);
        this._exhibitAnInterface(signalInterface);
    }

    addLayer(adap, obj, methodName, variation) {
        this._variations.push([adap, obj, methodName, variation]);
    }

    _receiveSignalsForSignalInterfaces(adap) {
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
}

module.exports = new CSI();