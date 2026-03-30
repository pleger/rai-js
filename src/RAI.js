let Layer = require('./Layer');

class RAI {

    constructor() {
        if (!RAI.instance) {
            RAI.instance = this;
            this.init();
        }
        return RAI.instance;
    }

    init() {
        this._layers = []; //only layers
        this._signalInterfacePool = []; //objects x interface-object
        this._variations = []; //originalLayer x object x methodName x variation
        this._originalMethods = []; //object x name x original_method
    }

    deploy(originalLayer) {
        let layer = new Layer(originalLayer);
        layer._name = layer._name !== "_" ? layer._name : "Layer_" + (this._layers.length + 1);

        this._layers.push(layer);
        this._addSavedLayers(layer);

        //it is to know if signals are already send data
        this._receiveSignalsForSignalInterfaces(layer);
    }

    undeploy(originalLayer) {
        this._uninstallVariations(originalLayer);
        this._cleanSignalComposition(originalLayer);

        this._layers = this._layers.filter(function (layer) {
            return layer.__original__ !== originalLayer;
        });
    }

    _addSavedLayers(layer) {
        let variations = this._variations.filter(function (variation) {
            return layer.__original__ === variation[0];
        });
        var thiz = this;
        variations.forEach(function (variation) {
            let obj = variation[1];
            let methodName = variation[2];
            let variationMethod = variation[3];

            thiz._addOriginalMethod(obj, methodName);
            let originalMethod = thiz._getOriginalMethod(obj, methodName);
            layer.addVariation(obj, methodName, variationMethod, originalMethod);
        });
    }

    _uninstallVariations(originalLayer) {
        this._layers.forEach(function (layer) {
            if (layer.__original__ === originalLayer) {
                layer._uninstallVariations();
            }
        });
    }

    exhibit(object, signalInterface) {
        this._addSignalInterface(object, signalInterface);
        this._addIdSignal(signalInterface);
        this._exhibitAnInterface(signalInterface);
    }

    addPartialMethod(originalAdadp, obj, methodName, variation) {
        this._variations.push([originalAdadp, obj, methodName, variation]);
    }

    _receiveSignalsForSignalInterfaces(layer) {
        this._signalInterfacePool.forEach(function (si) {
            for (let field in si[1]) {
                if (si[1].hasOwnProperty(field)) {
                    layer.addSignal(si[1][field]);
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

                this._layers.forEach(function (layer) {
                    layer.addSignal(signalInterface[field]);
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

    getLayers(filter) {
        filter = filter || function () {
            return true;
        };
        return this._layers.filter(filter);
    }

    getActiveLayers() {
        return this.getLayers(function (layer) {
            return layer.isActive()
        })
    };

    getInactiveLayers() {
        return this.getLayers(function (layer) {
            return !layer.isActive()
        })
    };

    _removingLayers(originalLayer) {
        this._variations = this._variations.filter(function (variation) {
            return originalLayer !== variation[0];
        });
    }

    _cleanSignalComposition(originalLayer) {
        let layer = this._layers.find(function (layer) {
            return layer.__original__ === originalLayer;
        });

        layer.cleanCondition();
    }
}

module.exports = new RAI();