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
        this._adaptationsPool = []; //only adaptations
        this._signalInterfacePool = []; //objects x interface-object
        this._variations = []; //adap x object x methodName x variations
        this._originalMethods = []; //object x name x original_method
    }

    deploy(adap) {
        adap = new Adaptation(adap);
        adap._name = adap._name !== "_" ? adap._name : "Adaptation_" + (this._adaptationsPool.length + 1);

        this._adaptationsPool.push(adap);
        this._addSavedLayers(adap);

        //it is to know if signals are already send data
        this._receiveSignalsForSignalInterfaces(adap);
    }

    undeploy(originalAdap) {
        this._uninstallVariations(originalAdap);
        this._adaptationsPool = this._adaptationsPool.filter(function (adap) {
            return adap.__original__ !== originalAdap;
        });
        this._removingLayers(originalAdap);
    }

    _addSavedLayers(adap) {
        let variations = this._variations.filter(function (variation) {
            return adap.__original__ === variation[0];
        });
        var thiz = this;
        variations.forEach(function (variation) {
            let obj = variation[1];
            let methodName = variation[2];
            let variationMethod = variation[3];

            thiz._addOriginalMethod(obj, methodName);
            let originalMethod = thiz._getOriginalMethod(obj, methodName);
            adap.addVariation(obj, methodName, variationMethod, originalMethod);
        });
    }

    _uninstallVariations(originalAdap) {
        this._adaptationsPool.forEach(function (adap) {
            if (adap.__original__ === originalAdap) {
                adap._uninstallVariations();
            }
        });
    }

    _removingLayers(originalAdap) {
        this._variations = this._variations.filter(function (variation) {
            return originalAdap !== variation[0];
        });
    }

    exhibit(objects, signalInterface) {
        objects = !Array.isArray(objects) ? [objects] : objects.length === 0 ? [{}] : objects;

        let thiz = this;
        objects.forEach(function (object) {
            thiz._addSignalInterface(object, signalInterface);
        });

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

    _addOriginalMethod(obj, methodName) {
        let originalMethod = this._getOriginalMethod(obj, methodName);

        if (originalMethod === undefined) {
            this._originalMethods.push([obj, methodName, obj[methodName]]);
        }
    }

    _getOriginalMethod(obj, methodName) {
        let found = this._originalMethods.find(function (tuple) {
            return obj === tuple[0] && methodName === tuple[1];
        });

        return found === undefined? undefined: found[2];
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