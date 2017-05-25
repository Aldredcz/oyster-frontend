// @flow
import type {TUserFromApi} from 'core/entities/users'
import type {TProjectFromApi, TProject} from 'core/entities/projects'

export type TNotificationPermission =
	| 'complete'


export type TNotificationCommon = {
	uuid: string,
	name: string,
}

export type TNotification = TNotificationCommon & {
	createdAt: Date,
	completedAt: ?Date,
	authorsByIds: ?Array<string>,
	ownersByIds: ?Array<string>,
	permissions: ?Set<TNotificationPermission>,
	objects: {
		project?: TProject,
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
	},
}>
