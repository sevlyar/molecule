var _ = require('lodash');
var should = require("should");
var simple = require("simple-mock");
var rewire = require("rewire");

var Context = rewire("./context");

describe("Context", function() {
    beforeEach(function() {
        this.ctx = Context.new();
    })

    describe(".new", function() {
        it("returns new void context if called without parameters", function() {
            var ctx = Context.new();
            ctx.variables.should.be.eql({
                $context: ctx
            });
        });
        it("returns context with passed variables in argument", function() {
            var ctx = Context.new({
                a: 1
            });
            ctx.variables.should.be.eql({
                a: 1,
                $context: ctx
            });
        })
    })

    describe("#map", function() {
        it("map values", function() {
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
        });
        it("don't affects on parent context", function() {
            this.ctx
                .map("a", 1)
                .inherit()
                .map("a", 2)
            ;
            this.ctx.get("a").should.be.equal(1);
        });
    });

    describe("#get", function() {
        it("returns mapped value for exists key", function() {
            var o = { };
            this.ctx
                .map("obj", o)
                .get("obj").should.be.eql(o)
            ;
        });
        it("throws exeption for unknown key", function() {
            (function() {
                this.ctx.get("notRegistered");
            }).should.throw();
        });
        it("supports lazzy initialization", function() {
            var val = 1;
            function init() {
                return val++;
            }
            this.ctx.map("key", Context.lazzyInit(init));
            val.should.be.equal(1);
            this.ctx.get("key").should.be.equal(1);
            this.ctx.get("key");
            val.should.be.equal(2);
        });
    });

    describe("#invoke", function() {
        it("invokes given function", function() {
            var fn = simple.spy(function() {});
            this.ctx.invoke(fn);
            fn.callCount.should.be.equal(1);
        });
        it("injects context variables as parameters", function() {
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
        });
        it("returns value returned by invoked functon", function() {
            var result = new Object();
            var fn = simple.stub();
            fn.returnWith(result);
            this.ctx.invoke(fn).should.be.equal(result);
        })
        it("trows error on non-function", function() {
            (function() {
                this.ctx.invoke("string");
            }).should.throw();
        });
    });

    describe("#inherit", function() {
        it("returns new context", function() {
            this.ctx.inherit().should.be.not.equal(this.ctx);
        });
        it("returns context with access to variables of parent context", function() {
            this.ctx
                .map("a", 1)
                .inherit()
                .get("a")
                .should.be.equal(1)
            ;
        });
    });

    describe("annotate", function() {
        before(function() {
            this.annotate = Context.__get__("annotate");
        });
        it("should annotate function with arg names", function() {
            this.annotate(function(a, b, c) { }).$inject.should.be.eql(["a", "b", "c"]);
        });
    })
});