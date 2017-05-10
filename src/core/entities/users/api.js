// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import type {TUser, TUserField} from './types'

export function oysterRequestFetchUser (
	uuid: string,
	fields: Array<TUserField>,
): Promise<TUser> {
	return request(`${SETTINGS.oysterApi}/user/${uuid}?fields=${fields.join(',')}`).then(
		(response) => response.json(),
		// TODO: error handling
	)
}
