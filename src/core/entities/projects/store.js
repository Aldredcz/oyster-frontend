// @flow
import {createEntityStore} from 'libs/entity-manager/core'
import {oysterRequestFetchProject} from './api'

const ProjectsStore = createEntityStore({
	fetch: oysterRequestFetchProject,
})
window.ProjectsStore = ProjectsStore

export default ProjectsStore
