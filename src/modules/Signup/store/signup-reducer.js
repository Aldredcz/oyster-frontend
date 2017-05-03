// @flow
import {SIGNUP_ACTION_TYPES} from './signup-actions'
import type {TSignupAction, TSignupState} from './types'


const initialState: TSignupState = {
	step: 1,
	inviteToken: '',
	formData: {
		name: '',
		surname: '',
		email: '',
		password: '',
		passwordConfirm: '',
	},
	formMetadata: {
		name: {
			dirty: false,
		},
		surname: {
			dirty: false,
		},
		email: {
			dirty: false,
		},
		password: {
			dirty: false,
		},
		passwordConfirm: {
			dirty: false,
		},
	},
}

export default function signupReducer (
	state: TSignupState = initialState,
	action: TSignupAction,
): TSignupState {
	switch (action.type) {
		case SIGNUP_ACTION_TYPES.SET_STEP:
			return {
				...state,
				step: action.payload.value,
			}

		case SIGNUP_ACTION_TYPES.SET_INVITE_TOKEN:
			return {
				...state,
				inviteToken: action.payload.inviteToken,
			}

		case SIGNUP_ACTION_TYPES.SET_FORM_VALUE:
			return {
				...state,
				formData: {
					...state.formData,
					[action.payload.field]: action.payload.value,
				},
			}

		case SIGNUP_ACTION_TYPES.SET_FORM_DIRTY:
			return {
				...state,
				formMetadata: {
					...state.formMetadata,
					[action.payload.field]: {
						...state.formMetadata[action.payload.field],
						dirty: action.payload.value,
					},
				},
			}

		case SIGNUP_ACTION_TYPES.SET_FORM_DISABLED:
			return {
				...state,
				formMetadata: {
					...state.formMetadata,
					[action.payload.field]: {
						...state.formMetadata[action.payload.field],
						disabled: action.payload.value,
					},
				},
			}

		default:
			return state
	}
}
