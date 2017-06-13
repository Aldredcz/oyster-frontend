// @flow
import React from 'react'
import {observer, inject} from 'mobx-react'
import type {TDashboardStore} from '../core/store'

import Box from 'libs/box'
import Link from 'core/router/Link'
import {projectFactory} from 'core/components/Project/Project'


const Project = projectFactory({
	titleRenderer: (title, self) =>	(
		<Box>
			{React.cloneElement(title, {
				module: 'projectDetail',
				params: {projectUuid: self.props.project.uuid},
				as: Link,
				asBoxBasedComponent: true,
				block: false,
				display: 'inline-block',
			})}
		</Box>
	),
	projectManagerSelectRenderer: () => null,
})

type TProps = {
	dashboardStore: TDashboardStore,
}

@inject('dashboardStore') @observer
export default class Dashboard extends React.Component<void, TProps, void> {
	createNewProject = () => {
		this.props.dashboardStore.createNewProject()
	}

	render () {
		const {dashboardStore: {projects, ui}} = this.props

		return (
			<Box>
				{projects
					? (
						<div>
							{projects.length === 0 && 'No projects!'}
							{projects.map((project, i) => (
								<Box key={project.data.uuid} marginTop={i !== 0 ? 2.5 : 0}>
									<Project uuid={project.data.uuid} />
								</Box>
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
			</Box>
		)
	}
}
