// @flow
import React from 'react'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'

import {moduleManager} from 'core/store/router'

import {tasksStore} from 'core/entities/tasks'
import type {TTask} from 'core/entities/tasks'
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
}>

@injectEntity({
	entityStore: tasksStore,
	id: (props) => props.uuid,
	mapEntityToProps: (entity) => ({
		task: entity.data,
	}),
})
@observer
export default class TaskPreviewBox extends React.Component<void, TProps, void> {
	goToTaskDetail = (ev: MouseEvent) => {
		const {projectUuid, task} = this.props

		moduleManager.setModule('projectDetail', {
			projectUuid,
			selectedTaskUuid: task.uuid,
		}, ev)
	}

	render () {
		const {task} = this.props
		const {uuid, name, ownersByIds} = task

		return (
			<div style={{border: '1px solid black', borderRadius: 5, padding: 10, margin: 10}}>
				<a href='javascript://' onClick={this.goToTaskDetail}>
					<h1 title={uuid}>{name || '[unnamed]'}</h1>
				</a>
				{ownersByIds &&
					ownersByIds.map((ownerId) => (
						<OwnerIco key={ownerId} uuid={ownerId} />
					))
				}
			</div>

		)
	}
}
