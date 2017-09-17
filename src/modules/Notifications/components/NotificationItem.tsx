import React from 'react'
import {observer} from 'mobx-react'
import formatDate from 'date-fns/format'
import {TNotification} from '../core/types'
import Link from 'core/router/Link'

import {usersStore} from 'core/entities/users'
import {TUserEntity} from 'core/entities/users'

import Box from 'libs/box'
import Text from 'core/components/ui/Text'

type TProps = {
	notification: TNotification,
	onClick: (ev: MouseEvent) => any,
}

const NotificationText = (props) => (
	<Text
		color='neutral'
	>
		{props.children}
	</Text>
)

const Strong = (props) => (
	<Text
		bold
		color='neutralDark'
	>
		{props.children}
	</Text>
)

const StyledLink = (props) => (
	<Link
		block
		padding={0.5}
		style={() => ({
			':hover': {
				textDecoration: 'underline',
			},
		})}
		{...props}
	/>
)

const Span = ({children, ...restProps}: any) => (
	<Box as='span' {...restProps}>{children}</Box>
)

function formatAuthors (authors: Array<TUserEntity>): React.ReactElement<any> | null {
	if (!authors.length) {
		return null
	}

	return (
		<Strong>{authors[0].data.name} {authors[0].data.surname}</Strong>
	)
}

const ProjectNotification = ({project, onClick, type, authors}) => {
	let message
	const authorHtml = formatAuthors(authors)
	const projectHtml = <Strong>{project.name}</Strong>

	switch (type) {
		case 'rename':
			message = authorHtml
				? <Span>{authorHtml} has renamed {projectHtml}.</Span>
				: <Span>{projectHtml} has been renamed.</Span>
			break
		default:
			message = authorHtml
				? <Span>{authorHtml} has updated project {projectHtml}.</Span>
				: <Span>Project {projectHtml} has been updated.</Span>
	}

	return (
		<StyledLink
			module='projectDetail'
			params={{projectUuid: project.uuid}}
			onClick={onClick}
		>
			<NotificationText>
				{message}
			</NotificationText>
		</StyledLink>
	)
}

const TaskNotification = ({task, onClick, type, authors}) => {
	let message
	const authorHtml = formatAuthors(authors)
	const taskHtml = <Strong>{task.name}</Strong>
	const projectUuid = task.projectsByIds && task.projectsByIds[0]

	switch (type) {
		case 'deadline':
			const deadlineHtml = task.deadline
				? <Strong>{formatDate(task.deadline, 'DD. MM. YYYY')}</Strong>
				: <Strong>none</Strong>
			message = authorHtml
				? <Span>{authorHtml} has changed {taskHtml} deadline to {deadlineHtml}.</Span>
				: <Span>Deadline of {taskHtml} has been changed to {deadlineHtml}.</Span>
			break
		case 'brief':
			message = authorHtml
				? <Span>{authorHtml} has changed the brief of {taskHtml}.</Span>
				: <Span>Brief of {taskHtml} has been changed.</Span>
			break
		case 'approve':
			message = authorHtml
				? <Span>{authorHtml} has approved {taskHtml}!</Span>
				: <Span>{taskHtml} has been approved!</Span>
			break
		default:
			message = authorHtml
				? <Span>{authorHtml} has updated task {taskHtml}.</Span>
				: <Span>Task {taskHtml} has been updated.</Span>
	}

	if (!projectUuid) {
		return (
			<NotificationText>
				{message}
			</NotificationText>
		)
	}

	return (
		<StyledLink
			module='projectDetail'
			params={{projectUuid, selectedTaskUuid: task.uuid}}
			onClick={onClick}
		>
			<NotificationText>
				{message}
			</NotificationText>
		</StyledLink>
	)
}

@observer
export default class NotificationItem extends React.Component<TProps> {
	render () {
		const {notification, onClick} = this.props
		let content
		const authors = (notification.authorsByIds || []).map((authorUuid) => usersStore.getEntity(authorUuid))

		if (notification.subjects.projects) {
			content = ProjectNotification({
				project: notification.subjects.projects[0],
				onClick,
				type: notification.name,
				authors,
			})
		} else if (notification.subjects.tasks) {
			content = TaskNotification({
				task: notification.subjects.tasks[0],
				onClick,
				type: notification.name,
				authors,
			})
		} else {
			content = null // TODO: show at least something??
		}

		return content
			? (
				<Box
					debugTitle={notification.uuid}
					style={() => ({
						backgroundColor: !notification.completedAt && '#EAEAEA',
					})}
				>{content}</Box>
			)
			: null
	}
}
