let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const CSI = require('../src/RAI');

module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'enter_exit-1': function (test) {
        let flags = [];

        let adap = {
            enter: function () {
                flags.push("enter");
            },
            exit: function () {
                flags.push("exit");
            },
            condition: "a > 10"
        };
        CSI.deploy(adap);

        let obj = {
            x: new Signal(2),
            y: 20
        };

        CSI.exhibit(obj,{a: obj.x});

        test.deepEqual(flags, []);
        test.done();
    },
    'enter_exit-2': function (test) {
        let flags = [];
        let adap = {
            enter: function () {
                flags.push("enter");
            },
            exit: function () {
                flags.push("exit");
            },
            condition: "a > 10"
        };

        CSI.deploy(adap);
        let obj = {
            x: new Signal(2),
            y: 20
        };
        CSI.exhibit(obj,{a: obj.x});
        obj.x.value = 20;

        test.deepEqual(flags, ["enter"]);
        test.done();
    },
    'enter_exit-3': function (test) {
        let flags = [];
        let adap = {
            enter: function () {
                flags.push("enter");
            },
            exit: function () {
                flags.push("exit");
            },
            condition: "a > 10"
        };

        CSI.deploy(adap);
        let obj = {
            x: new Signal(2),
            y: 20
        };
        CSI.exhibit(obj,{a: obj.x});
        obj.x.value = 20;
        obj.x.value = 5;

        test.deepEqual(flags, ["enter", "exit"]);
        test.done();
    },
    'enter_exit-4': function (test) {
        let flags = [];
        let adap = {
            enter: function () {
                flags.push("enter");
            },
            exit: function () {
                flags.push("exit");
            },
            condition: "a > 10"
        };

        CSI.deploy(adap);
        let obj = {
            x: new Signal(2),
            y: 20
        };
        CSI.exhibit(obj,{a: obj.x});
        obj.x.value = 20;
        obj.x.value = 1000;

        test.deepEqual(flags, ["enter"]);
        test.done();
    },
    'enter_exit-5': function (test) {
        let flags = [];
        let adap = {
            enter: function () {
                flags.push("enter");
            },
            exit: function () {
                flags.push("exit");
            },
            condition: "a > 10"
        };

        CSI.deploy(adap);
        let obj = {
            x: new Signal(2),
            y: 20
        };
        CSI.exhibit( obj,{a: obj.x});
        obj.x.value = 20;
        obj.x.value = 1;
        obj.x.value = 50;
        obj.x.value = 150;

        test.deepEqual(flags, ["enter","exit","enter"]);
        test.done();
    }
});
