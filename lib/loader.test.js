var _ = require('lodash');
var path = require("path");
var should = require("should");
var simple = require("simple-mock");
var rewire = require("rewire");

var context = require("./context");

module.exports = {
	"before": function() {
		this.loader = rewire("./loader");
	},

	"loader": {
		before: function() {
			this.loadA = this.loader("lib/test/a");
		},

		"creates initializer function": function() {
			this.loadA.should.be.type("function");
		},

		"creates initializer such that when invoked in context": {
			before: function() {
				this.context = context.new({ c: "Variable C" });
				this.a = this.context.invoke(this.loadA);
			},

			"loads module": function() {
				this.a.toString().should.be.equal("Module A");
			},
			"loads missing module dependencies and injects these into module constructor": function() {
				this.a.b.toString().should.be.equal("Module B");
			},
			"injects into module constructor existing variables instead default dependencies": function() {
				this.a.c.should.be.equal("Variable C");
			},
			"loads module in child context": function() {
				this.a.$context.isInheritedFrom(this.context).should.be.true;
			},
			"do not change it": function() {
				this.context.has("a").should.be.false;
				this.context.has("b").should.be.false;
			}
		},

		".resolve": {
			before: function() {
				this.ROOT_DIR = path.resolve(__dirname, "..");
			},
			beforeEach: function() {
				// drop resolver cache
				this.loader.__set__("projectRootDir", null);
			},
			"resolves path based on lib dir": function() {
				this.loader.resolve(".").should.be.equal(this.ROOT_DIR);
			},
			"resolves path based on PROJECT_ROOT env variable value": function() {
				var ROOT_DIR = "/some_dir"
				process.env.PROJECT_ROOT = ROOT_DIR;
				this.loader.resolve("and_one_more").should.be.equal("/some_dir/and_one_more")
			}
		}
	}
};