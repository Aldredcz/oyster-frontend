// @flow
import type {TUserFromApi} from 'core/entities/users'
import type {TProjectFromApi, TProject} from 'core/entities/projects'
import type {TTaskFromApi, TTask} from 'core/entities/tasks'

export type TNotificationPermission =
	| 'complete'

export type TEventType =
	| 'rename'
	| 'deadline'
	| 'brief'
	| 'assign'
	| 'approve'


// EVENT SUBJECTS
type TEventFromApiSubjectTask = {type: 'task'} & TTaskFromApi
type TEventFromApiSubjectProject = {type: 'project'} & TProjectFromApi
type TEventFromApiSubject =
	| TEventFromApiSubjectTask
	| TEventFromApiSubjectProject

type TEventSubjectTask = {type?: 'task'} & TTask
type TEventSubjectProject = {type?: 'project'} & TProject
type TEventSubject =
	| TEventSubjectTask
	| TEventSubjectProject


/***
 EVENT - NOTIFICATION rules:
 for every event in notification.events
 - same event.name
 - same event.subject.type
***/

// EVENT
export type TEventCommon = {
	uuid: string,
	name: TEventType,
}

export type TEvent = TEventCommon & {
	createdAt: Date,
	authorsByIds: ?Array<string>,
	subject: ?TEventSubject,
}

export type TEventFromApi = $Shape<TEventCommon & {
	created_at: string,
	authors: ?Array<TUserFromApi>,
	subject: TEventFromApiSubject,
}>

// NOTIFICATION
export type TNotificationCommon = {
	uuid: string,
}

export type TNotification = TNotificationCommon & {
	name: TEventType,
	authorsByIds: Array<string>,
	createdAt: Date,
	updatedAt: ?Date,
	completedAt: ?Date,
	subjects: {
		projects?: Array<TProject>,
		tasks?: Array<TTask>,
	},
	permissions: ?Map<TNotificationPermission, boolean>, // TODO: change to Set when mobx supports it

}

export type TNotificationFromApi = $Shape<TNotificationCommon & {
	created_at: ?string,
	updated_at: ?string,
	completed_at: ?string,
	owners: ?Array<TUserFromApi>,
	events: ?Array<TEventFromApi>,
	actions: ?Array<TNotificationPermission>,
}>
