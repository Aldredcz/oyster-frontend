// @flow
import React from 'react'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'

import {tasksStore} from 'core/entities/tasks'
import type {TTask, TTaskField} from 'core/entities/tasks'
import type {TTaskEntity} from 'core/entities/tasks/store'

import Datetime from 'core/components/ui/Datetime'
import UserSelect from 'core/components/ui/UserSelect'


type TProps = $Shape<{
	uuid?: string,
	projectUuid: string,
	task: TTask,
	updateField: $PropertyType<TTaskEntity, 'updateField'>,
	assignContributor: $PropertyType<TTaskEntity, 'assignContributor'>,
	editNameOnMount: boolean,
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
		editNameOnMount: !entity.data.name,
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
		const {uuid, name, brief, deadline, permissions, ownersByIds} = this.props.task

		return (
			<div style={{border: '1px solid red'}}>
				<div>
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
				</div>
				<br />
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
				<div>
					Deadline:
					<Datetime
						value={deadline}
						editable={Boolean(permissions && permissions.has('deadline'))}
						onChange={(value) => this.props.updateField('deadline', value)}
						time={false}
						minDate={new Date()}
					/>
				</div>
				<div>
					Contributors:
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
							onChange={(userUuid) => userUuid && this.props.assignContributor(userUuid)}
						/>
					)}
				</div>
			</div>
		)
	}
}
