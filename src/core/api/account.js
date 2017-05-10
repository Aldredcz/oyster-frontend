// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import type {TAccount} from 'core/entities/accounts'
import {UsersStore} from 'core/entities/users'
import type {TUser} from 'core/entities/users'
import {GroupsStore} from 'core/entities/groups'
import type {TGroup} from 'core/entities/groups'
import {ProjectsStore} from 'core/entities/projects'
import type {TProjectFromApi, TProject} from 'core/entities/projects'
import {TasksStore} from 'core/entities/tasks'
import type {TTaskFromApi, TTask} from 'core/entities/tasks'


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
		(projects: Array<TProjectFromApi>): Array<string> => {
			projects.forEach((projectFromApi: TProjectFromApi) => {
				const tasks = projectFromApi.tasks || []
				tasks.forEach((taskFromApi: TTaskFromApi) => {
					const task: TTask = {
						...taskFromApi,
						ownersByIds: taskFromApi.owners,
					}
					TasksStore.updateEntity(task.uuid, task, {updateOnServer: false})
				})

				const project: TProject = {
					...projectFromApi,
					tasksByIds: tasks.map((task) => task.uuid),
				}

				ProjectsStore.updateEntity(project.uuid, project, {updateOnServer: false})
			})

			return projects.map((project) => project.uuid)
		},
	)
}
