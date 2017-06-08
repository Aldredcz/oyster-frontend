// @flow
import format from 'date-fns/format'
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import tasksStore from './store'
import type {TTask, TTaskFromApi, TTaskField} from './types'

export function processTaskFromApi (taskFromApi: TTaskFromApi, updateStore: boolean = true): $Shape<TTask> {
	const task: $Shape<TTask> = {}
	taskFromApi.uuid && (task.uuid = taskFromApi.uuid)
	taskFromApi.name && (task.name = taskFromApi.name)
	taskFromApi.brief && (task.brief = taskFromApi.brief)
	taskFromApi.deadline && (task.deadline = new Date(taskFromApi.deadline))
	taskFromApi.completed_at && (task.completedAt = new Date(taskFromApi.completed_at))
	taskFromApi.approved_at && (task.approvedAt = new Date(taskFromApi.approved_at))
	taskFromApi.owners && (task.ownersByIds = taskFromApi.owners.map((u) => u.uuid))
	taskFromApi.projects && (task.projectsByIds = taskFromApi.projects.map((u) => u.uuid))
	taskFromApi.actions && (task.permissions = new Set(taskFromApi.actions))

	if (updateStore) {
		tasksStore.setEntity(task.uuid, {data: task})
	}

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

export function oysterRequestTaskComplete (uuid: string): Promise<Date> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}/complete`, {
		method: 'PUT',
		body: JSON.stringify({}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then((data) => new Date(data.completed_at))
}

export function oysterRequestTaskApprove (uuid: string): Promise<Date> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}/approve`, {
		method: 'PUT',
		body: JSON.stringify({}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then((data) => new Date(data.approved_at))
}

export function oysterRequestTaskAssignContributor (uuid: string, userUuid: string): Promise<Array<string>> {
	return request(`${SETTINGS.oysterApi}/task/${uuid}/assign`, {
		method: 'PUT',
		body: JSON.stringify({
			owner: userUuid,
		}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(({owners}) => owners.map((owner) => owner.uuid))
}

export const TaskAPI = {
	fetch: oysterRequestFetchTask,
	create: oysterRequestCreateTask,
	update: (uuid: string, field: string, value: any): Promise<any> => {
		switch (field) {
			case 'name':
				return oysterRequestTaskRename(uuid, value)
			case 'brief':
				return oysterRequestTaskBriefChange(uuid, value)
			case 'deadline':
				return oysterRequestTaskDeadlineChange(uuid, value)
			case 'completedAt':
				return oysterRequestTaskComplete(uuid)
			case 'approvedAt':
				return oysterRequestTaskApprove(uuid)
			default:
				return Promise.reject(`Cannot update field '${field}' in Task`)
		}
	},
	assignContributor: oysterRequestTaskAssignContributor,
}
