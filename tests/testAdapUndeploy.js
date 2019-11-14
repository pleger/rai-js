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