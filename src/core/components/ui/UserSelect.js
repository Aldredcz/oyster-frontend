// @flow
import React from 'react'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import type {TUsersStore} from 'core/entities/users/store'

import UserPreview from './UserPreview'
import Box from 'libs/box'
import Text from 'core/components/ui/Text'

type TProps = $Shape<{
	// component API
	selectedUserUuid: ?string,
	editable: boolean,
	onChange: (userUuid: string) => any,
	whitelist?: Set<string>,
	blacklist?: Set<string>,
	children: any,
	hideIfNoOption?: boolean,

	// injected
	usersStore: TUsersStore,
}>

const highlightedItemStyles = (theme) => ({
	backgroundColor: theme.colors.neutralLight,
})

@inject('usersStore') @observer
export default class UserSelect extends React.Component<void, TProps, void> {
	@observable isExpanded: boolean = false

	showOptionList = () => {
		this.isExpanded = true
		document.addEventListener('click', this.hideOptionList)
	}

	hideOptionList = () => {
		document.removeEventListener('click', this.hideOptionList)
		this.isExpanded = false
	}

	renderOptionList () {
		const {usersStore, selectedUserUuid, onChange, whitelist, blacklist, hideIfNoOption} = this.props

		const options = usersStore.userEntitiesList.filter((userEntity) => {
			const {uuid} = userEntity.data

			return !(whitelist && !whitelist.has(uuid) || blacklist && blacklist.has(uuid))
		})

		if (options.length === 0 && hideIfNoOption) {
			return null
		}

		return (
			<Box
				position='absolute'
				backgroundColor='white'
				borderRadius={5}
			>
				{options.map((userEntity) => {
					const {uuid} = userEntity.data

					return (
						<Box
							key={uuid}
							onClick={() => onChange && onChange(uuid)}
							paddingVertical={0.3}
							paddingHorizontal={0.4}
							cursor='pointer'
							style={(theme) => ({
								...(uuid === selectedUserUuid ? highlightedItemStyles(theme) : {}),
								':hover': highlightedItemStyles(theme),
							})}
						>
							<UserPreview
								userUuid={uuid}
							/>
						</Box>
					)
				})}
			</Box>
		)
	}

	render () {
		const {selectedUserUuid} = this.props
		const children = this.props.children || (
			selectedUserUuid
				? <UserPreview userUuid={selectedUserUuid} avatarSize={1.5} />
				: <Text>Select user</Text>
		)

		const optionList = this.renderOptionList()

		if (!optionList) {
			return null
		}

		return (
			<Box position='relative'>
				<Box onClick={this.showOptionList} cursor='pointer'>
					{children}
				</Box>
				{this.isExpanded && optionList}
			</Box>
		)
	}
}
