let testCase = require('nodeunit').testCase;
const SMP = require('../src/StateMachineParser');

module.exports = testCase({
    'create': function (test) {
        let exp = "a > 1 && $a > 1 => b > 2$";
        let smExp = SMP.getSMExp(exp);
        test.deepEqual(smExp, ["a > 1 => b > 2"]);

        test.done();
    },
    'create-multiple-expression': function (test) {
        let exp = "a > 1 && $a > 1 => b > 2$ && $a > 10 && c > 10$ && c > 10";
        let smExp = SMP.getSMExp(exp);
        test.deepEqual(smExp, ["a > 1 => b > 2", "a > 10 && c > 10"]);

        test.done();
    },
    'removeExpression': function (test) {
        let exp = "a > 1 && $a > 1 => b > 2$ && $a > 10 && c > 10$ && c > 10";
        let smExp = SMP.removeSMExp(exp);
        test.equal(smExp, "a > 1 &&  &&  && c > 10", smExp);

        test.done();
    },
    'seq:':function (test) {
        let exp = "(-> a b)";
        let smExp = SMP.parse(exp);
        test.equal(smExp, "seq(exp('a'),exp('b'))");

        test.done();
    },
    'or:':function (test) {
        let exp = "(|| a b)";
        let smExp = SMP.parse(exp);
        test.equal(smExp, "or(exp('a'),exp('b'))");

        test.done();
    },
    'plus_start:':function (test) {
        let exp = "(* (+ a))";
        let smExp = SMP.parse(exp);
        test.equal(smExp, "star(plus(exp('a')))");

        test.done();
    },
    'seqOr:':function (test) {
        let exp = "(-> (|| a b) (|| c d))";
        let smExp = SMP.parse(exp);
        test.equal(smExp, "seq(or(exp('a'),exp('b')),or(exp('c'),exp('d')))");

        test.done();
    },
    'orStarSeq:':function (test) {
        let exp = "(|| (* a) (-> c d))";
        let smExp = SMP.parse(exp);
        test.equal(smExp, "or(star(exp('a')),seq(exp('c'),exp('d')))");

        test.done();
    },
    'seqn:':function (test) {
        let exp = "(--> (* a) (+ c) d)";
        let smExp = SMP.parse(exp);
        test.equal(smExp, "seqN([star(exp('a')),plus(exp('c')),exp('d')])");

        test.done();
    },
    'withExpressions':function (test) {
        let exp = "(|| (* (a + 2)) (-> (a > 5) (a>=5 && a!=2)))";
        let smExp = SMP.parse(exp);
        test.equal(smExp, "or(star(exp('a+2')),seq(exp('a>5'),exp('a>=5&&a!=2')))");

        test.done();
    }

});