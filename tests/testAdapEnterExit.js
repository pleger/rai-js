let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const CORP = require('../src/CSI');

//todo: remove CORP.init()

module.exports = testCase({
    'enter_exit-1': function (test) {
        CORP.init();
        let lactivation = [];

        let adap = {
            enter: function () {
                lactivation.push("enter");
            },
            exit: function () {
                lactivation.push("exit");
            },
            condition: "a > 10"
        };
        CORP.deploy(adap);

        let obj = {
            x: new Signal(2),
            y: 20
        };

        CORP.exhibit({a: obj.x}, obj);

        test.deepEqual(lactivation, []);
        test.done();
    },
    'enter_exit-2': function (test) {
        CORP.init();

        let lactivation = [];
        let adap = {
            enter: function () {
                lactivation.push("enter");
            },
            exit: function () {
                lactivation.push("exit");
            },
            condition: "a > 10"
        };

        CORP.deploy(adap);
        var obj = {
            x: new Signal(2),
            y: 20
        };
        CORP.exhibit({a: obj.x}, obj);
        obj.x.value = 20;

        test.deepEqual(lactivation, ["enter"]);
        test.done();
    },
    'enter_exit-3': function (test) {
        CORP.init();

        let lactivation = [];
        let adap = {
            enter: function () {
                lactivation.push("enter");
            },
            exit: function () {
                lactivation.push("exit");
            },
            condition: "a > 10"
        };

        CORP.deploy(adap);
        let obj = {
            x: new Signal(2),
            y: 20
        };
        CORP.exhibit({a: obj.x}, obj);
        obj.x.value = 20;
        obj.x.value = 5;

        test.deepEqual(lactivation, ["enter", "exit"]);
        test.done();
    },
    'enter_exit-4': function (test) {
        CORP.init();

        let lactivation = [];
        let adap = {
            enter: function () {
                lactivation.push("enter");
            },
            exit: function () {
                lactivation.push("exit");
            },
            condition: "a > 10"
        };

        CORP.deploy(adap);
        let obj = {
            x: new Signal(2),
            y: 20
        };
        CORP.exhibit({a: obj.x}, obj);
        obj.x.value = 20;
        obj.x.value = 1000;

        test.deepEqual(lactivation, ["enter"]);
        test.done();
    },
    'enter_exit-5': function (test) {
        CORP.init();

        let lactivation = [];
        let adap = {
            enter: function () {
                lactivation.push("enter");
            },
            exit: function () {
                lactivation.push("exit");
            },
            condition: "a > 10"
        };

        CORP.deploy(adap);
        let obj = {
            x: new Signal(2),
            y: 20
        };
        CORP.exhibit({a: obj.x}, obj);
        obj.x.value = 20;
        obj.x.value = 1;
        obj.x.value = 50;
        obj.x.value = 150;

        test.deepEqual(lactivation, ["enter","exit","enter"]);
        test.done();
    }
});
