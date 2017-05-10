// @flow
export type TGroup = {
	uuid: string,
	name?: string,
	tasksByIds?: Array<string>,
	ownersByIds?: Array<string>,
	deadline?: string,
	archived?: boolean,
	accountsByIds?: Array<string>,
}

export type TGroupField = $Keys<TGroup>
