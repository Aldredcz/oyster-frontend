// @flow
type TLoadedComponent<P> = Class<React$Component<*, P, *>>
export type TLoadableLoadingComponent = Class<React$Component<*, {
	isLoading: boolean,
	componentProps: any,
}, *>>

export type TLoadableOptions = {
	loader: () => Promise<TLoadedComponent<any>>,
	LoadingComponent?: TLoadableLoadingComponent,
	serverSideRequirePath?: string,
	webpackRequireWeakId?: () => number,
	hotReload?: (hotReloadCallback: () => void) => void,
}

export type TLoadableProps = {
	forceLoading?: boolean,
}
