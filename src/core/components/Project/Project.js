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

import Box from 'libs/box'
import Text from 'core/components/ui/Text'
import Button from 'core/components/ui/Button'
import Ico from 'core/components/ui/Ico'

type TProps = $Shape<{
	uuid: string,
	project: TProject,
	isLoading: boolean,
	addNewTask: $PropertyType<TProjectEntity, 'addNewTask'>,
	updateField: $PropertyType<TProjectEntity, 'updateField'>,
	assignProjectManager: $PropertyType<TProjectEntity, 'assignProjectManager'>,
	deleteProjectManager: $PropertyType<TProjectEntity, 'deleteProjectManager'>,
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

const AddTaskButton = ({isCreating, onClick}) => (
	<Box
		width={12} height={12}
		borderWidth={1}
		borderColor='neutral'
		borderRadius={5}
		flexShrink={0}
		style={() => ({
			position: 'relative',
			cursor: 'pointer',
		})}
		onClick={onClick}
	>
		<Box
			style={() => ({
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
			})}
		>
			<Ico
				color='neutral'
				type={isCreating ? 'spinner' : 'plus'}
				spin={isCreating}
				width={2}
				style={() => ({
					position: 'absolute',
					left: '50%',
					transform: 'translateX(-50%)',
				})}
			/>
			<Text
				block
				bold
				width='100%'
				size='9'
				marginTop={2.25}
				color='neutral'
				align='center'
			>
				{!isCreating
					? 'Add task'
					: 'Creating...'
				}
			</Text>
		</Box>
	</Box>
)

const Title = (props) => (
	<Text
		size='13'
		bold
		block
		marginLeft={5}
		marginVertical={1}
		{...props}
	/>
)

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
			deleteProjectManager: entity.deleteProjectManager.bind(entity),
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

			if (this.state.creatingNewTask) {
				return
			}

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
				? <Title>{uuid}</Title>
				: <Title title={uuid}>{name || '[unnamed project]'}</Title>
		}

		renderProjectManagerSelect () {
			const {project: {permissions, ownersByIds}} = this.props

			return (
				<div>
					Project managers:
					{ownersByIds && ownersByIds.map((userUuid) => (
						<span key={userUuid}>
							<UserSelect
								selectedUserUuid={userUuid}
								editable={false}
							/>
							{permissions && permissions.has('assign') && (
								<Button
									backgroundColor='red'
									onClick={() => this.props.deleteProjectManager(userUuid)}
								>Delete</Button>
							)}
						</span>
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
			const {uuid, project: {tasksByIds, permissions}} = this.props

			return (
				<Box flex width='100%' paddingLeft={5}>
					{tasksByIds && (
						tasksByIds.map((taskId) => (
							<Box
								key={taskId}
								width={12} height={12}
								flexShrink={0}
								marginRight={1}
							>
								<TaskPreviewBox projectUuid={uuid} uuid={taskId} />
							</Box>
						))
					)}
					{permissions && permissions.has('task') && (
						<AddTaskButton
							isCreating={this.state.creatingNewTask}
							onClick={() => this.createNewTask()}
						/>
					)}
				</Box>
			)
		}

		render () {
			return (
				<Box marginVertical={1}>
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
					</Box>
			)
		}
	}

	return Project
}

export default projectFactory()
