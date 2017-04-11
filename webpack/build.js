import webpack from 'webpack'
import gutil from 'gulp-util'

export default function (webpackConfig) {
	return function (callback) {
		webpack(webpackConfig, (fatalError, stats) => {
			if (fatalError) {
				throw new gutil.PluginError('webpack', fatalError)
			}

			if (stats) {
				const jsonStats = stats.toJson()
				const buildError = jsonStats.errors[0]

				if (buildError) {
					throw new gutil.PluginError('webpack', buildError)
				}

				process.env.BUILD_HASH = jsonStats.hash
				/*const mainChunk = jsonStats.assetsByChunkName.main
				if (mainChunk && typeof mainChunk.filter === 'function') { // `devtool: inline-source-maps` causes this to be undefined
					process.env.BUILD_CSS_FILE = jsonStats.assetsByChunkName.main.filter(
						(val) => val.match(/^main\..*\.css$/),
					)[0]
				}*/

				gutil.log('[webpack]', stats.toString({
					colors: true,
					version: false,
					hash: false,
					timings: false,
					chunks: false,
					chunkModules: false,
				}))

			}

			callback()
		})
	}
}
