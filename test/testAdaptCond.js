let testCase = require('nodeunit').testCase;
const Adaptation = require('../src/Adaptation');
const Condition = require('../src/Condition');
const Signal = require('../src/Signal');

module.exports = testCase({
    'create-1': function (test) {
        let cond = new Condition("a > 10");
        let adap = new Adaptation({condition: cond});

        test.equal(cond, adap.condition);

        test.done();
    },
    'create-2': function (test) {
        let cond = new Condition("a > 10");
        let adap = new Adaptation(cond, "", {});

        test.equal(cond, adap.condition);

        test.done();
    },
    'eval-1': function (test) {
        let s = new Signal(0, "a");
        let cond = new Condition("a > 10", [s]);
        let adap = new Adaptation({condition: cond});

        test.equal(adap.isActive(), false);

        test.done();
    },
    'eval-2': function (test) {
        let s = new Signal(0, "a");
        let cond = new Condition("a > 10", [s]);
        let adap = new Adaptation({condition: cond});

        test.equal(adap.isActive(), false);
        s.value = 20;
        test.equal(adap.isActive(), true);

        test.done();
    },
    'eval-3': function (test) {
        let s1 = new Signal(0, "a");
        let s2 = new Signal(0, "b");
        let s3 = new Signal(0, "c");

        let cond = new Condition("a > 10 && b > c", [s1, s2, s3]);
        let adap = new Adaptation({condition: cond});

        test.equal(adap.isActive(), false);
        s1.value = 20;
        test.equal(adap.isActive(), false);
        s2.value = 300;
        test.equal(adap.isActive(), true);
        s3.value = 200;
        test.equal(adap.isActive(), true);

        test.done();
    }
});