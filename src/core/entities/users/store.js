// @flow
import {UsersAPI} from './api'
import {initialState} from './types'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import type {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {persistStateSingleton} from 'core/utils/mobx'

export class UserEntity extends createUpdatableEntityClass({
	entityState: initialState,
	update: UsersAPI.update,
}) {}

class UsersStore extends createEntityStoreClass({
	EntityClass: UserEntity,
	fetch: UsersAPI.fetch,
}) {}

const usersStore: IEntityStore<UserEntity> = persistStateSingleton(new UsersStore())

export default usersStore
