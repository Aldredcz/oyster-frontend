// @flow
import {BE_PROXY_PREFIX} from '../../project.constants'

export type TSETTINGS = {
	oysterApi: string,
	+env: 'development' | 'production',
	setApiUrl?: (apiUrl: string) => void,
	resetApiUrl?: () => void,
}

const originalOysterApi = BE_PROXY_PREFIX

const SETTINGS: TSETTINGS = {
	oysterApi: localStorage.getItem('apiUrl') || originalOysterApi,
	env: typeof ENVIRONMENT !== 'undefined' ? ENVIRONMENT : 'production',
}

window.SETTINGS = SETTINGS

SETTINGS.setApiUrl = (apiUrl) => {
	localStorage.setItem('apiUrl', apiUrl)
	SETTINGS.oysterApi = apiUrl
}

SETTINGS.resetApiUrl = () => {
	localStorage.removeItem('apiUrl')
	SETTINGS.oysterApi = originalOysterApi
}

export default SETTINGS
