import path from 'path'

export const PATH_BASE_DIR = path.normalize(path.join(__dirname, '..'))
export const PATH_SOURCE_DIR = path.join(PATH_BASE_DIR, 'src')
export const PATH_BUILD_DIR = path.join(PATH_BASE_DIR, 'build')
export const PATH_ASSETS_DIR = path.join(PATH_BASE_DIR, 'assets')


export const DEVSERVER_PORT = 8899
export const DEVSERVER_IP = `http://localhost:${DEVSERVER_PORT}`
