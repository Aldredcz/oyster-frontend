import React from 'react'
import {Provider} from 'mobx-react'
import dashboardStore from './core/store'
import Dashboard from './components/Dashboard'

export default class DashboardWrapper extends React.Component {
	render () {
		const DashboardAny = Dashboard as any
		const elem = <DashboardAny />
		return (
			<Provider dashboardStore={dashboardStore}>
				{elem}
			</Provider>
		)
	}
}
