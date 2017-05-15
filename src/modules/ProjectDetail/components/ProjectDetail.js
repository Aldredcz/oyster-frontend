// @flow
import React from 'react'
import {Link} from 'react-router-dom'

import type {TProject} from 'core/entities/projects'

import Project from 'core/components/Project/Project'
import TaskDetail from 'core/components/Task/TaskDetail'


type TProps = TProject & {
	uuid: string,
	selectedTaskUuid?: string,
}

export default class ProjectDetail extends React.Component<void, TProps, void> {
	render () {
		const {uuid, selectedTaskUuid} = this.props

		return (
			<div>
				<p><Link to='/dashboard'>{'<'} Back to dashboard</Link></p>
				<Project uuid={uuid} />
				{selectedTaskUuid && (
					<TaskDetail
						key={selectedTaskUuid}
						uuid={selectedTaskUuid}
						projectUuid={uuid}
					/>
				)}
			</div>
		)
	}
}
