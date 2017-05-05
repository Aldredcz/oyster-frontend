// @flow
import React from 'react'
import request from 'core/utils/request'
import browserHistory from 'core/utils/browserHistory'

import {removeAuthorizationData} from 'core/authorization'

export default class Dashboard extends React.Component<void, void, *> {
	state = {
		projectsData: null,
	}

	constructor (props: void) {
		super(props)

		request('/api/project/all')
			.then((response) => response.json())
			.then(
				(data) => {
					this.setState({
						projectsData: data,
					})
				},
			)
	}

	logout = (ev: MouseEvent) => {
		ev.preventDefault()

		removeAuthorizationData()
		browserHistory.push('/login?logout')
	}

	render () {
		return (
			<div>
				<h1>Dashboard</h1>
				<p>
					<a
						href='javascript://'
						onClick={this.logout}
					>
						Logout!
					</a>
				</p>
				{this.state.projectsData &&
					<pre>
						<code>
							Projects data:{'\n'}
							{JSON.stringify(this.state.projectsData, null, '\t')}
						</code>
					</pre>
				}
			</div>
		)
	}
}
