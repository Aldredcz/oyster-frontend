const path = require('path')
const webpack = require('webpack')

const {
	PATH_DLL_DIR,
	PATH_BUILD_DIR,
	PATH_ASSETS_DIR,
} = require('../project.constants')


module.exports = (params) => {
	const isDev = Boolean(params && params.isDev)

	const config = {
		cache: isDev,
		devtool: isDev ? '#module-source-map' : '#source-map',
		entry: {
			libs: [
				'babel-polyfill',
				'isomorphic-fetch',
				'react',
				'react-dom',
				'mobx',
				'mobx-react',
			],
		},
		output: {
			library: '[name]',
			path: (!isDev
					? PATH_BUILD_DIR
					: path.join(PATH_ASSETS_DIR, 'dll')
			),
			filename: (!isDev
					? '[name].[hash].js'
					: '[name].js'
			),
		},
		plugins: do {
			const plugins = [
				new webpack.LoaderOptionsPlugin({
					minimize: !isDev,
					debug: isDev,
				}),
				new webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: JSON.stringify(isDev ? 'development' : 'production'),
					},
				}),
				new webpack.DllPlugin({
					path: path.join(PATH_DLL_DIR, '[name]-manifest.json'),
					name: '[name]',
				}),
			]

			if (!isDev) {
				plugins.push(
					new webpack.optimize.UglifyJsPlugin({
						mangle: {
							'keep_fnames': true,
						},
					}),
					function () {
						this.plugin('done', (stats) => {
							require('fs').writeFileSync(
								path.join(PATH_BUILD_DIR, 'stats.dll.json'),
								JSON.stringify(stats.toJson().assetsByChunkName, null, '\t'),
							)
						})
					},
				)
			}

			plugins // final expression in do-block
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
	}

	return config
}
