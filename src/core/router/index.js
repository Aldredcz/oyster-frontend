// @flow
import {observable, computed, action, reaction} from 'mobx'
import {Router} from 'vendor/director'
import {persistStateSingleton} from 'core/utils/mobx/index'

import type {IRoutingStore, TModuleId} from './types'
import {getAuthorizationData} from 'core/authorization'
import createRoutes from './routes'
import {moduleConfigs} from './moduleConfigs'

class ModuleManager implements IRoutingStore {
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
		// internal stuff - mounting module and connecting with nestedPath provider
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

				if (moduleConfig.store && moduleConfig.store.onEnter) {
					moduleConfig.store.onEnter()
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
	@observable module: ?TModuleId = null
	@observable basePath: string = ''
	@observable nestedPath: string = ''

	@action setModule (module: ?TModuleId, options: any, dryRun?: boolean): ?string {
		module = module || this.module

		if (!module) {
			return
		}

		const moduleConfig = moduleConfigs[module]
		if (!dryRun) {
			if (options && moduleConfig.store) {
				moduleConfig.store.setData && moduleConfig.store.setData(options)
			}
			this.module = module
		} else {
			return ModuleManager.generatePath({
				basePath: moduleConfig.basePath,
				nestedPath: (moduleConfig.store && moduleConfig.store.constructor.generatePath)
					//$FlowFixMe -- typechecking from outside works
					? moduleConfig.store.constructor.generatePath(options)
					: null,
			})
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

