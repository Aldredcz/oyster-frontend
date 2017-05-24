// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import usersStore from './store'
import type {TUser, TUserFromApi, TUserField} from './types'

export function processUserFromApi (userFromApi: TUserFromApi): $Shape<TUser> {
	const user: $Shape<TUser> = {}
	userFromApi.uuid && (user.uuid = userFromApi.uuid)
	userFromApi.name && (user.name = userFromApi.name)
	userFromApi.surname && (user.surname = userFromApi.surname)
	userFromApi.email && (user.email = userFromApi.email)
	userFromApi.accounts && (user.accountsByIds = userFromApi.accounts.map((a) => a.uuid))

	usersStore.setEntity(user.uuid, {data: user})

	return user
}

export function oysterRequestFetchUser (
	uuid: string,
	fields?: Array<TUserField>,
): Promise<TUser> {
	return request(`${SETTINGS.oysterApi}/user/${uuid}`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processUserFromApi)
}

export const UsersAPI = {
	fetch: oysterRequestFetchUser,
	update: () => Promise.reject(), // TODO:
}
