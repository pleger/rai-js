//add to the array what example you want to execute it
const EXAMPLE_SCRIPTS = [2,9];

EXAMPLE_SCRIPTS.forEach(function (example) {
    console.log("\n\nEXECUTING THE EXAMPLE: " + example + "\n========================");
    require("./examples/example" + example);
});