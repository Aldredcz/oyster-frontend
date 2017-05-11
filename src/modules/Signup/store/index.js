// @flow
import {observable, action} from 'mobx'
import browserHistory from 'core/utils/browserHistory'
import {persistStateSingleton} from 'core/utils/mobx'

import type {ISignupStoreShape, TSignupFormField} from './types'
import {oysterRequestUserSignup} from 'core/api/login-signup'
import {setAuthorizationData} from 'core/authorization'

const signupFormFields: Array<TSignupFormField> = ['name', 'surname', 'email', 'password', 'passwordConfirm']

function generateFormData (): $PropertyType<ISignupStoreShape, 'formData'> {
	const result: $PropertyType<ISignupStoreShape, 'formData'> = {}
	signupFormFields.forEach((field) => {
		result[field] = ''
	})
	return result
}

function generateFormMetadata (): $PropertyType<ISignupStoreShape, 'formMetadata'> {
	const result: $PropertyType<ISignupStoreShape, 'formMetadata'> = {}
	signupFormFields.forEach((field) => {
		result[field] = {
			dirty: false,
			disabled: false,
		}
	})
	return result
}

export class SignupStore implements ISignupStoreShape {
	constructor (props: ?ISignupStoreShape) {
		Object.assign(this, props)
	}

	@observable step = 1
	@observable inviteToken = null
	@observable formData = generateFormData()
	@observable formMetadata = generateFormMetadata()

	@action setInviteToken (token: string) {
		this.inviteToken = token
	}

	@action setFormValue (field: TSignupFormField, value: string) {
		this.formData[field] = value
	}

	@action setFormDisabled (field: TSignupFormField, value: boolean) {
		this.formMetadata[field].disabled = value
	}

	@action setFormDirty (field: TSignupFormField, value: boolean) {
		this.formMetadata[field].dirty = !value
	}

	@action setNextStep () {
		this.step++
	}

	@action submitForm () {
		this.setNextStep()
		if (this.inviteToken) {
			oysterRequestUserSignup({
				name: this.formData.name,
				surname: this.formData.surname,
				email: this.formData.email,
				password: this.formData.password,
				invite: this.inviteToken,
			}).then(
				(data) => {
					setAuthorizationData(data)
					browserHistory.push('/dashboard') // TODO: some global store?
				},
			)
		}
	}
}

export type TSignupStore = SignupStore

export default persistStateSingleton(new SignupStore())
