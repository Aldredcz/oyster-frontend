import React from 'react'
import {withRouter, Link} from 'react-router-dom'

import {oysterRequestUserLogin} from 'core/api/user'
import {setAuthorizationData} from 'core/authorization'

@withRouter
export default class Login extends React.Component {
	state = {
		formData: {
			email: '',
			password: '',
		},
		processing: false,
		error: null,
	}

	handleChange = (ev) => {
		this.setState({
			formData: {
				...this.state.formData,
				[ev.target.name]: ev.target.value,
			},
		})
	}

	handleSubmit = (ev) => {
		ev.preventDefault()

		this.setState({
			processing: true,
			error: null,
		})
		oysterRequestUserLogin(this.state.formData)
			.then(
				(userData) => {
					setAuthorizationData(userData)
					this.props.history.push('/dashboard')
				},
				async ({response}) => {
					this.setState({
						formData: {
							...this.state.formData,
							password: '',
						},
						error: await response.text(), // TODO: change
						processing: false,
					})
				},
			)
	}

	render () {
		const {formData, processing, error} = this.state

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
						disabled={processing}
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
					</p>
				</form>
			</div>
		)
	}
}
