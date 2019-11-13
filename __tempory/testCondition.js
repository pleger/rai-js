let logger = require('../libs/logger');

const Signal = require('../src/Signal');
const Condition = require('../src/SignalComp');

logger.info("start test conditions");

let a = new Signal("a", 10);
let b = new Signal("b", 56);
let c = new Signal("c", 32 );
let con = new Condition([a,b,c]," a > 10 && b > 4 && c < 12");
a._val = 5;
a._val = 100;
c._val = 3;

logger.info("end test conditions");



