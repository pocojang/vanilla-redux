const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const base = require('./webpack.base.config.js');
const ROOT_DIR = path.resolve(__dirname, '../');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');

module.exports = merge(base, {
	mode: 'development',
	entry: {
		question: `${SRC_DIR}/index.js`,
	},
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		compress: true,
		contentBase: DIST_DIR,
		open: true,
		port: 3000,
		historyApiFallback: true,
		hot: true,
		inline: true,
		overlay: {
			warnings: true,
			errors: true,
		},
		stats: {
			color: true,
		},
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new ProgressBarPlugin({
			format: 'Build [:bar] :percent (:elapsed seconds)',
			clear: false,
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			inject: 'body',
			hash: true,
			showErrors: true,
		}),
	],
});
