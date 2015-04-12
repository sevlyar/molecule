var util = require("util");

var Module = module.exports = function(args) {
	var verbose = args.verbose;
	return {
		info: info,
		verbose: info,
		data: "",
		purge: purge
	}
};

var info = function() {
	var line = util.format.apply(util, arguments);
	this.data += line + "\n";
}

var purge = function() {
	var data = this.data;
	this.data = "";
	return data;
}