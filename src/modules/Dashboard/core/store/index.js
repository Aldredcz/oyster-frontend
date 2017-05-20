// @flow
import {observable, computed, action} from 'mobx'
import {persistStateSingleton} from 'core/utils/mobx'
import type {IPersistStateSingletonExtras} from 'core/utils/mobx'
import accountStore from 'core/store/account'
import {projectsStore, Project} from 'core/entities/projects'
import {moduleManager} from 'core/router'

class DashboardStore {
	// eslint-disable-next-line class-methods-use-this
	@computed get projects () {
		return accountStore.projectsByIds && accountStore.projectsByIds.map((projectUuid) => (
			projectsStore.getEntity(projectUuid)
		))
	}

	@observable ui = {
		creatingNewProject: false,
	}

	// eslint-disable-next-line class-methods-use-this
	@action fetchProjects () {
		accountStore.fetchProjects()
	}

	@action createNewProject (): Promise<Project> {
		this.ui.creatingNewProject = true

		const response = accountStore.createNewProject()

		response.then(
			(projectUuid) => {
				this.ui.creatingNewProject = false
				moduleManager.setModule('projectDetail', {projectUuid})
			},
		)

		return response.then((projectUuid) => projectsStore.getEntity(projectUuid))
	}

	@action onEnter () {
		if (!this.projects) {
			this.fetchProjects()
		}
	}
}

export type TDashboardStore = DashboardStore & IPersistStateSingletonExtras

export default persistStateSingleton(new DashboardStore())
