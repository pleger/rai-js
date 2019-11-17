let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");

let screen = {
    gyroscope: new Signal(50),
    rotate: function () {
        show("Rotating");
    }
};

let playerView = {
    movie: new Signal(false),
    draw: function () {
        show("Showing a Movie");
    }
};

let landscape = {
    condition: new SignalComp("gyroLevel > 45"),
    enter: function () {
        screen.rotate();
    }
};

let portrait = {
    condition: new SignalComp("landscape == false && playMovie == false"),
    enter: function () {
        screen.rotate();
    }
};

CSI.exhibit(screen, {gyroLevel: screen.gyroscope});
CSI.exhibit(playerView, {playMovie: playerView.movie});
CSI.exhibit(landscape, {landscape: landscape.condition});

CSI.addLayer(landscape, playerView, "draw", function () {
    show("[LANDSCAPE-LAYER] Lanscape Mode");
    Adaptation.proceed();

});

CSI.addLayer(portrait, playerView, "draw", function () {
    show("[PORTRAIT-LAYER] Portrait");
    Adaptation.proceed();
});


CSI.deploy(landscape);
CSI.deploy(portrait);

playerView.draw();


show("\n-Change SmartPhone position");
screen.gyroscope.value = 2;
playerView.draw();
