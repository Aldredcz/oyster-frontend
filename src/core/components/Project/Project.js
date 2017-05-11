// @flow
import React from 'react'
import {Link} from 'react-router-dom'
import {connectEntity} from 'libs/entity-manager/react'

import {ProjectsStore} from 'core/entities/projects'
import type {TProject} from 'core/entities/projects'

import TaskPreviewBox from 'core/components/Task/TaskPreviewBox'

type TProps = $Shape<TProject & {
	loading: boolean,
}>


@connectEntity({
	entityStore: ProjectsStore,
	id: (props) => props.uuid,
	fields: ['name', 'tasksByIds'],
	mapStateToProps: (entityState, loadingState, updatingState) => ({
		name: entityState.name,
		tasksByIds: entityState.tasksByIds,
		loading: Object.values(loadingState).some(Boolean),
	}),
})
export default class Project extends React.Component<void, TProps, void> {
	render () {
		const {uuid, name, tasksByIds, loading} = this.props

		return (
			<div>
				<Link to={`/project/${uuid}`}>
						{loading
						? <h1>{uuid} <small>loading...</small></h1>
						: <h1 title={uuid}>{name || '[unnamed project]'}</h1>
					}
				</Link>
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

