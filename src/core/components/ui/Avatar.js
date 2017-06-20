// @flow
import React from 'react'
import type {TUser} from 'core/entities/users'

import Box from 'libs/box'
import type {TBoxProps} from 'libs/box'

type TProps = TBoxProps & {
	user: TUser,
	avatarSize?: number | string,
}


export default class Avatar extends React.Component<void, TProps, void> {
	render () {
		const {user, avatarSize = 1.25, ...restProps} = this.props
		const avatarSizeResolved = typeof avatarSize === 'number' ? `${avatarSize}rem` : avatarSize // TODO: solve better

		return (
			<Box
				backgroundColor='blueDark'
				width={avatarSize}
				height={avatarSize}
				title={`${user.name || ''} ${user.surname || ''}`}
				{...restProps}
				style={(theme) => ({
					fontFamily: theme.typography.fontFamily,
					fontSize: `calc(${avatarSizeResolved} * 0.5)`,
					borderRadius: avatarSizeResolved,
					lineHeight: avatarSizeResolved,
					textAlign: 'center',
					color: 'white',
				})}
			>{user.name && user.name.charAt(0)}{user.surname && user.surname.charAt(0)}</Box>
		)
	}
}
