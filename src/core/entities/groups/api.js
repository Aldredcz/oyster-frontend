// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import groupsStore from './store'
import type {TGroup, TGroupFromApi, TGroupField} from './types'

export function processGroupFromApi (groupFromApi: TGroupFromApi): TGroup {
	const group: TGroup = {
		uuid: groupFromApi.uuid,
		name: groupFromApi.name || undefined,
	}

	groupsStore.setGroup(group.uuid, {data: group})

	return group
}

export function oysterRequestFetchGroup (
	uuid: string,
	fields?: Array<TGroupField>,
): Promise<TGroup> {
	return request(`${SETTINGS.oysterApi}/group/${uuid}`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processGroupFromApi)
}
