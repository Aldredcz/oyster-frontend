// @flow
import type {TSignupState} from 'modules/Signup/store/types'

export type TGlobalState = {
	+app: any, // TODO
}

export type TRootState = TGlobalState & {
	+signup: TSignupState,
}

export type TSignupModuleState = TGlobalState & {
	+signup: TSignupState,
}
