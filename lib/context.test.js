var _ = require('lodash');
var should = require("should");
var simple = require("simple-mock");
var rewire = require("rewire");

module.exports = {
    "before": function(){
        this.Context = rewire("./context");
    },

    "Context": {
        "beforeEach": function() {
            this.ctx = this.Context.new();
        },

        ".new": {
            "returns new void context if called without parameters": function() {
                var ctx = this.Context.new();
                ctx.variables.should.be.eql({
                    $context: ctx
                });
            },
            "returns context with passed variables in argument": function() {
                var ctx = this.Context.new({
                    a: 1
                });
                ctx.variables.should.be.eql({
                    a: 1,
                    $context: ctx
                });
            }
        },

        "#map": {
            "map values": function() {
                var fn = function() {};
                this.ctx
                    .map("s", "string")
                    .map("i", 1)
                    .map("f", fn)
                    .variables.should.be.eql({
                        $context: this.ctx,
                        s: "string",
                        i: 1,
                        f: fn
                    })
                ;
            },
            "don't affects on parent context": function() {
                this.ctx
                    .map("a", 1)
                    .inherit()
                    .map("a", 2)
                ;
                this.ctx.get("a").should.be.equal(1);
            }
        },

        "#get": {
            "returns mapped value for exists key": function() {
                var o = { };
                this.ctx
                    .map("obj", o)
                    .get("obj").should.be.eql(o)
                ;
            },
            "throws exeption for unknown key": function() {
                (function() {
                    this.ctx.get("notRegistered");
                }).should.throw();
            },
            "supports lazzy initialization": function() {
                var val = 1;
                function init() {
                    return val++;
                }
                this.ctx.map("key", this.Context.lazzyInit(init));
                val.should.be.equal(1);
                this.ctx.get("key").should.be.equal(1);
                this.ctx.get("key");
                val.should.be.equal(2);
            }
        },

        "#invoke": {
            "invokes given function": function() {
                var fn = simple.spy(function() {});
                this.ctx.invoke(fn);
                fn.callCount.should.be.equal(1);
            },
            "injects context variables as parameters": function() {
                var result;
                function fn(a, b) {
                    result = _.map(arguments);
                }
                this.ctx
                    .map("a", 1)
                    .map("b", "string")
                    .invoke(fn)
                ;
                result.should.be.eql([1, 'string']);
            },
            "returns value returned by invoked functon": function() {
                var result = new Object();
                var fn = simple.stub();
                fn.returnWith(result);
                this.ctx.invoke(fn).should.be.equal(result);
            },
            "trows error on non-function": function() {
                (function() {
                    this.ctx.invoke("string");
                }).should.throw();
            }
        },

        "#inherit": {
            "returns new context": function() {
                this.ctx.inherit().should.be.not.equal(this.ctx);
            },
            "returns context with access to variables of parent context": function() {
                this.ctx
                    .map("a", 1)
                    .inherit()
                    .get("a")
                    .should.be.equal(1)
                ;
            }
        },

        "annotate": {
            "before": function() {
                this.annotate = this.Context.__get__("annotate");
            },
            "should annotate function with arg names": function() {
                this.annotate(function(a, b, c) { }).$inject.should.be.eql(["a", "b", "c"]);
            }
        }
    }
}
