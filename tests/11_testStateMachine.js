let testCase = require('nodeunit').testCase;
const SM = require('../src/StateMachine');

module.exports = testCase({
    'create': function (test) {
        let sa = SM.sym("a");
        let sb = SM.sym("a");
        let exp = SM.seq(sa, sb); //a->b
        let sm = SM(exp);
        test.ok(true);
        test.done();
    },
    'create2': function (test) {
        let sm = SM(SM.seq(SM.sym("a"), SM.sym("b"))); //a->b
        test.ok(true);
        test.done();
    },
    'symA': function (test) {
        let sm = SM(SM.sym("a")); //a
        test.equal(sm("a"), true);
        test.equal(sm("b"), true);

        test.done();
    },
    'seqAB': function (test) {
        let sm = SM(SM.seq(SM.sym("a"), SM.sym("b"))); //a->b
        test.equal(sm("a"), false);
        test.equal(sm("a"), false);
        test.equal(sm("c"), false);
        test.equal(sm("b"), true);
        test.equal(sm("b"), true); //starting again

        test.done();
    }, 'seqAccccB': function (test) {
        let sm = SM(SM.seq(SM.sym("a"), SM.sym("b"))); //a->b
        test.equal(sm("a"), false);
        test.equal(sm("c"), false);
        test.equal(sm("c"), false);
        test.equal(sm("c"), false);
        test.equal(sm("b"), true);

        test.done();
    },
    'seqAB-twice': function (test) {
        let sm = SM(SM.seq(SM.sym("a"), SM.sym("b"))); //a -> b
        test.equal(sm("a"), false);
        test.equal(sm("a"), false);
        test.equal(sm("b"), true);
        test.equal(sm("a"), false);
        test.equal(sm("c"), false);
        test.equal(sm("b"), true);

        test.done();
    },
    'OrAB': function (test) {
        let sm = SM(SM.or(SM.sym("a"), SM.sym("b"))); //a||b
        test.equal(sm("a"), true);
        test.equal(sm("b"), true);
        test.equal(sm("c"), true); //because of the (single) semantics!!

        test.done();
    },
    'starA': function (test) {
        let sm = SM(SM.star(SM.sym("a"))); //a*
        test.equal(sm("a"), false);
        test.equal(sm("a"), false);
        test.equal(sm("a"), false);
        test.equal(sm("a"), false);
        test.equal(sm("b"), true);
        test.equal(sm("c"), true);

        test.done();
    },
    'plusA': function (test) {
        let sm = SM(SM.plus(SM.sym("a"))); //a+
        test.equal(sm("a"), false);
        test.equal(sm("a"), false);
        test.equal(sm("a"), false);
        test.equal(sm("a"), false);
        test.equal(sm("b"), true);
        test.equal(sm("c"), true); //because of the (single) semantics!!

        test.done();
    },
    'or-seq': function (test) {
        let sm = SM(SM.or(SM.seq(SM.sym("a"), SM.sym("b")), SM.seq(SM.sym("c"), SM.sym("d")))); //(a->b)||(c->d)
        test.equal(sm("a"), false);
        test.equal(sm("b"), true);
        test.equal(sm("c"), false);
        test.equal(sm("d"), true);
        test.equal(sm("a"), false);
        test.equal(sm("c"), false);
        test.equal(sm("b"), true);
        test.equal(sm("d"), true);

        test.done();
    },
    'seq-or': function (test) {
        let sm = SM(SM.seq(SM.or(SM.sym("a"), SM.sym("b")), SM.or(SM.sym("c"), SM.sym("d")))); //(a||b)->(c||d)
        test.equal(sm("a"), false);
        test.equal(sm("d"), true);
        test.equal(sm("c"), true);
        test.equal(sm("b"), false);
        test.equal(sm("c"), true);
        test.equal(sm("a"), false);
        test.equal(sm("b"), false);
        test.equal(sm("c"), true);

        test.done();
    },
    'seq-n': function (test) {
        let sm = SM(SM.seqN([SM.sym("a"), SM.sym("b"), SM.sym("c"), SM.sym("d")])); //(-> a b c d)
        test.equal(sm("a"), false);
        test.equal(sm("b"), false);
        test.equal(sm("c"), false);
        test.equal(sm("d"), true);
        test.equal(sm("d"), true); //because of the (single) semantics!!

        test.done();
    }
});
