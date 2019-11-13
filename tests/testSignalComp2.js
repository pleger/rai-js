let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalComp = require('../src/SignalComp');

module.exports = testCase({
    'create-1': function (test) {
        let s1 = new Signal(10, "a");
        let cond1 = new SignalComp("a > 10", [s1]);
        let cond2 = new SignalComp("r > 10", [cond1], "r");

        test.notEqual(cond1 === undefined);
        test.notEqual(cond2 === undefined);

        test.ok(true, "conditions was created");

        test.done();
    },
    'evaluate-1': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a > 10", [s1], "r");
        let cond2 = new SignalComp("r", [cond1]);

        cond1.evaluate();
        test.equal(cond1.value, true);
        test.equal(cond2.value, true);

        test.done();
    },
    'evaluate-2': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a > 10", [s1], "r");
        let cond2 = new SignalComp("r", [cond1]);

        s1.value = 9;
        test.equal(cond1.value, false);
        test.equal(cond2.value, false);

        test.done();
    },
    'evaluate-3': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a > 10", [s1], "r");
        let cond2 = new SignalComp("!r", [cond1]);

        s1.value = 9;
        test.equal(cond1.value, false);
        test.equal(cond2.value, true);

        test.done();
    },
    'evaluate-4': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a + 10", [s1], "r");
        let cond2 = new SignalComp("r > 20 ", [cond1]);

        s1.value = 100;
        test.equal(cond1.value, 110);
        test.equal(cond2.value, true);

        test.done();
    },
    'evaluate-with-three-levels': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a + 10", [s1], "r");
        let cond2 = new SignalComp("r > 20 ", [cond1], "h");
        let cond3 = new SignalComp("h && a > 5", [s1, cond2]);

        s1.value = 100;
        test.equal(cond1.value, 110);
        test.equal(cond2.value, true);
        test.equal(cond3.value, true);

        test.done();
    },
    'evaluate-with-multiple-condition': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a + 10", [s1], "r");
        let cond2 = new SignalComp("r > 20 ", [cond1], "h");
        let cond3 = new SignalComp("h && r > 5", [cond1, cond2]);

        s1.value = 100;
        test.equal(cond1.value, 110);
        test.equal(cond2.value, true);
        test.equal(cond3.value, true);

        test.done();
    }
});
