//add the list of example that you want to exexute
const EXAMPLE_SCRIPTS = [3];

EXAMPLE_SCRIPTS.forEach(function (example) {
    console.log("\n\nEXECUTING THE EXAMPLE: " + example+ "\n========================");
    require("./examples/example" + example);
});


