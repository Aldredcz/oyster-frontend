// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import GroupsStore from './store'
import type {TGroup, TGroupFromApi, TGroupField} from './types'

export function processGroupFromApi (groupFromApi: TGroupFromApi): TGroup {
	const group: TGroup = {
		uuid: groupFromApi.uuid,
		name: groupFromApi.name || undefined,
	}

	GroupsStore.updateEntity.locally(group.uuid, group)

	return group
}

export function oysterRequestFetchGroup (
	uuid: string,
	fields: Array<TGroupField>,
): Promise<TGroup> {
	return request(`${SETTINGS.oysterApi}/group/${uuid}?fields=${fields.join(',')}`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processGroupFromApi)
}
