let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");

let smartPhone = {
    isInHouse: new Signal(false),
};

let kitchen = {
    time: new Signal(1200),
    isLightTurnOn: new Signal(false),
    turnOnTeapot: function () {
        show("Teapot is turning on");
    }
};

let welcomeHome = {
    condition: new SignalComp("timeBack > 1900 && $(-> (smartPhone) (light))$"),
    enter: function () {
        kitchen.turnOnTeapot();
    }
};

CSI.exhibit(smartPhone, {smartPhone: smartPhone.isInHouse});
CSI.exhibit(kitchen, {light: kitchen.isLightTurnOn, timeBack: kitchen.time});
CSI.deploy(welcomeHome);

kitchen.time.value = 1930;
smartPhone.isInHouse.value = true;
kitchen.isLightTurnOn.value = true;





