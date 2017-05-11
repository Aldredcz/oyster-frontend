import gutil from 'gulp-util'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

import {
	WEBPACK_DEVSERVER_PORT,
	WEBPACK_DEVSERVER_IP,
} from '../project.constants'

export default function (webpackConfig) {
	return function (callback) {
		new webpackDevServer(webpack(webpackConfig), {
			hot: true,
			headers: {'Access-Control-Allow-Origin': '*'},
			publicPath: webpackConfig.output.publicPath,
			// Remove console.log mess during watch.
			stats: {
				assets: false,
				colors: true,
				version: false,
				hash: false,
				//timings: false,
				chunks: false,
				chunkModules: false,
			},
		}).listen(WEBPACK_DEVSERVER_PORT, 'localhost', (err) => {
			// Callback is called only once, can't be used to catch compilation errors.
			if (err) {
				throw new gutil.PluginError('webpack-dev-server', err)
			}

			gutil.log('[webpack-dev-server]', `${WEBPACK_DEVSERVER_IP}/build/main.js`)
			callback()
		})
	}
}
