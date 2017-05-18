// @flow
import React from 'react'
import {isEmail, isPassword} from 'libs/validation/validators'
import {moduleManager} from 'core/store/router'
import {setAuthorizationData} from 'core/authorization'
import {oysterRequestUserLogin} from 'core/api/login-signup'

export default class Login extends React.Component {
	state = {
		formData: {
			email: '',
			password: '',
		},
		processing: false,
		error: null,
	}

	handleChange = (ev: KeyboardEvent) => {
		if (ev.target instanceof HTMLInputElement) {
			this.setState({
				formData: {
					...this.state.formData,
					[ev.target.name]: ev.target.value,
				},
			})
		}
	}

	handleSubmit = (ev: Event) => {
		ev.preventDefault()

		this.setState({
			processing: true,
			error: null,
		})
		oysterRequestUserLogin(this.state.formData)
			.then(
				(userData) => {
					setAuthorizationData(userData)
					moduleManager.setModule('dashboard')
				},
				async ({response}) => {
					const responseJson = await response.json()
					this.setState({
						formData: {
							...this.state.formData,
							password: '',
						},
						error: responseJson && responseJson.error || null,
						processing: false,
					})
				},
			)
	}

	goToSignup = (ev: MouseEvent) => {
		moduleManager.setModule('signup', null, ev)
	}

	render () {
		const {formData, processing, error} = this.state
		const isValid = isEmail(formData.email) && isPassword(formData.password)

		return (
			<div>
				<h1>Login</h1>
				<form onSubmit={this.handleSubmit}>
					<input
						type='text'
						placeholder='Your e-mail'
						name='email'
						value={formData.email}
						onChange={this.handleChange}
					/>
					<input
						type='password'
						placeholder='Password'
						name='password'
						value={formData.password}
						onChange={this.handleChange}
					/>
					<input
						type='submit'
						value='Log me in!'
						disabled={processing || !isValid}
					/>
					{error && (
						<p style={{color: 'red'}}>
							{error}
						</p>
					)}
					<p>
						<a href='/signup' onClick={this.goToSignup}>
							Go to signup
						</a>
						{' '}|{' '}
						<a href='/signup?invite=1e863a9f-1f0d-40e7-8de8-60462838b6d8'>
							Go to signup (with predefined token)
						</a>
						{' '}|{' '}
						<a href='/signup?invite=1e863a9f-1f0d-40e7-8de8-60462838b6d8&email=tester@getoyster.com'>
							Go to signup (with predefined token and email)
						</a>
					</p>
				</form>
			</div>
		)
	}
}
