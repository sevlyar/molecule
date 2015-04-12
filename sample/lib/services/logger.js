var Module = module.exports = function(args) {
	var verbose = args.verbose;
	return {
		info: info,
		verbose: verbose ? info : stub
	}
};

var info = function() {
	console.log.apply(console, arguments);
}

var stub = function() { }