import React from 'react'
import {Route, Redirect} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import asyncComponent from 'libs/async-component'

import {getAuthorizationData} from 'core/authorization'

const Login = asyncComponent(() => import('modules/Login').then((module) => module.default))
const Signup = asyncComponent(() => import('modules/Signup').then((module) => module.default))
const Dashboard = asyncComponent(() => import('modules/Dashboard').then((module) => module.default))

class StandardLayout extends React.Component {
	render () {
		return (
			<div className='standard-layout' style={{width: 800, margin: '0 auto'}}>
				{this.props.children}
			</div>
		)
	}
}

export default class App extends React.Component {
	render () {
		const isLogged = Boolean(getAuthorizationData().token)

		return (
			<BrowserRouter>
				<div className='wrapper'>
					<Route
						path='/'
						exact={true}
						render={() => isLogged
							? <Redirect to='/dashboard' />
							: <Redirect to='login' />
						}
					/>
					<Route path='/login' render={() => <Login />} />
					<Route path='/signup' component={Signup} />
					<Route
						path='/dashboard'
						render={() =>
							<StandardLayout>
								<Dashboard />
							</StandardLayout>
						}
					/>
				</div>
			</BrowserRouter>
		)
	}
}
