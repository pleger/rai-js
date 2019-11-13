let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const CSI = require('../src/CSI');

module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'create': function (test) {
        CSI.deploy({condition: "a > 10"});
        test.equals(CSI.getActiveAdaps().length, 0);

        test.done();
    },
    'create-2': function (test) {
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        CSI.deploy({condition: "a > 10"});
        CSI.exhibit(obj,{a: obj.x});
        test.equals(CSI.getActiveAdaps().length, 0);

        test.done();
    },
    'activate-0': function (test) {
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        CSI.deploy({condition: "a > 10"});
        CSI.exhibit(obj,{a: obj.x});
        obj.x.value = 15;
        test.equals(CSI.getActiveAdaps().length, 1);

        test.done();
    },
    'activate-1': function (test) {
        let obj = {
            x: new Signal(9),
            y: new Signal(0),
        };

        CSI.deploy({condition: "a > 10 && b > 10"});
        CSI.exhibit(obj,{a: obj.x, b: obj.y});
        obj.x.value = 15;
        obj.y.value = 20;
        test.equals(CSI.getActiveAdaps().length, 1);

        test.done();
    },
    'activate-2': function (test) {
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CSI.deploy({condition: "a > 10 && b > 10"});
        CSI.exhibit(obj1,{a: obj1.x});
        CSI.exhibit(obj2,{b: obj2.x});
        obj1.x.value = 15;
        test.equals(CSI.getActiveAdaps().length, 0);
        obj2.x.value = 34;
        test.equals(CSI.getActiveAdaps().length, 1);

        test.done();
    },
    'activate-3': function (test) {
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CSI.deploy({condition: "a > b"});
        CSI.exhibit( obj1,{a: obj1.x});
        CSI.exhibit( obj2,{b: obj2.x});

        test.equals(CSI.getActiveAdaps().length, 1);
        obj2.x.value = 34;
        test.equals(CSI.getActiveAdaps().length, 0);

        test.done();
    },
    'activate-4': function (test) {
        let obj1 = {
            x: new Signal(1),
            y: 62,
        };
        let obj2 = {
            x: new Signal(2),
            y: 49,
        };

        CSI.deploy({condition: "a > 50"});
        CSI.exhibit(obj1,{a: obj1.x});
        CSI.exhibit(obj2,{a: obj2.x});

        test.equals(CSI.getActiveAdaps().length, 0);

        obj1.x.value = 100;
        test.equals(CSI.getActiveAdaps().length, 1);
        obj2.x.value = 150;
        test.equals(CSI.getActiveAdaps().length, 1);

        test.done();
    },
    'activate-5': function (test) {
        let obj = {
            x: new Signal(1),
            y: 62,
        };

        CSI.deploy({condition: "a > 50"});
        CSI.deploy({condition: "a > 100"});
        CSI.exhibit(obj,{a: obj.x});

        test.equals(CSI.getActiveAdaps().length, 0);
        obj.x.value = 60;
        test.equals(CSI.getActiveAdaps().length, 1);
        obj.x.value = 110;
        test.equals(CSI.getActiveAdaps().length, 2);

        test.done();
    },
    'activate-6': function (test) {
        let obj = {
            x: new Signal(1),
            y: 62,
        };

        CSI.deploy({condition: "a > 50"});
        CSI.deploy({condition: "a > 100"});
        CSI.exhibit(obj,{a: obj.x});

        test.equals(CSI.getActiveAdaps().length, 0);
        obj.x.value = 60;
        test.equals(CSI.getActiveAdaps().length, 1);
        obj.x.value = 110;
        test.equals(CSI.getActiveAdaps().length, 2);

        test.done();
    }
});