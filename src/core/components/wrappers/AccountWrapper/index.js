// @flow
import React from 'react'
import {inject, observer} from 'mobx-react'

import type {TAccountStore} from 'core/store/account'

import {oysterRequestFetchAccount, oysterRequestFetchAccountGroups, oysterRequestFetchAccountUsers} from 'core/api/account'

import Text from 'core/components/ui/Text'

type TProps = {
	accountStore: TAccountStore,
	children: React$Element<*>,
}

@inject('accountStore') @observer
export default class AccountWrapper extends React.Component<void, TProps, void> {
	componentWillMount () {
		const {accountStore} = this.props

		if (!accountStore.uuid) {
			oysterRequestFetchAccount().then(
				({uuid, name}) => {
					accountStore.setUuidAndName(uuid, name)
				},
				// TODO: handle error
			)
		}
		if (!accountStore.usersByIds) {
			oysterRequestFetchAccountUsers().then(
				(usersByIds) => {
					accountStore.setUsersByIds(usersByIds)
				},
				// TODO: handle error
			)
		}
		if (!accountStore.groupsByIds) {
			oysterRequestFetchAccountGroups().then(
				(groupsByIds) => {
					accountStore.setGroupsByIds(groupsByIds)
				},
				// TODO: handle error
			)
		}
	}

	render () {
		const {accountStore: {uuid, usersByIds, groupsByIds}} = this.props

		if (!uuid || !usersByIds || !groupsByIds) {
			return (
				<Text
					block
					align='center'
					marginTop={4}
					size='30'
					color='neutral'
				>
					Loading account data...
				</Text>
			)
		}

		return (
			this.props.children
		)
	}
}
