import {observable, action} from 'mobx'
import {generateSingleton} from 'core/utils/mobx'
import {oysterRequestFetchAccountProjects, oysterRequestCreateAccountProjects} from 'core/api/account'

export interface IAccountStoreShape {
	uuid: string | null,
	name: string | null,
	usersByIds: Array<string> | null,
	groupsByIds: Array<string> | null,
	projectsByIds: Array<string> | null,
}

class AccountStore implements IAccountStoreShape {
	@observable uuid = null
	@observable name = null
	@observable usersByIds = null
	@observable groupsByIds = null
	@observable projectsByIds = null

	@action setUuidAndName (uuid: string, name: string | null) {
		this.uuid = uuid
		this.name = name
	}

	@action setUsersByIds (usersByIds: Array<string>) {
		this.usersByIds = usersByIds
	}

	@action setGroupsByIds (groupsByIds: Array<string>) {
		this.groupsByIds = groupsByIds
	}

	@action setProjectsByIds (projectsByIds: Array<string>) {
		this.projectsByIds = projectsByIds
	}

	@action fetchProjects (): Promise<Array<string>> {
		const response = oysterRequestFetchAccountProjects()

		response.then(
			(data) => this.setProjectsByIds(data),
			// TODO: handle error
		)

		return response
	}

	@action createNewProject (): Promise<string> {
		const response = oysterRequestCreateAccountProjects()

		response.then(
			(project) => {
				this.projectsByIds && this.projectsByIds.unshift(project.uuid)
			},
		)

		return response.then((project) => project.uuid)
	}
}

export type TAccountStore = AccountStore

export default generateSingleton(AccountStore)
