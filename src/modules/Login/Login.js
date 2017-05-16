// @flow
import React from 'react'
import {Link} from 'react-router-dom'
import browserHistory from 'core/utils/browserHistory'
import {isEmail, isPassword} from 'libs/validation/validators'

import {oysterRequestUserLogin} from 'core/api/login-signup'
import {setAuthorizationData} from 'core/authorization'

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
					browserHistory.push('/dashboard')
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
						<Link to='/signup'>
							Go to signup
						</Link>
						{' '}|{' '}
						<Link to='/signup?invite=1e863a9f-1f0d-40e7-8de8-60462838b6d8'>
							Go to signup (with predefined token)
						</Link>
						{' '}|{' '}
						<Link to='/signup?invite=1e863a9f-1f0d-40e7-8de8-60462838b6d8&email=tester@getoyster.com'>
							Go to signup (with predefined token and email)
						</Link>
					</p>
				</form>
			</div>
		)
	}
}
