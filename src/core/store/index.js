// @flow
import {createStore, compose, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import DevTools from './DevTools'

import rootReducer from './rootReducer'


const storeEnhancers = [
	applyMiddleware(
		thunkMiddleware,
	),
]

const devToolsEnhancer = DevTools
	? DevTools.instrument()
	: window.devToolsExtension && window.devToolsExtension({name: 'rootReducer'})

devToolsEnhancer && storeEnhancers.push(devToolsEnhancer)


const store = createStore(rootReducer, undefined, compose(...storeEnhancers))

export default store

if (__DEV__ && module && module.hot) {
	module.hot.accept('./rootReducer', () => {
		store.replaceReducer(rootReducer)
	})
}
