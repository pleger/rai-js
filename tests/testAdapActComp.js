let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const SignalComp = require('../src/SignalComp');
const CSI = require('../src/CSI');

module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'two-activations': function (test) {
        let obj = {
            x: new Signal(9),
            y: 56,
        };

        let adap1 = {
            condition: new SignalComp("a > 1")
        };

        let adap2 = {
            condition: new SignalComp("h")
        };

        CSI.deploy(adap1);
        CSI.deploy(adap2);
        CSI.exhibit({a: obj.x}, obj);
        CSI.exhibit({pp: adap1.condition}, adap1);

        test.ok("creating and deploying adaptations");

        test.done();
    },
    'two-activations-2': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(0),
            y: 56,
        };

        let adap1 = {
            condition: new SignalComp("a > 1"),
            enter: function() {
                activates.push("enter-adap1");
            }
        };

        let adap2 = {
            condition: new SignalComp("h"),
            enter: function() {
                activates.push("enter-adap2");
            }
        };

        CSI.deploy(adap1);
        CSI.deploy(adap2);
        CSI.exhibit({a: obj.x}, obj);
        CSI.exhibit({h: adap1.condition}, adap1);
        obj.x.value = 10;
        test.deepEqual(activates, ["enter-adap1","enter-adap2"]);

        test.done();
    },
    'two-activations-3': function (test) {
        let activates = [];
        let obj = {
            x: new Signal(0),
            y: new Signal(5),
        };

        let adap1 = {
            condition: new SignalComp("a > 1"),
            enter: function() {
                activates.push("enter-adap1");
            }
        };

        let adap2 = {
            condition: new SignalComp("b > 5"),
            enter: function() {
                activates.push("enter-adap2");
            }
        };

        let adap3 = {
            condition: new SignalComp("h && r"),
            enter: function() {
                activates.push("enter-adap3");
            }
        };


        CSI.deploy(adap1);
        CSI.deploy(adap2);
        CSI.deploy(adap3);

        CSI.exhibit({a: obj.x, b: obj.y}, obj);
        CSI.exhibit({h: adap1.condition}, adap1);
        CSI.exhibit({r: adap2.condition}, adap2);
        obj.x.value = 10;
        obj.y.value = 100;
        test.deepEqual(activates, ["enter-adap1","enter-adap2","enter-adap3"]);

        test.done();
    }
});