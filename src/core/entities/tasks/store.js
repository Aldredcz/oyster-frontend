// @flow
import {createEntityStore} from 'libs/entity-manager/core'
import {oysterRequestFetchTask} from './api'

const TasksStore = createEntityStore({
	fetch: oysterRequestFetchTask,
})
window.TasksStore = TasksStore

export default TasksStore
