// @flow
import React from 'react'
import {Provider} from 'mobx-react'
import signupStore from './store'
import Signup from './components/Signup'


export default class SignupWrapper extends React.Component<void, void, void> {
	render () {
		const SignupAny: any = Signup

		return (
			<Provider signupStore={signupStore}>
				<SignupAny />
			</Provider>
		)
	}
}
