// @flow
export type TAccountState = {
	+uuid: ?string,
	+name: ?string,
	+usersByIds: ?Array<string>,
	+groupsByIds: ?Array<string>,
	+projectsByIds: ?Array<string>,
}
export type TSetDataPayloadVariants = {
	string: {
		key: 'uuid' | 'name',
		value: ?string,
	},
	arrayOfStrings: {
		key: 'usersByIds' | 'groupsByIds' | 'projectsByIds',
		value: ?Array<string>,
	},
}

export type TSetDataPayloadVariant =
	| $PropertyType<TSetDataPayloadVariants, 'string'>
	| $PropertyType<TSetDataPayloadVariants, 'arrayOfStrings'>

export type TAccountActions = {
	setData: {
		type: 'account/SET_DATA',
		payload: TSetDataPayloadVariant,
	},
}

export type TAccountAction =
	| $PropertyType<TAccountActions, 'setData'>
