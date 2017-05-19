// @flow
import React from 'react'
import {observer, inject} from 'mobx-react'
import {moduleManager} from 'core/router'
import {removeAuthorizationData} from 'core/authorization'
import type {TAccountStore} from 'core/store/account'

import Link from 'core/router/Link'
import {projectFactory} from 'core/components/Project/Project'


const Project = projectFactory({
	titleRenderer: (title, self) => (
		<Link
			module='projectDetail'
			params={{projectUuid: self.props.project.uuid}}
		>
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
			accountStore.fetchProjects() // TODO: remove from view
		}
	}

	logout = (ev: MouseEvent) => {
		ev.preventDefault()

		removeAuthorizationData()
		moduleManager.setModule('login', {
			logout: true,
		})
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
