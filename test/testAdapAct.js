let testCase = require('nodeunit').testCase;

const Adaptation = require('../src/Adaptation');
const Condition = require('../src/Condition');
const Signal = require('../src/Signal');
const CORP = require('../src/COPR');

//todo: remove CORP.init()

module.exports = testCase({
    'create': function (test) {
        CORP.init();
        let adap = new Adaptation({condition: "a > 10"});

        CORP.deploy(adap);
        test.equals(adap.isActive(), false);

        test.done();
    },
    'create-2': function (test) {
        CORP.init();
        let adap = new Adaptation({condition: "a > 10"});
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        CORP.deploy(adap);
        CORP.exhibit({a: obj.x}, obj);
        test.equals(adap.isActive(), false);

        test.done();
    },
    'activate': function (test) {
        CORP.init();
        let adap = new Adaptation({condition: "a > 10"});
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        CORP.deploy(adap);
        CORP.exhibit({a: obj.x}, obj);
        obj.x.value = 15;
        test.equals(adap.isActive(), true);

        test.done();
    },
    'active-2': function(test) {
        CORP.init();
        let adap = new Adaptation({condition: "a > 10 && b > 10"});
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CORP.deploy(adap);
        CORP.exhibit({a: obj1.x}, obj1);
        CORP.exhibit({b: obj2.x}, obj2);
        obj1.x.value = 15;
        test.equals(adap.isActive(), false);
        obj2.x.value = 34;
        test.equals(adap.isActive(), true);

        test.done();
    },
    'active-3': function(test) {
        CORP.init();
        let adap = new Adaptation({condition: "a > b"});
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CORP.deploy(adap);
        CORP.exhibit({a: obj1.x}, obj1);
        CORP.exhibit({b: obj2.x}, obj2);

        test.equals(adap.isActive(), true);
        obj2.x.value = 34;
        test.equals(adap.isActive(), false);

        test.done();
    },
    'active-4': function(test) {
        console.log("START");
        CORP.init();
        let adap = new Adaptation({condition: "a > 50"});
        let obj1 = {
            x: new Signal(9),
            y: 62,
        };
        let obj2 = {
            x: new Signal(5),
            y: 49,
        };

        CORP.deploy(adap);
        CORP.exhibit({a: obj1.x}, obj1);
        CORP.exhibit({a: obj2.x}, obj2);

        console.log("ADAPTIVE 1 (false):" + adap.isActive());
        test.equals(adap.isActive(), false);

        console.log("ADAPTIVE 2-1 (false):" + adap.isActive());
        obj1.x.value = 100;
        test.equals(adap.isActive(), true);
        console.log("ADAPTIVE 2-2 (true):" + adap.isActive());

        console.log("ADAPTIVE 3-1 (true):" + adap.isActive());
        obj2.x.value = 100;
        console.log("ADAPTIVE 3-2 (true):" + adap.isActive());
        test.equals(adap.isActive(), false);

        console.log("END");
        test.done();
    }
});