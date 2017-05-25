// @flow
import React from 'react'
import {Provider} from 'mobx-react'
import notificationsStore from './core/store'
import NotificationButton from './components/NotificationButton'
	;(NotificationButton: any)

export default class NotificationsWrapper extends React.Component<void, any, void> {
	render () {
		//$FlowFixMe
		const elem = <NotificationButton/>
		return (
			<Provider notificationsStore={notificationsStore}>
				{elem}
			</Provider>
		)
	}
}
