// source: https://github.com/facebook/jest/blob/master/examples/typescript/preprocessor.js
const tsc = require('typescript')
const babel = require('babel-core')
const tsConfig = require('./tsconfig.json')
tsConfig.compilerOptions.target = 'es6'

module.exports = {
	process (src, path) {
		let output = src
		if (path.endsWith('.ts') || path.endsWith('.tsx')) {
			output = tsc.transpile(output, tsConfig.compilerOptions, path, [])
		}
		output = babel.transform(output, {
			presets: [
				'es2015',
				'stage-0',
				'react',
			],
			plugins: [
				'transform-decorators-legacy',
				'dev-expression',
				'syntax-dynamic-import',
				'transform-es2015-modules-commonjs',
				'dynamic-import-node',
				['module-resolver', {
					root: ['./src'],
				}],
			],
		}).code

		return output
	},
}