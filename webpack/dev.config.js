const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..', 'src'),
  entry: {
    app: './index.js'
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, '..', 'demo')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0']
          }
        },
        exclude: /node_modules/
      }, {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      }, {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }, {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?importLoaders=2',
          'sass-loader',
        ],
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