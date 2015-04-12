var _ = require('lodash');
var should = require("should");
var simple = require("simple-mock");
var rewire = require("rewire");

module.exports = {
    "before": function() {
        this.Context = rewire("./logger");
    },

    "Logger": {
        "beforeEach": function() {
            this.ctx = this.Context.new();
        },


    }
}
