// @flow
import React from 'react'
import URI from 'urijs'
import {withRouter} from 'react-router-dom'
import type {Location} from 'react-router'
import {connect} from 'react-redux'

import type {TSignupState, TSignupFormField} from '../store/types'
import type {TSignupModuleState} from 'core/store/types'

import {validateField, validatePasswords} from '../core/validation'
import {setFormValue, setFormDirty, setNextStep, submitForm, setInviteToken, setFormDisabled} from '../store/signup-actions'

import SignupFormField from './SignupFormField'

type TProps = {
	+location: Location,
	+step: $PropertyType<TSignupState, 'step'>,
	+formData: $PropertyType<TSignupState, 'formData'>,
	+formMetadata: $PropertyType<TSignupState, 'formMetadata'>,
	+setFormValue: typeof setFormValue,
	+setFormDirty: typeof setFormDirty,
	+setNextStep: typeof setNextStep,
	+submitForm: typeof submitForm,
	+setInviteToken: typeof setInviteToken,
	+setFormDisabled: typeof setFormDisabled,
}

@connect(
	(state: TSignupModuleState) => ({
		step: state.signup.step,
		formData: state.signup.formData,
		formMetadata: state.signup.formMetadata,
	}),
	{
		setFormValue,
		setFormDirty,
		setNextStep,
		submitForm,
		setInviteToken,
		setFormDisabled,
	},
)
@withRouter
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

	componentWillMount () {
		const query = URI.parseQuery(this.props.location.search)

		if (!query.invite) {
			alert('Nemas invite token, chod dopice. TODO: make this more user friendly :D')
		} else {
			this.props.setInviteToken({
				inviteToken: query.invite,
			})
		}

		if (query.email) {
			this.props.setFormValue({
				field: 'email',
				value: query.email,
			})
			this.props.setFormDisabled({
				field: 'email',
				value: true,
			})
		}

	}

	handleChange = (field: TSignupFormField, value: string) => {
		this.props.setFormValue({
			field,
			value,
		})
	}

	handleBlur = (field: TSignupFormField) => {
		this.props.setFormDirty({
			field,
			value: true,
		})
	}

	nextStep = (ev: Event) => {
		ev.preventDefault()

		this.props.setNextStep()
	}

	handleFormSubmit = (ev: Event) => {
		ev.preventDefault()

		this.props.submitForm()
	}

	renderStep1 () {
		const {formData, formMetadata} = this.props
		const fields: Array<TSignupFormField> = ['name', 'surname', 'email']
		const isWholeStepValid = fields.every(
			(fieldId) => !validateField(fieldId, formData[fieldId]),
		)

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
				<input
					type='submit'
					value='Next'
					disabled={!isWholeStepValid}
				/>
			</form>
		)
	}

	renderStep2 () {
		const {formData, formMetadata} = this.props
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
		const {step} = this.props

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
