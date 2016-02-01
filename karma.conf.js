// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-08-13 using
// generator-karma 0.9.0

module.exports = function (config) {
    'use strict';


    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: './project/',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-cookies/angular-cookies.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/angular-aria/angular-aria.js',
            'bower_components/angular-messages/angular-messages.js',
            'bower_components/angular-material/angular-material.js',

            'app/rd.main/app.js',
            'app/rd.main/rd.events.js',
            'app/rd.main/services/rd.config.svc.js',
            'app/rd.main/services/rd.context.svc.js',
            'app/rd.main/controllers/rd.main.ctrl.js',

            'app/rd.layout/rd.layout.routing.js',
            'app/rd.layout/controllers/rd.404.ctrl.js',
            'app/rd.layout/controllers/rd.header.ctrl.js',
            'app/rd.layout/controllers/rd.layout.ctrl.js',
            'app/rd.layout/controllers/rd.leftSide.ctrl.js',
            'app/rd.layout/controllers/rd.rightSide.ctrl.js',

            'app/rd.common/rd.common.js',

            '../.tmp/templateCache.js'
        ],
        // list of files / patterns to exclude
        exclude: [],

        reporters: ['spec', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'app/**/!(*spec).js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            reporters:[
                {type: 'html', dir:'../coverage/'},
                {type: 'text-summary'}
            ]
        },

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-spec-reporter'
        ],

        specReporter: {
            maxLogLines: 5
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
