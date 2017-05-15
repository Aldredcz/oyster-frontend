// @flow
import {oysterRequestFetchUser} from './api'
import type {TUser} from './types'
import {observable, action} from 'mobx'

import {persistStateSingleton} from 'core/utils/mobx'

interface IUserState {
	data: TUser,
	isLoading: boolean,
}

class User implements IUserState {
	@observable data = {
		uuid: '',
		name: null,
		surname: null,
		email: null,
		accountsByIds: null,
	}
	@observable isLoading = false

	@action setLoading (value: boolean) {
		this.isLoading = value
	}

	@action setData (
		data: $Shape<TUser>,
		{clearLoading = true}: {clearLoading: boolean} = {},
	) {
		//$FlowFixMe
		Object.assign(this.data, data)

		if (clearLoading) {
			this.isLoading = false
		}
	}
}

export class UsersStore {
	@observable users: Map<string, User> = new Map()

	@action setUser (uuid: string, userState?: $Shape<IUserState>): User {
		let user: User
		if (this.users.has(uuid)) {
			user = (this.users.get(uuid): any)
		} else {
			user = new User()
			this.users.set(uuid, user)
		}

		Object.assign(user, userState)

		return user
	}

	getUser (uuid: string): User {
		if (this.users.has(uuid)) {
			return (this.users.get(uuid): any)
		}

		const newUser = this.setUser(uuid)
		newUser.setLoading(true)

		oysterRequestFetchUser(uuid)
			.then((data) => {
				newUser.setData(data)
			})

		return newUser
	}
	getEntity = this.getUser.bind(this)
}

export default persistStateSingleton(new UsersStore())
