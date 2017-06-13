// @flow
import React from 'react'
import {observer} from 'mobx-react'
import formatDate from 'date-fns/format'
import isPastDate from 'date-fns/is_past'
import injectEntity from 'core/utils/mobx/entityInjector'


import {tasksStore} from 'core/entities/tasks'
import type {TTask, TTaskEntity} from 'core/entities/tasks'
import {usersStore} from 'core/entities/users'
import type {TUser} from 'core/entities/users'

import Link from 'core/router/Link'
import Box from 'libs/box'
import Text from 'core/components/ui/Text'
import Avatar from 'core/components/ui/Avatar'

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
					width='20px'
				/>
			</Box>
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

		if (permissions) {
			if ((status === 'new' || status === 'after_deadline') && permissions.has('complete')) {
				statusActions.push('complete')
			}
			if (status === 'completed' && permissions.has('approve')) {
				statusActions.push('approve')
			}
		}

		return (
			<Link
				module='projectDetail' params={{projectUuid, selectedTaskUuid: uuid}}
				block
				width='100%' height='100%'
				borderWidth={1}
				borderColor='neutral'
				borderRadius={5}
				padding={0.75}
				style={() => ({position: 'relative'})}
			>
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
				<Text
					title={uuid}
					size='17'
					style={() => ({
						position: 'absolute',
						top: '50%',
						transform: 'translateY(-50%)',
					})}
				>{name || '[unnamed]'}</Text>

				<Box
					style={() => ({
						position: 'absolute',
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
						{deadline && <Text size='8'>{formatDate(deadline, 'DD. MM. YYYY')}</Text>}
					</Box>
				</Box>
			</Link>
		)
	}
}
