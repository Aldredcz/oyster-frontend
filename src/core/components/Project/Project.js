// @flow
import React from 'react'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'
import {moduleManager} from 'core/router'

import {projectsStore} from 'core/entities/projects'
import type {TProject, TProjectEntity} from 'core/entities/projects'
import {oysterRequestCreateTask} from 'core/entities/tasks'

import TaskPreviewBox from 'core/components/Task/TaskPreviewBox'
import UserSelect from 'core/components/ui/UserSelect'

type TProps = $Shape<{
	uuid: string,
	project: TProject,
	isLoading: boolean,
	addNewTask: $PropertyType<TProjectEntity, 'addNewTask'>,
	updateField: $PropertyType<TProjectEntity, 'updateField'>,
	assignProjectManager: $PropertyType<TProjectEntity, 'assignProjectManager'>,
	editNameOnMount: boolean,
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
	titleRenderer = (elem, self) => elem,
	projectManagerSelectRenderer = (elem, self) => elem,
	tasksRenderer = (elem, self) => elem,
}: {
	titleRenderer?: (elem: React$Element<any>, self: *) => ?React$Element<any>,
	projectManagerSelectRenderer?: (elem: React$Element<any>, self: *) => ?React$Element<any>,
	tasksRenderer?: (elem: React$Element<any>, self: *) => ?React$Element<any>,
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
			assignProjectManager: entity.assignProjectManager.bind(entity),
			editNameOnMount: !entity.data.name,
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

		componentDidMount () {
			const {editNameOnMount, project: {permissions}} = this.props
			if (editNameOnMount && permissions && permissions.has('rename')) {
				this.editField('name')
			}
		}

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

		renderTitle () {
			const {isLoading, uuid, project: {name}} = this.props

			return isLoading
				? <h1>{uuid} <small>loading...</small></h1>
				: <h1 title={uuid}>{name || '[unnamed project]'}</h1>
		}

		renderProjectManagerSelect () {
			const {project: {permissions, ownersByIds}} = this.props

			return (
				<div>
					Project managers:
					{ownersByIds && ownersByIds.map((userUuid) => (
						<UserSelect
							key={userUuid}
							selectedUserUuid={userUuid}
							editable={false}
						/>
					))}
					{permissions && permissions.has('assign') && (
						<UserSelect
							selectedUserUuid={null}
							editable={true}
							onChange={(userUuid) => userUuid && this.props.assignProjectManager(userUuid)}
						/>
					)}
				</div>
			)
		}

		renderTasks () {
			const {uuid, project: {tasksByIds}} = this.props

			return (
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
			)
		}

		render () {
			return (
				<div>
					{titleRenderer
						? titleRenderer(this.renderTitle(), this)
						: this.renderTitle()}
					{projectManagerSelectRenderer
						? projectManagerSelectRenderer(this.renderProjectManagerSelect(), this)
						: this.renderProjectManagerSelect()
					}
					{tasksRenderer
						? tasksRenderer(this.renderTasks(), this)
						: this.renderTasks()
					}
					<div style={{display: 'table', clear: 'both'}} />
				</div>
			)
		}
	}

	return Project
}

export default projectFactory()
