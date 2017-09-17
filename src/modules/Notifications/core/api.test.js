import * as NotificationsAPI from './api'

const eventName = 'rename'
const eventSubjectType = 'task'

const createNotificationFromApi = ({eventName, eventSubjectType}) => ({
	uuid: '124',
	'created_at': '2017-05-05',
	events: [{
		uuid: '111',
		name: eventName,
		'created_at': '2017-05-04',
		subject: {
			type: eventSubjectType,
			uuid: '199',
		},
	}],
})

const validNotification = {...createNotificationFromApi({eventName, eventSubjectType})}
const invalidNotification = {
	...validNotification,
	events: [],
}

describe('processNotificationFromApi', () => {
	test('notification name matches event name', ()  => {
		const notificationFromApi = createNotificationFromApi({
			eventName,
			eventSubjectType,
		})
		const notification = NotificationsAPI.processNotificationFromApi(notificationFromApi)

		expect(notification.name).toEqual(eventName)
	})

	test('creates right `subjects` map', ()  => {
		const notificationFromApi = createNotificationFromApi({
			eventName,
			eventSubjectType: 'task',
		})
		const notification = NotificationsAPI.processNotificationFromApi(notificationFromApi)

		expect(notification.subjects).toHaveProperty('tasks')
	})

	test('returns falsy value when subject type is unknown', ()  => {
		const notificationFromApi = createNotificationFromApi({
			eventName,
			eventSubjectType: 'SOME-WEIRD-STUFF',
		})
		const notification = NotificationsAPI.processNotificationFromApi(notificationFromApi)

		expect(notification).toBeFalsy()
	})

	test('returns falsy value when there is no event', () => {
		const invalidNotification2 = {...invalidNotification}
		delete invalidNotification2.events
		const notification1 = NotificationsAPI.processNotificationFromApi(invalidNotification)
		const notification2 = NotificationsAPI.processNotificationFromApi(invalidNotification2)

		expect(notification1).toBeFalsy()
		expect(notification2).toBeFalsy()
	})
})


describe('processNotificationsFromApi', () => {
	test('filters out invalid notifications', () => {
		const notifications = NotificationsAPI.processNotificationsFromApi([
			invalidNotification,
			validNotification,
			invalidNotification,
		])

		expect(notifications.length).toEqual(1)
	})
})
