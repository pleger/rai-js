let logger = require('./libs/logger');

// Context-Oriented Programming Runtime (COPR)

class COPR {

    #adaptationsPool;

    constructor(){
        logger.trace("Starting COPR");
        if(!COPR.instance){
           COPR.instance = this;
           this.init();
        }
        return COPR.instance;
    }

    init() {
        this.#adaptationsPool = [];
    }

    deploy(adaptation){
        let adap = new Adaptation(adaptation);
        this.#adaptationsPool.push(adap);
    }
}

module.exports = new COPR();