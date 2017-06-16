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
import Logo from 'core/components/ui/Logo'
import Text from 'core/components/ui/Text'
import Ico from 'core/components/ui/Ico'
import AccountWrapper from 'core/components/wrappers/AccountWrapper'

import NotificationsButton from 'modules/Notifications/component'

const Menu = () => (
	<Box
		backgroundColor='blue'
		height='100vh'
		position='fixed'
		zIndex={1}
		width='130px'
	>
		<Logo
			color='blueDark'
			width='100%'
			height='auto'
			padding='10px'
			marginBottom='20px'
		/>
		<Box padding='10px' backgroundColor='blueDark'>
			<Ico height='20px' type='projects' color='white'  />
			<Text
				bold
				size='9'
				align='center'
				width='75px'
				display='inline-block'
				color='white'
				position='relative'
				top={-0.25}
			>
				projects
			</Text>
		</Box>
	</Box>
)

const StandardLayout = ({children}: any) => (
	<Box>
		<Menu />
		<Box width='calc(100% - 130px)' marginLeft='130px' marginBottom={3}>
			<Box
				width='calc(100% - 130px)'
				paddingHorizontal={1}
				paddingVertical={0.5}
				position='fixed'
				zIndex={1}
				height='36px'
				backgroundColor='neutralLight'
			>
				<Box
					style={() => ({
						float: 'right',
					})}
				>
					<NotificationsButton />
				</Box>
			</Box>
			<Box
				marginTop='0px'
				paddingTop={'36px' /* compensating top bar */}
				id='contentWrapper'
			>
				{children}
			</Box>
		</Box>
	</Box>
)

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
		const {Component, isAuthRequired} = moduleManager

		let elem = Component ? <Component /> : <span/>

		if (isAuthRequired) {
			elem = addStandardLayout(addAccountWrapper(elem))
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
