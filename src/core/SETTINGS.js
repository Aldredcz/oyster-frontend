// @flow
import {BE_PROXY_PREFIX} from '../../project.constants'

export type TSETTINGS = {
	+oysterApi: string,
	+env: 'development' | 'production',
}

const SETTINGS: TSETTINGS = {
	oysterApi: BE_PROXY_PREFIX,
	env: typeof ENVIRONMENT !== 'undefined' ? ENVIRONMENT : 'production',
}

export default SETTINGS
