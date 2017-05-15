// @flow
import React from 'react'

import {projectsStore, Project} from 'core/entities/projects'
import type {TProject} from 'core/entities/projects'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'
import browserHistory from 'core/utils/browserHistory'

import {oysterRequestCreateTask} from 'core/entities/tasks'

import TaskPreviewBox from 'core/components/Task/TaskPreviewBox'

type TProps = $Shape<TProject & {
	isLoading: boolean,
	addNewTask: $PropertyType<Project, 'addNewTask'>,
}>

type TState = {
	creatingNewTask: boolean,
}

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
			addNewTask: entity.addNewTask.bind(entity),
		}),
	})
	@observer
	class Project extends React.Component<void, TProps, TState> {
		state = {
			creatingNewTask: false,
		}

		createNewTask () {
			const {uuid: projectUuid, addNewTask} = this.props

			this.setState({
				creatingNewTask: true,
			})

			oysterRequestCreateTask({projectUuid})
				.then(
					({uuid: taskUuid}) => {
						this.setState({
							creatingNewTask: false,
						})
						addNewTask(taskUuid)
						browserHistory.push(`/project/${projectUuid}/task/${taskUuid}`)
					},
				)
		}

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
					<div className='tasks' style={{width: '100%', float: 'left'}}>
						{tasksByIds && (
							tasksByIds.map((taskId) => (
								<div key={taskId} style={{float: 'left'}}>
									<TaskPreviewBox projectUuid={uuid} uuid={taskId} />
								</div>
							))
						)}
						<div style={{float: 'left', cursor: 'pointer'}}>
							{!this.state.creatingNewTask
								? (
									<h2 onClick={() => this.createNewTask()}>
										<a href='javascript://'>New task!</a>
									</h2>
								)
								: (
									<h2>Creating...</h2>
								)
							}
						</div>
					</div>
					<div style={{display: 'table', clear: 'both'}} />
				</div>
			)
		}
	}

	return Project
}

export default projectFactory()
