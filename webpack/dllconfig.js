const path = require('path')
const webpack = require('webpack')

const {
	PATH_VENDOR_DIR,
	PATH_BUILD_DIR,
	PATH_VENDOR_ASSETS_DIR,
	RESOLVE,
} = require('./webpack.constants')

const vendor = [
	'@leadhub/lh-segment-designer/build/SegmentDesigner',
	'@roihunter/template-editor',
	'./src/can-dependencies',
	'babel-polyfill',
	'i18next',
	'immutable',
	'jquery',
	'lodash',
	'moment',
	'numeral',
	'react-dnd',
	'react-dom',
	'react-highcharts',
	'react-redux',
	'react-router',
	'react-select',
	'react',
	'redux',
	'select2',
]

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

const plugins = [
	new webpack.LoaderOptionsPlugin({
		minimize: isProduction,
		debug: isDevelopment,
	}),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
		},
	}),
	new webpack.DllPlugin({
		path: path.join(PATH_VENDOR_DIR, '[name]-manifest.json'),
		name: '[name]',
	}),
]

const output = {
	library: '[name]',
	path: (isProduction
		? PATH_BUILD_DIR
		: PATH_VENDOR_ASSETS_DIR
	),
	filename: (isProduction
		? '[name].[hash].js'
		: '[name].js'
	),
}

if (isProduction) {
	plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			mangle: {
				keep_fnames: true,
			},
		}),
		function () {
			this.plugin('done', (stats) => {
				require('fs').writeFileSync(
					path.join(PATH_BUILD_DIR, 'stats.vendor.json'),
					JSON.stringify(stats.toJson().assetsByChunkName, null, '\t'),
				)
			})
		},
	)
}

module.exports = {
	cache: isDevelopment,
	devtool: isDevelopment ? 'eval-source-map' : null,
	entry: {
		vendor,
	},
	output,
	plugins,
	resolve: RESOLVE,
	module: {
		noParse: [
			/(dojo|mootools|zepto|yui)\.js$/,
		],
	},
}
