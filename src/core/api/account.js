// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'

import type {TAccount} from 'core/entities/accounts'
import {UsersStore} from 'core/entities/users'
import type {TUser} from 'core/entities/users'
import {GroupsStore} from 'core/entities/groups'
import type {TGroup} from 'core/entities/groups'
import {processProjectFromApi} from 'core/entities/projects'
import type {TProjectFromApi} from 'core/entities/projects'


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
				UsersStore.updateEntity.locally(user.uuid, user)
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
				GroupsStore.updateEntity.locally(group.uuid, group)
			})

			return groups.map((group) => group.uuid)
		},
	)
}

export function oysterRequestFetchAccountProjects (): Promise<Array<string>> {
	return request(`${SETTINGS.oysterApi}/account/projects`)
		.then(
			(response) => response.json(),
			// TODO: error handling
		)
		.then((projectsFromApi: Array<TProjectFromApi>) => {
			return projectsFromApi.map((p) => processProjectFromApi(p).uuid)
		})
}
