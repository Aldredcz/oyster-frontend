import {GroupsAPI} from './api'
import {initialState} from './types'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {generateSingleton} from 'core/utils/mobx'


export class GroupEntity extends createUpdatableEntityClass({
	entityState: initialState,
	update: GroupsAPI.update,
}) {}

class GroupsStore extends createEntityStoreClass({
	EntityClass: GroupEntity,
	fetch: GroupsAPI.fetch,
}) {}

const groupsStore: IEntityStore<GroupEntity> = generateSingleton(GroupsStore)

export default groupsStore
