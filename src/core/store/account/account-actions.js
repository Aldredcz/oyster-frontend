// @flow
import type {TAccountActions, TSetDataPayloadVariant} from './types'

export const ACCOUNT_ACTION_TYPES = {
	SET_DATA: 'account/SET_DATA',
}

type TSetData = (params: TSetDataPayloadVariant) => $PropertyType<TAccountActions, 'setData'>

export const setData: TSetData = (params) => ({
	type: ACCOUNT_ACTION_TYPES.SET_DATA,
	payload: params,
})

