// @flow
import {observable, action, computed} from 'mobx'
import {persistStateSingleton} from 'core/utils/mobx'

type TProjectDetailStoreData = {projectUuid: ?string, selectedTaskUuid: ?string}

class ProjectDetailStore {
	static generatePath ({projectUuid, selectedTaskUuid}: TProjectDetailStoreData): string {
		let path = ''

		if (projectUuid) {
			path += `/${projectUuid}`

			if (selectedTaskUuid) {
				path += `/task/${selectedTaskUuid}`
			}
		}

		return path
	}

	@observable projectUuid: ?string = null
	@observable selectedTaskUuid: ?string = null

	@action setData (
		{projectUuid, selectedTaskUuid}: $Shape<TProjectDetailStoreData>,
	) {
		this.projectUuid = projectUuid
		this.selectedTaskUuid = selectedTaskUuid || null
	}

	@computed get currentPath () {
		return ProjectDetailStore.generatePath({
			projectUuid: this.projectUuid,
			selectedTaskUuid: this.selectedTaskUuid,
		})
	}
}

export type TProjectDetailStore = ProjectDetailStore

const projectDetailStore: TProjectDetailStore = persistStateSingleton(new ProjectDetailStore())

export default projectDetailStore
