import gutil from 'gulp-util'
import webpack from 'webpack'
import webpackDevServer from 'webpack-dev-server'

import {
	DEVSERVER_PORT,
	DEVSERVER_IP
} from '../project.constants'

export default function (webpackConfig) {
	return function (callback) {
		new webpackDevServer(webpack(webpackConfig), {
			hot: true,
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
		}).listen(DEVSERVER_PORT, 'localhost', (err) => {
			// Callback is called only once, can't be used to catch compilation errors.
			if (err) {
				throw new gutil.PluginError('webpack-dev-server', err)
			}

			gutil.log('[webpack-dev-server]', `${DEVSERVER_IP}/build/main.js`)
			callback()
		})
	}
}
