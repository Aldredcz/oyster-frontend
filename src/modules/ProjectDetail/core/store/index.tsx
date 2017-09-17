import {observable, action, computed} from 'mobx'
import {generateSingleton} from 'core/utils/mobx'

type TProjectDetailStoreData = {projectUuid: string | null, selectedTaskUuid: string | null}

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

	@observable projectUuid: string | null = null
	@observable selectedTaskUuid: string | null = null

	@action setData (
		{projectUuid, selectedTaskUuid}: Partial<TProjectDetailStoreData>,
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

const projectDetailStore: TProjectDetailStore = generateSingleton(ProjectDetailStore)

export default projectDetailStore
