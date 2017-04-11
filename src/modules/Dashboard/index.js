import React from 'react'

import Dashboard from './Dashboard'

export default class DashboardWrapper extends React.Component {
	componentDidMount () {
		if (module && module.hot) {
			module.hot.accept('./Dashboard', () => {
				this.forceUpdate()
			})
		}
	}

	render () { // eslint-disable-line class-methods-use-this
		return <Dashboard />
	}
}
