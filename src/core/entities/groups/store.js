// @flow
import {createEntityStore} from 'libs/entity-manager/core'
import {oysterRequestFetchGroup} from './api'

const GroupsStore = createEntityStore({
	fetch: oysterRequestFetchGroup,
	cacheExpiration: Infinity,
})

export default GroupsStore
