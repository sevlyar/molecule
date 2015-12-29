var reduce = require('lodash/collection/reduce');
var each = require('lodash/collection/each');
var filepath = require("path");
var glob = require("glob");

Context = require("./context");

module.exports = loader;

function loader(path, context) {
    var resolvedPath = resolvePath(path);
    return Context.initializer(function($context) {
        $context = context || $context && $context.inherit();
        return load(path, $context);
    });
}

loader.load = load;

function load(path, context) {
    context = context || Context.new();
    var resolved = resolvePath(path);
    var filenames = glob.sync(resolved);
    if (filenames.length === 0 || filenames[0] == resolved) {
        return loadModule(resolved, context);
    }
    return reduce(filenames, function(result, filename) {
        var moduleName = filepath.basename(filename, ".js");
        var module = loadModule(filename, context);
        result[moduleName] = module;
        return result;
    }, {});
}

// TODO: запоминать уже загруженные модули и при повторной загрузке бросать исключение при соотв-их настройках
function loadModule(path, context) {
    var module = require(path);
    each(module.$require, function(path, name) {
        if (!context.has(name)) {
            context.map(name, loader(path));
        }
    });
    try {
        return context.invoke(module);
    } catch(err) {
        throw new Error(["unable load module " + path, err.toString()], err);
    }
}

loader.resolve = resolvePath;

function resolvePath(path) {
    if (filepath.isAbsolute(path)) {
        return path;
    }
    path = filepath.join(getProjectRootDir(), path);
    return filepath.normalize(path);
}

var projectRootDir = null;
function getProjectRootDir() {
    return projectRootDir || findProjectRootDir();
}

function findProjectRootDir() {
    projectRootDir =
        process.env.PROJECT_ROOT ||
        findProjectRootDirBy("node_modules") ||
        findProjectRootDirBy("lib") ||
        (function() {
            throw new Error("Unable find project root dir. Use PROJECT_ROOT environment variable.");
        })()
    ;
    return projectRootDir;
}

function findProjectRootDirBy(dirName) {
    var i = __dirname.indexOf(dirName);
    if (i > 0) {
        return __dirname.slice(0, i);
    }
    return null;
}
