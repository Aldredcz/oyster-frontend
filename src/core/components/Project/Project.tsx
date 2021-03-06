import React from 'react'
import {observable, autorun} from 'mobx'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'
import {moduleManager} from 'core/router'
import debounce from 'lodash/debounce'

import {projectsStore} from 'core/entities/projects'
import {TProject, TProjectEntity} from 'core/entities/projects'
import {tasksStore, oysterRequestCreateTask} from 'core/entities/tasks'

import TaskPreviewBox from 'core/components/Task/TaskPreviewBox'

import Box from 'libs/box'
import Text from 'core/components/ui/Text'
import EditableText from 'core/components/ui/EditableText'
import Ico from 'core/components/ui/Ico'
import UserSelect, {AddUserPlaceholder} from 'core/components/ui/UserSelect'
import UserPreview from 'core/components/ui/UserPreview'

import MoveDetector from 'libs/move-detector'

type TProps = Partial<{
	uuid: string,
	selectedTaskUuid: string | null,
	project: TProject,
	isLoading: boolean,
	addNewTask: TProjectEntity['addNewTask'],
	updateField: TProjectEntity['updateField'],
	assignProjectManager: TProjectEntity['assignProjectManager'],
	deleteProjectManager: TProjectEntity['deleteProjectManager'],
	editNameOnMount: boolean,
}>

type TStateField = 'name'

type TState = {
	creatingNewTask: boolean,
	name: {
		isEditing: boolean,
		value: TProject['name'] | null,
	},
}

const AddTaskButton = ({isCreating, onClick}) => (
	<Box
		width={12} height={12}
		borderWidth={1}
		borderColor='neutral'
		borderRadius={5}
		flexShrink={0}
		position='relative'
		cursor='pointer'
		onClick={onClick}
	>
		<Box
			flex
			flexDirection='column'
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
				marginHorizontal='auto'
			/>
			<Text
				block
				bold
				width='100%'
				textSize='9'
				marginTop={0.25}
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
	<EditableText
		textSize='13'
		bold
		block
		marginLeft={5}
		marginTop={1}
		marginBottom={0.75}
		{...props}
	/>
)

export const projectFactory = ({
	titleRenderer = (elem, self) => elem,
	projectManagerSelectRenderer = (elem, self) => elem,
	tasksRenderer = (elem, self) => elem,
}: {
	titleRenderer?: (elem: React.ReactElement<any>, self) => React.ReactElement<any> | null,
	projectManagerSelectRenderer?: (elem: React.ReactElement<any>, self) => React.ReactElement<any> | null,
	tasksRenderer?: (elem: React.ReactElement<any>, self) => React.ReactElement<any> | null,
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
	class Project extends React.Component<TProps, TState> {
		state = {
			creatingNewTask: false,
			name: {
				isEditing: false,
				value: null,
			},
		}

		nameEl: HTMLInputElement | null = null
		projectWrapperEl: HTMLElement | null = null
		tasksWrapperEl: HTMLElement | null = null
		translateXTmp: number = 0
		@observable projectWrapperWidth: number = 0
		@observable translateX: number = 0

		constructor (props: TProps) {
			super(props)

			autorun(() => {
				this.translateXTmp = this.translateX
			})
		}

		componentDidMount () {
			const {editNameOnMount, project: {permissions}} = this.props
			if (editNameOnMount && permissions && permissions.has('rename')) {
				this.editField('name')
			}
			window.addEventListener('resize', this.handleWindowResizeDebounced)
		}

		componentWillUnmount () {
			window.removeEventListener('resize', this.handleWindowResizeDebounced)
		}

		handleWindowResizeDebounced = debounce(() => {
			if (this.projectWrapperEl) {
				this.projectWrapperWidth = this.projectWrapperEl.clientWidth
			}
		}, 100)

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
				[field as $FixMe]: {
					isEditing: true,
					value: this.props.project[field],
				},
			}, () => {
				const fieldEl = this[`${field}El`]
				fieldEl && typeof fieldEl.focus === 'function' && fieldEl.focus()
			})

		}

		updateEditingField (field: TStateField, value: any) {
			this.setState({
				[field as $FixMe]: {
					isEditing: true,
					value,
				},
			})
		}

		submitEditingField (field: TStateField, value?: any) {
			this.props.updateField(field, value || this.state[field].value)
			this.setState({
				[field as $FixMe]: {
					isEditing: false,
					value: null,
				},
			})
		}

		renderTitle () {
			const {isLoading, uuid, project: {name}} = this.props

			return isLoading
				? <Title>{uuid}</Title>
				: <Title italic={!name} debugTitle={uuid}>{name || 'Add project name'}</Title>
		}

		renderProjectManagerSelect () {
			const {project: {permissions, ownersByIds}} = this.props
			const canDelete = permissions && permissions.has('assign') && ownersByIds && ownersByIds.length > 1

			return (
				<Box flex paddingLeft={5} paddingVertical={1}>
					{ownersByIds && ownersByIds.map((userUuid) => (
						<Box flex marginRight={1.25} key={userUuid}>
							<UserPreview
								userUuid={userUuid}
								role='project manager'
								avatarSize={1.625}
							/>
							{canDelete && (
								<Ico
									type='x'
									color='red'
									alignSelf='flex-start'
									width={0.625}
									marginLeft={0.625}
									cursor='pointer'
									onClick={() => this.props.deleteProjectManager(userUuid)}
								/>
							)}
						</Box>
					))}
					{permissions && permissions.has('assign') && (
						<UserSelect
							blacklist={new Set(ownersByIds)}
							hideIfNoOption
							selectedUserUuid={null}
							onChange={(userUuid) => userUuid && this.props.assignProjectManager(userUuid)}
						>
							<AddUserPlaceholder
								role='project manager'
								icoSize={1.625}
							/>
						</UserSelect>
					)}
				</Box>
			)
		}

		saveTranslateXDebounced = debounce((translateX) => {
			this.tasksWrapperEl && this.tasksWrapperEl.style.removeProperty('transition')
			this.tasksWrapperEl && this.tasksWrapperEl.style.removeProperty('transform')
			this.translateX = translateX
		}, 100)

		renderTasks () {
			const {uuid, selectedTaskUuid, project: {tasksByIds, permissions}} = this.props

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
			const translateXUpperBound = -originalTranslateX
			const translateXLowerBound = Math.min(originalTranslateX, this.projectWrapperWidth - tasksWidth) - originalTranslateX

			const highlightedTaskProps = {
				height: 13,
				width: 13,
				marginLeft: -0.5,
				marginRight: 0.5,
			}

			let showPrevEl
			let showNextEl

			if (this.translateX < translateXUpperBound) {
				showPrevEl = (
					<Box
						flex
						alignItems='center'
						justifyContent='center'
						onClick={() => {
							this.translateX = Math.min(this.translateX + 13 * 16, translateXUpperBound)
						}}
						position='absolute'
						cursor='pointer'
						left={0}
						height='100%'
						width={5}
						style={() => ({
							background: 'linear-gradient(to right, rgba(255,255,255,0.75) 0%,rgba(255,255,255,0.75) 100%)',
						})}
					>
						<Ico
							type='arrowLeft'
							color='neutral'
							height={2}
						/>
					</Box>
				)
			}

			if (this.translateX > translateXLowerBound) {
				showNextEl = (
					<Box
						flex
						alignItems='center'
						justifyContent='center'
						onClick={() => {
							this.translateX = Math.max(this.translateX - 13 * 16, translateXLowerBound)
						}}
						position='absolute'
						cursor='pointer'
						right={0}
						height='100%'
						width={5}
						style={() => ({
							background: 'linear-gradient(to right, rgba(255,255,255,0.75) 0%,rgba(255,255,255,0.75) 100%)',
						})}
					>
						<Ico
							type='arrowRight'
							color='neutral'
							height={2}
						/>
					</Box>
				)
			}

			return (
				<MoveDetector
					onMove={({dX, type}) => {
						if (type === 'touch') {
							dX = -dX
						}
						this.translateXTmp += dX
						this.translateXTmp = Math.min(this.translateXTmp, translateXUpperBound)
						this.translateXTmp = Math.max(this.translateXTmp, translateXLowerBound)

						if (this.tasksWrapperEl) {
							this.tasksWrapperEl.style.transition = 'none'
							this.tasksWrapperEl.style.transform = `translateX(${originalTranslateX + this.translateXTmp}px)`
						}
						this.saveTranslateXDebounced(this.translateXTmp)
					}}
				>
					{showPrevEl}
					{showNextEl}
					<Box
						flex
						alignItems='center'
						height={13}
						paddingLeft={5}
						getRef={(el) => this.tasksWrapperEl = el}
						style={() => ({
							transform: `translateX(${originalTranslateX + this.translateX}px)`,
							transition: 'transform 0.5s',
						})}
					>
						{tasksByIds && (
							tasksByIds.map((taskId) => (
								<Box
									key={taskId}
									width={12} height={12}
									flexShrink={0}
									marginRight={1}
									{...(taskId === selectedTaskUuid ? highlightedTaskProps : null)}
									style={() => ({
										transition: 'all 0.35s',
									})}
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
						el && setTimeout(() => { // so we don't force rerender inside render
							this.projectWrapperWidth = el.clientWidth
						}, 0)
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
