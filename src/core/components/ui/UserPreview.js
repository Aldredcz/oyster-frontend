// @flow
import React from 'react'
import {observer, inject} from 'mobx-react'

import type {TColor, TTextSize} from 'core/config/themes/types'
import type {TUsersStore} from 'core/entities/users/store'

import Box from 'libs/box'
import type {TBoxProps} from 'libs/box'
import Text from 'core/components/ui/Text'
import Avatar from 'core/components/ui/Avatar'

type TProps = $Shape<TBoxProps & {
	userUuid: string,
	avatarSize?: number | string,
	textSize?: TTextSize,
	textColor?: TColor,
	role?: string,

	usersStore: TUsersStore,
}>

@inject('usersStore') @observer
export default class UserPreview extends React.Component<void, TProps, void> {
	render () {
		const {usersStore, userUuid, role, avatarSize, textSize, textColor, ...restProps} = this.props
		const user = usersStore.getEntity(userUuid).data

		return (
			<Box flex alignItems='center' {...restProps}>
				<Avatar
					user={user}
					marginRight={0.5}
					avatarSize={avatarSize}
				/>
				<Text
					textSize={textSize}
					color={textColor}
				>
					{user.name} {user.surname}
					{role && <br />}
					{role}
				</Text>

			</Box>
		)
	}
}
