// @flow
import {ProjectAPI} from './api'
import {initialState} from './types'
import {action} from 'mobx'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import type {IUpdatableEntity} from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import type {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {persistStateSingleton} from 'core/utils/mobx'

const UpdatableProject = createUpdatableEntityClass({
	entityState: initialState,
	update: ProjectAPI.update,
})

export class ProjectEntity extends UpdatableProject {
	@action addNewTask (uuid: string) {
		this.data.tasksByIds && this.data.tasksByIds.push(uuid)
	}

	@action assignProjectManager (userUuid: string) {
		const originalOwnersByIds = this.data.ownersByIds || []
		const newValue = [...originalOwnersByIds, userUuid]

		this.data.ownersByIds = newValue
		ProjectAPI.assignProjectManager(this.data.uuid, userUuid)
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

export type TProjectEntity = ProjectEntity & IUpdatableEntity<typeof initialState>

class ProjectsStore extends createEntityStoreClass({
	EntityClass: ProjectEntity,
	fetch: ProjectAPI.fetch,
}) {}

const projectsStore: IEntityStore<TProjectEntity> = persistStateSingleton(new ProjectsStore())
export default projectsStore
