// @flow
import React from 'react'
import {observer} from 'mobx-react'
import formatDate from 'date-fns/format'
import isPastDate from 'date-fns/is_past'
import injectEntity from 'core/utils/mobx/entityInjector'

import Link from 'core/router/Link'

import {tasksStore} from 'core/entities/tasks'
import type {TTask, TTaskEntity} from 'core/entities/tasks'
import {usersStore} from 'core/entities/users'
import type {TUser} from 'core/entities/users'


@injectEntity({
	entityStore: usersStore,
	id: (props) => props.uuid,
	mapEntityToProps: (entity) => ({
		owner: entity.data,
	}),
})
@observer
class OwnerIco extends React.Component<void, $Shape<{owner: TUser, uuid: string}>, void> {
	render () {
		const {uuid, name, surname, email} = this.props.owner

		return (
			<div title={uuid}>
				{name && surname
					? `${name[0].toUpperCase()}${surname[0].toUpperCase()}`
					: email && (() => {
						const parts = email.split(/[\@\.]/).map((c) => c[0] && c[0].toUpperCase())
						return `${parts[0]}@${parts[1]}.${parts[2]}`
					})()
				}
			</div>
		)
	}
}

type TProps = $Shape<{
	task: TTask,
	uuid: string,
	projectUuid: string,
	updateField: $PropertyType<TTaskEntity, 'updateField'>,
}>

@injectEntity({
	entityStore: tasksStore,
	id: (props) => props.uuid,
	mapEntityToProps: (entity) => ({
		task: entity.data,
		updateField: entity.updateField.bind(entity),
	}),
})
@observer
export default class TaskPreviewBox extends React.Component<void, TProps, void> {
	render () {
		const {task, projectUuid, updateField} = this.props
		const {uuid, name, deadline, ownersByIds, completedAt, approvedAt, permissions} = task

		let status

		if (approvedAt) {
			status = 'approved'
		} else if (completedAt) {
			status = 'completed'
		} else if (deadline && isPastDate(deadline)) {
			status = 'after_deadline'
		} else {
			status = 'new'
		}

		const statusActions = []

		if ((status === 'new' || status === 'after_deadline') && permissions.has('complete')) {
			statusActions.push('complete')
		}
		if (status === 'completed' && permissions.has('approve')) {
			statusActions.push('approve')
		}

		return (
			<div style={{border: '1px solid black', borderRadius: 5, padding: 10, margin: 10}}>
				<div>
					Status: {status}
					{statusActions.map((action) => {
						let field
						let label
						if (action === 'complete') {
							field = 'completedAt'
							label = 'Complete'
						}
						if (action === 'approve') {
							field = 'approvedAt'
							label = 'Approve'
						}
						return (
							<button key={action} onClick={() => updateField(field, new Date())}>
								{label}
							</button>
						)
					})}
				</div>
				<Link module='projectDetail' params={{projectUuid, selectedTaskUuid: uuid}}>
					<h1 title={uuid}>{name || '[unnamed]'}</h1>
				</Link>
				{ownersByIds &&
					ownersByIds.map((ownerId) => (
						<OwnerIco key={ownerId} uuid={ownerId} />
					))
				}
				{deadline && <span>{formatDate(deadline, 'DD. MM. YYYY')}</span>}
			</div>
		)
	}
}
