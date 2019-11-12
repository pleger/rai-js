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
        CSI.exhibit({a: obj.x}, obj);
        test.equals(CSI.getActiveAdaps().length, 0);

        test.done();
    },
    'activate': function (test) {
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        CSI.deploy({condition: "a > 10"});
        CSI.exhibit({a: obj.x}, obj);
        obj.x.value = 15;
        test.equals(CSI.getActiveAdaps().length, 1);

        test.done();
    },
    'active-2': function (test) {
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CSI.deploy({condition: "a > 10 && b > 10"});
        CSI.exhibit({a: obj1.x}, obj1);
        CSI.exhibit({b: obj2.x}, obj2);
        obj1.x.value = 15;
        test.equals(CSI.getActiveAdaps().length, 0);
        obj2.x.value = 34;
        test.equals(CSI.getActiveAdaps().length, 1);

        test.done();
    },
    'active-3': function (test) {
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CSI.deploy({condition: "a > b"});
        CSI.exhibit({a: obj1.x}, obj1);
        CSI.exhibit({b: obj2.x}, obj2);

        test.equals(CSI.getActiveAdaps().length, 1);
        obj2.x.value = 34;
        test.equals(CSI.getActiveAdaps().length, 0);

        test.done();
    },
    'active-4': function (test) {
        let obj1 = {
            x: new Signal(1),
            y: 62,
        };
        let obj2 = {
            x: new Signal(2),
            y: 49,
        };

        CSI.deploy({condition: "a > 50"});
        CSI.exhibit({a: obj1.x}, obj1);
        CSI.exhibit({a: obj2.x}, obj2);

        test.equals(CSI.getActiveAdaps().length, 0);

        obj1.x.value = 100;
        test.equals(CSI.getActiveAdaps().length, 1);
        obj2.x.value = 150;
        test.equals(CSI.getActiveAdaps().length, 1);

        test.done();
    },
    'active-5': function (test) {
        let obj = {
            x: new Signal(1),
            y: 62,
        };

        CSI.deploy({condition: "a > 50"});
        CSI.deploy({condition: "a > 100"});
        CSI.exhibit({a: obj.x}, obj);

        test.equals(CSI.getActiveAdaps().length, 0);
        obj.x.value = 60;
        test.equals(CSI.getActiveAdaps().length, 1);
        obj.x.value = 110;
        test.equals(CSI.getActiveAdaps().length, 2);

        test.done();
    },
    'active-6': function (test) {
        let obj = {
            x: new Signal(1),
            y: 62,
        };

        CSI.deploy({condition: "a > 50"});
        CSI.deploy({condition: "a > 100"});
        CSI.exhibit({a: obj.x}, obj);

        test.equals(CSI.getActiveAdaps().length, 0);
        obj.x.value = 60;
        test.equals(CSI.getActiveAdaps().length, 1);
        obj.x.value = 110;
        test.equals(CSI.getActiveAdaps().length, 2);

        test.done();
    }
});