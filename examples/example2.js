let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");

let screen = {
    gyroscope: new Signal(0),
    rotate: function () {
        show("Rotating");
    }
};


let playerView = {
    draw: function () {
        show("Showing a Movie");
    }
};

let landscape = {
    condition: "gyroLevel > 45",
    enter: function () {
        screen.rotate();
    }
};


CSI.exhibit(screen,
    {gyroLevel: screen.gyroscope});


CSI.addLayer(landscape, playerView, "draw",
    function () {
        Adaptation.proceed();
        show("[LAYER] Lanscape Mode")
    }
);


CSI.deploy(landscape);
playerView.draw();

show("\nChange SmartPhone position");
screen.gyroscope.value = 60;
playerView.draw();
