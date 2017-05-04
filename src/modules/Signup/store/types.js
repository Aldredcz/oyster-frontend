// @flow
export type TSignupFormMetadata = {|
	+dirty: boolean,
	+disabled?: boolean,
|}

export type TSignupFormField =
	| 'name'
	| 'surname'
	| 'email'
	| 'password'
	| 'passwordConfirm'

export type TSignupState = {
	+step: number,
	+inviteToken: string,
	+formData: {
		+[key: TSignupFormField]: string,
	},
	+formMetadata: {
		+[key: TSignupFormField]: TSignupFormMetadata,
	},
}

export type TSignupActions = {
	setStep: {
		type: 'signup/SET_STEP',
		payload: {|
			value: number,
		|},
	},
	setInviteToken: {
		type: 'signup/SET_INVITE_TOKEN',
		payload: {|
			inviteToken: string,
		|},
	},
	setFormValue: {
		type: 'signup/SET_FORM_VALUE',
		payload: {|
			field: TSignupFormField,
			value: string,
		|},
	},
	setFormDirty: {
		type: 'signup/SET_FORM_DIRTY',
		payload: {|
			field: TSignupFormField,
			value: boolean,
		|},
	},
	setFormDisabled: {
		type: 'signup/SET_FORM_DISABLED',
		payload: {|
			field: TSignupFormField,
			value: boolean,
		|},
	},
}

export type TSignupAction =
	| $PropertyType<TSignupActions, 'setStep'>
	| $PropertyType<TSignupActions, 'setInviteToken'>
	| $PropertyType<TSignupActions, 'setFormValue'>
	| $PropertyType<TSignupActions, 'setFormDirty'>
	| $PropertyType<TSignupActions, 'setFormDisabled'>
