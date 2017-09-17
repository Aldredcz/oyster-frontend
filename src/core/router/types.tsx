type TRoutingStoreConstructor = Function & {
	readonly generatePath?: (params: Object) => string, // TODO: this doesnt work
}

export type TModuleId =
	| 'login'
	| 'signup'
	| 'dashboard'
	| 'projectDetail'

export interface IRoutingStore {
	readonly currentPath: string,
	readonly setData: (params: Object) => void,
	readonly constructor: $TSFixMe, //TRoutingStoreConstructor,
	readonly onEnter?: () => void,
}
