// @flow
import type {TUserFromApi} from 'core/entities/users'
import type {TProjectFromApi} from 'core/entities/projects'

type TTaskPermission =
	| 'rename'
	| 'deadline'
	| 'brief'
	| 'assign'
	| 'complete'
	| 'approve'

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
	permissions: ?Set<TTaskPermission>,
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
