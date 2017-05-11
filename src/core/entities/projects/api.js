// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import ProjectsStore from './store'
import type {TProject, TProjectFromApi, TProjectField} from './types'

import {processTaskFromApi} from 'core/entities/tasks'

export function processProjectFromApi (projectFromApi: TProjectFromApi): TProject {
	const project: TProject = {
		...projectFromApi,
		tasksByIds: projectFromApi.tasks && projectFromApi.tasks.map(
			(taskFromApi) => processTaskFromApi(taskFromApi).uuid,
		),
		accountsById: projectFromApi.accounts && projectFromApi.accounts.map((a) => a.uuid),
		ownersById: projectFromApi.owners && projectFromApi.owners.map((u) => u.uuid),
	}

	ProjectsStore.updateEntity.locally(project.uuid, project)

	return project
}

export function oysterRequestFetchProject (
	uuid: string,
	fields: Array<TProjectField>,
): Promise<TProject> {
	// TODO; change URL - more info: https://getoyster.slack.com/archives/D4XJBLQAY/p1494430385106624
	return request(`${SETTINGS.oysterApi}/project/${uuid}/tasks?fields=${fields.join(',')}`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then(processProjectFromApi)
}
