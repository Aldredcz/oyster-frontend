// @flow
import {action} from 'mobx'
import {TaskAPI} from './api'
import {initialState} from './types'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import type {IUpdatableEntity} from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import type {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {persistStateSingleton} from 'core/utils/mobx'

export class TaskEntity extends createUpdatableEntityClass({
	entityState: initialState,
	update: TaskAPI.update,
}) {
	@action assignContributor (userUuid: string) {
		const originalOwnersByIds = this.data.ownersByIds || []
		const newValue = [...originalOwnersByIds, userUuid]

		this.data.ownersByIds = newValue
		TaskAPI.assignContributor(this.data.uuid, userUuid)
			.then(
				(ownersByIds) => {
					this.data.ownersByIds = ownersByIds
				},
				() => {
					alert('Assigning failed, TODO:')
					this.data.ownersByIds = originalOwnersByIds
				},
			)
	}
}

export type TTaskEntity = IUpdatableEntity<typeof initialState> & TaskEntity

class TasksStore extends createEntityStoreClass({
	EntityClass: TaskEntity,
	fetch: TaskAPI.fetch,
}) {}

const tasksStore: IEntityStore<TTaskEntity> = persistStateSingleton(new TasksStore())

export default tasksStore
