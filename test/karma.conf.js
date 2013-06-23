// Karma configuration
// Generated on Tue Jun 11 2013 17:22:52 GMT+0200 (CEST)

// base path, that will be used to resolve files and exclude
basePath = '../';

SCHNIPP_DEPS = [
    'dependencies/underscore.js',
    'dependencies/jqueryui/js/jquery-1.6.2.min.js'
]

SCHNIPP_MAX = [
    'src/schnipp.js',
    'src/schnipp/events.js',
    'src/schnipp/net.js',

    'src/schnipp/models.js',
    'src/schnipp/tree.js',
    'src/schnipp/ui.js',
    'src/schnipp/dynforms.js',
    'src/schnipp/dynforms/abstract_field.js',
    'src/schnipp/dynforms/primitive_field.js',
    'src/schnipp/dynforms/fields.js',
    'src/schnipp/dynforms/fields/checkbox.js',
    'src/schnipp/dynforms/fields/floatingpoint.js',
    'src/schnipp/dynforms/fields/form.js',
    'src/schnipp/dynforms/fields/integer.js',
    'src/schnipp/dynforms/fields/select.js',
    'src/schnipp/dynforms/fields/text.js',
    'src/schnipp/dynforms/fields/textarea.js',
    'src/schnipp/models/observable.js',
    'src/schnipp/models/entity.js',
    'src/schnipp/ui/dialog.js',
    'src/schnipp/ui/list.js'
];

SCHNIPP_TESTS_DEPS = [
    'dependencies/jquery-mockjax/jquery.mockjax.js'
];

SCHNIPP_TESTS = [
    'test/schnipp/**/*.js'
];

QUNIT_UI = 'test/karma_qunitui.js';

// list of files / patterns to load in the browser
files = [
  QUNIT_UI,
  QUNIT,
  QUNIT_ADAPTER,
]
.concat(SCHNIPP_DEPS)
.concat(SCHNIPP_MAX)
.concat(SCHNIPP_TESTS_DEPS)
.concat(SCHNIPP_TESTS);


// list of files to exclude
exclude = [
  
];


preprocessors = {
  'src/**/*.js': 'coverage'
};



// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['coverage', 'progress'];


coverageReporter = {
  type : 'html',
  dir : 'coverage/',
}


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = [];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
