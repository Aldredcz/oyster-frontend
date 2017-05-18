// @flow
import Loadable from 'libs/loadable'

export {default as routes} from './core/store/routes'
export {default as moduleStore} from './core/store'

export const ComponentLoadable = Loadable({
	loader: () => import(/* webpackChunkName: "module-projectDetail" */'./component').then((m) => m.default),
	webpackRequireWeakId: () => require.resolveWeak('./component'),
	hotReload: (callback) => {
		module.hot.accept('./component', callback)
	},
})
