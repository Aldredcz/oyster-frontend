// @flow
import type {TTaskFromApi} from 'core/entities/tasks'
/*import type {TUser} from 'core/entities/users'
import type {TAccount} from 'core/entities/accounts'*/

export type TProjectCommon = {
	uuid: string,
	name?: string,
	deadline?: string,
	archived?: boolean,
}

export type TProject = TProjectCommon & {
	accountsByIds?: Array<string>,
	tasksByIds?: Array<string>,
	ownersByIds?: Array<string>,
}

export type TProjectFromApi = TProjectCommon & {
	accounts?: Array<string>,
	tasks?: Array<TTaskFromApi>,
	owners?: Array<string>,
}

export type TProjectField = $Keys<TProject>
