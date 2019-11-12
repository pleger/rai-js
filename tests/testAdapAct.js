let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const CORP = require('../src/CSI');

//todo: remove CORP.init()

module.exports = testCase({
    'create': function (test) {
        CORP.init();

        CORP.deploy({condition: "a > 10"});
        test.equals(CORP.getActiveAdaps().length, 0);

        test.done();
    },
    'create-2': function (test) {
        CORP.init();
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        CORP.deploy({condition: "a > 10"});
        CORP.exhibit({a: obj.x}, obj);
        test.equals(CORP.getActiveAdaps().length, 0);

        test.done();
    },
    'activate': function (test) {
        CORP.init();
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        CORP.deploy({condition: "a > 10"});
        CORP.exhibit({a: obj.x}, obj);
        obj.x.value = 15;
        test.equals(CORP.getActiveAdaps().length, 1);

        test.done();
    },
    'active-2': function(test) {
        CORP.init();
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CORP.deploy({condition: "a > 10 && b > 10"});
        CORP.exhibit({a: obj1.x}, obj1);
        CORP.exhibit({b: obj2.x}, obj2);
        obj1.x.value = 15;
        test.equals(CORP.getActiveAdaps().length, 0);
        obj2.x.value = 34;
        test.equals(CORP.getActiveAdaps().length, 1);

        test.done();
    },
    'active-3': function(test) {
        CORP.init();
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CORP.deploy({condition: "a > b"});
        CORP.exhibit({a: obj1.x}, obj1);
        CORP.exhibit({b: obj2.x}, obj2);

        test.equals(CORP.getActiveAdaps().length, 1);
        obj2.x.value = 34;
        test.equals(CORP.getActiveAdaps().length, 0);

        test.done();
    },
    'active-4': function(test) {
        CORP.init();

        let obj1 = {
            x: new Signal(1),
            y: 62,
        };
        let obj2 = {
            x: new Signal(2),
            y: 49,
        };

        CORP.deploy({condition: "a > 50"});
        CORP.exhibit({a: obj1.x}, obj1);
        CORP.exhibit({a: obj2.x}, obj2);

        test.equals(CORP.getActiveAdaps().length, 0);

        obj1.x.value = 100;
        test.equals(CORP.getActiveAdaps().length, 1);
        obj2.x.value = 150;
        test.equals(CORP.getActiveAdaps().length, 1);

        test.done();
    },
    'active-5': function(test) {
        CORP.init();
        let obj = {
            x: new Signal(1),
            y: 62,
        };

        CORP.deploy({condition: "a > 50"});
        CORP.deploy({condition: "a > 100"});
        CORP.exhibit({a: obj.x}, obj);

        test.equals(CORP.getActiveAdaps().length, 0);
        obj.x.value = 60;
        test.equals(CORP.getActiveAdaps().length, 1);
        obj.x.value = 110;
        test.equals(CORP.getActiveAdaps().length, 2);

        test.done();
    },
    'active-6': function(test) {
        CORP.init();
        let obj = {
            x: new Signal(1),
            y: 62,
        };

        CORP.deploy({condition: "a > 50"});
        CORP.deploy({condition: "a > 100"});
        CORP.exhibit({a: obj.x}, obj);

        test.equals(CORP.getActiveAdaps().length, 0);
        obj.x.value = 60;
        test.equals(CORP.getActiveAdaps().length, 1);
        obj.x.value = 110;
        test.equals(CORP.getActiveAdaps().length, 2);

        test.done();
    }
});