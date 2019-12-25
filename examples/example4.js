let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");

let screen = {
    gyroscope: new Signal(0),
    rotate: function () {
        show("Rotating");
    }
};

let playerView = {
    kind: new Signal("video camara"),
    draw: function () {
        show("Showing a Movie");
    }
};

//Creating two adaptations
let landscape = {
    condition: new SignalComp("gyroLevel > 45"),
    enter: function () {
        console.log("ENTER LANDSCAPE");
        screen.rotate();
    },
    exit: function() {
        console.log("landscape is over");
    }

};

let portrait = {
    condition: new SignalComp("!landscape && kindMovie == 'FULL_MOVIE'"),
    enter: function () {
        console.log("ENTER PORTRAIT");
        screen.rotate();
    }
};
// End Adaptations


CSI.exhibit(screen, {gyroLevel: screen.gyroscope});
CSI.exhibit(playerView, {kindMovie: playerView.kind});
CSI.exhibit(landscape, {landscape: landscape.condition});

//Adding two layers
CSI.addPartialMethod(landscape, playerView, "draw", function () {
    show("[LANDSCAPE-LAYER] Lanscape Mode");
    Adaptation.proceed();
});

CSI.addPartialMethod(portrait, playerView, "draw", function () {
    show("[PORTRAIT-LAYER] Portrait");
    Adaptation.proceed();
});


CSI.deploy(landscape);
CSI.deploy(portrait);

playerView.draw();
show("\n-Change SmartPhone position");
screen.gyroscope.value = 100;
playerView.draw();

screen.gyroscope.value = 10; //Landscape is over!!!!
playerView.kind.value = 'FULL_MOVIE'; //required for portrait
playerView.draw();