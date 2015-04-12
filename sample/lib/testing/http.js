var Module = module.exports = function(routes) {
	this.routes = routes;
};

Module.$constructor = true;

Module.$require = {
	routes: "lib/services/http/routes"
}

Module.prototype.listen = function(callback) {
	callback();
};

Module.prototype.handle = function(req, resp) {
	this.routes.handle(req, resp);
};