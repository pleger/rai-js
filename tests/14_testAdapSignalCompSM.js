let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalComp = require('../src/SignalComp');
const CSI = require('../src/CSI');


module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'creation': function (test) {
        let obj = {
            x: new Signal(0),
            y: new Signal(true),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("$(--> (b==true) (b==false) (b==3))$")
        };

        CSI.exhibit(obj, {a: obj.x, b: obj.y});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        test.ok("Creation was successful");
        test.done();
    },
    'onlySM': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("$(-> (a==true) (a==3))$")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.x.value = true;
        obj.x.value = 3;
        flags.push(obj.m());
        test.deepEqual(flags, ["original","variation"]);
        test.done();
    },
    'onlySM-2': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("$(--> (a) (a == 3) (!a))$")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.x.value = true;
        obj.x.value = 3;
        flags.push(obj.m());
        obj.x.value = false;
        flags.push(obj.m());
        test.deepEqual(flags, ["original","original","variation"]);
        test.done();
    },
    'onlySM-3': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("$(--> (a) (a == 3) (a))$")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.x.value = true;
        obj.x.value = 3;
        flags.push(obj.m());
        obj.x.value = true;
        flags.push(obj.m());

        test.deepEqual(flags, ["original","original","variation"]);
        test.done();
    },
    'onlySM-4': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("$(--> (a) (a == 3) (a))$")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.x.value = true;
        obj.x.value = 3;
        flags.push(obj.m());
        obj.x.value = true;
        flags.push(obj.m());
        obj.x.value = true; //this value is not submitted again.
        flags.push(obj.m());

        test.deepEqual(flags, ["original","original","variation","variation"]);
        test.done();
    },
    'onlySM-5': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("$(--> (a > 5) (a == 3) (a > 10))$")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.x.value = 7;
        obj.x.value = 3;
        flags.push(obj.m());
        obj.x.value = 11;
        flags.push(obj.m());
        obj.x.value = 15; //this first state disable again!
        flags.push(obj.m());

        test.deepEqual(flags, ["original","original","variation","original"]);
        test.done();
    },
    'SM-with-other-expressions': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            y: new Signal(5),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("b == 2 && $(--> (a > 5) (a == 3) (a > 10))$")
        };

        CSI.exhibit(obj, {a: obj.x, b: obj.y});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.y.value = 2;
        obj.x.value = 7;
        obj.x.value = 3;
        obj.x.value = 11;
        flags.push(obj.m());

        test.deepEqual(flags, ["original","variation"]);
        test.done();
    },
    'SM-with-other-expressions-AND-EFFECT': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            y: new Signal(5),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("b == 2 && $(--> (a > 5) (a == 3) (a > 10))$")
        };

        CSI.exhibit(obj, {a: obj.x, b: obj.y});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.x.value = 7;
        obj.x.value = 3;
        obj.x.value = 11;
        obj.y.value = 2; //SM never was evaluated because of '&&' operator
        flags.push(obj.m());

        test.deepEqual(flags, ["original","original"]);
        test.done();
    },
    'SM-with-other-expressions-AND-EFFECT-2': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            y: new Signal(5),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("$(--> (a > 5) (a == 3) (b > 1)) && b == 2$")
        };

        CSI.exhibit(obj, {a: obj.x, b: obj.y});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.x.value = 7;
        obj.x.value = 3;
        obj.y.value = 2;
        flags.push(obj.m());

        test.deepEqual(flags, ["original","variation"]);
        test.done();
    },
    'SM-with-other-expressions-OR-Effect': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(false),
            y: new Signal(5),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("b == 2 || $(--> (a > 5) (a == 3) (a > 10))$")
        };

        CSI.exhibit(obj, {a: obj.x, b: obj.y});
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        CSI.deploy(adap);

        flags.push(obj.m());
        obj.x.value = 7;
        obj.x.value = 3;
        obj.x.value = 11;
        obj.y.value = 2;
        flags.push(obj.m());

        test.deepEqual(flags, ["original","variation"]);
        test.done();
    }
});