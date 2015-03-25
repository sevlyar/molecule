var Module = module.exports = function(b, c, $context) {
	return new A(b, c, $context);
}
Module.$require = {
	b: "lib/test/b",
	c: "lib/test/c"
}

function A(b, c, $context) {
	this.b = b;
	this.c = c;
	this.$context = $context;
};
A.prototype.toString = function() {
	return "Module A";
}