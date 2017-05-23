// @flow
import {computed} from 'mobx'
import {UsersAPI} from './api'
import {initialState} from './types'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import type {IUpdatableEntity} from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import type {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {persistStateSingleton} from 'core/utils/mobx'

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
		return [...this.entities.values()]
	}
}

export type TUsersStore = IEntityStore<TUserEntity> & UsersStore

const usersStore: TUsersStore = persistStateSingleton(new UsersStore())

export default usersStore
