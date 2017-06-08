// @flow
import React from 'react'
import {observer} from 'mobx-react'
import formatDate from 'date-fns/format'
import type {TNotification} from '../core/types'
import Link from 'core/router/Link'

import {usersStore} from 'core/entities/users'
import type {TUserEntity} from 'core/entities/users'

type TProps = {
	notification: TNotification,
	onClick: (ev: MouseEvent) => any,
}

function formatAuthors (authors: Array<TUserEntity>): ?React$Element<any> {
	if (!authors.length) {
		return null
	}

	return (
		<strong>{authors[0].data.name} {authors[0].data.surname}</strong>
	)
}

const ProjectNotification = ({project, onClick, type, authors}: *) => {
	let message
	const authorHtml = formatAuthors(authors)
	const projectHtml = <strong>{project.name}</strong>

	switch (type) {
		case 'rename':
			message = authorHtml
				? <span>{authorHtml} has renamed {projectHtml}.</span>
				: <span>{projectHtml} has been renamed.</span>
			break
		default:
			message = authorHtml
				? <span>{authorHtml} has updated project {projectHtml}.</span>
				: <span>Project {projectHtml} has been updated.</span>
	}

	return (
		<Link
			module='projectDetail'
			params={{projectUuid: project.uuid}}
			onClick={onClick}
		>
			<div>
				{message}
			</div>
		</Link>
	)
}

const TaskNotification = ({task, onClick, type, authors}: *) => {
	let message
	const authorHtml = formatAuthors(authors)
	const taskHtml = <strong>{task.name}</strong>
	const projectUuid = task.projectsByIds && task.projectsByIds[0]

	switch (type) {
		case 'deadline':
			const deadlineHtml = task.deadline
				? <strong>{formatDate(task.deadline, 'DD. MM. YYYY')}</strong>
				: <strong>none</strong>
			message = authorHtml
				? <span>{authorHtml} has changed {taskHtml} deadline to {deadlineHtml}.</span>
				: <span>Deadline of {taskHtml} has been changed to {deadlineHtml}.</span>
			break
		case 'brief':
			message = authorHtml
				? <span>{authorHtml} has changed the brief of {taskHtml}.</span>
				: <span>Brief of {taskHtml} has been changed.</span>
			break
		case 'approve':
			message = authorHtml
				? <span>{authorHtml} has approved {taskHtml}!</span>
				: <span>{taskHtml} has been approved!</span>
			break
		default:
			message = authorHtml
				? <span>{authorHtml} has updated task {taskHtml}.</span>
				: <span>Task {taskHtml} has been updated.</span>
	}

	if (!projectUuid) {
		return (
			<div>
				{message}
			</div>
		)
	}

	return (
		<Link
			module='projectDetail'
			params={{projectUuid, selectedTaskUuid: task.uuid}}
			onClick={onClick}
		>
			<div>
				{message}
			</div>
		</Link>
	)
}

@observer
export default class NotificationItem extends React.Component<void, TProps, void> {
	render () {
		const {notification, onClick} = this.props
		let content
		const authors = (notification.authorsByIds || []).map((authorUuid) => usersStore.getEntity(authorUuid))

		if (notification.objects.project) {
			content = ProjectNotification({
				project: notification.objects.project,
				onClick,
				type: notification.name,
				authors,
			})
		} else if (notification.objects.task) {
			content = TaskNotification({
				task: notification.objects.task,
				onClick,
				type: notification.name,
				authors,
			})
		} else {
			content = null // TODO: show at least something??
		}

		return content
			? (
				<div
					title={notification.uuid}
					style={{
						background: notification.completedAt ? 'inherit' : 'grey',
					}}
				>{content}</div>
			)
			: null
	}
}
