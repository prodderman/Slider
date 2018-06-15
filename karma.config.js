module.exports = function (config) {
  config.set({
    frameworks: [
      'mocha', 'chai', 'source-map-support'
    ],

    remapIstanbulReporter: {
      reports: {
          html: 'coverage'
      },
    },

    files: [
      'node_modules/babel-polyfill/dist/polyfill.min.js',
      'test.index.js'
    ],

    exclude: [],

    preprocessors: {
      'test.index.js': 'webpack',
    },

    plugins: [
      "karma-chai",
      "karma-mocha",
      "karma-webpack",
      "karma-remap-istanbul",
      "karma-mocha-reporter",
      "karma-chrome-launcher",
      "karma-source-map-support",
      "karma-phantomjs-launcher",
    ],

    reporters: [
      'mocha', 'karma-remap-istanbul',
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_DEBUG,
    autoWatch: true,
    browsers: ['PhantomJS'],
    webpack: require('./webpack/test.config.js'),
    singleRun: false,
    concurrency: Infinity,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
