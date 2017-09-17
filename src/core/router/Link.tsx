import React from 'react'
import {isOpeningInNewWindow} from 'libs/event-helpers/mouse-event'
import {moduleManager} from './index'
import {TModuleId} from './types'

import Text from 'core/components/ui/Text'
import {TProps as TTextProps} from 'core/components/ui/Text'

type TProps = TTextProps & {
	module?: TModuleId,
	params?: Object,
	onClick?: (ev: MouseEvent) => any,
	//children: Children, // flow srsly??? You don't support children with JSX syntax????
}

export default class Link extends React.Component<TProps> {
	goToModule = (ev: MouseEvent) => {
		if (!isOpeningInNewWindow(ev)) {
			ev.preventDefault()
			const {params, module} = this.props

			moduleManager.setModule(module, params)
		}
	}

	render () {
		const {params, module, onClick, children, ...restProps} = this.props

		const url = moduleManager.setModule(module, params, true)

		return (
			<Text
				as='a'
				href={url || 'javascript://'}
				decoration='none'
				onClick={(ev: MouseEvent) => {
					onClick && onClick(ev)
					if (!ev.defaultPrevented) {
						this.goToModule(ev)
					}
				}}
				{...restProps}
			>
				{children}
			</Text>
		)
	}
}
