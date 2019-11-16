const webpack = require('webpack');
const path = require('path');
const server = process.env.SERVER || 'dev';

const ROOT_DIR = path.resolve(__dirname, '../');

module.exports = {
	resolve: {
		extensions: ['.js'],
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
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: false,
						},
					},
				],
			},
		],
	},
};
