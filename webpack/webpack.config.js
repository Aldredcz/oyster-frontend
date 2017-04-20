import webpack from 'webpack'
import fs from 'fs'
import path from 'path'

import {
	PATH_BUILD_DIR,
	PATH_ASSETS_DIR,
	WEBPACK_DEVSERVER_IP,
} from '../project.constants'


export default (params) => {
	const isDev = Boolean(params && params.isDev)
	const isTest = Boolean(params && params.isTest)

	const hotReloadEntries = [
		'react-hot-loader/patch',
		`webpack-dev-server/client?${WEBPACK_DEVSERVER_IP}`,
		'webpack/hot/only-dev-server',
	]

	const config = {
		cache: isDev,
		bail: !isDev,
		devtool: isTest
			? '#inline-source-maps'
			: isDev ? '#eval-source-map' : '#source-map',
		entry: {
			main: [
				...(isDev ? hotReloadEntries : []),
				'./src/main.js',
			],
		},
		output: {
			path: PATH_BUILD_DIR,
			filename: isDev ? '[name].js' : '[name].[hash].js',
			publicPath: isDev ? `${WEBPACK_DEVSERVER_IP}/build/` : '/build/',
		},
		resolve: {
			modules: [
				'./src',
				'node_modules',
			],
			alias: {
				'assets': PATH_ASSETS_DIR,
			},
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							cacheDirectory: true,
						},
					},
				},
				{
					test: /\.styl$/,
					use: [
						{
							loader: 'style-loader',
							options: {
								sourceMap: true,
							},
						},
						{
							loader: 'css-loader',
							options: {
								sourceMap: true,
							},
						},
						'stylus-loader',
					],
				},
			],
		},
		node: {
			fs: 'empty',
		},
		plugins: do {
			const plugins = [
				new webpack.LoaderOptionsPlugin({
					minimize: !isDev,
					debug: isDev,
				}),
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: JSON.stringify(process.env.NODE_ENV),
					},
				}),
				new webpack.DllReferencePlugin({
					context: '.',
					manifest: require('../dll/libs-manifest.json'),
				}),
			]

			if (isDev) {
				plugins.push(
					new webpack.HotModuleReplacementPlugin(),
					new webpack.NamedModulesPlugin(),
					new webpack.NoEmitOnErrorsPlugin(),
				)
			} else if (!isTest) {
				plugins.push(
					new webpack.optimize.UglifyJsPlugin({
						compress: {
							// Because uglify reports so many irrelevant warnings.
							warnings: false,
						},
						mangle: {
							keep_fnames: true, // eslint-disable-line camelcase
						},
					}),
					//new ExtractTextPlugin('[name].[contenthash].css'),
					function () {
						this.plugin('done', (stats) => {
							fs.writeFileSync(
								path.join(PATH_BUILD_DIR, 'stats.dist.json'),
								JSON.stringify(stats.toJson().assetsByChunkName, null, '\t'),
							)
						})
					},
				)
			}

			plugins // final expression in do-block
		},
	}

	return config
}
