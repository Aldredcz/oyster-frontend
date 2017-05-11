// @flow
import type {TTaskFromApi} from 'core/entities/tasks'
import type {TUserFromApi} from 'core/entities/users'
import type {TAccountFromApi} from 'core/entities/accounts'

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
}

export type TProjectFromApi = $Shape<TProjectCommon & {
	accounts: ?Array<TUserFromApi>,
	tasks: ?Array<TTaskFromApi>,
	owners: ?Array<TAccountFromApi>,
}>

export type TProjectField = $Keys<TProject>
