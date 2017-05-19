// @flow
import {ProjectAPI} from './api'
import {initialState} from './types'
import {action} from 'mobx'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import type {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {persistStateSingleton} from 'core/utils/mobx'

const UpdatableProject = createUpdatableEntityClass({
	entityState: initialState,
	update: ProjectAPI.update,
})

export class Project extends UpdatableProject {
	@action addNewTask (uuid: string) {
		this.data.tasksByIds && this.data.tasksByIds.push(uuid)
	}
}

class ProjectsStore extends createEntityStoreClass({
	EntityClass: Project,
	fetch: ProjectAPI.fetch,
}) {}

const projectsStore: IEntityStore<Project> = persistStateSingleton(new ProjectsStore())
export default projectsStore
