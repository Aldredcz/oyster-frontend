// @flow
import type {TUserFromApi} from 'core/entities/users'
import type {TProjectFromApi, TProject} from 'core/entities/projects'
import type {TTaskFromApi, TTask} from 'core/entities/tasks'

export type TNotificationPermission =
	| 'complete'

export type TNotificationType =
	| 'rename'
	| 'deadline'
	| 'brief'
	| 'assign'
	| 'approve'

export type TNotificationCommon = {
	uuid: string,
	name: TNotificationType,
}

export type TNotification = TNotificationCommon & {
	createdAt: Date,
	completedAt: ?Date,
	authorsByIds: ?Array<string>,
	ownersByIds: ?Array<string>,
	permissions: ?Map<TNotificationPermission, boolean>, // TODO: change to Set when mobx supports it
	objects: {
		project?: TProject,
		task?: TTask,
	},
}

export type TNotificationFromApi = $Shape<TNotificationCommon & {
	created_at: ?string,
	completed_at: ?string,
	authors: ?Array<TUserFromApi>,
	owners: ?Array<TUserFromApi>,
	actions: ?Array<TNotificationPermission>,
	objects: ?{
		project?: TProjectFromApi,
		task?: TTaskFromApi,
	},
}>
