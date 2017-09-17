type TLoadedComponent<P> = React.ComponentClass<P>
export type TLoadableLoadingComponent = React.ComponentClass<{
	isLoading: boolean,
	componentProps: any,
	error: any,
}>

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
