// @flow
import React from 'react'
import browserHistory from 'core/utils/browserHistory'
import {observer, inject} from 'mobx-react'
import {Link} from 'react-router-dom'

import {oysterRequestFetchAccountProjects} from 'core/api/account'
import type {TAccountStore} from 'core/store/account'

import {removeAuthorizationData} from 'core/authorization'

import {projectFactory} from 'core/components/Project/Project'


const Project = projectFactory({
	titleRenderer: (title, props) => (
		<Link to={`/project/${props.uuid}`}>
			{title}
		</Link>
	),
})

type TProps = {
	accountStore: TAccountStore,
}

@inject('accountStore') @observer
export default class Dashboard extends React.Component<void, TProps, void> {
	componentWillMount () {
		const {accountStore} = this.props

		if (!accountStore.projectsByIds) {
			oysterRequestFetchAccountProjects().then(
				(data) => accountStore.setProjectsByIds(data),
				// TODO: handle error
			)
		}
	}

	logout = (ev: MouseEvent) => {
		ev.preventDefault()

		removeAuthorizationData()
		browserHistory.push('/login?logout')
	}

	render () {
		const {accountStore: {projectsByIds}} = this.props

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
				{projectsByIds
					? (
						<div>
							{projectsByIds.length === 0 && 'No projects!'}
							{projectsByIds.map((projectId) => (
								<Project key={projectId} uuid={projectId} />
							))}
						</div>
					)
					: 'Loading data...'
				}
			</div>
		)
	}
}
