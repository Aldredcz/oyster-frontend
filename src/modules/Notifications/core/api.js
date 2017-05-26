// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'
import {processUserFromApi} from 'core/entities/users'
import {processProjectFromApi} from 'core/entities/projects'
import type {TNotification, TNotificationFromApi} from './types'

function processNotificationFromApi (notificationFromApi: TNotificationFromApi): $Shape<TNotification> {
	const notification: $Shape<TNotification> = {}
	notificationFromApi.uuid && (notification.uuid = notificationFromApi.uuid)
	notificationFromApi.name && (notification.name = notificationFromApi.name)
	notificationFromApi.created_at
		? (notification.createdAt = new Date(notificationFromApi.created_at))
		: (notification.createdAt = new Date()) // falback to current time
	notificationFromApi.completed_at && (notification.completedAt = new Date(notificationFromApi.completed_at))
	notificationFromApi.authors && (notification.authorsByIds = notificationFromApi.authors.map(
		(userFromApi) => processUserFromApi(userFromApi).uuid,
	))
	notificationFromApi.owners && (notification.ownersByIds = notificationFromApi.owners.map(
		(userFromApi) => processUserFromApi(userFromApi).uuid,
	))
	notificationFromApi.actions && (notification.permissions = new Set(notificationFromApi.actions))
	notification.objects = {}
	if (notificationFromApi.objects) {
		if (notificationFromApi.objects.project) {
			notification.objects.project = processProjectFromApi(notificationFromApi.objects.project, false)
		}
	}

	return notification
}

export function oysterRequestFetchNotifications (): Promise<Array<$Shape<TNotification>>> {
	return request(`${SETTINGS.oysterApi}/notifications`)
		.then((response) => response.json())
		.then(
			(notificationsFromApi: Array<TNotificationFromApi>) => notificationsFromApi.map(
				(notificationFromApi) => processNotificationFromApi(notificationFromApi),
			),
		)
}

export function oysterRequestCompleteNotification (uuid: string): Promise<Date> {
	return request(`${SETTINGS.oysterApi}/notification/${uuid}/complete`, {
		method: 'PUT',
		body: JSON.stringify({}),
	})
		.then((response) => response.json())
		.then(
			(data) => new Date(data.completed_at),
		)
}

export const NotificationAPI = {
	fetchAll: oysterRequestFetchNotifications,
	complete: oysterRequestCompleteNotification,
}