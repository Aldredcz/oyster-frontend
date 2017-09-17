export type TSignupFormMetadata = {
	dirty: boolean,
	disabled: boolean,
}

export type TSignupFormField =
	| 'name'
	| 'surname'
	| 'email'
	| 'password'
	| 'passwordConfirm'
	| 'inviteToken'

export interface ISignupStoreShape {
	step: number,
	inviteToken: string,
	formData: {
		[key in TSignupFormField]: string;
	},
	formMetadata: {
		[key in TSignupFormField]: TSignupFormMetadata;
	},
	ui: {
		isInviteTokenInputVisible: boolean,
		pendingRequest: boolean,
	},
}
