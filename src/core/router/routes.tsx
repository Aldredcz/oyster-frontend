import {routes as projectDetailRoutes} from 'modules/ProjectDetail'

export default (moduleManager: any) => {
	const routes = {
		'/login': {
			on: () => {
				moduleManager.setModule('login')
			},
		},
		'/signup': {
			on: () => {
				moduleManager.setModule('signup')
			},
		},
		'/dashboard': {
			on: () => {
				moduleManager.setModule('dashboard')
			},
		},
		'/project': {
			...projectDetailRoutes,
			on: () => {
				moduleManager.setModule('projectDetail')
			},
		},
	}

	return routes
}
