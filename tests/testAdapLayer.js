let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalComp = require('../src/SignalComp');
const Adaptation = require('../src/Adaptation');
const CSI = require('../src/CSI');

module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'create': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(9),
            m: function () {
                activates.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            activates.push("variation")
        });
        CSI.deploy(adap);
        obj.m();
        test.deepEqual(activates, ["variation"]);

        test.done();
    },
    'create-2': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(9),
            m: function () {
                activates.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            activates.push("variation")
        });
        obj.m();

        CSI.deploy(adap); //later deployment
        test.deepEqual(activates, ["original"]);

        test.done();
    },
    'variation-1': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                activates.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            activates.push("variation")
        });
        CSI.deploy(adap);
        obj.x.value = 10;
        obj.m();
        test.deepEqual(activates, ["variation"]);

        test.done();
    },
    'variation-2-changing-deployment-place': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                activates.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            activates.push("variation")
        });
        CSI.deploy(adap);
        obj.m();
        test.deepEqual(activates, ["variation"]);

        test.done();
    },
    'variation-3-changing-deployment-place': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                activates.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            activates.push("variation")
        });
        obj.m();
        CSI.deploy(adap);
        test.deepEqual(activates, ["original"]);

        test.done();
    },
    'variation-4-addingRemovingLayer': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                activates.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            activates.push("variation")
        });
        CSI.deploy(adap);

        obj.m();
        obj.x.value = 0;
        obj.m();

        test.deepEqual(activates, ["variation", "original"]);

        test.done();
    },
    'calling proceed': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                activates.push("original")
            },
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function () {
            activates.push("variation");
            Adaptation.proceed();
        });
        CSI.deploy(adap);
        obj.m();
        test.deepEqual(activates, ["variation", "original"]);

        test.done();
    },
    'layer-method-with-return': function (test) {
        let activates = [];
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
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        activates.push(obj.m());
        CSI.deploy(adap);
        activates.push(obj.m());
        test.deepEqual(activates, ["original", "variation"]);

        test.done();
    },
    'layer-method-with-return-proceed': function (test) {
        let activates = [];
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
        CSI.addLayer(adap, obj, "m", function () {
            return "variation" + "-" + Adaptation.proceed();
        });
        activates.push(obj.m());
        CSI.deploy(adap);
        activates.push(obj.m());
        test.deepEqual(activates, ["original", "variation-original"]);

        test.done();
    },
    'layer-method-with-return-proceed-uninstall': function (test) {
        let activates = [];
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
        CSI.addLayer(adap, obj, "m", function () {
            return "variation" + "-" + Adaptation.proceed();
        });
        activates.push(obj.m());
        CSI.deploy(adap);
        activates.push(obj.m());
        obj.x.value = 0;
        activates.push(obj.m());
        test.deepEqual(activates, ["original", "variation-original", "original"]);

        test.done();
    },
    'layer-undeploy-1': function (test) {
        let activates = [];
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
        CSI.addLayer(adap, obj, "m", function () {
            return "variation";
        });
        activates.push(obj.m());
        CSI.deploy(adap);
        activates.push(obj.m());
        CSI.undeploy(adap);
        activates.push(obj.m());
        test.deepEqual(activates, ["original", "variation", "original"]);

        test.done();
    }
});