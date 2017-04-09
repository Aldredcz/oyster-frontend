import fs from 'fs-extra'
import path from 'path'
import yargs from 'yargs'
import spawnProcess from 'cross-spawn-async'
import runSequence from 'run-sequence'

import gulp from 'gulp'
import bg from 'gulp-bg'

//import webpackBuild from './webpack/build'
import webpackDevServer from './webpack/devserver'

import createWebpackConfig from './webpack/webpack.config'

const args = yargs
	.alias('p', 'production') // bool flag switching development/production enviroment
	.default({
		production: false,
	})
	.argv


process.env.NODE_ENV = args.production ? 'production' : 'development'

function hideStackTrace (done, message = '[see above]') {
	return (exitCode) => {
		if (exitCode) {
			exitCode = new Error(message)
			exitCode.showStack = false
		}

		done(exitCode)
	}
}

gulp.task('clean', () => {
	fs.removeSync(path.join(__dirname, '/build'))
	fs.removeSync(path.join(__dirname, '/dist'))
})

gulp.task('eslint', (done) => {
	spawnProcess('npm', ['run', '--silent', 'eslint'], {stdio: 'inherit'})
		.on('close', hideStackTrace(done))
})

gulp.task('build-webpack-dev', (done) => {
	webpackDevServer(
		createWebpackConfig(),
	)(done)
})

gulp.task('build-webpack', [process.env.NODE_ENV === 'production'
		? 'build-webpack-production'
		: 'build-webpack-dev'],
)

gulp.task('build', (done) =>
	runSequence(
		'clean',
		'build-webpack',
		done,
	),
)

gulp.task('server', ['build'], bg('node', '--max_old_space_size=8192', './src/server'))

gulp.task('default', ['server'])
