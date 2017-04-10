import React from 'react'

import Login from './Login'

export default class LoginWrapper extends React.Component {
	componentDidMount () {
		if (module && module.hot) {
			module.hot.accept('./Login', () => {
				this.forceUpdate()
			})
		}
	}

	render () {
		return <Login />
	}
}
