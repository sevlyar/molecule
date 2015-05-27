## Context

```javascript
var Context = require("molecule").Context;

var context = Context.new();
context.map("str", "some string");

context.has("str"); // true
context.get("str"); // "some string" 
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

base.has("b"); // true
base.has("c"); // false
child.has("b"); // true
child.has("c"); // true
child.get("b"); // 1
base.get("c"); // exception "Variable 'c' not found in context"

base.map("b", 2); // an exception is thrown
child.map("b", 3);
base.get("b"); // 1
child.get("b"); // 3
```

## Parameters injection



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
context.invoke(midding); // an exception is thrown

function chain($context) {
	return $context.invoke(f);
}
context.invoke(chain); // returns "some string 1"
```




