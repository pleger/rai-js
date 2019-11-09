let testCase = require('nodeunit').testCase;
const Signal = require('../Signal');
const Condition = require('../Condition');

module.exports = testCase({
    'Create': function (test) {
        let s1 = new Signal("a", 10);
        let cond = new Condition([s1], "a > 10");
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
        test.done();
    }


});