let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');

module.exports = testCase({
    'create': function (test) {
        let signal = new Signal(10, "a");

        test.equal(signal.id, "a");
        test.equal(signal.value, 10);

        test.done();
    },

    'changing value': function (test) {
        let signal = new Signal(10, "a");

        signal._val = 5;
        test.equal(signal._val, 5);

        test.done();
    },
    'two signals': function (test) {
        let signal1 = new Signal(10, "a");
        let signal2 = new Signal(100, "b");

        test.ok(signal1 !== signal2, "different objects");
        test.equal(signal1.id, "a");
        test.equal(signal1._val, 10);
        test.equal(signal2.id, "b");
        test.equal(signal2._val, 100);

        test.done();
    },
    'two signals two values': function (test) {
        let signal1 = new Signal(10, "a");
        let signal2 = new Signal(100, "b");

        test.ok(signal1 !== signal2);
        test.equal(signal1.id, "a");
        test.equal(signal1._val, 10);
        test.equal(signal2.id, "b");
        test.equal(signal2._val, 100);
        signal1._val = 5;
        signal2._val = 5;
        test.ok(signal1._val === signal2._val);

        test.done();
    },
    'signal-no-id': function (test) {
        let signal = new Signal(10);

        signal.id = "a";
        test.equal(signal.id, "a");

        test.done();
    },
    'signal-no-id-2': function (test) {
        let signal = new Signal(10);

        signal.id = "a";
        test.notEqual(signal.id, "_");

        test.done();
    }
});