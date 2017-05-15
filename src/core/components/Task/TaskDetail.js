// @flow
import React from 'react'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'

import {tasksStore} from 'core/entities/tasks'
import type {TTask, TTaskField} from 'core/entities/tasks'
import type {Task} from 'core/entities/tasks/store'


type TProps = $Shape<{
	uuid?: string,
	projectUuid: string,
	task: TTask,
	updateField: $PropertyType<Task, 'updateField'>,
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
	deadline: {
		isEditing: boolean,
		value: ?$PropertyType<TTask, 'deadline'>,
	},
}

type TStateField = TTaskField & $Keys<TState>


@injectEntity({
	entityStore: tasksStore,
	id: (props) => props.uuid,
	mapEntityToProps: (entity) => ({
		task: entity.data,
		updateField: entity.updateField.bind(entity),
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
		deadline: {
			isEditing: false,
			value: null,
		},
	}

	nameEl: ?HTMLInputElement = null
	briefEl: ?HTMLTextAreaElement = null

	componentDidMount () {
		const {editNameOnMount, task: {actionsSet}} = this.props
		if (editNameOnMount && actionsSet && actionsSet.has('rename')) {
			this.edit('name')
		}
	}

	edit (field: TStateField) {
		this.setState({
			[field]: {
				isEditing: true,
				value: this.props.task[field],
			},
		}, () => {
			const fieldEl = (this: any)[`${field}El`]
			fieldEl && typeof fieldEl.focus === 'function' && fieldEl.focus()
		})

	}

	update (field: TStateField, value: any) {
		this.setState({
			[field]: {
				isEditing: true,
				value,
			},
		})
	}

	submit (field: TStateField) {
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
		const {uuid, name, brief, actionsSet} = this.props.task

		return (
			<div style={{border: '1px solid red'}}>
				<div>
					{!state.name.isEditing
						? (
							<div>
								Name: <h1 title={uuid}> {name}</h1>
								{actionsSet && actionsSet.has('rename') && (
									<a href='javascript://' onClick={() => this.edit('name')}>edit</a>
								)}
							</div>
						)
						: (
							<input
								ref={(el) => this.nameEl = el}
								value={state.name.value || ''}
								onChange={(ev) => this.update('name', ev.target.value)}
								onKeyDown={(ev) => ev.key === 'Enter' && this.submit('name')}
							/>
						)
					}
				</div>
				<br />
				<div>
					{!state.brief.isEditing
						? (
							<div>
								Brief: {brief && brief.split('\n').map((paragraph) => (
									<p>{paragraph}</p>
								))}
								{actionsSet && actionsSet.has('brief') && (
									<a href='javascript://' onClick={() => this.edit('brief')}>edit</a>
								)}
							</div>
						)
						: (
							<textarea
								ref={(el) => this.briefEl = el}
								style={{width: '100%', height: 200}}
								value={state.brief.value || ''}
								onChange={(ev) => this.update('brief', ev.target.value)}
								onKeyDown={(ev) => ev.key === 'Enter' && ev.shiftKey && this.submit('brief')}
							/>
						)
					}
				</div>
			</div>
		)
	}
}
