// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import TasksStore from './store'
import type {TTask, TTaskFromApi, TTaskField} from './types'

export function processTaskFromApi (taskFromApi: TTaskFromApi): TTask {
	const task: TTask = {
		...taskFromApi,
		ownersByIds: taskFromApi.owners,
	}

	TasksStore.updateEntity(task.uuid, task, {updateOnServer: false})

	return task
}

export function oysterRequestFetchTask (
	uuid: string,
	fields: Array<TTaskField>,
): Promise<TTask> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}?fields=${fields.join(',')}`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processTaskFromApi)
}
