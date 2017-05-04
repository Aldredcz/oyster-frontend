// @flow
import React from 'react'
import {AppContainer} from 'react-hot-loader'

import Signup from './components/Signup'

export {default as signupReducer} from './store/signup-reducer'

const SignupAny: any = Signup

export default class SignupWrapper extends React.Component {
	componentDidMount () {
		if (module && module.hot) {
			module.hot.accept('./components/Signup', () => {
				this.forceUpdate()
			})
		}
	}

	render () {
		return (
			<AppContainer>
				<SignupAny />
			</AppContainer>
		)
	}
}
