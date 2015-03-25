var Module = module.exports = function() {
	return new B();
}

function B() {
};
B.prototype.toString = function() {
	return "Module B";
}