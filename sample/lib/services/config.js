var path = require("path");

var Module = module.exports = function(args) {
	var configFilePath = path.resolve(process.cwd(), args.config || "../config/server.json");
	return require(configFilePath);	
};
