// @flow
import {observable, computed, action, reaction} from 'mobx'
import {Router} from 'vendor/director'
import {isOpeningInNewWindow} from 'libs/event-helpers/mouse-event'
import {persistStateSingleton} from 'core/utils/mobx'

import {getAuthorizationData} from 'core/authorization'
import createRoutes from './routes'
import {moduleConfigs} from './moduleConfigs'

class ModuleManager {
	static generatePath ({basePath, nestedPath}) {
		let url = '/'
		if (basePath) {
			url += basePath
		}
		if (nestedPath) {
			url += nestedPath
		}

		return url
	}

	constructor () {
		// internal stuff
		reaction(
			() => this.module,
			(module) => {
				if (this.disposeNestedPathObserver) {
					this.disposeNestedPathObserver()
					this.disposeNestedPathObserver = null
				}

				if (!module) {
					return
				}
				const moduleConfig = moduleConfigs[module]

				if (moduleConfig.hasSubroute) {
					this.setData({
						basePath: moduleConfig.basePath,
						nestedPath: moduleConfig.store.currentPath,
					})

					this.disposeNestedPathObserver = reaction(
						() => moduleConfig.store.currentPath,
						(nestedPath) => {
							this.setData({basePath: moduleConfig.basePath, nestedPath})
						},
					)
				} else {
					this.setData({basePath: moduleConfig.basePath})
				}
			},
		)

		// update URL automatically when needed
		reaction(
			() => this.currentPath,
			(currentPath) => {
				if (currentPath !== window.location.pathname) {
					router.setRoute(currentPath) // eslint-disable-line no-use-before-define
				}
			},
		)
	}

	disposeNestedPathObserver = null
	@observable module = null
	@observable basePath: string = ''
	@observable nestedPath: string = ''

	@action setModule (module: string, options: any, ev?: MouseEvent): ?string {
		const moduleConfig = moduleConfigs[module]
		if (!ev || !isOpeningInNewWindow(ev)) { // TODO: probably don't mess with `ev` here
			if (options && moduleConfig.store) {
				moduleConfig.store.setData && moduleConfig.store.setData(options)
			}
			this.module = module
		} else {
			const url = ModuleManager.generatePath({
				basePath: moduleConfig.basePath,
				nestedPath: (moduleConfig.store && moduleConfig.store.constructor.generatePath)
					? moduleConfig.store.constructor.generatePath(options)
					: null,
			})

			if (!ev.defaultPrevented) {
				window.open(url)
			} else {
				return url
			}
		}
	}

	//$FlowFixMe - flow cannot detect default value :/
	@action setData ({basePath, nestedPath = ''}) {
		this.basePath = basePath
		this.nestedPath = nestedPath
	}

	@computed get isAuthRequired () {
		return this.module ? moduleConfigs[this.module].isAuthRequired : null
	}

	@computed get Component (): ?ReactClass<any> {
		return this.module ? moduleConfigs[this.module].Component : null
	}

	@computed get store () {
		return this.module ? moduleConfigs[this.module].store : null
	}

	@computed get currentPath () {
		return ModuleManager.generatePath({
			basePath: this.basePath,
			nestedPath: this.nestedPath,
		})
	}
}

export const moduleManager: ModuleManager = persistStateSingleton(new ModuleManager())
export const router = new Router(createRoutes(moduleManager)).configure({
	html5history: true,
	recurse: 'backward',
})

router.on('/$', () => {
	if (getAuthorizationData().uuid) {
		router.replaceRoute('/dashboard')
	} else {
		router.replaceRoute('/login')
	}
})

if (typeof window === 'object') {
	window.router = router
}

