// @flow
export type TGroupCommon = {
	uuid: string,
	name?: string,
}

export type TGroup = TGroupCommon
export type TGroupFromApi = TGroupCommon

export type TGroupField = $Keys<TGroup>
