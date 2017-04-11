import {BE_PROXY_PREFIX} from '../../project.constants'

const SETTINGS = {
	oysterApi: BE_PROXY_PREFIX,
	env: typeof ENVIRONMENT !== 'undefined' ? ENVIRONMENT : 'production',
}

export default SETTINGS
