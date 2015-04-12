var cliArgs = require("command-line-args");

var Module = module.exports = function() {
	return cli.parse();
};

var cli = cliArgs([
    { name: "verbose", type: Boolean, alias: "v"},
    { name: "config", type: String }
]);