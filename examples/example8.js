let {Signal, SignalComp, Adaptation, CSI, show} = require("../loader");

let t = new Signal(0, "t");
//let h = new Signal(0, "h");

let ht = new SignalComp("t > 10", [t], "ht");
//let hh = new SignalComp("h > 50", [h], "hh");

let hto = new SignalComp("hto || ht", [ht], "hto");
//hto.addSignal(hto);

t.value = 15;

console.log(t.value);
console.log(ht.value);
console.log(hto.value);
console.log("\n");
t.value = 8;

console.log(t.value);
console.log(ht.value);
console.log(hto.value);



