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
		const state = this.state
		const {isIncomplete, isPastDeadline, task} = this.props
		const {uuid, name, brief, deadline, permissions, ownersByIds} = task

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
					{!state.name.isEditing
						? (
							<div>
								Name: <h1 title={uuid}> {name}</h1>
								{permissions && permissions.has('rename') && (
									<a href='javascript://' onClick={() => this.editField('name')}>edit</a>
								)}
							</div>
						)
						: (
							<input
								ref={(el) => this.nameEl = el}
								value={state.name.value || ''}
								onChange={(ev) => this.updateEditingField('name', ev.target.value)}
								onKeyDown={(ev) => ev.key === 'Enter' && this.submitEditingField('name')}
							/>
						)
					}
					<div>
						{!state.brief.isEditing
							? (
								<div>
									Brief: {brief && brief.split('\n').map((paragraph, i) => (
									<p key={String(i)}>{paragraph}</p>
								))}
									{permissions && permissions.has('brief') && (
										<a href='javascript://' onClick={() => this.editField('brief')}>edit</a>
									)}
								</div>
							)
							: (
								<textarea
									ref={(el) => this.briefEl = el}
									style={{width: '100%', height: 200}}
									value={state.brief.value || ''}
									onChange={(ev) => this.updateEditingField('brief', ev.target.value)}
									onKeyDown={(ev) => ev.key === 'Enter' && ev.shiftKey && this.submitEditingField('brief')}
								/>
							)
						}
					</div>
				</Box>
			</Box>
		)
	}
}
