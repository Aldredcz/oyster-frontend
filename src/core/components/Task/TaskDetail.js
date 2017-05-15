// @flow
import React from 'react'
import {observer} from 'mobx-react'
import injectEntity from 'core/utils/mobx/entityInjector'

import {tasksStore} from 'core/entities/tasks'
import type {TTask} from 'core/entities/tasks'


type TProps = $Shape<{
	uuid: string,
	projectUuid: string,
	task: TTask,
}>


@injectEntity({
	entityStore: tasksStore,
	id: (props) => props.uuid,
	mapEntityToProps: (entity) => ({
		task: entity.data,
	}),
})
@observer
export default class TaskDetail extends React.Component<void, TProps, void> {
	render () {
		const {uuid, name, brief} = this.props.task

		return (
			<div>
				<h1 title={uuid}>{name}</h1>
				<h4>Brief:</h4>
				<div>
					{brief}
				</div>
			</div>
		)
	}
}
