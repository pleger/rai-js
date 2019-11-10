let testCase = require('nodeunit').testCase;
const Signal = require('../Signal');
const Condition = require('../Condition');


module.exports = testCase({
    'Create': function (test) {
        let s1 = new Signal("a", 10);
        let cond = new Condition([s1], "a > 10");
        test.notEqual(cond === undefined);
        test.ok(true, "condition was created");

        test.done();
    },
    'Evaluate': function (test) {
        let s1 = new Signal("a", 10);
        let cond = new Condition([s1], "a > 10");

        test.equals(cond.evaluate(), false);
        test.done();
    },
    'ChangeValue': function (test) {
        let s1 = new Signal("a", 10);
        let cond = new Condition([s1], "a > 10");

        test.equals(cond.evaluate(), false);
        s1.value = 11;

        test.equals(cond.evaluate(), true);
        test.done();
    },
    'undefined variables': function(test) {
        let cond = new Condition([new Signal('b', 10)], "a > 10");

        test.throws(function() {cond.evaluate();});
        test.done();
    },
    'multiple condition': function(test) {
        let s1 = new Signal("a", 10);
        let cond1 = new Condition([s1], "a > 10");
        let cond2 = new Condition([s1], "a > 100");

        s1.value = 50;
        test.equals(cond1.evaluate(), true);
        test.equals(cond2.evaluate(), false);
        test.done();
    }
});