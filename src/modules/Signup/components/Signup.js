// @flow
import React from 'react'
import {inject, observer} from 'mobx-react'

import type {TSignupStore} from '../core/store'
import type {TSignupFormField} from '../core/store/types'

import {validateField, validatePasswords} from '../core/validation'

import SignupFormField from './SignupFormField'
import Box from 'libs/box'
import Logo from 'core/components/ui/Logo'
import Text from 'core/components/ui/Text'
import Form from 'core/components/ui/Form'
import Button from 'core/components/ui/Button'

const Layout = (props) => (
	<Box flex>{props.children}</Box>
)

const BgPattern = (props) => (
	<Box
		width={props.expanded ? '100%' : '50%'}
		height='100vh'
		style={() => ({
			background: 'url("/assets/images/backgrounds/O_pattern_1.png") repeat',
			transition: 'width 1s',
		})}
	/>
)

const ContentCol = (props) => (
	<Box
		width={props.hidden ? '0%' : '50%'}
		position='relative'
		style={() => ({
			overflow: 'hidden',
			transition: 'width 1s',
		})}
	>
		{props.children}
	</Box>
)

const Content = (props) => (
	<Box
		width='80%'
		position='absolute'
		style={() => ({
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
		})}
	>{props.children}</Box>
)


type TProps = {
	+signupStore: TSignupStore,
}

@inject('signupStore', 'accountStore') @observer
export default class Signup extends React.Component<void, TProps, void> {
	static fieldsConfig: {[key: TSignupFormField]: {type: *, title: string, width?: string}} = {
		name: {
			type: 'text',
			title: 'Name',
			width: '50%',
		},
		surname: {
			type: 'text',
			title: 'Surname',
			width: '50%',
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
		inviteToken: {
			type: 'text',
			title: 'Invite token',
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
		this.props.signupStore.setPendingRequest(true)

		this.props.signupStore.submitForm()
			.catch(() => {
				alert('Signup was unsuccessful :( Please try again or contact our support TODO:')
				this.props.signupStore.setPendingRequest(false)
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
			<Form onSubmit={this.nextStep} noValidate marginHorizontal='-10px'>
				<Text
					block
					size='30'
					marginBottom={5}
					color='neutral'
				>
					Hi! I'm Oyster.<br />
					What's your name?
				</Text>
				{fields.map((fieldId) => (
					<SignupFormField
						key={fieldId}
						type={Signup.fieldsConfig[fieldId].type}
						title={Signup.fieldsConfig[fieldId].title}
						value={formData[fieldId]}
						onChange={(value) => this.handleChange(fieldId, value)}
						onBlur={() => this.handleBlur(fieldId)}
						disabled={Boolean(formMetadata[fieldId].disabled)}
						isDirty={formMetadata[fieldId].dirty}
						validation={validateField(fieldId, formData[fieldId])}
						width={Signup.fieldsConfig[fieldId].width}
					/>
				))}
				{ui.isInviteTokenInputVisible && (
					<div>
						<SignupFormField
							type={Signup.fieldsConfig.inviteToken.type}
							title={Signup.fieldsConfig.inviteToken.title}
							value={inviteToken || ''}
							onChange={(value) => signupStore.setInviteToken(value)}
							onBlur={() => this.handleBlur('inviteToken')}
							isDirty={formMetadata.inviteToken.dirty}
							validation={validateField('inviteToken', inviteToken)}
						/>
					</div>
				)}
				<Button
					submit
					block
					size='13'
					width='50%'
					disabled={!isWholeStepValid}
				>
					Next
				</Button>
			</Form>
		)
	}

	renderStep2 () {
		const {signupStore: {formData, formMetadata, ui}} = this.props
		const fields: Array<TSignupFormField> = ['password', 'passwordConfirm']
		const passwordsMatchValidation = validatePasswords(formData)
		const isWholeStepValid = !passwordsMatchValidation && fields.every(
			(fieldId) => !validateField(fieldId, formData[fieldId]),
		)

		return (
			<Form onSubmit={this.handleFormSubmit} noValidate marginHorizontal='-10px'>
				<Text
					block
					size='30'
					marginBottom={5}
					color='neutral'
				>
					Nice to meet you, {formData.name}!<br />
					What's your password?
				</Text>
				{fields.map((fieldId) => (
					<SignupFormField
						key={fieldId}
						type={Signup.fieldsConfig[fieldId].type}
						title={Signup.fieldsConfig[fieldId].title}
						value={formData[fieldId]}
						onChange={(value) => this.handleChange(fieldId, value)}
						onBlur={() => this.handleBlur(fieldId)}
						disabled={false}
						isDirty={formMetadata[fieldId].dirty}
						validation={validateField(fieldId, formData[fieldId])}
					/>
				))}
				<Text
					block
					size='13'
					color='red'
					marginVertical={2}
				>
					{formMetadata.password.dirty && formMetadata.passwordConfirm.dirty && passwordsMatchValidation || '\u00a0'}
				</Text>
				<Button
					submit
					block
					size='13'
					width='50%'
					disabled={!isWholeStepValid || ui.pendingRequest}
				>
					Get started!
				</Button>
			</Form>
		)
	}

	render () {
		const {signupStore: {step, ui}} = this.props

		return (
			<Layout>
				<ContentCol hidden={ui.pendingRequest}>
					<Logo
						width='auto'
						height={2.5}
						position='absolute'
						top={1.25}
						left={1.25}
					/>
					<Content>
						{step === 1 && this.renderStep1()}
						{step === 2 && this.renderStep2()}
					</Content>
				</ContentCol>
				<BgPattern expanded={ui.pendingRequest} />
			</Layout>
		)
	}
}
