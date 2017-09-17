import {TUserFromApi} from 'core/entities/users'
import {TProjectFromApi, TProject} from 'core/entities/projects'
import {TTaskFromApi, TTask} from 'core/entities/tasks'

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
	authorsByIds: Array<string> | null,
	subject: TEventSubject | null,
}

export type TEventFromApi = Partial<TEventCommon & {
	created_at: string,
	authors: Array<TUserFromApi> | null,
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
	updatedAt: Date | null,
	completedAt: Date | null,
	subjects: {
		projects?: Array<TProject>,
		tasks?: Array<TTask>,
	},
	permissions: Map<TNotificationPermission, boolean> | null, // TODO: change to Set when mobx supports it

}

export type TNotificationFromApi = Partial<TNotificationCommon & {
	created_at: string | null,
	updated_at: string | null,
	completed_at: string | null,
	owners: Array<TUserFromApi> | null,
	events: Array<TEventFromApi> | null,
	actions: Array<TNotificationPermission> | null,
}>
