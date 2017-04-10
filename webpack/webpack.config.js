import webpack from 'webpack'

import {
	PATH_SOURCE_DIR,
	PATH_BUILD_DIR,
	PATH_ASSETS_DIR,
	WEBPACK_DEVSERVER_IP,
} from '../project.constants'


export default () => {

	const config = {
		cache: true,
		devtool: 'eval-source-map',
		entry: {
			main: [
				'react-hot-loader/patch',
				`webpack-dev-server/client?${WEBPACK_DEVSERVER_IP}`,
				'webpack/hot/only-dev-server',
				'./src/main.js',
			],
		},
		output: {
			path: PATH_BUILD_DIR,
			filename: '[name].js',
			publicPath: `${WEBPACK_DEVSERVER_IP}/build/`,
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
					include: [
						PATH_SOURCE_DIR,
					],
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
		plugins: [
			new webpack.LoaderOptionsPlugin({
				minimize: false,
				debug: true,
			}),
			new webpack.DefinePlugin({
				'process.env': {
					NODE_ENV: JSON.stringify(process.env.NODE_ENV),
				},
			}),
			/*new webpack.DllReferencePlugin({
				context: '.',
				manifest: require('../dll/vendor-manifest.json'),
			}),*/
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),
			new webpack.NoEmitOnErrorsPlugin(),
		],
	}

	return config
}
