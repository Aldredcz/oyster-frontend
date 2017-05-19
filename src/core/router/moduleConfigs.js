// @flow
import type {IRoutingStore, TModuleId} from './types'
import {moduleStore as projectDetailStore, ComponentLoadable as ProjectDetail} from 'modules/ProjectDetail/index'
import {ComponentLoadable as Login} from 'modules/Login/index'
import {ComponentLoadable as Signup} from 'modules/Signup/index'
import {ComponentLoadable as Dashboard} from 'modules/Dashboard/index'

type TModuleDetailStore = {
	hasSubroute: true,
	store: IRoutingStore,
} | {
	hasSubroute?: false,
	store?: {
		+setData: $PropertyType<IRoutingStore, 'setData'>,
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
