// @flow
export type TSignupFormMetadata = {|
	dirty: boolean,
	disabled?: boolean,
|}

export type TSignupFormField =
	| 'name'
	| 'surname'
	| 'email'
	| 'password'
	| 'passwordConfirm'

export interface ISignupStoreShape {
	step: number,
	inviteToken: ?string,
	formData: {
		[key: TSignupFormField]: string,
	},
	formMetadata: {
		[key: TSignupFormField]: TSignupFormMetadata,
	},
}
