const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..', 'src'),
  entry: {
    app: './index.ts'
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '..', 'demo')
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
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
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
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({filename: 'index.html', template: `./index.html`}),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.NamedModulesPlugin()
  ],

  devServer: {
    port: 8080,
    inline: true,
    hot: true,
    lazy: false,
    contentBase: "build",
    historyApiFallback: true,
    stats: 'errors-only'
  }
}