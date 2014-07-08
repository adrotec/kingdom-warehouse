// Karma configuration

module.exports = function(config) {

  var files = {
    src: 'src/**/*.js',
//    test: 'src/**/*.spec.js'
  }

	var testFiles = [
		'node_modules/traceur/bin/traceur.js',
		'config.global-shared.js',
		'config.global.js',
    'node_modules/kingdom-warehouse/test-main-shared.js',
    'test-main.js',
    {pattern: 'node_modules/di/dist/amd/**/*.js', included: false},
    {pattern: 'bower_components/**/*.js', included: false},
		{pattern: files.src, included: false},
//		{pattern: files.test, included: false},
	];

  var preprocessors = {};
  preprocessors[files.src] = ['traceur'],
//  preprocessors[files.test] = ['traceur'],

  config.set({

    traceurPreprocessor: {
      options: {
        modules: 'amd',
        types: true,
//        typeAssertions: true,
//        typeAssertionModule: 'assert',
        annotations: true,
        sourceMap: true,
        experimental: true,
      }
    },

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'traceur', 'requirejs'],


    // list of files / patterns to load in the browser
    files: testFiles,


    // list of files to exclude
    exclude: [

    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: preprocessors,


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
