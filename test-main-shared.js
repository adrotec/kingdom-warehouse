var npmPath = '../node_modules';
var bowerPath = '../bower_components';
if(typeof CONFIG_SHARED_REQUIREJS !== 'undefined'){
  for(var key in CONFIG_SHARED_REQUIREJS.paths){
    CONFIG_REQUIREJS.paths[key] = CONFIG_SHARED_REQUIREJS.paths[key];
  }
  for(var key in CONFIG_SHARED_REQUIREJS.map['*']){
    CONFIG_REQUIREJS.map['*'][key] = CONFIG_SHARED_REQUIREJS.map['*'][key];
  }
  for(var key in CONFIG_SHARED_REQUIREJS.shim){
    CONFIG_REQUIREJS.shim[key] = CONFIG_SHARED_REQUIREJS.shim[key];
  }
}
var requirejsConfigJson = JSON.stringify(CONFIG_REQUIREJS);
requirejsConfigJson = requirejsConfigJson.replace(/bower\//g, bowerPath + '/');
requirejsConfigJson = requirejsConfigJson.replace(/npm\//g, npmPath + '/');
var requirejsConfig = JSON.parse(requirejsConfigJson);

var allTestFiles = [];
var TEST_REGEXP = /(\.spec)\.js$/i;

var pathToModule = function(path) {
  var replacedPath = path.replace(/^\/base\//, '').replace(/\.js$/, '');
  replacedPath = replacedPath.replace(/^src\//, '');
  return replacedPath;
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)
      && file.indexOf('bower_components') === -1 && file.indexOf('node_modules') === -1){
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/src',

  // dynamically load all test files
  deps: allTestFiles,
  paths: requirejsConfig.paths || {},
	map: requirejsConfig.map || {},
  shim: requirejsConfig.shim || {},

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
