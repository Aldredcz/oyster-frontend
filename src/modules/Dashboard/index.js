// @flow
import Loadable from 'libs/loadable'

export const ComponentLoadable = Loadable({
	loader: () => import(/* webpackChunkName: "module-dashboard" */'./component').then((m) => m.default),
	webpackRequireWeakId: () => require.resolveWeak('./component'),
	hotReload: (callback) => {
		module.hot.accept('./component', callback)
	},
})
