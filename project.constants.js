const path = require('path')

const PATH_BASE_DIR = path.normalize(path.join(__dirname, '..'))

const WEBPACK_DEVSERVER_PORT = 8899
const EXPRESS_SERVER_PORT = 9090


module.exports = {
	PATH_BASE_DIR,
	PATH_SOURCE_DIR: path.join(PATH_BASE_DIR, 'src'),
	PATH_BUILD_DIR: path.join(PATH_BASE_DIR, 'build'),
	PATH_ASSETS_DIR: path.join(PATH_BASE_DIR, 'assets'),

	WEBPACK_DEVSERVER_PORT,
	WEBPACK_DEVSERVER_IP: `http://localhost:${WEBPACK_DEVSERVER_PORT}`,
	EXPRESS_SERVER_PORT
}
