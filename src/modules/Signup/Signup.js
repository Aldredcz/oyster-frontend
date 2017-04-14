// @flow
import React from 'react'
import {withRouter, Link} from 'react-router-dom'

import {oysterRequestUserSignup} from 'core/api/user'
import {setAuthorizationData} from 'core/authorization'

@withRouter
export default class Signup extends React.Component {
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
		oysterRequestUserSignup(this.state.formData)
			.then(
				(userData) => {
					setAuthorizationData(userData)
					this.props.history.push('/dashboard')
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

		return (
			<div>
				<h1>Signup</h1>
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
						value='Sign me up!'
						disabled={processing}
					/>
					{error && (
						<p style={{color: 'red'}}>
							{error}
						</p>
					)}
					<p>
						<Link to='/login'>
							Go to login!
						</Link>
					</p>
				</form>
			</div>
		)
	}
}
