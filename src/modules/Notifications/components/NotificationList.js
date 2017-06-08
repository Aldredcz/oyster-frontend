// @flow
import React from 'react'
import {observer} from 'mobx-react'
import {isOpeningInNewWindow} from 'libs/event-helpers/mouse-event'
import type {TNotification} from '../core/types'

import NotificationItem from './NotificationItem'

type TProps = {
	notifications: Array<TNotification>,
	completeNotification: (notificationUuid: string) => any,
	completeAllNotifications: () => any,
	onHide: () => any,
	showCompleteAll: boolean,
}

@observer
export default class NotificationList extends React.Component<void, TProps, void> {
	render () {
		const {notifications, completeNotification, completeAllNotifications, showCompleteAll, onHide} = this.props

		return (
			<div
				style={{
					position: 'absolute',
					top: 'calc(100% + 7px)',
					right: -5,
					width: 200,
					border: '2px dotted black',
					padding: 5,
				}}
			>
				{!notifications.length
					? 'No notifications'
					: notifications.map((notification) => (
						<NotificationItem
							key={notification.uuid}
							notification={notification}
							onClick={(ev) => {
								completeNotification(notification.uuid)
								if (!isOpeningInNewWindow(ev)) {
									onHide()
								}
							}}
						/>
					))
				}
				{showCompleteAll && (
					<button onClick={completeAllNotifications}>Mark all as read</button>
				)}
			</div>
		)
	}
}
