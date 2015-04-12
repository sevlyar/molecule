var express = require("express");
var loader = require("../../../../").loader;

var Module = module.exports = function($context) {
	// var middleware = loader.load("lib/services/http/middleware/*", $context);
	var controllers = loader.load("lib/services/http/controllers/*", $context);
	
	var router = express();
	router.get("/somethings/:id", controllers.getSomethings);
	return router;
};
