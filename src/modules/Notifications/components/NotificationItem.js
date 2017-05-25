// @flow
import React from 'react'
import type {TNotification} from '../core/types'
import Link from 'core/router/Link'

type TProps = {
	notification: TNotification,
	onClick: (ev: MouseEvent) => any,
}

const ProjectRenameNotification = ({project, onClick}: *) => (
	<Link
		module='projectDetail'
		params={{projectUuid: project.uuid}}
		onClick={onClick}
	>
		<div>
			Project <strong>{project.name}</strong> has been renamed.
		</div>
	</Link>
)

export default class NotificationItem extends React.Component<void, TProps, void> {
	render () {
		const {notification, onClick} = this.props
		let content

		switch (notification.name) {
			case 'rename':
				if (notification.objects.project) {
					content = ProjectRenameNotification({project: notification.objects.project, onClick})
				}
				break

			default:
				content = 'Unknown notification.'
		}

		return (
			<div
				title={notification.uuid}
				style={{
					background: notification.completedAt ? 'inherit' : 'grey',
				}}
			>{content}</div>
		)
	}
}
