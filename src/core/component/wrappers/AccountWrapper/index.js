// @flow
import React from 'react'
import {connect} from 'react-redux'

import type {TGlobalState} from 'core/store/types'
import type {TAccountState} from 'core/store/account/types'
import {setData} from 'core/store/account/account-actions'

import {oysterRequestFetchAccount, oysterRequestFetchAccountGroups, oysterRequestFetchAccountUsers} from 'core/api/account'

type TProps = TAccountState & {
	setData: typeof setData,
	children: React$Element<*>,
}

@connect(
	(state: TGlobalState) => ({...state.account}),
	{
		setData,
	},
)
export default class AccountWrapper extends React.Component<void, TProps, void> {
	componentWillMount () {
		const {uuid, usersByIds, groupsByIds, setData} = this.props

		if (!uuid) {
			oysterRequestFetchAccount().then(
				({uuid, name}) => {
					setData({key: 'uuid', value: uuid})
					setData({key: 'name', value: name})
				},
				// TODO: handle error
			)
		}
		if (!usersByIds) {
			oysterRequestFetchAccountUsers().then(
				(usersByIds) => {
					setData({key: 'usersByIds', value: usersByIds})
				},
				// TODO: handle error
			)
		}
		if (!groupsByIds) {
			oysterRequestFetchAccountGroups().then(
				(groupsByIds) => {
					setData({key: 'groupsByIds', value: groupsByIds})
				},
				// TODO: handle error
			)
		}
	}

	render () {
		return (
			this.props.children
		)
	}
}

