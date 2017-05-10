// @flow
import React from 'react'
import {connectEntity} from 'libs/entity-manager/react'

import {TasksStore} from 'core/entities/tasks'
import type {TTask} from 'core/entities/tasks'


type TProps = TTask & {}

@connectEntity({
	entityStore: TasksStore,
	id: (props) => props.uuid,
	fields: ['name'],
	mapStateToProps: (entityState, loadingState, updatingState) => ({
		name: entityState.name,
	}),
})
export default class Task extends React.Component<*, TProps, *> {
	render () {
		const {uuid, name} = this.props

		return (
			<h1><code>{uuid}</code>{name}</h1>
		)
	}
}

