// @flow
import React from 'react'
import {observer} from 'mobx-react'
import {isOpeningInNewWindow} from 'libs/event-helpers/mouse-event'
import type {TNotification} from '../core/types'

import NotificationItem from './NotificationItem'
import Box from 'libs/box'
import Text from 'core/components/ui/Text'
import Button from 'core/components/ui/Button'

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
			<Box
				position='fixed'
				top='40px'
				right='10px'
				width={15}
				backgroundColor='neutralLight'
				borderRadius={5}
			>
				<Text
					block
					textSize='9'
					color={notifications.length ? 'neutral' : 'neutralDark'}
					paddingHorizontal={0.6} paddingVertical={0.3}
				>
					{notifications.length
						? 'Notifications'
						: 'No notifications'
					}
				</Text>
				{notifications.map((notification) => (
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
				))}
				{showCompleteAll && (
					<Button
						onClick={completeAllNotifications}
						block
						marginVertical={0.6}
						marginHorizontal='auto'
					>Mark all as read</Button>
				)}
			</Box>
		)
	}
}
