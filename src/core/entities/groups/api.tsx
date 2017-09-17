import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import groupsStore from './store'
import {TGroup, TGroupFromApi, TGroupField} from './types'

export function processGroupFromApi (groupFromApi: TGroupFromApi): Partial<TGroup> {
	const group: Partial<TGroup> = {}
	groupFromApi.uuid && (group.uuid = groupFromApi.uuid)
	groupFromApi.name && (group.name = groupFromApi.name)

	groupsStore.setEntity(group.uuid, {data: group})

	return group
}

export function oysterRequestFetchGroup (
	uuid: string,
	fields?: Array<TGroupField>,
): Promise<Partial<TGroup>> {
	return request(`${SETTINGS.oysterApi}/group/${uuid}`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processGroupFromApi)
}

export const GroupsAPI = {
	fetch: oysterRequestFetchGroup,
	update: () => Promise.reject(''), // TODO:
}
