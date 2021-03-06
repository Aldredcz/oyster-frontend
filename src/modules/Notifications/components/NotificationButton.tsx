import React from 'react'
import ReactDOM from 'react-dom'
import {observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import {TNotificationsStore} from '../core/store'

import NotificationList from './NotificationList'
import Box from 'libs/box'
import Ico from 'core/components/ui/Ico'


type TProps = {
	notificationsStore: TNotificationsStore,
}

@inject('notificationsStore') @observer
export default class NotificationButton extends React.Component<TProps> {
	@observable isExpanded: boolean = false

	listEl: HTMLElement | null = null

	showList = () => {
		if (this.isExpanded) {
			return
		}

		this.props.notificationsStore.fetchNotifications()
		this.isExpanded = true
		document.addEventListener('click', this.hideListOnClickOutside)
	}

	hideListOnClickOutside = (ev: any) => {
		if (ev.path && !ev.path.includes(this.listEl)) {
			this.hideList()
		}
	}

	hideList = () => {
		document.removeEventListener('click', this.hideListOnClickOutside)
		this.isExpanded = false
	}

	render () {
		const {notificationsStore} = this.props
		const {unreadNotificationsCount, notifications} = notificationsStore

		return (
			<Box>
				<Box
					display='inline-block'
					position='relative'
					style={() => ({cursor: 'pointer'})}
					onClick={this.showList}
				>
					<Ico
						type='notification'
						height={1}
						color='neutralDark'
					/>
					{unreadNotificationsCount
						? (
							<Box
								width='8px'
								height='8px'
								backgroundColor='red'
								borderRadius={8}
								position='absolute'
								style={() => ({
									bottom: '2px',
									right: '-1px',
								})}
							/>
						)
						: ''
					}
				</Box>
				{this.isExpanded && (
					<NotificationList
						ref={(reactEl) => {
							// eslint-disable-next-line react/no-find-dom-node
							const el = ReactDOM.findDOMNode(reactEl)
							if (el instanceof HTMLElement) {
								this.listEl = el
							}
						}}
						notifications={notifications}
						onHide={this.hideList}
						completeNotification={(uuid) => notificationsStore.completeNotification(uuid)}
						completeAllNotifications={() => notificationsStore.completeAllNotifications()}
						showCompleteAll={Boolean(unreadNotificationsCount)}
					/>
				)}
			</Box>
		)
	}
}
