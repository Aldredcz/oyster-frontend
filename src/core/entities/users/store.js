// @flow
import {UsersAPI} from './api'
import {initialState} from './types'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import type {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {persistStateSingleton} from 'core/utils/mobx'

export class User extends createUpdatableEntityClass({
	entityState: initialState,
	update: UsersAPI.update,
}) {}

class UsersStore extends createEntityStoreClass({
	EntityClass: User,
	fetch: UsersAPI.fetch,
}) {}

const usersStore: IEntityStore<User> = persistStateSingleton(new UsersStore())

export default usersStore
