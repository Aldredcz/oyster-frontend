import React from 'react'
import {Provider} from 'mobx-react'
import notificationsStore from './core/store'
import NotificationButton from './components/NotificationButton'

export default class NotificationsWrapper extends React.Component {
	render () {
		const NotificationButtonAny = NotificationButton as any
		const elem = <NotificationButtonAny />
		return (
			<Provider notificationsStore={notificationsStore}>
				{elem}
			</Provider>
		)
	}
}
