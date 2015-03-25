var Module = module.exports = function() {
	return new C();
}

function C() {
};
C.prototype.toString = function() {
	return "Module C";
}