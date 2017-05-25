// @flow
import React from 'react'
import {observer, inject} from 'mobx-react'
import {moduleManager} from 'core/router'
import type {TDashboardStore} from '../core/store'

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
	projectManagerSelectRenderer: () => null,
})

type TProps = {
	dashboardStore: TDashboardStore,
}

@inject('dashboardStore') @observer
export default class Dashboard extends React.Component<void, TProps, void> {
	logout = (ev: MouseEvent) => {
		ev.preventDefault()

		moduleManager.logout()
	}

	createNewProject = () => {
		this.props.dashboardStore.createNewProject()
	}

	render () {
		const {dashboardStore: {projects, ui}} = this.props

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
				{projects
					? (
						<div>
							{projects.length === 0 && 'No projects!'}
							{projects.map((project) => (
								<Project key={project.data.uuid} uuid={project.data.uuid} />
							))}
						</div>
					)
					: 'Loading data...'
				}
				<hr />
				<h2>
					{ui.creatingNewProject
						? 'Creating...'
						: <a href='javascript://' onClick={this.createNewProject}>Add new project</a>
					}
				</h2>
			</div>
		)
	}
}
