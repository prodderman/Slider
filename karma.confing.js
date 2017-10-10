const webpack = require('./webpack/dev.config.js');

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: [
      'mocha', 'chai'
    ],

    coverageReporter: {
      dir:'coverage/',
      reporters: [
        { type:'html', subdir: 'report-html' },
        { type:'lcov', subdir: 'report-lcov' }
      ],
      instrumenterOptions: {
        istanbul: { noCompact:true }
      }
    },

    files: [
      'node_modules/babel-polyfill/dist/polyfill.min.js',
      'test.index.js'
    ],

    exclude: [],

    preprocessors: {
      'test.index.js': ['webpack', 'coverage']
    },

    plugins: [
      'karma-chai',
      'karma-mocha',
      'karma-coverage',
      'karma-webpack', 
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
      'karma-sourcemap-loader'
    ],

    reporters: [
      'mocha', 'coverage'
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    webpack: {
      module: webpack.module,
      resolve: webpack.resolve
    },
    singleRun: false,
    concurrency: Infinity,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
