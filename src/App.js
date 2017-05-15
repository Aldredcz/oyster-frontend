// @flow
import React from 'react'
import ACLRoute from 'core/utils/ACLRoute'
import {Router} from 'react-router'
import {Provider as MobxProvider} from 'mobx-react'
import MobxDevTools from 'mobx-react-devtools'
import {Route, Redirect} from 'react-router-dom'
import {Provider as FelaProvider, ThemeProvider} from 'react-fela'
import Loadable from 'libs/loadable'
import {visualTheme} from 'core/config/themes/theme'

import browserHistory from 'core/utils/browserHistory'
import {getRenderer, getMountNode} from 'core/config/fela'

import accountStore from 'core/store/account'
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
			<MobxProvider accountStore={accountStore}>
				<FelaProvider mountNode={getMountNode()} renderer={getRenderer()}>
					<ThemeProvider theme={visualTheme}>
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
										exact={true}
										render={({match}) => addAccountWrapper(addStandardLayout(
											<ProjectDetail uuid={match.params.uuid} />,
										))}
									/>
								</div>
							</Router>
							{MobxDevTools}
						</div>
					</ThemeProvider>
				</FelaProvider>
			</MobxProvider>
		)
	}
}
