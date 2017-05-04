// @flow
import React from 'react'

import Dashboard from './Dashboard'
const DashboardAny: any = Dashboard

export default class DashboardWrapper extends React.Component {
	componentDidMount () {
		if (module && module.hot) {
			module.hot.accept('./Dashboard', () => {
				this.forceUpdate()
			})
		}
	}

	render () {
		return <DashboardAny />
	}
}
