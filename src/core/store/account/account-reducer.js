// @flow
import {ACCOUNT_ACTION_TYPES} from './account-actions'
import type {TAccountState, TAccountAction} from './types'

const initialState: TAccountState = {
	uuid: null,
	name: null,
	usersByIds: null,
	groupsByIds: null,
}

export default function accountReducer (
	state: TAccountState = initialState,
	action: TAccountAction,
): TAccountState {
	switch (action.type) {
		case ACCOUNT_ACTION_TYPES.SET_DATA:
			return ({
				...state,
				[action.payload.key]: action.payload.value,
			}: any) // flow cannot understand this :/
		default:
			return state
	}
}
