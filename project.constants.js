const path = require('path')

const PATH_BASE_DIR = __dirname

const WEBPACK_DEVSERVER_PORT = 8899
const EXPRESS_SERVER_PORT = 9090

const BE_PROXY_PREFIX = '/api'


module.exports = {
	PATH_BASE_DIR,
	PATH_SOURCE_DIR: path.join(PATH_BASE_DIR, 'src'),
	PATH_BUILD_DIR: path.join(PATH_BASE_DIR, 'build'),
	PATH_ASSETS_DIR: path.join(PATH_BASE_DIR, 'assets'),
	PATH_DIST_DIR: path.join(PATH_BASE_DIR, 'dist'),
	PATH_DLL_DIR: path.join(PATH_BASE_DIR, 'dll'),

	WEBPACK_DEVSERVER_PORT,
	WEBPACK_DEVSERVER_IP: `http://localhost:${WEBPACK_DEVSERVER_PORT}`,
	EXPRESS_SERVER_PORT,

	BE_PROXY_PREFIX,
}
