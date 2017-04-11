import fs from 'fs-extra'
import path from 'path'
import yargs from 'yargs'
import spawnProcess from 'cross-spawn-async'
import runSequence from 'run-sequence'
import jade from 'jade'
import gulp from 'gulp'
import bg from 'gulp-bg'

import webpackBuild from './webpack/build'
import webpackDevServer from './webpack/devserver'
import createWebpackConfig from './webpack/webpack.config'

import PROJECT_CONSTANTS from './project.constants'

const args = yargs
	.alias('p', 'production') // bool flag switching development/production enviroment
	.alias('d', 'deployConfig') // devel / staging / production
	.default({
		production: false,
		deployConfig: 'devel',
		port: PROJECT_CONSTANTS.EXPRESS_SERVER_PORT,
	})
	.argv


process.env.NODE_ENV = args.production ? 'production' : 'development'
process.env.SERVER_PORT = args.port
process.env.DEPLOY_CONFIG = args.deployConfig

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
	fs.removeSync(PROJECT_CONSTANTS.PATH_BUILD_DIR)
	fs.removeSync(PROJECT_CONSTANTS.PATH_DIST_DIR)
})

gulp.task('generate-html', () => {
	fs.mkdirSync(PROJECT_CONSTANTS.PATH_DIST_DIR)

	const jadeOptions = {
		env: process.env.NODE_ENV,
		buildHash: process.env.BUILD_HASH,
		PROJECT_CONSTANTS,
	}

	fs.writeFileSync(
		path.join(PROJECT_CONSTANTS.PATH_DIST_DIR, '/index.html'),
		jade.renderFile(path.join(PROJECT_CONSTANTS.PATH_BASE_DIR, 'src/server/views/main.jade'), jadeOptions),
	)
})

gulp.task('copy-files', () => {
	fs.copySync(
		path.join(__dirname, '/build'),
		path.join(PROJECT_CONSTANTS.PATH_DIST_DIR, '/build'),
	)

	fs.copySync(
		path.join(__dirname, '/assets'),
		path.join(PROJECT_CONSTANTS.PATH_DIST_DIR, '/assets'),
	)
})

gulp.task('test', (done) => runSequence(
	'eslint',
	'testBuild',
	hideStackTrace(done),
))

gulp.task('testBuild', (done) => runSequence(
	'clean',
	//'build-vendor',
	'build-webpack-test',
	done,
))

gulp.task('eslint', (done) => {
	spawnProcess('npm', ['run', '--silent', 'eslint'], {stdio: 'inherit'})
		.on('close', hideStackTrace(done))
})

gulp.task('build-webpack-test', (done) => {
	webpackBuild(
		createWebpackConfig({isTest: true}),
	)(done)
})

gulp.task('build-webpack-dev', (done) => {
	webpackDevServer(
		createWebpackConfig({isDev: true}),
	)(done)
})

gulp.task('build-webpack-production', (done) => {
	webpackBuild(
		createWebpackConfig({isDev: false}),
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

gulp.task('deploy', (done) => {
	if (process.env.NODE_ENV !== 'production') {
		console.log('Can\'t run deploy task in development enviroment') // eslint-disable-line no-console
		done()

		return
	}

	runSequence(
		'eslint',
		'build',
		'generate-html',
		'copy-files',
		done,
	)
})
