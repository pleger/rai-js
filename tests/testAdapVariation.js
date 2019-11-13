let testCase = require('nodeunit').testCase;
const Signal = require('../src/Signal');
const CSI = require('../src/CSI');


module.exports = testCase({
    'setUp': function (test) {
        CSI.init();
        test();
    },
    'variation-1': function(test) {
        let adap = {
            enter: function () {
                lactivation.push("enter");
            },
            exit: function () {
                lactivation.push("exit");
            },
            variation: function() {

            },
            condition: "a > 10"
        };

        test.done();
    }
});