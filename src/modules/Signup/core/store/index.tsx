import {observable, action} from 'mobx'
import URI from 'urijs'
import {generateSingleton} from 'core/utils/mobx'
import {moduleManager} from 'core/router'
import {oysterRequestUserSignup, oysterRequestCheckInviteToken} from 'core/api/auth'

import {ISignupStoreShape, TSignupFormField} from './types'

const signupFormFields: Array<TSignupFormField> = ['name', 'surname', 'email', 'password', 'passwordConfirm', 'inviteToken']

function generateFormData (): ISignupStoreShape['formData'] {
	const result: $FixMe = {}
	signupFormFields.forEach((field) => {
		result[field] = ''
	})
	return result
}

function generateFormMetadata (): ISignupStoreShape['formMetadata'] {
	const result: $FixMe = {}
	signupFormFields.forEach((field) => {
		result[field] = {
			dirty: false,
			disabled: false,
		}
	})
	return result
}

class SignupStore implements ISignupStoreShape {
	@observable step = 1
	@observable inviteToken = ''
	@observable isInviteTokenValid = false
	@observable accountName = ''
	@observable formData = generateFormData()
	@observable formMetadata = generateFormMetadata()
	@observable ui = {
		isInviteTokenInputVisible: false,
		pendingRequest: false,
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

	@action setPreviousStep () {
		this.step = Math.max(1, this.step - 1)
	}

	@action submitForm () {
		return oysterRequestUserSignup({
			name: this.formData.name,
			surname: this.formData.surname,
			email: this.formData.email,
			password: this.formData.password,
			invite: this.inviteToken,
		}).then(
			(userData) => {
				moduleManager.handleLogin(userData.uuid, userData.token)
			},
		)
	}

	// ROUTING
	@action onEnter () {
		const query = URI.parseQuery(window.location.search)

		this.resetStore()

		if (!query.invite) {
			this.ui.isInviteTokenInputVisible = true
		} else {
			this.checkInviteToken(query.invite)
				.catch(() => {
					alert('We\'re sorry. It looks like this signup address is not valid. Please contant us at hello@getoyster.com')
				})
			this.ui.isInviteTokenInputVisible = false
			this.setInviteToken(query.invite)
		}

		if (query.email) {
			this.setFormValue('email', query.email)
			this.setFormDisabled('email', true)
		}
	}

	@action checkInviteToken (token: string): Promise<void> {
		if (!token) {
			return Promise.reject('')
		}
		return oysterRequestCheckInviteToken(token)
			.then(
				({name}) => {
					this.accountName = name
					this.isInviteTokenValid = true
				},
			)
	}

	@action setPendingRequest (value: boolean) {
		this.ui.pendingRequest = value
	}

	@action resetStore () {
		this.step = 1
		this.inviteToken = ''
		this.formData = generateFormData()
		this.formMetadata = generateFormMetadata()
		this.ui = {
			isInviteTokenInputVisible: false,
			pendingRequest: false,
		}
	}
}

export type TSignupStore = SignupStore

export default generateSingleton(SignupStore)
