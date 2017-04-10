import React from 'react'

import Signup from './Signup'

export default class SignupWrapper extends React.Component {
	componentDidMount () {
		if (module && module.hot) {
			module.hot.accept('./Signup', () => {
				this.forceUpdate()
			})
		}
	}

	render () {
		return <Signup />
	}
}
