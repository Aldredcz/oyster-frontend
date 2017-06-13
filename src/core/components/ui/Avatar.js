// @flow
import React from 'react'
import type {TUser} from 'core/entities/users'

import Box from 'libs/box'
import type {TBoxProps} from 'libs/box'

type TProps = TBoxProps & {
	user: TUser,
}


export default class Avatar extends React.Component<void, TProps, void> {
	render () {
		const {user} = this.props
		const {width = '20px'} = this.props

		return (
			<Box
				backgroundColor='blueDark'
				width={width}
				height={width}
				title={`${user.name || ''} ${user.surname || ''}`}
				style={(theme) => ({
					fontFamily: theme.typography.fontFamily,
					fontSize: `calc(${width} * 0.5)`,
					borderRadius: width,
					lineHeight: width,
					textAlign: 'center',
					color: 'white',
				})}
			>{user.name && user.name.charAt(0)}{user.surname && user.surname.charAt(0)}</Box>
		)
	}
}
