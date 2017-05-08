// @flow
import {createEntityStore} from 'libs/entity-manager/core'
import {oysterRequestFetchUser} from './api'

const UsersStore = createEntityStore({
	fetch: oysterRequestFetchUser,
})
window.UsersStore = UsersStore

export default UsersStore
