let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");

let battery = {
    name: "UMIDIGI",
    charge: new Signal(100),
    capacity: 5105
};

let videoCard = {
    graph: function() {
        show("High Performance");
    }
};

let lowBattery = {
  condition: new SignalComp("level < 30")
};

CSI.exhibit(battery, {level: battery.charge});
CSI.addPartialMethod(lowBattery, videoCard, "graph", function() {show("Low Performance")} );
CSI.deploy(lowBattery);

videoCard.graph();

battery.charge.value = 20;

videoCard.graph();
