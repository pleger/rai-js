let logger = require('../libs/logger');

const Signal = require('../Signal');
const Condition = require('../Condition');

logger.info("start test conditions");

let a = new Signal("a", 10);
let b = new Signal("b", 56);
let c = new Signal("c", 32 );
let con = new Condition([a,b,c]," a > 10 && b > 4 && c < 12");
a.value = 5;
a.value = 100;
c.value = 3;

logger.info("end test conditions");



