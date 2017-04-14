// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

type TParams = {
	email: string,
	password: string,
}

export function oysterRequestUserSignup (params: TParams) {
	return request(`${SETTINGS.oysterApi}/user/sign_up`, {
		method: 'POST',
		body: JSON.stringify(params),
	}).then((response) => response.json())
}

export function oysterRequestUserLogin (params: TParams) {
	return request(`${SETTINGS.oysterApi}/user/login`, {
		method: 'POST',
		body: JSON.stringify(params),
	}).then((response) => response.json())
}

