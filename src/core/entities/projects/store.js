// @flow
import {oysterRequestFetchProject} from './api'
import type {TProject} from './types'
import {observable, action} from 'mobx'

import {persistStateSingleton} from 'core/utils/mobx'

interface IProjectState {
	data: TProject,
	isLoading: boolean,
}

class Project implements IProjectState {
	@observable data = {
		uuid: '',
		name: null,
		deadline: null,
		archived: null,
		accountsByIds: null,
		tasksByIds: null,
		ownersByIds: null,
	}
	@observable isLoading = false

	@action setLoading (value: boolean) {
		this.isLoading = value
	}

	@action setData (
		data: $Shape<TProject>,
		{clearLoading = true}: {clearLoading: boolean} = {},
	) {
		//$FlowFixMe
		Object.assign(this.data, data)
		if (clearLoading) {
			this.isLoading = false
		}
	}
}

export class ProjectsStore {
	@observable projects: Map<string, Project> = new Map()

	@action setProject (uuid: string, projectState: $Shape<IProjectState>): Project {
		let project: Project
		if (this.projects.has(uuid)) {
			project = (this.projects.get(uuid): any)
		} else {
			project = new Project()
			this.projects.set(uuid, project)
		}

		Object.assign(project, projectState)

		return project
	}

	getProject (uuid: string): Project {
		if (this.projects.has(uuid)) {
			return (this.projects.get(uuid): any)
		}

		const newProject = this.setProject(uuid)
		newProject.setLoading(true)

		oysterRequestFetchProject(uuid)
			.then((data) => {
				newProject.setData(data)
			})

		return newProject
	}
	getEntity = this.getProject.bind(this)
}

export default persistStateSingleton(new ProjectsStore())
