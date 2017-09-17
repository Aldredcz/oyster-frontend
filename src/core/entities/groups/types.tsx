export type TGroupCommon = {
	uuid: string,
	name: string | null,
}

export type TGroup = TGroupCommon
export type TGroupFromApi = Partial<TGroupCommon>

export type TGroupField = keyof TGroup

export const initialState: TGroup = {
	uuid: '',
	name: null,
}
