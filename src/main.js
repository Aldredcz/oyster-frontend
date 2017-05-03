// @flow
import 'babel-polyfill'
import 'isomorphic-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'

import App from './App'

interface IRender {
	(AppComponent: ReactClass<any>): void
}

const renderApp: IRender = (AppComponent) => {
	ReactDOM.render((
			<AppContainer>
				<AppComponent />
			</AppContainer>
		),
		document.getElementById('main'),
	)
}

renderApp(App)

if (module && module.hot) {
	module.hot.accept('./App', () => {
		renderApp(App)
	})
}
