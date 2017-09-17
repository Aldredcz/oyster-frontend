import {observable, action} from 'mobx'
import {generateSingleton} from 'core/utils/mobx/index'
import {getAuthorizationData, setAuthorizationData, removeAuthorizationData} from 'core/authorization'

class UserStore {
	constructor () {
		const authData = getAuthorizationData()
		this.uuid = authData.uuid
		this.authorizationToken = authData.token
	}

	@observable uuid: string | null = null
	@observable authorizationToken: string | null = null

	@action setUser (uuid: string, authorizationToken: string) {
		this.uuid = uuid
		this.authorizationToken = authorizationToken
		setAuthorizationData({uuid, token: authorizationToken})
	}

	@action removeUser () {
		removeAuthorizationData()
		this.uuid = null
		this.authorizationToken = null
	}
}

export type TUserStore = UserStore

const userStore: TUserStore = generateSingleton(UserStore)

export default userStore
