import 'babel-polyfill'
import 'isomorphic-fetch'

import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {router} from 'core/router'

import handleRenderErrors from 'libs/renderErrorHandling'

import App from './App'


type TRender = (AppComponent: React.ComponentClass) => void

//useStrict(true)
handleRenderErrors(React)
router.init()


const renderApp: TRender = (AppComponent) => {
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
