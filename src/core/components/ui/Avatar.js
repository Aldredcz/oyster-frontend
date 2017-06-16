// @flow
import React from 'react'
import type {TUser} from 'core/entities/users'

import Box from 'libs/box'
import type {TBoxProps} from 'libs/box'

type TProps = TBoxProps & {
	user: TUser,
	size?: number | string,
}


export default class Avatar extends React.Component<void, TProps, void> {
	render () {
		const {user, size = 1.25, ...restProps} = this.props
		const sizeResolved = typeof size === 'number' ? `${size}rem` : size // TODO: solve better

		return (
			<Box
				backgroundColor='blueDark'
				width={size}
				height={size}
				title={`${user.name || ''} ${user.surname || ''}`}
				{...restProps}
				style={(theme) => ({
					fontFamily: theme.typography.fontFamily,
					fontSize: `calc(${sizeResolved} * 0.5)`,
					borderRadius: sizeResolved,
					lineHeight: sizeResolved,
					textAlign: 'center',
					color: 'white',
				})}
			>{user.name && user.name.charAt(0)}{user.surname && user.surname.charAt(0)}</Box>
		)
	}
}
