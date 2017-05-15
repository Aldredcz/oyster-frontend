// @flow
import type {TUserFromApi} from 'core/entities/users'

type TTaskACLAction =
	| 'rename'
	| 'deadline'
	| 'brief'

export type TTaskCommon = {
	uuid: string,
	name: ?string,
	brief: ?string,
}

export type TTask = TTaskCommon & {
	deadline: ?Date,
	completedAt: ?Date,
	ownersByIds: ?Array<string>,
	actionsSet: ?Set<TTaskACLAction>,
}

export type TTaskFromApi = $Shape<TTaskCommon & {
	deadline: ?string,
	completed_at: ?string,
	owners: ?Array<TUserFromApi>,
	actions: ?Array<TTaskACLAction>,
}>

export type TTaskField = $Keys<TTask>
