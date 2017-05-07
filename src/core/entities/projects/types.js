// @flow
import type {TTask} from 'core/entities/tasks'

export type TProjectStub = {
	uuid: string,
	name?: string,
	owners?: Array<string>,
	deadline?: string,
	archived?: boolean,
	accounts?: Array<string>,
}

export type TProject = TProjectStub & {
	tasks?: Array<string>,
}

export type TProjectFromApi = TProjectStub & {
	tasks?: Array<TTask>,
}

export type TProjectField = $Keys<TProject>
