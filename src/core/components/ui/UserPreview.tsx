import React from 'react'
import {observer, inject} from 'mobx-react'

import {TColor, TTextSize} from 'core/config/themes/types'
import {TUsersStore} from 'core/entities/users/store'

import Box from 'libs/box'
import {TBoxProps} from 'libs/box'
import Text from 'core/components/ui/Text'
import Avatar from 'core/components/ui/Avatar'

type TProps = Partial<TBoxProps & {
	userUuid: string,
	avatarSize?: number | string,
	textSize?: TTextSize,
	textColor?: TColor,
	role?: string,

	usersStore: TUsersStore,
}>

@inject('usersStore') @observer
export default class UserPreview extends React.Component<TProps> {
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
