// @flow
import {createEntityStore} from 'libs/entity-manager/core'
import {oysterRequestFetchTask} from './api'

const ProjectsStore = createEntityStore({
	fetch: oysterRequestFetchTask,
	cacheExpiration: Infinity,
})

export default ProjectsStore
