let testCase = require('nodeunit').testCase;
const Signal = require('../Signal');

module.exports = testCase({
    'create': function (test) {
        let signal = new Signal("a", 10);
        test.equals(signal.id, "a");
        test.equals(signal.value, 10);
        test.done();
    },

    'changing value': function (test) {
        let signal = new Signal("a", 10);
        signal.value = 5;
        test.equals(signal.value, 5);
        test.done();
    },

    'two signals': function (test) {
        let signal1 = new Signal("a", 10);
        let signal2 = new Signal("b", 100);
        test.ok(signal1 !== signal2, "different objects");

        test.equals(signal1.id, "a");
        test.equals(signal1.value, 10);
        test.equals(signal2.id, "b");
        test.equals(signal2.value, 100);

        test.done();
    },
    'two signals two values': function (test) {
        let signal1 = new Signal("a", 10);
        let signal2 = new Signal("b", 100);
        test.ok(signal1 !== signal2);

        test.equals(signal1.id, "a");
        test.equals(signal1.value, 10);
        test.equals(signal2.id, "b");
        test.equals(signal2.value, 100);

        signal1.value = 5;
        signal2.value = 5;
        test.ok(signal1.value === signal2.value);

        test.done();
    }
});