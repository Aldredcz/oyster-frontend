// @flow
import React from 'react'
import {observer, inject} from 'mobx-react'
import type {TUserEntity, TUsersStore} from 'core/entities/users/store'

type TProps = $Shape<{
	selectedUserUuid: ?string,
	editable: boolean,
	onChange: (userUuid: string) => any,
	usersStore: TUsersStore,
}>

@inject('usersStore') @observer
export default class UserSelect extends React.Component<void, TProps, void> {
	render () {
		const {usersStore, selectedUserUuid, onChange, editable} = this.props

		return (
			<select
				value={selectedUserUuid || ''}
				onChange={(ev) => onChange && onChange(ev.target.value)}
				disabled={!editable}
			>
				<option value={null} />
				{usersStore.userEntitiesList.map((userEntity: TUserEntity) => (
					<option
						key={userEntity.data.uuid}
						value={userEntity.data.uuid}
					>
						{userEntity.data.email}
					</option>
				))}
			</select>
		)
	}
}
