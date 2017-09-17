import {IRoutingStore, TModuleId} from './types'
import {moduleStore as projectDetailStore} from 'modules/ProjectDetail'
import {moduleStore as signupStore} from 'modules/Signup'
import {moduleStore as dashboardStore} from 'modules/Dashboard'

import ProjectDetail from 'modules/ProjectDetail/component'
import Login from 'modules/Login/component'
import Signup from 'modules/Signup/component'
import Dashboard from 'modules/Dashboard/component'


type TModuleDetailStore = {
	hasSubroute: true,
	store: IRoutingStore,
} | {
	hasSubroute?: false,
	store?: {
		readonly setData?: IRoutingStore['setData'],
		readonly onEnter?: IRoutingStore['onEnter'],
	},
}

export type TModuleDetail = {
	basePath: string,
	Component: React.ComponentClass<any>,
	isAuthRequired?: boolean,
} & TModuleDetailStore

export const moduleConfigs: {[key in TModuleId]: TModuleDetail} = {
	login: {
		basePath: 'login',
		Component: Login,
	},
	signup: {
		basePath: 'signup',
		Component: Signup,
		store: signupStore,
	},
	dashboard: {
		basePath: 'dashboard',
		Component: Dashboard,
		isAuthRequired: true,
		store: dashboardStore,
	},
	projectDetail: {
		basePath: 'project',
		isAuthRequired: true,
		Component: ProjectDetail,
		hasSubroute: true,
		store: projectDetailStore,
	},
}
