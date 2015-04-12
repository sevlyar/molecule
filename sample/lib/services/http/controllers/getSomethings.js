var Module = module.exports = function(config, logger) {
	return function(req, resp) {
		logger.verbose("return somethings " + req.params.id);
		resp.send("somethings " + req.params.id);
	}
};
