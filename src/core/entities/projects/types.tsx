import {TTaskFromApi} from 'core/entities/tasks'
import {TUserFromApi} from 'core/entities/users'
import {TAccountFromApi} from 'core/entities/accounts'

export type TProjectPermission =
	| 'rename'
	| 'assign'
	| 'task'

export type TProjectCommon = {
	uuid: string,
	name: string | null,
	deadline: string | null,
	archived: boolean | null,
}

export type TProject = TProjectCommon & {
	accountsByIds: Array<string> | null,
	tasksByIds: Array<string> | null,
	ownersByIds: Array<string> | null,
	permissions: Map<TProjectPermission, boolean> | null, // TODO: change to Set when mobx supports it
}

export type TProjectFromApi = Partial<TProjectCommon & {
	accounts: Array<TUserFromApi> | null,
	tasks: Array<TTaskFromApi> | null,
	owners: Array<TAccountFromApi> | null,
	actions: Array<TProjectPermission> | null,
}>

export type TProjectField = keyof TProject

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
