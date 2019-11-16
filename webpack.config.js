const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');



const ROOT_DIR = path.resolve(__dirname, './');
const DIST_DIR = path.resolve(ROOT_DIR, './dist');
​
module.exports = {
  entry: {
    app: ['./src/index.js'],
  },
  output: {
    filename: 'index.js',
    path: DIST_DIR,
  },
  resolve: {
    extensions: ['.js', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    historyApiFallback: true,
    inline: true,
    open: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    stats: {
      color: true,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          drop_console: true,
          output: {
            comments: false,
            beautify: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin({ DIST_DIR }),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),
  ],
};