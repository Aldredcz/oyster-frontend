// @flow
export type TGroupCommon = {
	uuid: string,
	name: ?string,
}

export type TGroup = TGroupCommon
export type TGroupFromApi = $Shape<TGroupCommon>

export type TGroupField = $Keys<TGroup>

export const initialState: TGroup = {
	uuid: '',
	name: null,
}
