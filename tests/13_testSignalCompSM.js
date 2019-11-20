let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalCompSM = require('../src/SignalCompSM');

module.exports = testCase({
    'create': function (test) {
        let cond = new SignalCompSM("a > 10 && $(-> a b)$");

        test.equal(cond.expression, "a > 10 && __SM__0(objectContext)");

        test.done();
    },
    'create-with-many-machines': function (test) {
        let cond = new SignalCompSM("a > 10 && $(-> a b)$ || b < 5 || $(|| a b)$ && z < 5");

        test.equal(cond.expression, "a > 10 && __SM__0(objectContext) || b < 5 || __SM__1(objectContext) && z < 5");

        test.done();
    },
    'create-with-realstatemachine': function (test) {
        let cond = new SignalCompSM("a > 10 && $(-> (a > b) (a == 5)$");

        test.equal(cond.expression, "a > 10 && __SM__0(objectContext)");

        test.done();
    },
    'evaluation-1': function (test) {
        let s1 = new Signal(50, "a");
        let s2 = new Signal(10, "b");
        let cond = new SignalCompSM("$(|| (a > b) (b == 10))$", [s1, s2]);

        test.equal(cond.expression, "__SM__0(objectContext)");
        test.equal(cond.evaluate(), true);

        test.done();
    },
    'evaluation-2': function (test) {
        let s1 = new Signal(5, "a");
        let s2 = new Signal(12, "b");
        let cond = new SignalCompSM("$(|| (a > b) (b == 10))$", [s1, s2]);

        test.equal(cond.expression, "__SM__0(objectContext)");
        test.equal(cond.evaluate(), false);

        test.done();
    },
    'evaluation-seq': function (test) {
        let s1 = new Signal(50, "a");
        let s2 = new Signal(10, "b");
        let cond = new SignalCompSM("$(-> (a > b) (b == 120))$", [s1, s2]);

        test.equal(cond.expression, "__SM__0(objectContext)");
        test.equal(cond.evaluate(), false);
        s2.value = 9;
        test.equal(cond.evaluate(), false);
        s2.value = 120;
        test.equal(cond.evaluate(), true);

        test.done();
    },
    'evaluation-seq2': function (test) {
        let s1 = new Signal(50, "a");
        let s2 = new Signal(10, "b");
        let s3 = new Signal(10, "c");
        let cond = new SignalCompSM("$(--> (a > b) (b == 120) (c == 2))$", [s1, s2, s3]);

        test.equal(cond.expression, "__SM__0(objectContext)");
        test.equal(cond.evaluate(), false);
        s2.value = 9;
        test.equal(cond.evaluate(), false);
        s2.value = 120;
        test.equal(cond.evaluate(), false);
        s3.value = 2;
        test.equal(cond.evaluate(), true);

        test.done();
    },
    'evaluation-seq-var': function (test) {
        let s1 = new Signal(0, "a");
        let cond = new SignalCompSM("$(-> (a > 10) (a == 2))$", [s1]);

        test.equal(cond.expression, "__SM__0(objectContext)");
        test.equal(cond.evaluate(), false);
        s1.value = 12;
        test.equal(cond.evaluate(), false);
        s1.value = 2;
        test.equal(cond.evaluate(), true);

        test.done();
    }
});