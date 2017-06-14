// @flow
import React from 'react'
import {observer} from 'mobx-react'
import type {TTask, TTaskPermission} from 'core/entities/tasks'
import type {TColor} from 'core/config/themes/types'

import Box from 'libs/box'
import Ico from 'core/components/ui/Ico'
import type {TIcoType} from 'core/components/ui/Ico'

export type TTaskStatus =
	| 'new'
	| 'afterDeadline'
	| 'completed'
	| 'approved'


type TProps = {
	preventClick?: boolean,
	actionsExpanded?: boolean,
	status: TTaskStatus,
	permissions: $PropertyType<TTask, 'permissions'>,
	onChange: (action: TTaskPermission) => any,
}

type TIcoDescriptor = {
	type: TIcoType,
	color: TColor,
}

const statusIcoMap: {[key: TTaskStatus]: TIcoDescriptor} = {
	new: {
		type: 'ok',
		color: 'green',
	},
	afterDeadline: {
		type: 'clockFull',
		color: 'red',
	},
	completed: {
		type: 'okFull',
		color: 'green',
	},
	approved: {
		type: 'okFull',
		color: 'neutralDark',
	},
}

const actionsIcoMap: {[key: TTaskPermission]: TIcoDescriptor} = {
	complete: {
		type: 'okFull',
		color: 'green',
	},
	approve: {
		type: 'okFull',
		color: 'neutralDark',
	},
	reopen: {
		type: 'undo',
		color: 'yellow',
	},
	reject: {
		type: 'undo',
		color: 'yellow',
	},
}

const icoBoxProps = {
	height: '20px',
	marginRight: 0.2,
}

@observer
export default class TaskStatus extends React.Component<void, TProps, void> {
	render () {
		const {status, permissions, preventClick, actionsExpanded, onChange} = this.props

		const statusActions = []

		if (permissions) {
			permissions.has('complete') && statusActions.push('complete')
			permissions.has('approve') && statusActions.push('approve')
			permissions.has('reopen') && statusActions.push('reopen')
			permissions.has('reject') && !permissions.has('reopen') && statusActions.push('reject')
		}

		return (
			<Box
				width={actionsExpanded ? '100%' : '20px'}
				overflow='hidden'
				style={() => ({
					whiteSpace: 'nowrap',
					':hover': {
						width: '100%',
					},
				})}
				onClick={preventClick
					? (ev) => {
						ev.preventDefault()
						ev.stopPropagation()
					}
					: undefined
				}
			>
				<Ico
					type={statusIcoMap[status].type}
					color={statusIcoMap[status].color}
					{...icoBoxProps}
					style={() => ({
						cursor: 'default',
					})}
				/>
				{statusActions.map((action) => (
					<Ico
						key={action}
						type={actionsIcoMap[action].type}
						color={actionsIcoMap[action].color}
						{...icoBoxProps}
						onClick={() => {
							onChange(action)
						}}
					/>
				))}
			</Box>
		)
	}
}
