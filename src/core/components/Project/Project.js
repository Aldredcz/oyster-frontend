// @flow
import React from 'react'
import {connectEntity} from 'libs/entity-manager/react'

import {ProjectsStore} from 'core/entities/projects'
import type {TProject} from 'core/entities/projects'

import TaskPreviewBox from 'core/components/Task/TaskPreviewBox'

@connectEntity({
	entityStore: ProjectsStore,
	id: (props) => props.uuid,
	fields: ['name', 'tasksByIds'],
	mapStateToProps: (entityState, loadingState, updatingState) => ({
		name: entityState.name,
		tasksByIds: entityState.tasksByIds,
	}),
})
export default class Project extends React.Component<*, TProject, *> {
	render () {
		const {uuid, name, tasksByIds} = this.props

		return (
			<div>
				<h1 title={uuid}>{name || '[unnamed project]'}</h1>
				{tasksByIds && (
					<div className='tasks' style={{width: '100%', float: 'left'}}>
						{tasksByIds.length === 0 && 'No tasks!'}
						{tasksByIds.map((taskId) => (
							<div key={taskId} style={{float: 'left'}}>
								<TaskPreviewBox uuid={taskId} />
							</div>
						))}
					</div>
				)}
			</div>
		)
	}
}

