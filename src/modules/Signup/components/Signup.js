// @flow
import React from 'react'
import {inject, observer} from 'mobx-react'

import type {TSignupStore} from '../core/store'
import type {TSignupFormField} from '../core/store/types'

import {validateField, validatePasswords} from '../core/validation'

import SignupFormField from './SignupFormField'

type TProps = {
	+signupStore: TSignupStore,
}

@inject('signupStore', 'accountStore') @observer
export default class Signup extends React.Component<void, TProps, void> {
	static fieldsConfig: {[key: TSignupFormField]: {type: string, title: string}} = {
		name: {
			type: 'text',
			title: 'Name',
		},
		surname: {
			type: 'text',
			title: 'Surname',
		},
		email: {
			type: 'email',
			title: 'Email',
		},
		password: {
			type: 'password',
			title: 'Password',
		},
		passwordConfirm: {
			type: 'password',
			title: 'Confirm password',
		},
	}

	handleChange = (field: TSignupFormField, value: string) => {
		this.props.signupStore.setFormValue(field, value)
	}

	handleBlur = (field: TSignupFormField) => {
		this.props.signupStore.setFormDirty(field, true)
	}

	nextStep = (ev: Event) => {
		ev.preventDefault()

		this.props.signupStore.setNextStep()
	}

	handleFormSubmit = (ev: Event) => {
		ev.preventDefault()

		this.props.signupStore.submitForm()
			.catch(() => {
				alert('Signup was unsuccessful :( You have probably entered wrong token. TODO')
			})
	}

	renderStep1 () {
		const {signupStore} = this.props
		const {formData, inviteToken, formMetadata, ui} = signupStore
		const fields: Array<TSignupFormField> = ['name', 'surname', 'email']
		const isWholeStepValid = fields.every(
			(fieldId) => !validateField(fieldId, formData[fieldId]),
		) && (ui.isInviteTokenInputVisible ? inviteToken : true)

		return (
			<form onSubmit={this.nextStep} noValidate>
				<h1>Hi! I'm Oyster. What's your name?</h1>
				{fields.map((fieldId) => (
					<SignupFormField
						key={fieldId}
						type={Signup.fieldsConfig[fieldId].type}
						placeholder={Signup.fieldsConfig[fieldId].title}
						value={formData[fieldId]}
						onChange={(value) => this.handleChange(fieldId, value)}
						onBlur={() => this.handleBlur(fieldId)}
						disabled={Boolean(formMetadata[fieldId].disabled)}
						isDirty={formMetadata[fieldId].dirty}
						validation={validateField(fieldId, formData[fieldId])}
					/>
				))}
				{ui.isInviteTokenInputVisible && (
					<div>
						<input
							type='text'
							placeholder='Invite token'
							value={inviteToken || ''}
							onChange={(ev: KeyboardEvent) => {
								if (ev.target instanceof HTMLInputElement) {
									signupStore.setInviteToken(ev.target.value)
								}
							}}
						/>
					</div>
				)}
				<input
					type='submit'
					value='Next'
					disabled={!isWholeStepValid}
				/>
			</form>
		)
	}

	renderStep2 () {
		const {signupStore: {formData, formMetadata}} = this.props
		const fields: Array<TSignupFormField> = ['password', 'passwordConfirm']
		const passwordsMatchValidation = validatePasswords(formData)
		const isWholeStepValid = !passwordsMatchValidation && fields.every(
			(fieldId) => !validateField(fieldId, formData[fieldId]),
		)

		return (
			<form onSubmit={this.handleFormSubmit} noValidate>
				<h1>Nice to meet you, {formData.name}! What's your password?</h1>
				{fields.map((fieldId) => (
					<SignupFormField
						key={fieldId}
						type={Signup.fieldsConfig[fieldId].type}
						placeholder={Signup.fieldsConfig[fieldId].title}
						value={formData[fieldId]}
						onChange={(value) => this.handleChange(fieldId, value)}
						onBlur={() => this.handleBlur(fieldId)}
						disabled={false}
						isDirty={formMetadata[fieldId].dirty}
						validation={validateField(fieldId, formData[fieldId])}
					/>
				))}
				{passwordsMatchValidation && formMetadata.password.dirty && formMetadata.passwordConfirm.dirty && (
					<p style={{color: 'red'}}>{passwordsMatchValidation}</p>
				)}
				<input
					type='submit'
					value='Get started'
					disabled={!isWholeStepValid}
				/>
			</form>
		)
	}

	renderStep3 () { // eslint-disable-line class-methods-use-this
		return (
			<h1>Processing...</h1>
		)
	}

	render () {
		const {signupStore: {step}} = this.props

		return (
			<div data-comment='layout and shit'>
				<div data-comment='logo'/>
				{step === 1 && this.renderStep1()}
				{step === 2 && this.renderStep2()}
				{step === 3 && this.renderStep3()}
			</div>
		)
	}
}
