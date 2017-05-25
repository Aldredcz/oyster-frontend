// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import {inject, observer} from 'mobx-react'
import type {TNotificationsStore} from '../core/store'

import NotificationList from './NotificationList'

type TProps = {
	notificationsStore: TNotificationsStore,
}
type TState = {
	isExpanded: boolean,
}

@inject('notificationsStore') @observer
export default class NotificationButton extends React.Component<void, TProps, TState> {
	state = {
		isExpanded: false,
	}

	listEl: ?HTMLElement = null

	showList = () => {
		if (this.state.isExpanded) {
			return
		}

		this.setState({
			isExpanded: true,
		}, () => {
			document.addEventListener('click', this.hideListOnClickOutside)
		})
	}

	hideListOnClickOutside = (ev: any) => {
		if (ev.path && !ev.path.includes(this.listEl)) {
			this.hideList()
		}
	}

	hideList = () => {
		document.removeEventListener('click', this.hideListOnClickOutside)
		this.setState({
			isExpanded: false,
		})
	}

	render () {
		const {notificationsStore} = this.props
		const {unreadNotificationsCount, notifications} = notificationsStore
		const {isExpanded} = this.state

		return (
			<div style={{position: 'relative'}}>
				<div
					style={{cursor: 'pointer'}}
					onClick={this.showList}
				>
					Notifications
					{unreadNotificationsCount
						? <span><br/>{'('}{unreadNotificationsCount} new)</span>
						: ''
					}
				</div>
				{isExpanded && (
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
			</div>
		)
	}
}
