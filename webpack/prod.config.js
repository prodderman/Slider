const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixer = require('autoprefixer');

module.exports = {
  context: path.resolve(__dirname, '..', 'src'),
  entry: {
    app: './slider.ts'
  },

  output: {
    publicPath: "",
    filename: 'slider.js',
    path: path.resolve(__dirname, '..', 'build')
  },

  resolve: {
    modules: [
      'node_modules', 'src'
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader?importLoaders=1', {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [autoprefixer({browsers: ['last 2 versions']})];
                }
              }
            },
            'sass-loader'
          ]
        })
      }, {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0']
          }
        },
        exclude: /node_modules/,
      }, {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'] }
          },
          'ts-loader',
        ],
        exclude: [/node_modules/, /-test\.ts$/],
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({use: 'css-loader'})
      }, {
        test: /\.(ico|png|jpg|svg|gif)$/,
        use: 'file-loader?name=fonts/[hash].[ext]'
      }, {
        test: /\.(png|svg)/,
        loader: 'url-loader',
        options: {
          name: 'images/[name].[ext]',
          limit: 10000
        }
      }
    ]
  },

  plugins: [
    new CleanPlugin(['./build'], { root: path.resolve(__dirname, '..') }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    }),
    new ExtractTextPlugin({filename: "[name].css", allChunks: true})
  ]
}