// @flow
import {action} from 'mobx'
import {TaskAPI} from './api'
import {initialState} from './types'
import type {TTaskPermission} from './types'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import type {IUpdatableEntity} from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import type {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {generateSingleton} from 'core/utils/mobx'

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

	@action deleteContributor (userUuid: string) {
		const originalOwnersByIds = this.data.ownersByIds || []
		const newValue = originalOwnersByIds.filter((ownerId) => ownerId !== userUuid)

		this.data.ownersByIds = newValue
		TaskAPI.deleteContributor(this.data.uuid, userUuid)
			.catch(
				() => {
					alert('Deleting failed, TODO:')
					this.data.ownersByIds = originalOwnersByIds
				},
			)
	}


	@action changeTaskStatus (action: TTaskPermission) {
		let promise
		switch (action) {
			case 'complete':
				promise = this.updateField('completedAt', new Date())
				break
			case 'approve':
				promise = this.updateField('approvedAt', new Date())
				break
			case 'reopen':
			case 'reject':
				this.data.completedAt = null
				this.data.approvedAt = null
				promise = TaskAPI[action](this.data.uuid)
					.catch(() => { /* TODO: */ })
				break
		}
		this.data.permissions && this.data.permissions.clear()

		// refetch to update permissions
		// will be replaced by websockets
		promise && promise
			.then(() => {
				TaskAPI.fetch(this.data.uuid)
			})
	}
}

export type TTaskEntity = IUpdatableEntity<typeof initialState> & TaskEntity

class TasksStore extends createEntityStoreClass({
	EntityClass: TaskEntity,
	fetch: TaskAPI.fetch,
}) {}

const tasksStore: IEntityStore<TTaskEntity> = generateSingleton(TasksStore)

export default tasksStore
