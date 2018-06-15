const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..', 'src'),
  entry: {
    test: '../test.index.js'
  },
  resolve: {
    modules: [
      'node_modules', 'src'
    ],
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              logLevel: 'debug',
              target: 'es5',
              compilerOptions: {
                inlineSourceMap: true,
              }
            }
          }
        ]
      }, {
        test: /\.ts$/,
        enforce: 'post',
        include: path.resolve('src'),
        exclude: [
          /node_modules/, /-test\.ts$/
        ],
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: {
            esModules: true,
            produceSourceMap: true
          }
        }
      }, {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }, {
        test: /\.scss$/,
        loader: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.(png|jpg|svg|ttf|eot|woff|woff2|gif)$/,
        loader: 'file-loader?name=[path][name].[ext]'
      }
    ]
  },

  plugins: [
    new CleanPlugin(['./coverage'], { root: path.resolve(__dirname, '..') }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('test')
    })]
}
