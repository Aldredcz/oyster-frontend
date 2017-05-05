// @flow
import React from 'react'
import {AppContainer} from 'react-hot-loader'
import type {TLoadableOptions, TLoadableProps} from './types'

const isWebpack = typeof __webpack_require__ !== 'undefined' // eslint-disable-line camelcase
/* eslint-disable */
const requireFn = isWebpack ? __webpack_require__ : module.require.bind(module)
/* eslint-enable */
const babelInterop = (obj: any) => obj && obj.__esModule ? obj.default : obj

const tryRequire = (pathOrId: string | number) => {
	try {
		return babelInterop(requireFn(pathOrId))
	} catch (err) {
		return null
	}
}


export default function Loadable (opts: TLoadableOptions): * {
	const {loader, LoadingComponent, serverSideRequirePath, webpackRequireWeakId, hotReload} = opts

	let isLoadingComponent = false
	let outsideComponent = null
	let outsidePromise = null
	let outsideError = null

	if (!isWebpack && serverSideRequirePath) {
		outsideComponent = tryRequire(serverSideRequirePath)
	}

	const load = ({isHot}: {isHot?: boolean} = {}) => {
		if (!isHot && isWebpack && webpackRequireWeakId) {
			const weakId = webpackRequireWeakId()
			/* eslint-disable */
			if (__webpack_modules__[weakId]) {
				// if it's not in webpack modules, we wont be able
				// to load it. If we attempt to, we mess up webpack's
				// internal state, so only tryRequire if it's already
				// in webpack modules.
				outsideComponent = tryRequire(weakId)
			}
			/* eslint-enable */

			if (outsideComponent) {
				outsidePromise = Promise.resolve()
			}
		}

		if (!outsidePromise) {
			isLoadingComponent = true
			outsidePromise = loader()
				.then((Component) => {
					isLoadingComponent = false
					outsideComponent = babelInterop(Component)
				})
				.catch((error) => {
					isLoadingComponent = false
					outsideError = error
				})
		}

		return outsidePromise
	}

	class Loadable extends React.Component<void, TLoadableProps, *> {
		static preload () {
			return load()
		}

		_mounted: boolean = false
		isLoadingAsynchronously: boolean = !outsideComponent
		state = {
			error: outsideError,
			Component: outsideComponent,
		}

		componentWillMount () {
			this._mounted = true

			if (this.state.Component) {
				return
			}

			this.loadComponent()
		}

		loadComponent ({isHot}: {isHot?: boolean} = {}) {
			load({isHot}).then(() => {
				if (!this._mounted) {
					return
				}

				this.isLoadingAsynchronously = true

				this.setState({
					error: outsideError,
					Component: outsideComponent,
				})
			})
		}

		componentDidMount () {
			this.componentDidUpdate()
			if (__DEV__ && hotReload && module.hot) {
				hotReload(() => {
					outsideComponent = null
					outsidePromise = null
					this.loadComponent({isHot: true})
				})
			}
		}

		componentWillUnmount () {
			this._mounted = false
		}

		componentDidUpdate () {
			const {error, Component} = this.state
			const {forceLoading} = this.props
			const isLoading = isLoadingComponent || forceLoading

			if (Component && !isLoading && !error) {
				this.isLoadingAsynchronously = false
			} else {
				this.isLoadingAsynchronously = true
			}
		}

		render () {
			const {error, Component} = this.state
			const {forceLoading, ...componentProps} = this.props
			const isLoading = Boolean(isLoadingComponent || forceLoading)

			if (isLoading || error) {
				return LoadingComponent
					? (
						<LoadingComponent
							isLoading={isLoading}
							error={error}
							componentProps={componentProps}
						/>
					)
					: <noscript />
			} else if (Component) {
				let ComponentElement = (
					<Component
						isLoadingAsynchronously={this.isLoadingAsynchronously}
						{...componentProps}
					/>
				)

				if (__DEV__ && hotReload && ComponentElement) {
					ComponentElement = (
						<AppContainer>
							{ComponentElement}
						</AppContainer>
					)
				}

				return ComponentElement
			}

			return null
		}
	}

	return Loadable
}
