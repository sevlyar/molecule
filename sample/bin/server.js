var molecule = require("../../");
var path = require("path");
process.env.PROJECT_ROOT = path.resolve(__dirname, "..");

var context = molecule.Context.new();
var appLoader = molecule.loader("lib/app");
var app = context.invoke(appLoader);
app.run(function() {});