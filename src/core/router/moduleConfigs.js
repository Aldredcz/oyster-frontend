// @flow
import {moduleStore as projectDetailStore, ComponentLoadable as ProjectDetail} from 'modules/ProjectDetail/index'
import {ComponentLoadable as Login} from 'modules/Login/index'
import {ComponentLoadable as Signup} from 'modules/Signup/index'
import {ComponentLoadable as Dashboard} from 'modules/Dashboard/index'

export const moduleConfigs = {
	login: {
		basePath: 'login',
		Component: Login,
	},
	signup: {
		basePath: 'signup',
		Component: Signup,
	},
	dashboard: {
		basePath: 'dashboard',
		Component: Dashboard,
		isAuthRequired: true,
	},
	projectDetail: {
		basePath: 'project',
		isAuthRequired: true,
		Component: ProjectDetail,
		hasSubroute: true,
		store: projectDetailStore,
	},
}
