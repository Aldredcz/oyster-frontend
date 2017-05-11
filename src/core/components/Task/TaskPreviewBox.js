// @flow
import React from 'react'
import {connectEntity} from 'libs/entity-manager/react'

import {TasksStore} from 'core/entities/tasks'
import type {TTask} from 'core/entities/tasks'
import {UsersStore} from 'core/entities/users'
import type {TUser} from 'core/entities/users'

@connectEntity({
	entityStore: UsersStore,
	id: (props) => props.uuid,
	fields: ['name', 'surname', 'email'],
	mapStateToProps: (entityState, loadingState, updatingState) => ({
		name: entityState.name,
		surname: entityState.surname,
		email: entityState.email,
	}),
})
class OwnerIco extends React.Component<void, $Shape<TUser>, void> {
	render () {
		const {uuid, name, surname, email} = this.props

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


@connectEntity({
	entityStore: TasksStore,
	id: (props) => props.uuid,
	fields: ['name', 'ownersByIds'],
	mapStateToProps: (entityState, loadingState, updatingState) => ({
		name: entityState.name,
		ownersByIds: entityState.ownersByIds,
	}),
})
export default class TaskPreviewBox extends React.Component<void, $Shape<TTask>, void> {
	render () {
		const {uuid, name, ownersByIds} = this.props

		return (
			<div style={{border: '1px solid black', borderRadius: 5, padding: 10, margin: 10}}>
				<h1 title={uuid}>{name}</h1>
				{ownersByIds &&
					ownersByIds.map((ownerId) => (
						<OwnerIco key={ownerId} uuid={ownerId} />
					))
				}
			</div>

		)
	}
}
