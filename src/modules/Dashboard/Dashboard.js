// @flow
import React from 'react'
import {withRouter} from 'react-router-dom'
import request from 'core/utils/request'
import type {ContextRouter} from 'react-router-dom'

import {removeAuthorizationData} from 'core/authorization'

type TProps = {
	history: ContextRouter,
}

@withRouter
export default class Dashboard extends React.Component<void, TProps, *> {
	state = {
		projectsData: null,
	}

	constructor (props: TProps) {
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
				{this.state.projectsData &&
					<pre>
						<code>
							Projects data:{'\n'}
							{JSON.stringify(this.state.projectsData)}
						</code>
					</pre>
				}
			</div>
		)
	}
}
