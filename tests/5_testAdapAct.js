let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const RAI = require('../src/RAI');

module.exports = testCase({
    'setUp': function (test) {
        RAI.init();
        test();
    },
    'create': function (test) {
        RAI.deploy({condition: "a > 10"});
        test.equals(RAI.getActiveLayers().length, 0);

        test.done();
    },
    'create-2': function (test) {
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        RAI.deploy({condition: "a > 10"});
        RAI.exhibit(obj, {a: obj.x});
        test.equals(RAI.getActiveLayers().length, 0);

        test.done();
    },
    'activate-0': function (test) {
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        RAI.deploy({condition: "a > 10"});
        RAI.exhibit(obj, {a: obj.x});
        obj.x.value = 15;
        test.equals(RAI.getActiveLayers().length, 1);

        test.done();
    },
    'activate-1': function (test) {
        let obj = {
            x: new Signal(9),
            y: new Signal(0),
        };

        RAI.deploy({condition: "a > 10 && b > 10"});
        RAI.exhibit(obj, {a: obj.x, b: obj.y});
        obj.x.value = 15;
        obj.y.value = 20;
        test.equals(RAI.getActiveLayers().length, 1);

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

        RAI.deploy({condition: "a > 10 && b > 10"});
        RAI.exhibit(obj1, {a: obj1.x});
        RAI.exhibit(obj2, {b: obj2.x});
        obj1.x.value = 15;
        test.equals(RAI.getActiveLayers().length, 0);
        obj2.x.value = 34;
        test.equals(RAI.getActiveLayers().length, 1);

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

        RAI.exhibit(obj1, {a: obj1.x});
        RAI.exhibit(obj2, {b: obj2.x});
        RAI.deploy({condition: "a > b"});

        test.equals(RAI.getActiveLayers().length, 1);
        obj2.x.value = 34;
        test.equals(RAI.getActiveLayers().length, 0);

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

        RAI.deploy({condition: "a > 50"});
        RAI.exhibit(obj1, {a: obj1.x});
        RAI.exhibit(obj2, {a: obj2.x});

        test.equals(RAI.getActiveLayers().length, 0);

        obj1.x.value = 100;
        test.equals(RAI.getActiveLayers().length, 1);
        obj2.x.value = 150;
        test.equals(RAI.getActiveLayers().length, 1);

        test.done();
    },
    'activate-5': function (test) {
        let obj = {
            x: new Signal(1),
            y: 62,
        };

        RAI.deploy({condition: "a > 50"});
        RAI.deploy({condition: "a > 100"});
        RAI.exhibit(obj, {a: obj.x});

        test.equals(RAI.getActiveLayers().length, 0);
        obj.x.value = 60;
        test.equals(RAI.getActiveLayers().length, 1);
        obj.x.value = 110;
        test.equals(RAI.getActiveLayers().length, 2);

        test.done();
    },
    'activate-6': function (test) {
        let obj = {
            x: new Signal(1),
            y: 62,
        };

        RAI.deploy({condition: "a > 50"});
        RAI.deploy({condition: "a > 100"});
        RAI.exhibit(obj, {a: obj.x});

        test.equals(RAI.getActiveLayers().length, 0);
        obj.x.value = 60;
        test.equals(RAI.getActiveLayers().length, 1);
        obj.x.value = 110;
        test.equals(RAI.getActiveLayers().length, 2);

        test.done();
    }
});