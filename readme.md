# Context

```javascript
var Context = require("molecule").Context;

var context = Context.new();
context.map("str", "some string");

context.has("str"); // true
context.get("str"); // "some string"

context.get("$context"); // returns self (context)
```

## Contexts Inheritance

Data registered in the child context is not visible in the parent context. And vice versa: Data registered in the parent context is visible in the child context.

Unable to register data with the same names twice in context. But parent and child contexts might to contain different data with the same names.

```javascript
var Context = require("molecule").Context;

var base = Context.new();
var child = base.inherit();
base.map("b", 1);
child.map("c", 2);

base.has("b");  // true
base.has("c");  // false
child.has("b"); // true
child.has("c"); // true
child.get("b"); // 1
base.get("c");  // exception "Variable 'c' not found in context"

base.map("b", 2); // an exception is thrown
child.map("b", 3);
base.get("b");  // 1
child.get("b"); // 3
```

## Arguments injection

**Context#invoke(f)**

Injects arguments by name into invoked function.

Method throws exception if data with required name missing in context.

```javascript
var Context = require("molecule").Context;

var context = Context.new();
context.map("arg1", "some string");
context.map("arg2", 1);

function f(arg1, arg2) {
	return arg1 + " " + arg2;
}
context.invoke(f); // returns "some string 1"

function missing(arg1, unknown) {}
context.invoke(missing); // an exception is thrown

function chain($context) {
	return $context.invoke(f);
}
context.invoke(chain); // returns "some string 1"
```

## Lazy initialization

Context supports lazy initialization of data by functions. Function invoked by Context#invoke and it is possible to inject into it the data registered in context.

```javascript
var Context = require("molecule").Context;

function init(arg1) {
	return arg1 + 1;
}

var context = Context.new();
context.map("arg1", 1);
context.map("arg2", Context.initializer(init));

context.isInitialized("arg2"); // false
context.get("arg2"); // 2
context.isInitialized("arg2"); // true
```

# Loader

```javascript
// lib/a.js
var A = module.exports = function(b) {
	this.f = function() {
    	return b.f();
    }
};
A.$constructor = true;
A.$require = {
	b: "lib/b"
}
```

```javascript
// lib/b.js
var B = module.exports = function() {
	return {
    	f: function() {
        	return "str";
        }
    }
};
```

## Module loading and wiring

Loader preregister required module dependencies in context as module loader. 

```javascript
var molecule = require("molecule");

var moduleALoader = molecule.loader("lib/a", molecule.Context.new());
var moduleAInstance = moduleALoader();

moduleAInstance.f(); // "str"
```

## Mocking module dependencies

It is possible to mock the dependency of module if preregister the data in context with required name.

```javascript
var molecule = require("molecule");

var context = molecule.Context.new();
context.map("b", {
	f: function() { return 1; }
});
var moduleALoader = molecule.loader("lib/a", context);
var moduleAInstance = moduleALoader();

moduleAInstance.f(); // 1
```
