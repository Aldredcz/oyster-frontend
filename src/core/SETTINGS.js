import {BE_PROXY_PREFIX} from '../../project.constants'

const SETTINGS = {
	//oysterApi: 'http://api.oyster.jemelik.eu',
	oysterApi: BE_PROXY_PREFIX,
	env: typeof ENVIRONMENT !== 'undefined' ? ENVIRONMENT : 'production',
}

export default SETTINGS
