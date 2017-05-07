// @flow
import browserHistory from 'core/utils/browserHistory'
import {oysterRequestUserSignup} from 'core/api/login-signup'
import {setAuthorizationData} from 'core/authorization'

import type {TSignupModuleState} from 'core/store/types'
import type {TSignupActions, TSignupAction, TSignupFormField} from './types'

export const SIGNUP_ACTION_TYPES = {
	SET_STEP: 'signup/SET_STEP',
	SET_INVITE_TOKEN: 'signup/SET_INVITE_TOKEN',
	SET_FORM_VALUE: 'signup/SET_FORM_VALUE',
	SET_FORM_DIRTY: 'signup/SET_FORM_DIRTY',
	SET_FORM_DISABLED: 'signup/SET_FORM_DISABLED',
}

type TGetState = () => TSignupModuleState
type TDispatch = (action: TSignupAction | (dispatch: TDispatch, getState: TGetState) => *) => string

export function setInviteToken (
	{inviteToken}: {inviteToken: string},
): $PropertyType<TSignupActions, 'setInviteToken'> {
	return {
		type: SIGNUP_ACTION_TYPES.SET_INVITE_TOKEN,
		payload: {
			inviteToken,
		},
	}
}

export function setNextStep () {
	return (dispatch: TDispatch, getState: TGetState) => {
		const currentStep = getState().signup.step

		return dispatch({
			type: SIGNUP_ACTION_TYPES.SET_STEP,
			payload: {
				value: currentStep + 1,
			},
		})
	}
}

export function setFormValue (
	{field, value}: {field: TSignupFormField, value: string},
): $PropertyType<TSignupActions, 'setFormValue'> {
	return {
		type: SIGNUP_ACTION_TYPES.SET_FORM_VALUE,
		payload: {
			field,
			value,
		},
	}
}

export function setFormDirty (
	{field, value}: {field: TSignupFormField, value: boolean},
): $PropertyType<TSignupActions, 'setFormDirty'> {
	return {
		type: SIGNUP_ACTION_TYPES.SET_FORM_DIRTY,
		payload: {
			field,
			value,
		},
	}
}

export function setFormDisabled (
	{field, value}: {field: TSignupFormField, value: boolean},
): $PropertyType<TSignupActions, 'setFormDisabled'> {
	return {
		type: SIGNUP_ACTION_TYPES.SET_FORM_DISABLED,
		payload: {
			field,
			value,
		},
	}
}

export function submitForm () {
	return (dispatch: TDispatch, getState: TGetState) => {
		const {name, surname, email, password} = getState().signup.formData

		dispatch(setNextStep())

		return oysterRequestUserSignup({
			name,
			surname,
			email,
			password,
			invite: getState().signup.inviteToken,
		}).then(
			(data) => {
				setAuthorizationData(data)
				browserHistory.push('/dashboard')
			},
		)
	}
}
