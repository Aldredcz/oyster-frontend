// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import tasksStore from './store'
import type {TTask, TTaskFromApi, TTaskField} from './types'

export function processTaskFromApi (taskFromApi: TTaskFromApi): TTask {
	const task: TTask = {
		uuid: taskFromApi.uuid,
		name: taskFromApi.name || null,
		brief: taskFromApi.brief || null,
		deadline: taskFromApi.deadline ? new Date(taskFromApi.deadline) : null,
		completedAt: taskFromApi.completed_at ? new Date(taskFromApi.completed_at) : null,
		ownersByIds: taskFromApi.owners && taskFromApi.owners.map((u) => u.uuid),
	}

	tasksStore.setTask(task.uuid, {data: task})

	return task
}

export function oysterRequestFetchTask (
	uuid: string,
	fields?: Array<TTaskField>,
): Promise<TTask> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processTaskFromApi)
}
