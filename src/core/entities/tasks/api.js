// @flow
import {format} from 'date-fns'
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
		actionsSet: taskFromApi.actions ? new Set(taskFromApi.actions) : null,
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

export function oysterRequestCreateTask (data: {projectUuid: string}): Promise<TTask> {
	return request(`${SETTINGS.oysterApi}/project/${data.projectUuid}/task`, {
		method: 'POST',
		body: JSON.stringify({}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processTaskFromApi)
}

export function oysterRequestTaskRename (uuid: string, name: string): Promise<string> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}/rename`, {
		method: 'PUT',
		body: JSON.stringify({name}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(({name}) => name)
}

export function oysterRequestTaskBriefChange (uuid: string, brief: string): Promise<string> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}/brief`, {
		method: 'PUT',
		body: JSON.stringify({brief}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(({brief}) => brief)
}

export function oysterRequestTaskDeadlineChange (uuid: string, deadline: Date): Promise<Date> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}/deadline`, {
		method: 'PUT',
		body: JSON.stringify({
			deadline: format(deadline, 'YYYY-MM-DD'),
		}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(({deadline}) => new Date(deadline))
}

