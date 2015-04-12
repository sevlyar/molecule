var _ = require('lodash');

module.exports = Context;

function Context(vars) {
    if (vars && typeof vars != "object") {
        throw new Error("Parameter should be object");
    }
    this.variables = vars || {};
    this.variables.$context = this;
}

Context.new = function(vars) {
    return new Context(vars);
};

Context.prototype.inherit = function() {
    function V() {}
    V.prototype = this.variables;
    return new Context(new V());
};

Context.prototype.isInheritedFrom = function(parent) {
    return parent.variables.isPrototypeOf(this.variables);
};

Context.prototype.map = function(name, value) {
    // TODO: add ability to pass object
    this.variables[name] = value;
    return this;
};

Context.prototype.has = function(name) {
    return name in this.variables;
};

Context.prototype.invoke = function(fn) {
    annotate(fn);
    var args = mapArguments(fn.$inject, this);
    return invoke(fn, args);
};

Context.prototype.get = function(varName) {
    if (!this.has(varName)) {
        throw new Error("Variable '" + varName + "' not found in context");
    }
    arg = this.variables[varName];
    if (isInitializer(arg)) {
        this.variables[varName] = arg = this.invoke(arg);
    }
    return arg;
};

Context.prototype.isInitialized = function(varName) {
    if (!this.has(varName)) {
        throw new Error("Variable '" + varName + "' not found in context");
    }
    return !isInitializer(this.variables[varName]);
};

var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function annotate(fn) {
    if (typeof fn != 'function') {
        throw new Error('argument must be function');
    }
    if (!fn.$inject) {
        var $inject = [];
        var fnText = fn.toString().replace(STRIP_COMMENTS, '');
        var argDecl = fnText.match(FN_ARGS);
        _.each(argDecl[1].split(FN_ARG_SPLIT), function(arg) {
            arg.replace(FN_ARG, function(all, underscore, name) {
                $inject.push(name);
            });
        });
        fn.$inject = $inject;
    }
    return fn;
}

function mapArguments(argNamesList, context) {
    return _.map(argNamesList, function(argName) {
        return context.get(argName);
    });
}

function invoke(fn, args) {
    if (!fn.$constructor) {
        return fn.apply(null, args);
    }
    var F = function(){};
    F.prototype = fn.prototype;
    obj = new F();
    fn.apply(obj, args);
    return obj;
}

var INITIALIZER_MARK = "__isInitializer";
Context.initializer = function(fn) {
    if (typeof fn != "function") {
        throw new Error("Invalid argument");
    }
    fn[INITIALIZER_MARK] = true;
    return fn;
}

function isInitializer(fn) {
    return !!(typeof fn == "function" && fn[INITIALIZER_MARK]);
}