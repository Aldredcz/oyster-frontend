module.exports = (wallaby) => {
	const config = {
		files: [
			'src/**/*.js',
			'project.constants.js',
			'!src/**/*.test.js',
		],
		tests: [
			'src/**/*.test.js',
		],
		testFramework: 'jest',
		env: {
			type: 'node',
			runner: 'node',
		},
		compilers: {
			'**/*.js': wallaby.compilers.babel(),
		},
	}

	return config
}
