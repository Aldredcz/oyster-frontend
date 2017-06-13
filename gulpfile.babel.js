import fs from 'fs-extra'
import path from 'path'
import yargs from 'yargs'
import runSequence from 'run-sequence'
import jade from 'jade'
import gulp from 'gulp'
import bg from 'gulp-bg'
import webpack from 'webpack'

import webpackBuild from './webpack/build'
import webpackDevServer from './webpack/devserver'
import createWebpackConfig from './webpack/webpack.config'
import createWebpackDllConfig from './webpack/webpack.dllconfig'

import PROJECT_CONSTANTS from './project.constants'

const args = yargs
	.alias('p', 'production') // bool flag switching development/production enviroment
	.alias('d', 'deployConfig') // devel / staging / production
	.default({
		production: false,
		deployConfig: 'staging',
		port: PROJECT_CONSTANTS.EXPRESS_SERVER_PORT,
	})
	.argv


process.env.NODE_ENV = args.production ? 'production' : 'development'
process.env.SERVER_PORT = args.port
process.env.DEPLOY_CONFIG = args.deployConfig

function hideStackTrace (done, message = '[see above]') { // eslint-disable-line no-unused-vars
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
	const dllFiles = fs.readJSONFileSync(path.join(PROJECT_CONSTANTS.PATH_BUILD_DIR, 'stats.dll.json'))

	const jadeOptions = {
		env: process.env.NODE_ENV,
		buildHash: process.env.BUILD_HASH,
		dllFilename: dllFiles.libs,
		PROJECT_CONSTANTS,
	}

	fs.writeFileSync(
		path.join(PROJECT_CONSTANTS.PATH_DIST_DIR, '/index.html'),
		jade.renderFile(path.join(PROJECT_CONSTANTS.PATH_BASE_DIR, 'src/server/views/main.jade'), jadeOptions),
	)
})

gulp.task('copy-files', () => {
	fs.copySync(
		PROJECT_CONSTANTS.PATH_BUILD_DIR,
		path.join(PROJECT_CONSTANTS.PATH_DIST_DIR, '/build'),
	)

	fs.copySync(
		PROJECT_CONSTANTS.PATH_ASSETS_DIR,
		path.join(PROJECT_CONSTANTS.PATH_DIST_DIR, '/assets'),
	)
})

gulp.task('testBuild', (done) => runSequence(
	'clean',
	'build-dll',
	'build-webpack-test',
	done,
))

gulp.task('build-dll', (done) => {
	webpack(
		createWebpackDllConfig({isDev: process.env.NODE_ENV !== 'production'}),
		done,
	)
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
		'build-dll',
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
		'build',
		'generate-html',
		'copy-files',
		done,
	)
})
