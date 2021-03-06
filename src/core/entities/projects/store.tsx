import {ProjectAPI} from './api'
import {initialState} from './types'
import {action} from 'mobx'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import {IUpdatableEntity} from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {generateSingleton} from 'core/utils/mobx'

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

	@action deleteProjectManager (userUuid: string) {
		const originalOwnersByIds = this.data.ownersByIds || []
		const newValue = originalOwnersByIds.filter((ownerId) => ownerId !== userUuid)

		this.data.ownersByIds = newValue
		ProjectAPI.deleteProjectManager(this.data.uuid, userUuid)
			.catch(
				() => {
					alert('Deleting failed, TODO:')
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

const projectsStore: IEntityStore<TProjectEntity> = generateSingleton(ProjectsStore)
export default projectsStore
