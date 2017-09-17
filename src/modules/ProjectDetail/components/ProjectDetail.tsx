import React from 'react'
import {inject, observer} from 'mobx-react'
import Link from 'core/router/Link'
import {TProjectDetailStore} from '../core/store'

import {projectFactory} from 'core/components/Project/Project'
import TaskDetail from 'core/components/Task/TaskDetail'

import Box from 'libs/box'
import Ico from 'core/components/ui/Ico'

const Project = projectFactory({
	titleRenderer: (title, self) => {
		const {project} = self.props
		const nameEditable = project.permissions && project.permissions.has('rename')

		if (nameEditable) {
			const isEditingProps = self.state.name.isEditing
				? {
					children: '',
					value: self.state.name.value,
					onChange: (ev) => {
						self.updateEditingField('name', ev.target.value)
					},
					onBlur: () => {
						self.submitEditingField('name')
					},
					onEnter: () => {
						self.submitEditingField('name')
					},
				}
				: {}

			title = React.cloneElement(title, {
				italic: title.props.italic && !self.state.name.isEditing,
				isEditing: self.state.name.isEditing,
				onClick: () => {
					!self.state.name.isEditing && self.editField('name')
				},
				block: false,
				width: 25,
				display: 'inline-block',
				cursor: !self.state.name.isEditing ? 'pointer' : undefined,
				children: (
					<Box>
						{title.props.children}
						<Ico
							type='edit'
							color='neutral'
							height={0.6}
							marginLeft={0.75}
						/>
					</Box>
				),
				...isEditingProps,
			})
		}

		return (
			<Box>
				{title}
			</Box>
		)
	},
})

type TProps = {
	projectDetailStore: TProjectDetailStore,
}

@inject('projectDetailStore') @observer
export default class ProjectDetail extends React.Component<TProps> {
	render () {
		const {projectDetailStore: {projectUuid, selectedTaskUuid}} = this.props

		return (
			<Box>
				<Link
					module='dashboard'
					position='absolute'
					top='11px'
					left={1}
				>{'<'} Back to dashboard</Link>
				{projectUuid && (
					<Project
						uuid={projectUuid}
						selectedTaskUuid={selectedTaskUuid}
					/>
				)}
				{projectUuid && selectedTaskUuid && (
					<TaskDetail
						key={selectedTaskUuid}
						uuid={selectedTaskUuid}
						projectUuid={projectUuid}
					/>
				)}
			</Box>
		)
	}
}
