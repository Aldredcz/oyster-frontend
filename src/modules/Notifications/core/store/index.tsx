import {observable, action, computed, autorun} from 'mobx'
import compareDatesDesc from 'date-fns/compare_desc'
import {generateSingleton} from 'core/utils/mobx'
import {NotificationAPI} from '../api'
import {TNotification} from '../types'
import {moduleManager} from 'core/router'

class NotificationsStore {
	constructor () {
		autorun('fetchNotificationsWhenLoggedIn', () => {
			if (moduleManager.isLoggedIn) {
				this.fetchNotifications()
			}
		})

		setInterval(
			() => {
				this.fetchNotifications()
			},
			60 * 1000,
		)
	}

	@observable notificationsMap: Map<string, TNotification> = new Map()

	@action fetchNotifications (): Promise<Array<string>> | null {
		if (!moduleManager.isLoggedIn) {
			return
		}
		return NotificationAPI.fetchAll()
			.then(
				(notifications) => notifications.map((notification) => {
					this.notificationsMap.set(notification.uuid, notification as $FixMe)
					return notification.uuid
				}),
			)
	}

	@computed get notifications () {
		return Array.from(this.notificationsMap.values()).sort((a, b) => compareDatesDesc(a.createdAt, b.createdAt))
	}

	@computed get unreadNotificationsCount () {
		return this.notifications.filter((notification) => !notification.completedAt).length
	}

	@action completeNotification (uuid) {
		const notification = this.notificationsMap.get(uuid)
		if (notification && !notification.completedAt) {
			notification.completedAt = new Date()
			NotificationAPI.complete(uuid).catch(() => {
				notification.completedAt = null
			})
		}
	}

	@action completeAllNotifications () {
		this.notifications
			.filter((notification) => !notification.completedAt)
			.forEach((notification) => {
				this.completeNotification(notification.uuid)
			})
	}
}

export type TNotificationsStore = NotificationsStore

const notificationsStore: TNotificationsStore = generateSingleton(NotificationsStore)

export default notificationsStore
