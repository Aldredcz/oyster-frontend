// @flow
import type {TTaskFromApi} from 'core/entities/tasks'
import type {TUserFromApi} from 'core/entities/users'
import type {TAccountFromApi} from 'core/entities/accounts'

export type TProjectPermission =
	| 'rename'
	| 'assign'
	| 'task'

export type TProjectCommon = {
	uuid: string,
	name: ?string,
	deadline: ?string,
	archived: ?boolean,
}

export type TProject = TProjectCommon & {
	accountsByIds: ?Array<string>,
	tasksByIds: ?Array<string>,
	ownersByIds: ?Array<string>,
	permissions: ?Set<TProjectPermission>,
}

export type TProjectFromApi = $Shape<TProjectCommon & {
	accounts: ?Array<TUserFromApi>,
	tasks: ?Array<TTaskFromApi>,
	owners: ?Array<TAccountFromApi>,
	actions: ?Array<TProjectPermission>,
}>

export type TProjectField = $Keys<TProject>

export const initialState: TProject = {
	uuid: '',
	name: null,
	deadline: null,
	archived: null,
	accountsByIds: null,
	tasksByIds: null,
	ownersByIds: null,
	permissions: null,
}
