let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");
const t = require('exectimer');
const Tick = t.Tick;

let repetitions = 100000;
let samples = [];



for (let i = 0; i <= 5; ++i) {
    samples.push(i * 100);
}
let resultSet = [[],[],[]];

function analyzeResult(results, i) {
    resultSet[i].push(Math.round(results.mean()/1000000));
    //console.log(results.duration()/1000000);
    //console.log(results.parse(results.duration())); // total duration of all ticks
    // console.log(results.parse(results.min()));      // minimal tick duration
    //console.log(results.parse(results.max()));      // maximal tick duration
    //console.log(results.mean()/1000000);     // mean tick duration
    //console.log(results.parse(results.median()));   // median tick duration
}

function showResults(){
    console.log("FINAL RESULTS");
    console.log(samples.join(","));
    console.log(resultSet[0].join(","));
    console.log(resultSet[1].join(","));
    console.log(resultSet[2].join(","));
}

function executeProfile(testID,f, cp) {
    cp = cp || function () {
    };

    for (let k = 0; k < samples.length; ++k) {
        let long = samples[k];

        function profile() {
            (function innerProfile(size, cp) {

                for (let i = 0; i <= size; ++i) {
                    let obj = f();
                    if (i === 0) {
                        cp(obj);
                    }
                }
            })(long, cp);
        }

        Tick.wrap("profile" + k, profile, repetitions);
        console.log("SHOW RESULTS:" + samples[k]);
        analyzeResult(t.timers["profile" + k], testID);
    }
}


function onlyObj() {
    let obj = {
        s: new Signal(0),
        m: function () {
            return this.s.value = 10;
        }
    };
    obj.m();
}

function objWithSIs() {
    let obj = {
        s: new Signal(0),
        m: function () {
            return this.s.value = 10;
        }
    };
    obj.m();
    CSI.exhibit(obj, {ss: obj.s});
}

function objWithAdaps() {
    let obj = {
        s: new Signal(0),
        m: function () {
            return this.s.value = 10;
        }
    };
    CSI.deploy({condition: "ss > 5"});
    obj.m();

    return obj;
}


    console.log("\n\nOnly objects with one signal:");
    CSI.init();
    executeProfile(0, onlyObj,function() {});

console.log("\n\nIdem with signal interfaces:");
CSI.init();

executeProfile(1,objWithSIs, function () {
    CSI.deploy({condition: "ss > 5"})
},0);


console.log("\n\nIdem with adaptations:");
CSI.init();
executeProfile(2,objWithAdaps, function (obj) {
    CSI.exhibit(obj, {ss: obj.s})
},0);

showResults();

/*
for (let k = 0; k < samples.length; ++k) {
    function profile() {
        for (let i = 0; i <= samples[k]; ++i) {
            let obj = {
                m: function () {
                }
            };
            obj.m();
        }
    }

    Tick.wrap("profile" + k, profile);
    console.log("SHOW RESULTS:" + samples[k]);
    analyzeResult(t.timers["profile" + k]);
}

 */
