// @flow
import {oysterRequestFetchGroup} from './api'
import type {TGroup} from './types'
import {observable, action} from 'mobx'

import {persistStateSingleton} from 'core/utils/mobx'

interface IGroupState {
	data: TGroup,
	isLoading: boolean,
}

class Group implements IGroupState {
	@observable data = {
		uuid: '',
		name: null,
	}
	@observable isLoading = false

	@action setLoading (value: boolean) {
		this.isLoading = value
	}

	@action setData (
		data: $Shape<TGroup>,
		{clearLoading = true}: {clearLoading: boolean} = {},
	) {
		//$flowFixMe
		Object.assign(this.data, data)

		if (clearLoading) {
			this.isLoading = false
		}
	}
}

export class GroupsStore {
	@observable groups: Map<string, Group> = new Map()

	@action setGroup (uuid: string, groupState?: $Shape<IGroupState>): Group {
		let group: Group
		if (this.groups.has(uuid)) {
			group = (this.groups.get(uuid): any)
		} else {
			group = new Group()
			this.groups.set(uuid, group)
		}

		Object.assign(group, groupState)

		return group
	}

	getGroup (uuid: string): Group {
		if (this.groups.has(uuid)) {
			return (this.groups.get(uuid): any)
		}

		const newGroup = this.setGroup(uuid)

		newGroup.setLoading(true)
		oysterRequestFetchGroup(uuid)
			.then((data) => {
				newGroup.setData(data)
			})

		return newGroup
	}
	getEntity = this.getGroup.bind(this)
}

export default persistStateSingleton(new GroupsStore())
