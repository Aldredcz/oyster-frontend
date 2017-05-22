// @flow
import {TaskAPI} from './api'
import {initialState} from './types'
import createUpdatableEntityClass from 'core/store/utils/createUpdatableEntityClass'
import createEntityStoreClass from 'core/store/utils/createEntityStoreClass'
import type {IEntityStore} from 'core/store/utils/createEntityStoreClass'

import {persistStateSingleton} from 'core/utils/mobx'

export class TaskEntity extends createUpdatableEntityClass({
	entityState: initialState,
	update: TaskAPI.update,
}) {}

class TasksStore extends createEntityStoreClass({
	EntityClass: TaskEntity,
	fetch: TaskAPI.fetch,
}) {}

const tasksStore: IEntityStore<TaskEntity> = persistStateSingleton(new TasksStore())

export default tasksStore
