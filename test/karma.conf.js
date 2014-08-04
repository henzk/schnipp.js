module.exports = function(config) {
config.set({
  // your config
        // Karma configuration
        // Generated on Tue Jun 11 2013 17:22:52 GMT+0200 (CEST)

        // base path, that will be used to resolve files and exclude
        basePath : '../',
        frameworks: ['qunit'],
        
        files : [
            'test/karma_qunitui.js',
            
            'dependencies/underscore.js',
            'dependencies/jqueryui/js/jquery-1.6.2.min.js',
            
            'src/schnipp.js',
            'src/schnipp/events.js',
            'src/schnipp/net.js',

            'src/schnipp/models.js',
            'src/schnipp/tree.js',
            'src/schnipp/ui.js',
            'src/schnipp/dynforms.js',
            'src/schnipp/dynforms/abstract_field.js',
            'src/schnipp/dynforms/abstractselect.js',
            'src/schnipp/dynforms/primitive_field.js',
            'src/schnipp/dynforms/fields.js',
            'src/schnipp/dynforms/fields/checkbox.js',
            'src/schnipp/dynforms/fields/floatingpoint.js',
            'src/schnipp/dynforms/fields/form.js',
            'src/schnipp/dynforms/fields/integer.js',
            'src/schnipp/dynforms/fields/select.js',
            'src/schnipp/dynforms/fields/text.js',
            'src/schnipp/dynforms/fields/textarea.js',
            'src/schnipp/dynforms/fields/dropdownselect.js',
            'src/schnipp/models/observable.js',
            'src/schnipp/models/entity.js',
            'src/schnipp/ui/dialog.js',
            'src/schnipp/ui/list.js',
            
            'dependencies/jquery-mockjax/jquery.mockjax.js',
            
            'test/schnipp/**/*.js'
        ],


        // list of files to exclude
        exclude : [
          
        ],


        preprocessors : {
          'src/**/*.js': 'coverage'
        },

        plugins: [
          // these plugins will be require() by Karma
          'karma-coverage',
          'karma-qunit',
          'karma-phantomjs-launcher'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit'
        reporters : ['coverage', 'progress'],


        coverageReporter : {
          type : 'html',
          dir : 'coverage/',
        },


        // web server port
        port : 9876,


        // cli runner port
        runnerPort : 9100,


        // enable / disable colors in the output (reporters and logs)
        colors : true,



        // enable / disable watching file and executing tests whenever any file changes
        autoWatch : true,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers : ['PhantomJS'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout : 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun : false,

});
};

