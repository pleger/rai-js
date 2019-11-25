let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");

let smartWatch = {
    isAwake: new Signal(false),
    time: new Signal(1200),
};


let airConditioner = {
    _temperature: 0,
    adjustTemperature: function (val) {
        show("Adjusting the temperature:" + val);
        this._temperature = val;
    }
};

let musicPlayer = {
    makeSleepNoise: function () {
        show("make sleep sound");
    }
};

let sleepMode = {
    condition: new SignalComp("$(--> awake awake (+ awake))$ && sleepTime > 0 && sleepTime < 700 "),
    enter: function() {
        airConditioner.adjustTemperature(26);
        musicPlayer.makeSleepNoise();
    },
    exit: function () {
        show("see the current state system");
    }
};



CSI.exhibit(smartWatch, {sleepTime: smartWatch.time, awake: smartWatch.isAwake});
CSI.deploy(sleepMode);

smartWatch.time.value = 200;
smartWatch.isAwake.value = true;
smartWatch.isAwake.value = false;
smartWatch.isAwake.value = true;
smartWatch.isAwake.value = false;
smartWatch.isAwake.value = true;
smartWatch.isAwake.value = false;





