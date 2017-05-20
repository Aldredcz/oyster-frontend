// @flow
import {observable, computed, action} from 'mobx'
import {persistStateSingleton} from 'core/utils/mobx'
import type {IPersistStateSingletonExtras} from 'core/utils/mobx'
import accountStore from 'core/store/account'
import {projectsStore} from 'core/entities/projects'

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

	@action onEnter () {
		if (!this.projects) {
			this.fetchProjects()
		}
	}
}

export type TDashboardStore = DashboardStore & IPersistStateSingletonExtras

export default persistStateSingleton(new DashboardStore())
