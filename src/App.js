// @flow
import React from 'react'
import ACLRoute from 'core/utils/ACLRoute'
import {Router} from 'react-router'
import {Route, Redirect} from 'react-router-dom'
import {Provider} from 'react-redux'
import DevTools from 'core/store/DevTools'
import Loadable from 'libs/loadable'

import browserHistory from 'core/utils/browserHistory'
import store from 'core/store'

import {getAuthorizationData} from 'core/authorization'

import AccountWrapper from 'core/components/wrappers/AccountWrapper'

const Login = Loadable({
	loader: () => import('modules/Login/component').then((m) => m.default),
	webpackRequireWeakId: () => require.resolveWeak('modules/Login/component'),
	hotReload: (callback) => {
		module.hot.accept('modules/Login/component', callback)
	},
})
const Signup = Loadable({
	loader: () => import('modules/Signup/component').then((m) => m.default),
	webpackRequireWeakId: () => require.resolveWeak('modules/Signup/component'),
	hotReload: (callback) => {
		module.hot.accept('modules/Signup/component', callback)
	},
})
const Dashboard = Loadable({
	loader: () => import('modules/Dashboard/component').then((m) => m.default),
	webpackRequireWeakId: () => require.resolveWeak('modules/Dashboard/component'),
	hotReload: (callback) => {
		module.hot.accept('modules/Dashboard/component', callback)
	},
})
const ProjectDetail = Loadable({
	loader: () => import('modules/ProjectDetail/component').then((m) => m.default),
	webpackRequireWeakId: () => require.resolveWeak('modules/ProjectDetail/component'),
	hotReload: (callback) => {
		module.hot.accept('modules/ProjectDetail/component', callback)
	},
})

class StandardLayout extends React.Component<void, *, void> {
	render () {
		return (
			<div className='standard-layout' style={{width: 800, margin: '0 auto'}}>
				{this.props.children}
			</div>
		)
	}
}

function addStandardLayout (elem: React$Element<any>): React$Element<any> {
	return (
		<StandardLayout>
			{elem}
		</StandardLayout>
	)
}

function addAccountWrapper (elem: React$Element<any>): React$Element<any> {
	const AccountWrapperAny: any = AccountWrapper

	return (
		<AccountWrapperAny>
			{elem}
		</AccountWrapperAny>
	)
}

export default class App extends React.Component<void, void, void> {
	render () {
		const isLogged = Boolean(getAuthorizationData().token)

		return (
			<Provider store={store}>
				<div>
					<Router history={browserHistory}>
						<div className='wrapper'>
							<Route
								path='/'
								exact={true}
								render={() => isLogged
									? <Redirect to='/dashboard' />
									: <Redirect to='/login' />
								}
							/>
							<Route path='/login' component={Login} />
							<Route path='/signup' component={Signup} />
							<ACLRoute
								path='/dashboard'
								render={() => addAccountWrapper(addStandardLayout(<Dashboard/>))}
							/>
							<ACLRoute
								path='/project/:uuid'
								render={({match}) => addAccountWrapper(addStandardLayout(
									<ProjectDetail uuid={match.params.uuid} />,
								))}
							/>
						</div>
					</Router>
					{__DEV__ && DevTools && <DevTools />}
				</div>
			</Provider>
		)
	}
}
