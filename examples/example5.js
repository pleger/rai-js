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

//Adaptation
let houseLight = {
  condition: "isHere == true",
  enter: function() {
      lights.turnOn();
  },
};

//two objects exhibiting the same signal
CSI.exhibit(smartPhone,
    {isHere: smartPhone.houseLocation});

CSI.exhibit(car,
    {isHere: car.parked});

CSI.deploy(houseLight);

//the car is here
car.parked.value = true;


