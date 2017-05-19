// @flow
import React from 'react'
import {Provider} from 'mobx-react'
import signupStore from './core/store'
import Signup from './components/Signup'


export default class SignupWrapper extends React.Component<void, void, void> {
	render () {
		//$FlowFixMe
		const elem = <Signup/>
		return (
			<Provider signupStore={signupStore}>
				{elem}
			</Provider>
		)
	}
}
