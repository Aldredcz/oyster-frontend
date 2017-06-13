// @flow
import type {TUserFromApi} from 'core/entities/users'
import type {TProjectFromApi} from 'core/entities/projects'

export type TTaskPermission =
	| 'rename'
	| 'deadline'
	| 'brief'
	| 'assign'
	| 'complete'
	| 'approve'
	| 'reopen'
	| 'reject'

export type TTaskCommon = {
	uuid: string,
	name: ?string,
	brief: ?string,
}

export type TTask = TTaskCommon & {
	deadline: ?Date,
	completedAt: ?Date,
	approvedAt: ?Date,
	ownersByIds: ?Array<string>,
	projectsByIds: ?Array<string>,
	permissions: ?Map<TTaskPermission, boolean>, // TODO: change to Set when mobx supports it
}

export type TTaskFromApi = $Shape<TTaskCommon & {
	deadline: ?string,
	completed_at: ?string,
	approved_at: ?string,
	owners: ?Array<TUserFromApi>,
	projects: ?Array<TProjectFromApi>,
	actions: ?Array<TTaskPermission>,
}>

export type TTaskField = $Keys<TTask>

export const initialState: TTask = {
	uuid: '',
	name: null,
	brief: null,
	deadline: null,
	completedAt: null,
	approvedAt: null,
	ownersByIds: null,
	projectsByIds: null,
	permissions: null,
}
