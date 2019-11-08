let logger = require('../libs/logger');

const Signal = require('../Signal');
const Condition = require('../Condition');

logger.info("start test conditions");

let a = new Signal("a");
let con = new Condition([a]," a > 10");
a.value = 5;

logger.info("end test conditions");



