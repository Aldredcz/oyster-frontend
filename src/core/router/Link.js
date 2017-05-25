// @flow
import React from 'react'
import {isOpeningInNewWindow} from 'libs/event-helpers/mouse-event'
import {moduleManager} from './index'
import type {TModuleId} from './types'

type TProps = {
	module?: TModuleId,
	params?: Object, // eslint-disable-line flowtype/no-weak-types
	onClick?: (ev: MouseEvent) => any,
	//children: Children, // flow srsly??? You don't support children with JSX syntax????
}

export default class Link extends React.Component<void, TProps, void> {
	goToModule = (ev: MouseEvent) => {
		if (!isOpeningInNewWindow(ev)) {
			ev.preventDefault()
			const {params, module} = this.props

			moduleManager.setModule(module, params)
		}
	}

	render () {
		//$FlowFixMe -- check TProps comment :(
		const {params, module, onClick, children} = this.props

		const url = moduleManager.setModule(module, params, true)

		return (
			<a
				href={url || 'javascript://'}
				onClick={(ev: MouseEvent) => {
					onClick && onClick(ev)
					if (!ev.defaultPrevented) {
						this.goToModule(ev)
					}
				}}
			>
				{children}
			</a>
		)
	}
}
