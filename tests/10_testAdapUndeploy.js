let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalComp = require('../src/SignalComp');
const CSI = require('../src/RAI');

module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'layer-undeploy-1': function (test) {
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
        CSI.undeploy(adap);
        flags.push(obj.m());
        test.deepEqual(flags, ["original", "variation", "original"]);

        test.done();
    },
    'layer-undeploy-deploy': function (test) {
        let flags = [];
        let obj = {
            x: new Signal(-1),
            m: function () {
                return "original";
            },
        };

        let adap = {
            condition: "a > 1",
        };

        obj.x.value = 10;
        CSI.exhibit(obj, {a: obj.x});
        CSI.addPartialMethod(adap, obj, "m", function () {
            return "variation";
        });
        flags.push(obj.m());
        CSI.deploy(adap);
        flags.push(obj.m());
        CSI.undeploy(adap);
        flags.push(obj.m());
        CSI.deploy(adap);
        flags.push(obj.m());

        test.deepEqual(flags, ["original", "variation", "original", "variation"]);

        test.done();
    }
});