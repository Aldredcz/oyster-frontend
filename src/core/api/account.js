// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import {UsersStore} from 'core/entities/users'
import type {TUser} from 'core/entities/users'
import {GroupsStore} from 'core/entities/groups'
import type {TGroup} from 'core/entities/groups'
import {ProjectsStore} from 'core/entities/projects'
import type {TProjectFromApi} from 'core/entities/projects'
import {TasksStore} from 'core/entities/tasks'
import type {TTask} from 'core/entities/tasks'

type TAccount = {
	uuid: string,
	name?: string,
}

export function oysterRequestFetchAccount (): Promise<TAccount> {
	return request(`${SETTINGS.oysterApi}/account/mine`).then(
		(response) => response.json(),
		// TODO: error handling
	)
}

export function oysterRequestFetchAccountUsers (): Promise<Array<string>> {
	return request(`${SETTINGS.oysterApi}/account/users`).then(
		(response) => response.json(),
		// TODO: error handling
	).then(
		(users: Array<TUser>) => {
			users.forEach((user) => {
				UsersStore.updateEntity(user.uuid, user, {updateOnServer: false})
			})

			return users.map((user) => user.uuid)
		},
	)
}

export function oysterRequestFetchAccountGroups (): Promise<Array<string>> {
	return request(`${SETTINGS.oysterApi}/account/groups`).then(
		(response) => response.json(),
		// TODO: error handling
	).then(
		(groups: Array<TGroup>) => {
			groups.forEach((group) => {
				GroupsStore.updateEntity(group.uuid, group, {updateOnServer: false})
			})

			return groups.map((group) => group.uuid)
		},
	)
}

export function oysterRequestFetchAccountProjects (): Promise<Array<string>> {
	return request(`${SETTINGS.oysterApi}/account/projects`).then(
		(response) => response.json(),
		// TODO: error handling
	).then(
		(projects: Array<TProjectFromApi>) => {
			projects.forEach((projectFromApi) => {
				projectFromApi.tasks = projectFromApi.tasks || []
				projectFromApi.tasks.forEach((task: TTask) => {
					TasksStore.updateEntity(task.uuid, task, {updateOnServer: false})
				})

				const project: any = { // in fact its valid TProject, flow fails here to understand
					...projectFromApi,
					tasks: projectFromApi.tasks && projectFromApi.tasks.map((task) => task.uuid),
				}
				ProjectsStore.updateEntity(project.uuid, project, {updateOnServer: false})
			})

			return projects.map((project) => project.uuid)
		},
	)
}
