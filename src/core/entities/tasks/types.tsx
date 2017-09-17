import {TUserFromApi} from 'core/entities/users'
import {TProjectFromApi} from 'core/entities/projects'

export type TTaskPermission =
	| 'rename'
	| 'deadline'
	| 'brief'
	| 'assign'
	| 'complete'
	| 'approve'
	| 'reopen'
	| 'reject'

export type TTaskStatus =
	| 'new'
	| 'afterDeadline'
	| 'completed'
	| 'approved'

export type TTaskCommon = {
	uuid: string,
	name: string | null,
	brief: string | null,
}

export type TTask = TTaskCommon & {
	deadline: Date | null,
	completedAt: Date | null,
	approvedAt: Date | null,
	ownersByIds: Array<string> | null,
	projectsByIds: Array<string> | null,
	permissions: Map<TTaskPermission, boolean> | null, // TODO: change to Set when mobx supports it
}

export type TTaskFromApi = Partial<TTaskCommon & {
	deadline: string | null,
	completed_at: string | null,
	approved_at: string | null,
	owners: Array<TUserFromApi> | null,
	projects: Array<TProjectFromApi> | null,
	actions: Array<TTaskPermission> | null,
}>

export type TTaskField = keyof TTask

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
