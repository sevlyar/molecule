var http = require("http");

var Module = module.exports = function($context) {
	this.context = $context;
};

Module.$constructor = true;

Module.$require = {
	"args": 	"lib/services/args",
	"config": 	"lib/services/config",
	"http": 	"lib/services/http",
	"logger": 	"lib/services/logger"
}

Module.prototype.run = function(callback) {
	// this.context.preload();
	this.context.get("http").listen(callback);
};