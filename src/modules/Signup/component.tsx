import React from 'react'
import {Provider} from 'mobx-react'
import signupStore from './core/store'
import Signup from './components/Signup'


export default class SignupWrapper extends React.Component {
	render () {
		const SignupAny = Signup as any
		const elem = <SignupAny />
		return (
			<Provider signupStore={signupStore}>
				{elem}
			</Provider>
		)
	}
}
