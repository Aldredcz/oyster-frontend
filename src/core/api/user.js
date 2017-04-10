import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

export function oysterRequestUserSignup (params) {
	return request(`${SETTINGS.oysterApi}/user/sign_up`, {
		method: 'POST',
		body: JSON.stringify(params),
	}).then((response) => response.json())
}

export function oysterRequestUserLogin (params) {
	return request(`${SETTINGS.oysterApi}/user/login`, {
		method: 'POST',
		body: JSON.stringify(params),
	}).then((response) => response.json())
}

