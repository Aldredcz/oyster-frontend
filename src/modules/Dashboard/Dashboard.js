// @flow
import React from 'react'
import {withRouter} from 'react-router-dom'
import type {ContextRouter} from 'react-router-dom'

import {removeAuthorizationData} from 'core/authorization'

type TProps = {
	history: ContextRouter,
}

@withRouter
export default class Dashboard extends React.Component<void, TProps, void> {
	logout = (ev: MouseEvent) => {
		ev.preventDefault()

		removeAuthorizationData()
		this.props.history.push('/login?logout')
	}

	render () {
		return (
			<div>
				<h1>Dashboard!</h1>
				<p>
					<a
						href='javascript://'
						onClick={this.logout}
					>
						Logout!
					</a>
				</p>
			</div>
		)
	}
}
