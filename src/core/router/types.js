// @flow
/* eslint-disable flowtype/no-weak-types */
interface IRoutingStoreConstructor {
	(any): any,
	+generatePath?: (params: Object) => string,
}

export type TModuleId =
	| 'login'
	| 'signup'
	| 'dashboard'
	| 'projectDetail'

export interface IRoutingStore {
	+currentPath: string,
	+setData: (params: Object) => void,
	+constructor: IRoutingStoreConstructor,
	+onEnter?: () => void,
}
