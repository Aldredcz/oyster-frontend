// @flow
import {observable, action} from 'mobx'
import URI from 'urijs'
import {persistStateSingleton} from 'core/utils/mobx'
import type {IPersistStateSingletonExtras} from 'core/utils/mobx'
import {moduleManager} from 'core/router'
import {setAuthorizationData} from 'core/authorization'
import {oysterRequestUserSignup} from 'core/api/login-signup'

import type {ISignupStoreShape, TSignupFormField} from './types'

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
	@observable inviteToken = ''
	@observable formData = generateFormData()
	@observable formMetadata = generateFormMetadata()
	@observable ui = {
		isInviteTokenInputVisible: false,
	}

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
		this.formMetadata[field].dirty = value
	}

	@action setNextStep () {
		this.step++
	}

	@action submitForm () {
		this.setNextStep()
		return oysterRequestUserSignup({
			name: this.formData.name,
			surname: this.formData.surname,
			email: this.formData.email,
			password: this.formData.password,
			invite: this.inviteToken,
		}).then(
			(data) => {
				setAuthorizationData(data)
				moduleManager.setModule('dashboard')
			},
		)
	}

	// ROUTING
	@action onEnter () {
		const query = URI.parseQuery(window.location.search)

		;(this: any).resetStore()

		if (!query.invite) {
			this.ui.isInviteTokenInputVisible = true
		} else {
			this.ui.isInviteTokenInputVisible = false
			this.setInviteToken(query.invite)
		}

		if (query.email) {
			this.setFormValue('email', query.email)
			this.setFormDisabled('email', true)
		}

	}
}

export type TSignupStore = SignupStore & IPersistStateSingletonExtras

export default persistStateSingleton(new SignupStore())
