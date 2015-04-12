var _ = require("lodash");
var filepath = require("path");
var glob = require("glob");

Context = require("./context");

module.exports = loader; 

function loader(path) {
    var resolvedPath = resolvePath(path);
    return Context.initializer(function($context) {
        return loadModule(resolvedPath, $context);
    });
}

loader.load = load;

function load(path, $context) {
    var resolved = resolvePath(path);
    var filenames = glob.sync(resolved);
    return _.reduce(filenames, function(result, filename) {
        var moduleName = filepath.basename(filename, ".js");
        var module = loadModule(filename, $context);
        result[moduleName] = module;
        return result;
    }, {});
}

// TODO: запоминать уже загруженные модули и при повторной загрузке бросать исключение при соотв-их настройках
function loadModule(path, $context) {
    var module = require(path);
    var childContext = $context.inherit();
    _.each(module.$require, function(path, name) {
        if (!$context.has(name)) {
            childContext.map(name, loader(path));
        }
    });
    return childContext.invoke(module);
}

loader.resolve = resolvePath;

function resolvePath(path) {
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
