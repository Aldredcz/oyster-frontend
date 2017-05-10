// @flow
export type TTaskCommon = {
	uuid: string,
	name?: string,
	deadline?: string,
	brief?: string,
}

export type TTask = TTaskCommon & {
	ownersByIds?: Array<string>,
}

export type TTaskFromApi = TTaskCommon & {
	owners?: Array<string>,
}


export type TTaskField = $Keys<TTask>
