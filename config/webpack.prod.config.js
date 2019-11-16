const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const base = require('./webpack.base.config.js');

const ROOT_DIR = path.resolve(__dirname, '../');
const SRC_DIR = path.resolve(ROOT_DIR, 'src');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

module.exports = merge(base, {
	mode: 'production',
	entry: {
		question: `${SRC_DIR}/index.js`,
	},
	output: {
		filename: 'index.js',
		path: DIST_DIR,
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [DIST_DIR],
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			inject: 'body',
			filename: 'answer.html',
		}),
	],
	devtool: 'inline-source-map',
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					drop_console: false,
					output: {
						comments: true,
						beautify: true,
					},
				},
			}),
		],
	},
});
