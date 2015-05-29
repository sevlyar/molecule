var molecule = require("../../");
var path = require("path");
process.env.PROJECT_ROOT = path.resolve(__dirname, "..");

var app = molecule.loader.load("lib/app");
app.run(function() {});