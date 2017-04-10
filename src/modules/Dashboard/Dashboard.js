import React from 'react'
import {withRouter} from 'react-router-dom'

import {removeAuthorizationData} from 'core/authorization'

@withRouter
export default class Dashboard extends React.Component {
	logout = (ev) => {
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
