// @flow
import {observable, computed, action, reaction} from 'mobx'
import {Router} from 'vendor/director'
import {generateSingleton} from 'core/utils/mobx/index'

import type {IRoutingStore, TModuleId} from './types'
import createRoutes from './routes'
import {moduleConfigs} from './moduleConfigs'
import userStore from './user'

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

	@action setModule (module: ?TModuleId, params: any, dryRun?: boolean): ?string {
		module = module || this.module

		if (!module) {
			return
		}

		const moduleConfig = moduleConfigs[module]
		if (!dryRun) {
			// redirect to 'login' if not logged in
			if (moduleConfig.isAuthRequired && !this.isLoggedIn) {
				return this.setModule('login', {
					noauth: true,
					originalModule: module,
					originalParams: params,
				})
			}

			if (params && moduleConfig.store) {
				moduleConfig.store.setData && moduleConfig.store.setData(params)
			}
			this.module = module
		} else {
			return ModuleManager.generatePath({
				basePath: moduleConfig.basePath,
				nestedPath: (moduleConfig.store && moduleConfig.store.constructor.generatePath)
					//$FlowFixMe -- typechecking from outside works
					? moduleConfig.store.constructor.generatePath(params)
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

	// AUTH
	userStore = userStore

	@action handleLogin (uuid: string, token: string, destination: ?{module: TModuleId, params?: any}) {
		this.userStore.setUser(uuid, token)
		if (!destination) {
			this.setModule('dashboard')
		} else {
			this.setModule(destination.module, destination.params)
		}
	}

	@action handleLogout () {
		this.userStore.removeUser()
		window.location = '/login' // quick solution for resetting all stores
		/*this.setModule('login', {
			logout: true,
		})*/
	}

	@computed get isLoggedIn (): boolean {
		return Boolean(this.userStore.uuid)
	}
}

export const moduleManager: ModuleManager = generateSingleton(ModuleManager)
export const router = new Router(createRoutes(moduleManager)).configure({
	html5history: true,
	recurse: 'backward',
})

router.on('/$', () => {
	if (moduleManager.isLoggedIn) {
		router.replaceRoute('/dashboard')
	} else {
		router.replaceRoute('/login')
	}
})

if (typeof window === 'object') {
	window.router = router
}

