import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

type TLoginParams = {
	readonly email: string,
	readonly password: string,
}

type TLoginResponse = {
	uuid: string,
	token: string,
}

type TSignupParams = {
	readonly email: string,
	readonly password: string,
	readonly name: string,
	readonly surname: string,
	readonly invite: string,
}

type TSignupResponse = TLoginResponse

export function oysterRequestUserSignup (params: TSignupParams): Promise<TSignupResponse> {
	return request(`${SETTINGS.oysterApi}/user/sign-up`, {
		method: 'POST',
		body: JSON.stringify(params),
	}).then((response) => response.json())
}

export function oysterRequestCheckInviteToken (token: string): Promise<{name: string}> {
	return request(`${SETTINGS.oysterApi}/user/sign-up/check-invite`, {
		method: 'POST',
		body: JSON.stringify({invite: token}),
	}).then((response) => response.json())
}

export function oysterRequestUserLogin (params: TLoginParams): Promise<TLoginResponse> {
	return request(`${SETTINGS.oysterApi}/user/login`, {
		method: 'POST',
		body: JSON.stringify(params),
	}).then((response) => response.json())
}

export function oysterRequestUserLogout (): Promise<any> {
	return request(`${SETTINGS.oysterApi}/user/logout`, {
		method: 'POST',
		body: JSON.stringify({}),
	})
}
