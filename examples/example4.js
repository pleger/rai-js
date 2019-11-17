let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");

let smartPhone = {
    houseLocation: new Signal(false)
};

let car = {
    parked: new Signal(false)
};

let lights = {
    turnOn: function () {
        show("Turn on");
    },
    turnOff: function () {
        show("Turn off");
    }
};


let houseLight = {
  condition: "isHere == true",
  enter: function() {
      lights.turnOn();
  },
};

CSI.exhibit(smartPhone,
    {isHere: smartPhone.houseLocation});

CSI.exhibit(car,
    {isHere: car.parked});

CSI.deploy(houseLight);

car.parked.value = true;


