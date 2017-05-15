// @flow
import type {TUserFromApi} from 'core/entities/users'

export type TTaskCommon = {
	uuid: string,
	name: ?string,
	brief: ?string,
}

export type TTask = TTaskCommon & {
	deadline: ?Date,
	completedAt: ?Date,
	ownersByIds: ?Array<string>,
}

export type TTaskFromApi = $Shape<TTaskCommon & {
	deadline: ?string,
	completed_at: ?string,
	owners: ?Array<TUserFromApi>,
}>

export type TTaskField = $Keys<TTask>
