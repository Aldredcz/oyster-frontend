// @flow
import React from 'react'

import {projectsStore} from 'core/entities/projects'
import type {TProject} from 'core/entities/projects'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'

import TaskPreviewBox from 'core/components/Task/TaskPreviewBox'

type TProps = $Shape<TProject & {
	isLoading: boolean,
}>

export const projectFactory = ({
	titleRenderer = (title, props) => title,

}: {
	titleRenderer: (title: React$Element<any>, props: TProps) => React$Element<any>,
} = {}) => {

	@injectEntity({
		entityStore: projectsStore,
		id: (props) => props.uuid,
		mapEntityToProps: (entity) => ({
			isLoading: entity.isLoading,
			uuid: entity.data.uuid,
			name: entity.data.name,
			tasksByIds: entity.data.tasksByIds,
		}),
	})
	@observer
	class Project extends React.Component<void, TProps, void> {
		render () {
			const {isLoading, uuid, name, tasksByIds} = this.props

			return (
				<div>
					{titleRenderer(
						isLoading
							? <h1>{uuid} <small>loading...</small></h1>
							: <h1 title={uuid}>{name || '[unnamed project]'}</h1>,
						this.props,
					)}
					{tasksByIds && (
						<div className='tasks' style={{width: '100%', float: 'left'}}>
							{tasksByIds.length === 0 && 'No tasks!'}
							{tasksByIds.map((taskId) => (
								<div key={taskId} style={{float: 'left'}}>
									<TaskPreviewBox projectUuid={uuid} uuid={taskId} />
								</div>
							))}
						</div>
					)}
				</div>
			)
		}
	}

	return Project
}

export default projectFactory()
