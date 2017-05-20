// @flow
import React from 'react'
import {Provider} from 'mobx-react'
import dashboardStore from './core/store'
import Dashboard from './components/Dashboard'
;(Dashboard: any)

export default class DashboardWrapper extends React.Component<void, void, void> {
	render () {
		//$FlowFixMe
		const elem = <Dashboard/>
		return (
			<Provider dashboardStore={dashboardStore}>
				{elem}
			</Provider>
		)
	}
}
