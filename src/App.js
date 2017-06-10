// @flow
import React from 'react'
import {Provider as MobxProvider, observer} from 'mobx-react'
import MobxDevTools from 'core/utils/mobx/DevTools'
import {moduleManager} from 'core/router'
import {Provider as FelaProvider, ThemeProvider} from 'react-fela'
import {visualTheme} from 'core/config/themes/theme'

import {getRenderer, getMountNode} from 'core/config/fela'
import accountStore from 'core/store/account'
import {usersStore} from 'core/entities/users'

import Box from 'libs/box'
import AccountWrapper from 'core/components/wrappers/AccountWrapper'

import Notifications from 'modules/Notifications/component'

const StandardLayout = ({children}: any) => (
	<Box width='90%' marginHorizontal='auto' marginVertical={0}>
		{children}
	</Box>
)

function addStandardLayout (elem: React$Element<any>): React$Element<any> {
	return (
		<StandardLayout>
			<div className='topbar' style={{position: 'absolute', top: 0, right: 0}}>
				<div style={{border: '2px solid black', padding: 5}}>
					<Notifications />
				</div>
			</div>
			{elem}
		</StandardLayout>
	)
}

function addAccountWrapper (elem: React$Element<any>): React$Element<any> {
	return (
		//$FlowFixMe
		<AccountWrapper>
			{elem}
		</AccountWrapper>
	)
}

function addMobxProvider (elem: React$Element<any>): React$Element<any> {
	return (
		<MobxProvider
			accountStore={accountStore}
			usersStore={usersStore}
			moduleManager={moduleManager}
		>
			<div>
				{elem}
				{__DEV__ && MobxDevTools}
			</div>
		</MobxProvider>
	)
}

function addFelaProvider (elem: React$Element<any>): React$Element<any> {
	return (
		<FelaProvider mountNode={getMountNode()} renderer={getRenderer()}>
			{elem}
		</FelaProvider>
	)
}

function addThemeProvider (elem: React$Element<any>): React$Element<any> {
	return (
		<ThemeProvider theme={visualTheme}>
			{elem}
		</ThemeProvider>
	)
}
@observer
export default class App extends React.Component<void, void, void> {
	render () {
		const {Component, isAuthRequired} = moduleManager

		let elem = Component ? <Component /> : <span/>

		if (isAuthRequired) {
			elem = addAccountWrapper(addStandardLayout(elem))
		}

		const App = [
			addMobxProvider,
			addFelaProvider,
			addThemeProvider,
		].reduceRight(
			(finalApp, providerFn) => providerFn(finalApp),
			elem,
		)

		return App
	}
}
