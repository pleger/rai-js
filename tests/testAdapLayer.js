let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalComp = require('../src/SignalComp');
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
            m: function() {activates.push("original")},
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function() {activates.push("variation")});
        CSI.deploy(adap);
        obj.m();
        test.deepEqual(activates, ["original"]);

        test.done();
    },
    'variation-1': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(-1),
            m: function() {activates.push("original")},
        };

        let adap = {
            condition: new SignalComp("a > 1")
        };

        CSI.exhibit(obj, {a: obj.x});
        CSI.addLayer(adap, obj, "m", function() {activates.push("variation")});
        CSI.deploy(adap);
        obj.x.value = 10;
        obj.m();
        test.deepEqual(activates, ["variation"]);

        test.done();
    }
});