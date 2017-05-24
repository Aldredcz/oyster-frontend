// @flow
import type {TUserFromApi} from 'core/entities/users'

type TTaskPermission =
	| 'rename'
	| 'deadline'
	| 'brief'
	| 'assign'

export type TTaskCommon = {
	uuid: string,
	name: ?string,
	brief: ?string,
}

export type TTask = TTaskCommon & {
	deadline: ?Date,
	completedAt: ?Date,
	ownersByIds: ?Array<string>,
	permissions: ?Set<TTaskPermission>,
}

export type TTaskFromApi = $Shape<TTaskCommon & {
	deadline: ?string,
	completed_at: ?string,
	owners: ?Array<TUserFromApi>,
	actions: ?Array<TTaskPermission>,
}>

export type TTaskField = $Keys<TTask>

export const initialState: TTask = {
	uuid: '',
	name: null,
	brief: null,
	deadline: null,
	completedAt: null,
	ownersByIds: null,
	permissions: null,
}
