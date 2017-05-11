// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import UsersStore from './store'
import type {TUser, TUserFromApi, TUserField} from './types'

export function processUserFromApi (userFromApi: TUserFromApi): TUser {
	const user: TUser = {
		uuid: userFromApi.uuid,
		name: userFromApi.name || null,
		surname: userFromApi.surname || null,
		email: userFromApi.email || null,
		accountsByIds: userFromApi.accounts ? userFromApi.accounts.map((a) => a.uuid) : null,
	}

	UsersStore.updateEntity.locally(user.uuid, user)

	return user
}

export function oysterRequestFetchUser (
	uuid: string,
	fields: Array<TUserField>,
): Promise<TUser> {
	return request(`${SETTINGS.oysterApi}/user/${uuid}?fields=${fields.join(',')}`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processUserFromApi)
}
