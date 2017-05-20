// @flow
import type {IRoutingStore, TModuleId} from './types'
import {moduleStore as projectDetailStore, ComponentLoadable as ProjectDetail} from 'modules/ProjectDetail'
import {ComponentLoadable as Login} from 'modules/Login'
import {moduleStore as signupStore, ComponentLoadable as Signup} from 'modules/Signup'
import {moduleStore as dashboardStore, ComponentLoadable as Dashboard} from 'modules/Dashboard'

type TModuleDetailStore = {
	hasSubroute: true,
	store: IRoutingStore,
} | {
	hasSubroute?: false,
	store?: {
		+setData?: $PropertyType<IRoutingStore, 'setData'>,
		+onEnter?: $PropertyType<IRoutingStore, 'onEnter'>,
	},
}

export type TModuleDetail = {
	basePath: string,
	Component: ReactClass<any>,
	isAuthRequired?: boolean,
} & TModuleDetailStore

export const moduleConfigs: {[key: TModuleId]: TModuleDetail} = {
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
