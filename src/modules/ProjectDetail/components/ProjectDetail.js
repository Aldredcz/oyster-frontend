// @flow
import React from 'react'
import {inject, observer} from 'mobx-react'
import Link from 'core/router/Link'
import type {TProjectDetailStore} from '../core/store'

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

type TProps = {
	projectDetailStore: TProjectDetailStore,
}

@inject('projectDetailStore') @observer
export default class ProjectDetail extends React.Component<void, TProps, void> {
	render () {
		const {projectDetailStore: {projectUuid, selectedTaskUuid}} = this.props

		return (
			<div>
				<p>
					<Link module='dashboard'>{'<'} Back to dashboard</Link>
				</p>
				{projectUuid && <Project uuid={projectUuid} />}
				{projectUuid && selectedTaskUuid && (
					<TaskDetail
						key={selectedTaskUuid}
						uuid={selectedTaskUuid}
						projectUuid={projectUuid}
					/>
				)}
			</div>
		)
	}
}
