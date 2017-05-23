// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import projectsStore from './store'
import type {TProject, TProjectFromApi, TProjectField} from './types'

import {processTaskFromApi} from 'core/entities/tasks'

export function processProjectFromApi (projectFromApi: TProjectFromApi): TProject {
	const project: TProject = {
		uuid: projectFromApi.uuid,
		name: projectFromApi.name || null,
		deadline: projectFromApi.deadline || null,
		archived: projectFromApi.archived || null,
		tasksByIds: projectFromApi.tasks && projectFromApi.tasks.map(
			(taskFromApi) => processTaskFromApi(taskFromApi).uuid,
		),
		accountsByIds: projectFromApi.accounts && projectFromApi.accounts.map((a) => a.uuid),
		ownersByIds: projectFromApi.owners && projectFromApi.owners.map((u) => u.uuid),
		actionsSet: projectFromApi.actions ? new Set(projectFromApi.actions) : null,
	}

	projectsStore.setEntity(project.uuid, {data: project})

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
