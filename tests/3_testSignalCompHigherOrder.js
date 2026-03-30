let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalComp = require('../src/SignalComp');

module.exports = testCase({
    'create-1': function (test) {
        let s1 = new Signal(10, "a");
        let cond1 = new SignalComp("a > 10", [s1]);
        let cond2 = new SignalComp("r > 10", [cond1], "r");

        test.notEqual(cond1 === undefined);
        test.notEqual(cond2 === undefined);

        test.ok(true, "conditions was created");

        test.done();
    },
    'evaluate-1': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a > 10", [s1], "r");
        let cond2 = new SignalComp("r", [cond1]);

        cond1.evaluate();
        test.equal(cond1.value, true);
        test.equal(cond2.value, true);

        test.done();
    },
    'evaluate-2': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a > 10", [s1], "r");
        let cond2 = new SignalComp("r", [cond1]);

        s1.value = 9;
        test.equal(cond1.value, false);
        test.equal(cond2.value, false);

        test.done();
    },
    'evaluate-3': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a > 10", [s1], "r");
        let cond2 = new SignalComp("!r", [cond1]);

        s1.value = 9;
        test.equal(cond1.value, false);
        test.equal(cond2.value, true);

        test.done();
    },
    'evaluate-4': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a + 10", [s1], "r");
        let cond2 = new SignalComp("r > 20 ", [cond1]);

        s1.value = 100;
        test.equal(cond1.value, 110);
        test.equal(cond2.value, true);

        test.done();
    },
    'evaluate-with-three-levels': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a + 10", [s1], "r");
        let cond2 = new SignalComp("r > 20 ", [cond1], "h");
        let cond3 = new SignalComp("h && a > 5", [s1, cond2]);

        s1.value = 100;
        test.equal(cond1.value, 110);
        test.equal(cond2.value, true);
        test.equal(cond3.value, true);

        test.done();
    },
    'evaluate-with-multiple-condition': function (test) {
        let s1 = new Signal(15, "a");
        let cond1 = new SignalComp("a + 10", [s1], "r");
        let cond2 = new SignalComp("r > 20 ", [cond1], "h");
        let cond3 = new SignalComp("h && r > 5", [cond1, cond2]);

        s1.value = 100;
        test.equal(cond1.value, 110);
        test.equal(cond2.value, true);
        test.equal(cond3.value, true);

        test.done();
    },
    'recursion': function (test) {
        let flags = [];
        let t = new Signal(0, "t");
        let ht = new SignalComp("t > 10", [t], "ht");
        let hto = new SignalComp("hto || ht", [ht], "hto");
        t.value = 15;

        flags.push(ht.value);
        flags.push(hto.value);
        t.value = 8;
        flags.push(ht.value);
        flags.push(hto.value);

        test.deepEqual(flags, [true, true, false, true]);
        test.done();
    },
    'recursion-2': function (test) {
        let flags = [];
        let t = new Signal(0, "t");
        let h = new Signal(0, "h");
        let ht = new SignalComp("t > 10", [t], "ht");
        let hh = new SignalComp("h > 50", [h], "hh");
        let hto = new SignalComp("hto || ht", [ht], "hto");
        let hho = new SignalComp("hho || (hh && hto)", [hh, hto], "hho");

        t.value = 15;
        flags.push(ht.value);
        flags.push(hto.value);
        flags.push(hho.value);

        h.value = 65;
        flags.push(ht.value);
        flags.push(hto.value);
        flags.push(hho.value);
        t.value = 6;
        h.value = 9;
        flags.push(hto.value);
        flags.push(hho.value);

        test.deepEqual(flags, [true, true, false, true, true, true, true, true]);
        test.done();
    },
    'recursion-3': function (test) {
        let flags1 = [];
        let flags2 = [];

        let t = new Signal(0, "t");
        let h = new Signal(0, "h");

        let ht = new SignalComp("t > 10", [t], "ht");
        let hh = new SignalComp("h > 50", [h], "hh");

        let state1 = new SignalComp("(state1 || ht) && !start && !final", [ht], "state1");
        let state2 = new SignalComp("(start && hh)", [hh], "state2");

        let start = new SignalComp("(start || state1) && !final", [state1], "start");
        let final = new SignalComp("(final || state2)", [state2], "final");

        state1.addSignal(start);
        state1.addSignal(final);
        state2.addSignal(start);
        start.addSignal(final);

        t.value = 15;
        flags1.push(state1.value);
        flags1.push(state2.value);
        flags1.push(start.value);
        flags1.push(final.value);

        h.value = 65;
        flags2.push(state1.value);
        flags2.push(state2.value);
        flags2.push(start.value);
        flags2.push(final.value);


        test.deepEqual(flags1, [false, false, true, false], "first state");
        test.deepEqual(flags2, [false, false, false, true], "second state");
        test.done();
    },
    'recursion-4': function (test) {
        let flags1 = [];
        let flags2 = [];
        let flags3 = [];

        let t = new Signal(0, "t");
        let h = new Signal(0, "h");

        let ht = new SignalComp("t > 10", [t], "ht");
        let hh = new SignalComp("h > 50", [h], "hh");

        let state1 = new SignalComp("(state1 || ht) && !start && !final", [ht], "state1");
        let state2 = new SignalComp("(start && hh)", [hh], "state2");

        let start = new SignalComp("(start || state1) && !final", [state1], "start");
        let final = new SignalComp("(final || state2)", [state2], "final");

        state1.addSignal(start);
        state1.addSignal(final);
        state2.addSignal(start);
        start.addSignal(final);

        t.value = 15;
        flags1.push(state1.value);
        flags1.push(state2.value);
        flags1.push(start.value);
        flags1.push(final.value);

        h.value = 65;
        flags2.push(state1.value);
        flags2.push(state2.value);
        flags2.push(start.value);
        flags2.push(final.value);

        t.value = 56;
        h.value = 90;
        flags3.push(state1.value);
        flags3.push(state2.value);
        flags3.push(start.value);
        flags3.push(final.value);


        test.deepEqual(flags1, [false, false, true, false], "first state");
        test.deepEqual(flags2, [false, false, false, true], "second state");
        test.deepEqual(flags3, [false, false, false, true], "second match");
        test.done();
    },
    'recursion-5': function (test) {
        let flags1 = [];
        let flags2 = [];
        let flags3 = [];
        let flags4 = [];

        let t = new Signal(0, "t");
        let h = new Signal(0, "h");

        let cond1 = new SignalComp("t > 10", [t], "cond1");
        let cond2 = new SignalComp("h > 50", [h], "cond2");

        //let state1 = new SignalComp("(state1 || cond1) && !start && !final", [], "state1");
        //let start = new SignalComp("(start || state1) && !final", [], "start");
        //let final = new SignalComp("(final || state2)", [], "final");

        let restart = new SignalComp("(cond1 && final)", [], "restart");
        let state1 = new SignalComp("(state1 || cond1) && !start", [], "state1");
        let state2 = new SignalComp("(state2 || cond2) && start", [], "state2");

        let start = new SignalComp("(start || state1) && !restart", [], "start");
        let final = new SignalComp("(state2)", [], "final");
        //let restart = new SignalComp("(!final)", [state2, final], "restart");
/*
        restart.addSignals([cond1, final]);
        state1.addSignals([cond1, start]);
        state2.addSignals([cond2, start]);
        start.addSignals([state1, restart]);
        final.addSignals([state2]);
        //final.addSignal(restart);

        t.value = 15;
        flags1.push(state1.value);
        flags1.push(state2.value);
        flags1.push(start.value);
        flags1.push(final.value);


        h.value = 65;
        flags2.push(state1.value);
        flags2.push(state2.value);
        flags2.push(start.value);
        flags2.push(final.value);

        /*
        t.value = 56;
        flags3.push(state1.value);
        flags3.push(state2.value);
        flags3.push(start.value);
        flags3.push(final.value);
/*
        // console.log("restart:"+restart.value);
        t.value = 34;
        // console.log("restart:"+restart.value);
        flags4.push(state1.value);
        flags4.push(state2.value);
        flags4.push(start.value);
        //flags4.push(final.value);
        */

        //test.deepEqual(flags1, [false, false, true, false], "first state");
        //test.deepEqual(flags2, [false, false, false, true], "second state");
        //test.deepEqual(flags3, [false, false, false, true], "second match");
        //test.deepEqual(flags4, [false, true, true, false], "no match");
        test.done();
    }
});
