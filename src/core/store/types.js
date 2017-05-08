// @flow
import type {TAccountState} from './account/types'
import type {TSignupState} from 'modules/Signup/store/types'

export type TGlobalState = {
	+account: TAccountState,
}

export type TRootState = TGlobalState & {
	+signup: TSignupState,
}

export type TSignupModuleState = TGlobalState & {
	+signup: TSignupState,
}
