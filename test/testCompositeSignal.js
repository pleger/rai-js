let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const CompositeSignal = require('../src/CompositeSignal');

module.exports = testCase({
    'createComposite': function (test) {
        let s1 = new Signal(10, "s");
        let cs1 = new CompositeSignal("s", [s1], 0, "cp");

        test.equal(cs1.value, 10);

        test.done();
    },
    'createComposite-change-value': function (test) {
        let s1 = new Signal(10, "s");
        let cs1 = new CompositeSignal("s", [s1], 0, "cp");

        s1.value = 50;
        test.equal(cs1.value, 50);

        test.done();
    },
    'createComposite-expression': function (test) {
        let s1 = new Signal(10, "s");
        let cs1 = new CompositeSignal("s + 1", [s1], 0, "cp");

        s1.value = 50;
        test.equal(cs1.value, 51);

        test.done();
    },
    'createComposite-boolean-expression': function (test) {
        let s1 = new Signal(10, "s");
        let cs1 = new CompositeSignal("s > 20", [s1], 0, "cp");

        s1.value = 50;
        test.equal(cs1.value, true);

        test.done();
    },
    'createComposite-multi-expression': function (test) {
        let s1 = new Signal(10, "s1");
        let s2 = new Signal(5, "s2");
        let cs1 = new CompositeSignal("s1 + s2", [s1, s2], 0, "cp");

        test.equal(cs1.value, 15);

        test.done();
    },
    'createComposite-multi-expression-2': function (test) {
        let s1 = new Signal(10, "s1");
        let s2 = new Signal(5, "s2");
        let cs1 = new CompositeSignal("s1 + s2", [s1, s2], 0, "cp");

        s1.value = 5;
        s2.value = 0;
        test.equal(cs1.value, 5);

        test.done();
    },

});