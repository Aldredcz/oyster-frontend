// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import projectsStore from './store'
import type {TProject, TProjectFromApi, TProjectField} from './types'

import {processTaskFromApi} from 'core/entities/tasks'

export function processProjectFromApi (projectFromApi: TProjectFromApi, updateStore: boolean = true): $Shape<TProject> {
	const project: $Shape<TProject> = {}
	projectFromApi.uuid && (project.uuid = projectFromApi.uuid)
	projectFromApi.name && (project.name = projectFromApi.name)
	projectFromApi.deadline && (project.deadline = projectFromApi.deadline)
	projectFromApi.archived && (project.archived = projectFromApi.archived)
	projectFromApi.tasks && (project.tasksByIds = projectFromApi.tasks.map(
		(taskFromApi) => processTaskFromApi(taskFromApi, updateStore).uuid,
	))
	projectFromApi.accounts && (project.accountsByIds = projectFromApi.accounts.map((a) => a.uuid))
	projectFromApi.owners && (project.ownersByIds = projectFromApi.owners.map((a) => a.uuid))
	projectFromApi.actions && (project.permissions = new Map(projectFromApi.actions.map((action) => [action, true])))

	if (updateStore) {
		projectsStore.setEntity(project.uuid, {data: project})
	}

	return project
}

export function oysterRequestFetchProject (
	uuid: string,
	fields?: Array<TProjectField>,
): Promise<TProject> {
	// TODO; change URL - more info: https://getoyster.slack.com/archives/D4XJBLQAY/p1494430385106624
	return request(`${SETTINGS.oysterApi}/project/${uuid}/tasks`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processProjectFromApi)
}

export function oysterRequestProjectRename (uuid: string, name: string): Promise<string> {
	return request(`${SETTINGS.oysterApi}/project/${uuid}/rename`, {
		method: 'PUT',
		body: JSON.stringify({name}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(({name}) => name)
}

export function oysterRequestCreateProject (): Promise<TProject> {
	return request(`${SETTINGS.oysterApi}/account/project`, {
		method: 'POST',
		body: JSON.stringify({}),
	})
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processProjectFromApi)
}

export function oysterRequestProjectAssignManager (uuid: string, userUuid: string): Promise<Array<string>> {
	return request(`${SETTINGS.oysterApi}/project/${uuid}/assign`, {
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


export const ProjectAPI = {
	fetch: oysterRequestFetchProject,
	update: (uuid: string, field: string, value: any): Promise<any> => {
		switch (field) {
			case 'name':
				return oysterRequestProjectRename(uuid, value)
			default:
				return Promise.reject(`Cannot update field '${field}' in Project`)
		}
	},
	create: oysterRequestCreateProject,
	assignProjectManager: oysterRequestProjectAssignManager,
}
