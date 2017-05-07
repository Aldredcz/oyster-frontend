// @flow
export type TGroup = {
	uuid: string,
	name?: string,
	tasks?: Array<string>,
	owners?: Array<string>,
	deadline?: string,
	archived?: boolean,
	accounts?: Array<string>,
}

export type TGroupField = $Keys<TGroup>
