var http = require("http");

var Module = module.exports = function(config, routes) {
	this.config = config.http;
	this.httpServer = http.createServer(routes);
};

Module.$constructor = true;

Module.$require = {
	routes: "lib/services/http/routes"
}

Module.prototype.listen = function(callback) {
	this.httpServer.listen(this.config.port, this.config.hostname, this.config.backlog, callback);
};
