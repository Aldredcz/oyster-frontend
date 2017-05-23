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
import {getAuthorizationData} from 'core/authorization'

import AccountWrapper from 'core/components/wrappers/AccountWrapper'


class StandardLayout extends React.Component<void, *, void> {
	render () {
		return (
			<div className='standard-layout' style={{width: '90%', margin: '0 auto'}}>
				{this.props.children}
			</div>
		)
	}
}

function addStandardLayout (elem: React$Element<any>): React$Element<any> {
	return (
		<StandardLayout>
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
		const isLogged = Boolean(getAuthorizationData().token)
		const {Component, isAuthRequired} = moduleManager

		if (isAuthRequired && !isLogged) {
			setTimeout(() => {
				moduleManager.setModule('login') // TODO: remove from view

			}, 0)

			return <noscript />
		}

		let elem = Component ? <Component /> : <span/>

		if (isAuthRequired) {
			elem = addAccountWrapper(addStandardLayout(elem))
		}

		let App = (
			<div className='wrapper'>
				{elem}
			</div>
		)

		App = [
			addMobxProvider,
			addFelaProvider,
			addThemeProvider,
		].reduceRight(
			(finalApp, providerFn) => providerFn(finalApp),
			App,
		)

		return App
	}
}
