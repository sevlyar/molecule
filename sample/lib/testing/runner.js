var async = require("async");

var PARALLEL_LIMIT = 1;

var Module = module.exports = function(http, logger) {
	this.http = http;
	this.logger = logger;
};

Module.$require = {
	logger: "lib/testing/logger",
	http: 	"lib/testing/http"
}

Module.prototype.run = function(callback) {
	var self = this;
	var tests = this.loadTests();
	async.eachLimit(tests, PARALLEL_LIMIT, function(test, done) {
		test.run(self.http, function(err) {
			var output = self.logger.purge();
			if (err) {
				console.log(output);
			}
			done();
		});
	}, callback);
};

// http tests may use supertest package
Module.prototype.loadTests = function() {
	return [];
};