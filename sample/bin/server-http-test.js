var molecule = require("../..");
var path = require("path");
process.env.PROJECT_ROOT = path.resolve(__dirname, "..");

var context = new molecule.Context();

// premap http and logger services with mock objects
context.map("http",   molecule.loader("lib/testing/http"));
context.map("logger", molecule.loader("lib/testing/logger"));

context.map("testRunner", molecule.loader("lib/testing/runner"));

var app = molecule.loader.load("lib/app", context);

app.run(function() {
	context.get("testRunner").run();
	console.log("done");
});