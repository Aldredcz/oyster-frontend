// @flow
import React from 'react'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'
import {moduleManager} from 'core/router'
import debounce from 'lodash/debounce'

import {projectsStore} from 'core/entities/projects'
import type {TProject, TProjectEntity} from 'core/entities/projects'
import {tasksStore, oysterRequestCreateTask} from 'core/entities/tasks'

import TaskPreviewBox from 'core/components/Task/TaskPreviewBox'
import UserSelect from 'core/components/ui/UserSelect'

import Box from 'libs/box'
import Text from 'core/components/ui/Text'
import Button from 'core/components/ui/Button'
import Ico from 'core/components/ui/Ico'

import MoveDetector from 'libs/move-detector'

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
		position='relative'
		style={() => ({
			cursor: 'pointer',
		})}
		onClick={onClick}
	>
		<Box
			position='absolute'
			style={() => ({
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
				position='absolute'
				style={() => ({
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
		projectWrapperEl: ?HTMLElement = null
		projectWrapperWidth: number = 0
		tasksWrapperEl: ?HTMLElement = null
		translateXTmp: number = 0
		@observable translateX: number = 0

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

		saveTranslateXDebounced = debounce((translateX) => {
			this.translateX = translateX
		}, 50)

		renderTasks () {
			const {uuid, project: {tasksByIds, permissions}} = this.props

			const canCreateNewTask = permissions && permissions.has('task')
			const firstUnapprovedTaskIndex = tasksByIds && tasksByIds.length
				? tasksByIds.findIndex((taskUuid) => {
					const taskEntity = tasksStore.getEntity(taskUuid)
					return taskEntity && !taskEntity.data.approvedAt
				})
				: 0

			// width + marginRight
			const taskWidthRem = 12 + 1

			let tasksWidth = ( // tasks + ?newtask
				(tasksByIds ? tasksByIds.length : 0) + (canCreateNewTask ? 1 : 0)
			) * taskWidthRem
			tasksWidth -= 1 // subtracting last marginRight
			tasksWidth += 5 + 2 // paddingLeft + paddingRight
			tasksWidth *= 16 // rem -> px

			const originalTranslateX = -Math.max(firstUnapprovedTaskIndex, 0) * 13 * 16

			return (
				<MoveDetector
					onMove={({dX, type}) => {
						if (type === 'touch') {
							dX = -dX
						}
						this.translateXTmp += dX
						this.translateXTmp = Math.min(-originalTranslateX, this.translateXTmp)
						this.translateXTmp = Math.max(
							this.translateXTmp,
							Math.min(originalTranslateX, this.projectWrapperWidth - tasksWidth) - originalTranslateX,
						)

						if (this.tasksWrapperEl) {
							this.tasksWrapperEl.style.transform = `translateX(${originalTranslateX + this.translateXTmp}px)`
						}
						this.saveTranslateXDebounced(this.translateXTmp)
					}}
				>
					<Box
						flex
						paddingLeft={5}
						getRef={(el) => this.tasksWrapperEl = el}
						style={() => ({
							transform: `translateX(${originalTranslateX + this.translateX}px)`,
						})}
					>
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
						{canCreateNewTask && (
							<AddTaskButton
								isCreating={this.state.creatingNewTask}
								onClick={() => this.createNewTask()}
							/>
						)}
					</Box>
				</MoveDetector>
			)
		}

		render () {
			return (
				<Box
					marginVertical={1}
					width='100%'
					overflow='hidden'
					getRef={(el) => {
						this.projectWrapperEl = el
						this.projectWrapperWidth = el ? el.clientWidth : 0
					}}
				>
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
