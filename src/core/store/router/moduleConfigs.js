// @flow
import {moduleStore as projectDetailStore, ComponentLoadable as ProjectDetail} from 'modules/ProjectDetail'
import {ComponentLoadable as Login} from 'modules/Login'
import {ComponentLoadable as Signup} from 'modules/Signup'
import {ComponentLoadable as Dashboard} from 'modules/Dashboard'

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
