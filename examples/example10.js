let {Signal, Adaptation, CSI, show} = require("../loader");

let screenSmartPhone = {
    gyroscope: new Signal(0),
    rotate: function () {
        show("Rotating");
    }
};

let playerViewSmartPhone = {
    draw: function () {
        show("Showing a Movie");
    }
};

//this videoGame does not support landscape
let videoGame = {
    draw: function() {
        show("Showing a Video Game");
    }
};

//adaptation
let landscape = {
    condition: "gyroLevel > 45",
    enter: function () {
        console.log("ENTER TRANSITION");
        screen.rotate();
    },
    scope: function(funName, obj) {
        return !(funName === "draw" && obj === videoGame);
    }
};


CSI.exhibit(screen, {gyroLevel: screen.gyroscope});

CSI.addPartialMethod(landscape, playerView, "draw",
    function () {
        show("[LAYER] Landscape Mode");
        Adaptation.proceed();

    }
);

CSI.addPartialMethod(landscape, videoGame, "draw",
    function () {
        show("[LAYER] Landscape Mode");
        Adaptation.proceed();
    }
);

CSI.deploy(landscape);
playerView.draw();

show("\nChange SmartPhone position");
screen.gyroscope.value = 60;
playerView.draw();
videoGame.draw();
