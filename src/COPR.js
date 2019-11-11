let logger = require('../libs/logger');
let Adaptation = require('./Adaptation');

class COPR {

    constructor(){
        if(!COPR.instance){
           COPR.instance = this;
           this.init();
        }
        return COPR.instance;
    }

    init() {
        this.i13n = {};
        this.adaptationsPool = [];
    }

    deploy(adap){
        this.adaptationsPool.push(new Adaptation(adap));
    }

    exhibit(signalInterface, object) {
        for (let field in signalInterface) {
            if (signalInterface.hasOwnProperty(field)) {
                signalInterface[field].id = field;
            }
        }

        for (let adap in this.adaptationsPool) {
            //loocking ...
            //if it matches, add it

        }
    }
}


module.exports = new COPR();