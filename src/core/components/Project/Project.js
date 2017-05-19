// @flow
import React from 'react'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'
import {moduleManager} from 'core/router'

import {projectsStore, Project} from 'core/entities/projects'
import type {TProject} from 'core/entities/projects'
import {oysterRequestCreateTask} from 'core/entities/tasks'

import TaskPreviewBox from 'core/components/Task/TaskPreviewBox'

type TProps = $Shape<{
	uuid: string,
	project: TProject,
	isLoading: boolean,
	addNewTask: $PropertyType<Project, 'addNewTask'>,
	updateField: $PropertyType<Project, 'updateField'>,
}>

type TState = {
	creatingNewTask: boolean,
	name: {
		isEditing: boolean,
		value: ?$PropertyType<TProject, 'name'>,
	},
}

type TStateField = 'name'

export const projectFactory = ({
	titleRenderer = (title, self) => title,
}: {
	titleRenderer: (title: React$Element<any>, self: *) => React$Element<any>,
} = {}) => {

	@injectEntity({
		entityStore: projectsStore,
		id: (props) => props.uuid,
		mapEntityToProps: (entity) => ({
			isLoading: entity.isLoading,
			project: entity.data,
			tasksByIds: entity.data.tasksByIds,
			addNewTask: entity.addNewTask.bind(entity),
			updateField: entity.updateField.bind(entity),
		}),
	})
	@observer
	class Project extends React.Component<void, TProps, TState> {
		state = {
			creatingNewTask: false,
			name: {
				isEditing: false,
				value: null,
			},
		}

		nameEl: ?HTMLInputElement = null

		createNewTask () {
			const {project: {uuid: projectUuid}, addNewTask} = this.props

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
						moduleManager.setModule('projectDetail', {
							projectUuid,
							selectedTaskUuid: taskUuid,
						})
					},
				)
		}

		editField (field: TStateField) {
			this.setState({
				[field]: {
					isEditing: true,
					value: this.props.project[field],
				},
			}, () => {
				const fieldEl = (this: $FlowFixMe)[`${field}El`]
				fieldEl && typeof fieldEl.focus === 'function' && fieldEl.focus()
			})

		}

		updateEditingField (field: TStateField, value: any) {
			this.setState({
				[field]: {
					isEditing: true,
					value,
				},
			})
		}

		submitEditingField (field: TStateField) {
			this.props.updateField(field, this.state[field].value)
			this.setState({
				[field]: {
					isEditing: false,
					value: null,
				},
			})
		}

		render () {
			const {isLoading, uuid, project: {name, tasksByIds}} = this.props

			return (
				<div>
					{titleRenderer(
						isLoading
							? <h1>{uuid} <small>loading...</small></h1>
							: <h1 title={uuid}>{name || '[unnamed project]'}</h1>,
						this,
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
