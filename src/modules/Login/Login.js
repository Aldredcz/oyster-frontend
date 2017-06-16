// @flow
import React from 'react'
import {observable, action} from 'mobx'
import {observer} from 'mobx-react'
import {isEmail, isPassword} from 'libs/validation/validators'
import {moduleManager} from 'core/router'
import {oysterRequestUserLogin} from 'core/api/auth'

import Box from 'libs/box'
import Logo from 'core/components/ui/Logo'
import Text from 'core/components/ui/Text'
import Form from 'core/components/ui/Form'
import TextInput from 'core/components/ui/TextInput'
import Button from 'core/components/ui/Button'

const Layout = (props) => (
	<Box flex>{props.children}</Box>
)

const BgPattern = () => (
	<Box
		width='50%'
		height='100vh'
		style={() => ({
			background: 'url("/assets/images/backgrounds/O_pattern_1.png") repeat',
		})}
	/>
)

const ContentCol = (props) => (
	<Box width='50%' position='relative'>{props.children}</Box>
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

@observer
export default class Login extends React.Component {
	@observable formData = {
		email: '',
		password: '',
	}
	@observable processing: boolean = false
	@observable error: ?string = null

	handleChange = action((ev: KeyboardEvent) => {
		if (ev.target instanceof HTMLInputElement) {
			this.formData[ev.target.name] = ev.target.value
		}
	})

	handleSubmit = action((ev: Event) => {
		ev.preventDefault()

		this.processing = true
		this.error = null
		oysterRequestUserLogin(this.formData)
			.then(
				(userData) => {
					moduleManager.handleLogin(userData.uuid, userData.token)
				},
				async ({response}) => {
					const responseJson = await response.json()
					this.handleLoginError(responseJson)
				},
			)
	})

	@action handleLoginError (responseJson: ?Object) {
		this.formData.password = ''
		this.error = responseJson && responseJson.error || null
		this.processing = false
	}

	render () {
		const {formData, processing, error} = this
		const isValid = isEmail(formData.email) && isPassword(formData.password)

		return (
			<Layout>
				<BgPattern />
				<ContentCol>
					<Logo
						width='auto'
						height={2.5}
						position='absolute'
						top={1.25}
						left={1.25}
					/>
					<Content>
						<Text
							block
							size='30'
							marginBottom={5}
							color='neutral'
						>
							Welcome back!<br/>
							Please login below.
						</Text>
						<Form onSubmit={this.handleSubmit}>
							<Text size='9' bold color='blue'>
								Email
							</Text>
							<TextInput
								block
								size='17'
								marginBottom={2}
								name='email'
								value={formData.email}
								onChange={this.handleChange}
							/>
							<Text size='9' bold color='blue'>
								Password
							</Text>
							<TextInput
								block
								size='17'
								marginBottom={5}
								type='password'
								name='password'
								value={formData.password}
								onChange={this.handleChange}
							/>
							<Button
								submit
								block
								size='13'
								width='50%'
								disabled={processing || !isValid}
							>
								Sign me in!
							</Button>
							{error && (
								<p style={{color: 'red'}}>
									{error}
								</p>
							)}
						</Form>
					</Content>
				</ContentCol>
			</Layout>
		)
	}
}
