// @flow
import React from 'react'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import formatDate from 'date-fns/format'
import injectEntity from 'core/utils/mobx/entityInjector'

import {tasksStore} from 'core/entities/tasks'
import type {TTask, TTaskEntity, TTaskStatus} from 'core/entities/tasks'
import {usersStore} from 'core/entities/users'
import type {TUser} from 'core/entities/users'

import type {TColor} from 'core/config/themes/types'
import Link from 'core/router/Link'
import Box from 'libs/box'
import Text from 'core/components/ui/Text'
import Avatar from 'core/components/ui/Avatar'
import TaskStatus from './TaskStatus'

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
		const {uuid} = this.props.owner

		return (
			<Box title={uuid} display='inline-block' marginRight={0.2}>
				<Avatar
					user={this.props.owner}
				/>
			</Box>
		)
	}
}

const borderColorPerStatus: {[key: TTaskStatus]: TColor} = {
	new: 'neutral',
	afterDeadline: 'red',
	completed: 'neutral',
	approved: 'neutralLight',
}


type TProps = $Shape<{
	task: TTask,
	uuid: string,
	projectUuid: string,
	taskStatus: TTaskStatus,
	changeTaskStatus: $PropertyType<TTaskEntity, 'changeTaskStatus'>,
}>

@injectEntity({
	entityStore: tasksStore,
	id: (props) => props.uuid,
	mapEntityToProps: (entity) => ({
		task: entity.data,
		changeTaskStatus: entity.changeTaskStatus.bind(entity),
		taskStatus: entity.status,
	}),
})
@observer
export default class TaskPreviewBox extends React.Component<void, TProps, void> {
	@observable isHover: boolean = false

	render () {
		const {task, projectUuid, changeTaskStatus, taskStatus} = this.props
		const {uuid, name, deadline, ownersByIds, permissions} = task

		return (
			<Link
				module='projectDetail' params={{projectUuid, selectedTaskUuid: uuid}}
				onMouseEnter={() => this.isHover = true}
				onMouseLeave={() => this.isHover = false}
				block
				width='100%' height='100%'
				backgroundColor={taskStatus === 'approved' ? 'neutralLight' : undefined}
				borderWidth={1}
				borderColor={borderColorPerStatus[taskStatus]}
				borderRadius={5}
				padding={0.75}
				position='relative'
			>
				<TaskStatus
					preventClick
					actionsExpanded={this.isHover}
					status={taskStatus}
					permissions={permissions}
					onChange={changeTaskStatus}
				/>
				<Text
					italic={!name}
					title={uuid}
					textSize='17'
					position='absolute'
					style={() => ({
						top: '50%',
						transform: 'translateY(-50%)',
					})}
				>{name || 'Add task name'}</Text>

				<Box
					position='absolute'
					style={() => ({
						bottom: 10,
						left: 10,
						right: 10,
					})}
				>
					<Box
						style={() => ({float: 'left'})}
					>
						{ownersByIds &&
							ownersByIds.map((ownerId) => (
								<OwnerIco key={ownerId} uuid={ownerId} />
							))
						}
					</Box>
					<Box
						style={() => ({float: 'right'})}
						marginTop='3px'
					>
						{deadline && <Text textSize='8'>{formatDate(deadline, 'DD. MM. YYYY')}</Text>}
					</Box>
				</Box>
			</Link>
		)
	}
}
