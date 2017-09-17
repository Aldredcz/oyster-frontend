import {computed} from 'mobx'
import {UsersAPI} from './api'
import {initialState} from './types'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import {IUpdatableEntity} from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {generateSingleton} from 'core/utils/mobx'

export class UserEntity extends createUpdatableEntityClass({
	entityState: initialState,
	update: UsersAPI.update,
}) {}

export type TUserEntity = UserEntity & IUpdatableEntity<typeof initialState>

class UsersStore extends createEntityStoreClass({
	EntityClass: UserEntity,
	fetch: UsersAPI.fetch,
}) {
	@computed get userEntitiesList (): Array<TUserEntity> {
		return Array.from(this.entities.values())
	}
}

export type TUsersStore = IEntityStore<TUserEntity> & UsersStore

const usersStore: TUsersStore = generateSingleton(UsersStore)

export default usersStore
