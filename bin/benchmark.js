#!/usr/bin/env node
var Benchmark = require("benchmark").Benchmark;

molecule = require("../index");
var result;

var bench = new Benchmark.Suite("Context")

bench
    .add("Context.new/0", {
        fn: function() {
            result = molecule.Context.new();
        }
    })
    .add("Context.new/1", {
        setup: function() {
            var initValue = {
                a: 1,
                b: "string"
            }
        },
        fn: function() {
            result = molecule.Context.new(initValue);
        }
    })
    .add("Context#inherit/1", {
        setup: setupContext,
        fn: function() {
            result = context.inherit();
        }
    })
    .add("Context#inherit/2", {
        setup: setupContext,
        fn: function() {
            context = context.inherit();
        }
    })
    .add("Context#get", {
        setup: setupContext,
        fn: function() {
            result = context.get("d");
        }
    })
;

function setupContext() {
    var context = molecule.Context.new({
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e"
    });
}

bench
    .add("Context#get/lazzy", {
        setup: function() {
            var context = molecule.Context.new();
            var value = new Object();
            function initializer() {
                return value;
            }
        },
        fn: function() {
            context.map("lazzy", initializer);
            result = context.get("lazzy");
        }
    })
;

bench
    .add("Context#invoke/0", {
        setup: setupInvoke(0),
        fn: fnInvoke
    })
    .add("Context#invoke/1", {
        setup: setupInvoke(1),
        fn: fnInvoke
    })
    .add("Context#invoke/2", {
        setup: setupInvoke(2),
        fn: fnInvoke
    })
    .add("Context#invoke/3", {
        setup: setupInvoke(3),
        fn: fnInvoke
    })
    .add("native-call/3", {
        setup: setupInvoke(3),
        fn: function() {
            func(context.get("a"), context.get("b"), context.get("c"));
        }
    })
;

function setupInvoke(n) {
    var fn = function() {
        var context = molecule.Context.new({a: "string", b: 1, c: 2});
        var func = function(ARGS) {
            result = arguments.a;
        }
    }
    return eval("("+fn.toString().replace("ARGS", ["c", "b", "a"].slice(3-n).join(", "))+")");
}

function fnInvoke() {
    context.invoke(func);
}

bench
    .on("cycle", function(event) {
        console.log(String(event.target));
    })
    .on("error", function(event) {
        console.log(event.target.error);
        console.log(event.target.compiled);
    })
    .run({ "async": true })
;