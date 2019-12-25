let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalComp = require('../src/SignalComp');
const Adaptation = require('../src/Layer');
const CSI = require('../src/RAI');

module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'create': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(9),
            m: function () {
                flags.push("original")
            },
        };

        let adap = {
            condition: "a > 1"
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation")
        });
        CSI.deploy(adap);
        obj.m();
        test.deepEqual(flags, ["variation"]);

        test.done();
    },
    'create-2': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(9),
            m: function () {
                flags.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation");
        });
        obj.m();

        CSI.deploy(adap); //later deployment
        test.deepEqual(flags, ["original"]);

        test.done();
    },
    'variation-1': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                flags.push("original");
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation");
        });
        CSI.deploy(adap);
        obj.x.value = 10;
        obj.m();
        test.deepEqual(flags, ["variation"]);

        test.done();
    },
    'variation-2-changing-deployment-place': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                flags.push("original");
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation");
        });
        CSI.deploy(adap);
        obj.m();
        test.deepEqual(flags, ["variation"]);

        test.done();
    },
    'variation-3-changing-deployment-place': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                flags.push("original");
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation");
        });
        obj.m();
        CSI.deploy(adap);
        test.deepEqual(flags, ["original"]);

        test.done();
    },
    'variation-4-addingRemovingLayer': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                flags.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation")
        });
        CSI.deploy(adap);

        obj.m();
        obj.x.value = 0;
        obj.m();

        test.deepEqual(flags, ["variation", "original"]);

        test.done();
    },
    'calling proceed': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                flags.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            flags.push("variation");
            Adaptation.proceed();
        });
        CSI.deploy(adap);
        obj.m();
        test.deepEqual(flags, ["variation", "original"]);

        test.done();
    },
    'layer-method-with-return': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            return "variation";
        });
        flags.push(obj.m());
        CSI.deploy(adap);
        flags.push(obj.m());
        test.deepEqual(flags, ["original", "variation"]);

        test.done();
    },
    'layer-method-with-return-proceed': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            return "variation" + "-" + Adaptation.proceed();
        });
        flags.push(obj.m());
        CSI.deploy(adap);
        flags.push(obj.m());
        test.deepEqual(flags, ["original", "variation-original"]);

        test.done();
    },
    'layer-method-with-return-proceed-uninstall': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            return "variation" + "-" + Adaptation.proceed();
        });
        flags.push(obj.m());
        CSI.deploy(adap);
        flags.push(obj.m());
        obj.x.value = 0;
        flags.push(obj.m());
        test.deepEqual(flags, ["original", "variation-original", "original"]);

        test.done();
    }
});