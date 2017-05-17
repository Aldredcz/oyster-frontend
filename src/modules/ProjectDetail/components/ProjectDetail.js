// @flow
import React from 'react'
import {Link} from 'react-router-dom'

import type {TProject} from 'core/entities/projects'

import {projectFactory} from 'core/components/Project/Project'
import TaskDetail from 'core/components/Task/TaskDetail'


const Project = projectFactory({
	titleRenderer: (title, self) => {
		const {project} = self.props
		const {name} = self.state

		let edit
		if (name.isEditing) {
			return (
				<div>
					<input
						ref={(el) => self.nameEl = el}
						type='text'
						value={name.value || ''}
						onChange={(ev) => self.updateEditingField('name', ev.target.value)}
						onKeyDown={(ev) => ev.key === 'Enter' && self.submitEditingField('name')}
					/>
				</div>
			)
		}

		if (project.actionsSet && project.actionsSet.has('rename')) {
			edit = <small><a href='javascript://' onClick={() => self.editField('name')}>edit name</a></small>
		}

		return (
			<div>
				{title}
				{edit}
			</div>
		)
	},
})

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
