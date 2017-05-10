// @flow
import React from 'react'
import browserHistory from 'core/utils/browserHistory'
import {connect} from 'react-redux'

import {oysterRequestFetchAccountProjects} from 'core/api/account'
import type {TGlobalState} from 'core/store/types'
import type {TAccountState} from 'core/store/account/types'
import {setData} from 'core/store/account/account-actions'

import {removeAuthorizationData} from 'core/authorization'

import Project from 'core/components/Project/Project'

type TProps = TAccountState & {
	setData: typeof setData,
}

@connect(
	(state: TGlobalState) => ({projectsByIds: state.account.projectsByIds}),
	{
		setData,
	},
)
export default class Dashboard extends React.Component<void, TProps, void> {
	componentWillMount () {
		const {projectsByIds, setData} = this.props

		if (!projectsByIds) {
			oysterRequestFetchAccountProjects().then(
				(projectsByIds) => {
					setData({key: 'projectsByIds', value: projectsByIds})
				},
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
		const {projectsByIds} = this.props

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
