let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const signalComp = require('../src/SignalComp');


module.exports = testCase({
    'Create': function (test) {
        let s1 = new Signal(10, "a");
        let cond = new signalComp("a > 10", [s1]);

        test.notEqual(cond === undefined);
        test.ok(true, "condition was created");

        test.done();
    },
    'Evaluate': function (test) {
        let s1 = new Signal(10, "a");
        let cond = new signalComp("a > 10", [s1]);

        test.equal(cond.evaluate(), false);

        test.done();
    },
    'ChangeValue': function (test) {
        let s1 = new Signal(10, "a");
        let cond = new signalComp("a > 10", [s1]);

        test.equal(cond.evaluate(), false);
        s1._val = 11;
        test.equal(cond.evaluate(), true);

        test.done();
    },
    'undefined variables': function (test) {
        let cond = new signalComp("a > 10", [new Signal(10, 'b')]);

        test.equal(cond.evaluate(), false);

        test.done();
    },
    'undefined variables-2': function (test) {
        let cond = new signalComp("true && a > 10", [new Signal(10, 'b')]);

        test.equal(cond.evaluate(), false);

        test.done();
    },
    'multiple condition': function (test) {
        let s1 = new Signal(0, "a");
        let cond1 = new signalComp("a > 10", [s1]);
        let cond2 = new signalComp("a > 100", [s1]);

        s1._val = 19;
        test.equal(cond1.evaluate(), true);
        test.equal(cond2.evaluate(), false);

        test.done();
    },
    'condition multiples adding': function (test) {
        let cond = new signalComp("a > 10 && b > 4 && c < 5 && d < 10", []);

        cond.addSignal(new Signal(100, "a"));
        cond.addSignal(new Signal(10, "b"));
        cond.addSignal(new Signal(2, "c"));
        cond.addSignal(new Signal(0, "d"));

        test.done();
    },
    'condition multiples adding-2': function (test) {
        let cond = new signalComp("a > 10 && b > 4 && c < 5 && d < 10");

        cond.addSignal(new Signal(100, "a"));
        cond.addSignal(new Signal(10, "b"));
        cond.addSignal(new Signal(2, "c"));
        cond.addSignal(new Signal(0, "d"));

        test.done();
    },
    'condition multiples adding-3': function (test) {
        let cond = new signalComp("a > 10 && b > 4 && c < 5 && d < 10");

        cond.addSignal(new Signal(100, "a"));
        cond.addSignal(new Signal(10, "b"));
        cond.addSignal(new Signal(2, "c"));
        cond.addSignal(new Signal(0, "d"));
        test.equal(cond.evaluate(), true);

        test.done();
    },
    'condition different signals': function (test) {
        let s1 = new Signal(0, "a");
        let s2 = new Signal(11, "a");
        let s3 = new Signal(5, "a");

        let activation;
        let cond = new signalComp("a > 10");
        cond.on(function (r) {
            test.equal(cond.value, activation);
        });

        activation = false;
        cond.addSignal(s1);

        activation = true;
        cond.addSignal(s2);

        activation = false;
        cond.addSignal(s3);

        test.done();
    },
    'counting condition signal-1': function (test) {
        let count = 0;
        let s = new Signal(0, "b");
        let cond = new signalComp("a > 10", [s]);
        cond.on(function () {
            test.equal(cond.value, false);
            ++count;
        });

        s.value = 5; //don't change the condition
        s.value = 10; //don't change the condition
        s.value = 45;
        test.equal(count, 1);

        test.done();
    },
    'counting condition signal-2': function (test) {
        let s = new Signal(0, "a");

        let count = 0;
        let cond = new signalComp("a > 10", [s]);
        cond.on(function () {
            test.equal(cond.value, false);
            ++count;
        });

        s.value = 5;
        s.value = 1;
        s.value = 4;
        test.equal(count, 1);

        test.done();
    },
    'counting condition signal-3': function (test) {
        let count = 0;
        let s = new Signal(0, "a");
        let cond = new signalComp("a > 10", [s]);
        cond.on(function () {
            ++count;
        });

        //no there are subscribers here!

        test.equal(count, 0);

        test.done();
    },
    'counting condition signal-4': function (test) {
        let count = 0;
        let s = new Signal(0, "a");
        let cond = new signalComp("a > 10", [s]);
        cond.on(function () {
            ++count;
        });
        s.value = 12;
        s.value = 8;
        s.value = 15;

        test.equal(count, 3);

        test.done();
    }
});