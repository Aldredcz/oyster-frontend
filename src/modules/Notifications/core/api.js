// @flow
import request from 'core/utils/request'
import SETTINGS from 'core/SETTINGS'
import {processUserFromApi} from 'core/entities/users'
import {processProjectFromApi} from 'core/entities/projects'
import {processTaskFromApi} from 'core/entities/tasks'
import type {TNotification, TNotificationFromApi, TEvent, TEventFromApi} from './types'

export function processEventFromApi (eventFromApi: TEventFromApi): $Shape<TEvent> {
	const event: $Shape<TEvent> = {
		uuid: eventFromApi.uuid,
		name: eventFromApi.name,
		createdAt: new Date(eventFromApi.created_at),
	}

	eventFromApi.authors && (event.authorsByIds = eventFromApi.authors.map(
		(userFromApi) => processUserFromApi(userFromApi).uuid,
	))

	if (eventFromApi.subject) {
		switch (eventFromApi.subject.type) {
			case 'task':
				//$FlowFixMe
				event.subject = processTaskFromApi(eventFromApi.subject, false)
				break
			case 'project':
				//$FlowFixMe
				event.subject = processProjectFromApi(eventFromApi.subject, false)
				break
		}

		//$FlowFixMe
		event.subject && (event.subject.type = eventFromApi.subject.type)
	}

	return event
}

const subjectTypeMap = {
	task: 'tasks',
	project: 'projects',
}

export function processNotificationFromApi (notificationFromApi: TNotificationFromApi): ?$Shape<TNotification> {
	if (!notificationFromApi.events || notificationFromApi.events.length === 0) {
		return
	}
	const events: Array<TEvent> = notificationFromApi.events.map(processEventFromApi)
	const subjectType: any = events[0].subject && events[0].subject.type
	const subjectsKey = subjectTypeMap[subjectType]

	if (events.length === 0 || !subjectsKey) {
		return
	}

	const notification: $Shape<TNotification> = {
		uuid: notificationFromApi.uuid,
		name: events[0].name,
		createdAt: new Date(notificationFromApi.created_at || 0),
		updatedAt: notificationFromApi.updated_at ? new Date(notificationFromApi.updated_at) : null,
		completedAt: notificationFromApi.completed_at ? new Date(notificationFromApi.completed_at) : null,
		authorsByIds: [...new Set(
			events.reduce(
				(result, curr) => [...result, ...(curr.authorsByIds || [])],
				[],
			),
		)],
		subjects: {
			[subjectsKey]: events.map((event) => event.subject).filter(Boolean),
		},
	}

	notificationFromApi.actions && (notification.permissions = new Map(notificationFromApi.actions.map((action) => [action, true])))

	return notification
}

export function processNotificationsFromApi (notificationsFromApi: Array<TNotificationFromApi>): Array<$Shape<TNotification>> {
	return notificationsFromApi
		.map(
			(notificationFromApi) => processNotificationFromApi(notificationFromApi),
		)
		.filter(Boolean)
}

export function oysterRequestFetchNotifications (): Promise<Array<$Shape<TNotification>>> {
	return request(`${SETTINGS.oysterApi}/notifications`)
		.then((response) => response.json())
		.then(processNotificationsFromApi)
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
