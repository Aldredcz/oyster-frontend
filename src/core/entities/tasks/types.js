// @flow
export type TTask = {
	uuid: string,
	name?: string,
}

export type TTaskField = $Keys<TTask>
