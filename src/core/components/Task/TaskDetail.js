// @flow
import React from 'react'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'

import {tasksStore} from 'core/entities/tasks'
import type {TTask, TTaskField} from 'core/entities/tasks'
import type {TTaskEntity} from 'core/entities/tasks/store'

import Box from 'libs/box'
import Datetime, {DatetimePreview} from 'core/components/ui/Datetime'
import UserPreview from 'core/components/ui/UserPreview'
import UserSelect, {AddUserPlaceholder} from 'core/components/ui/UserSelect'
import Ico from 'core/components/ui/Ico'
import EditableText from 'core/components/ui/EditableText'


type TProps = $Shape<{
	uuid?: string,
	projectUuid: string,
	task: TTask,
	updateField: $PropertyType<TTaskEntity, 'updateField'>,
	assignContributor: $PropertyType<TTaskEntity, 'assignContributor'>,
	deleteContributor: $PropertyType<TTaskEntity, 'deleteContributor'>,
	editNameOnMount: boolean,
	isPastDeadline: boolean,
	isIncomplete: boolean,
}>

type TState = {
	name: {
		isEditing: boolean,
		value: ?$PropertyType<TTask, 'name'>,
	},
	brief: {
		isEditing: boolean,
		value: ?$PropertyType<TTask, 'brief'>,
	},
}

type TStateField = TTaskField & $Keys<TState>


@injectEntity({
	entityStore: tasksStore,
	id: (props) => props.uuid,
	mapEntityToProps: (entity) => ({
		task: entity.data,
		updateField: entity.updateField.bind(entity),
		assignContributor: entity.assignContributor.bind(entity),
		deleteContributor: entity.deleteContributor.bind(entity),
		editNameOnMount: !entity.data.name,
		isPastDeadline: entity.isPastDeadline,
		isIncomplete: entity.isIncomplete,
	}),
})
@observer
export default class TaskDetail extends React.Component<void, TProps, TState> {
	state = {
		name: {
			isEditing: false,
			value: null,
		},
		brief: {
			isEditing: false,
			value: null,
		},
	}

	nameEl: ?HTMLInputElement = null
	briefEl: ?HTMLTextAreaElement = null

	componentDidMount () {
		const {editNameOnMount, task: {permissions}} = this.props
		if (editNameOnMount && permissions && permissions.has('rename')) {
			this.editField('name')
		}
	}

	editField (field: TStateField) {
		this.setState({
			[field]: {
				isEditing: true,
				value: this.props.task[field],
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

	submitEditingField (field: TStateField, value?: mixed) {
		this.props.updateField(field, value || this.state[field].value)
		this.setState({
			[field]: {
				isEditing: false,
				value: null,
			},
		})
	}

	render () {
		const state = this.state
		const {isIncomplete, isPastDeadline, task} = this.props
		const {name, brief, deadline, permissions, ownersByIds} = task

		const briefEditable = Boolean(permissions && permissions.has('brief'))
		const nameEditable = Boolean(permissions && permissions.has('rename'))

		return (
			<Box
				flex
				width='100%'
				backgroundColor='neutralLight'
				paddingVertical={2}
			>
				<Box
					width='180px'
					paddingHorizontal={1}
					marginTop={2}
					position='relative'
				>
					<Box marginBottom={2}>
						{ownersByIds && ownersByIds.map((userUuid) => (
							<Box position='relative' marginVertical={0.75} key={userUuid}>
								<UserPreview
									userUuid={userUuid}
									role='contributor'
									avatarSize={1.625}
								/>
								{permissions && permissions.has('assign') && (
									<Ico
										type='x'
										color='red'
										width={0.625}
										cursor='pointer'
										onClick={() => this.props.deleteContributor(userUuid)}
										position='absolute'
										right='0'
										top='2px'
									/>
								)}
							</Box>
						))}
						{permissions && permissions.has('assign') && (
							<UserSelect
								blacklist={new Set(ownersByIds)}
								hideIfNoOption
								selectedUserUuid={null}
								onChange={(userUuid) => userUuid && this.props.assignContributor(userUuid)}
							>
								<AddUserPlaceholder
									role='contributor'
									icoSize={1.625}
								/>
							</UserSelect>
						)}
					</Box>
					<Box position='relative'>
						<Datetime
							value={deadline}
							editable={Boolean(permissions && permissions.has('deadline'))}
							onChange={(value) => this.props.updateField('deadline', value)}
							time={false}
							minDate={new Date()}
						>
							<DatetimePreview
								value={deadline}
								textColor={(isPastDeadline && isIncomplete) ? 'red' : undefined}
								icoSize={1.625}
								usage='deadline'
							/>
						</Datetime>
						{deadline && Boolean(permissions && permissions.has('deadline')) && (
							<Ico
								type='x'
								color='red'
								width={0.625}
								cursor='pointer'
								onClick={() => this.props.updateField('deadline', null)}
								position='absolute'
								right='0'
								top='2px'
							/>
						)}
					</Box>
				</Box>
				<Box
					width='50%'
					paddingHorizontal={1}
				>
					<EditableText
						marginBottom={1}
						width={25}
						italic={!state.name.isEditing && !name}
						textSize='17'
						isEditing={state.name.isEditing}
						cursor={nameEditable && !state.name.isEditing ? 'pointer' : undefined}
						onClick={nameEditable && (() => {
							!state.name.isEditing && this.editField('name')
						})}
						onChange={(ev) => this.updateEditingField('name', ev.target.value)}
						onEnter={() => this.submitEditingField('name')}
						onBlur={() => this.submitEditingField('name')}
						value={state.name.value || ''}
					>
						{name || 'Task name...'}
						{nameEditable && (
							<Ico
								type='edit'
								color='neutral'
								height={0.8}
								marginLeft={0.75}
							/>
						)}
					</EditableText>
					<Box>
						<EditableText
							block
							multiline
							height={20}
							overflow='auto'
							padding={1}
							backgroundColor={briefEditable ? 'white' : undefined}
							borderRadius={5}
							isEditing={state.brief.isEditing}
							cursor={briefEditable && !state.brief.isEditing ? 'pointer' : undefined}
							onClick={briefEditable && (() => {
								!state.brief.isEditing && this.editField('brief')
							})}
							onChange={(ev) => this.updateEditingField('brief', ev.target.value)}
							onEnter={(ev) => {
								if (ev.shiftKey) {
									this.submitEditingField('brief')
								}
							}}
							onBlur={() => this.submitEditingField('brief')}
							value={state.brief.value || ''}
						>
							{brief
								? brief.split('\n').map((p, i) => [
									p,
									<br />,
								])
								: 'Enter brief...'}
						</EditableText>
					</Box>
				</Box>
			</Box>
		)
	}
}
