// @flow
import React from 'react'
import PropTypes from 'prop-types'
import type {TBoxProps} from 'libs/box'
import type {TColor, TTextSize, TTheme} from 'core/config/themes/types'

import Box from 'libs/box'
import Text from './Text'
import DummySubmit from './DummySubmit'

type TProps = TBoxProps & {
	size?: TTextSize,
	disabled?: boolean,
	submit?: boolean,
	children?: any,
	onClick?: (ev: Event) => any,
}

type TContext = {
	theme: TTheme,
}

function getRawHoverColor (color: TColor, theme: TTheme): string {
	const colorDark: any = `${String(color)}Dark`
	if (colorDark in theme.colors) {
		;(colorDark: TColor)
		return theme.colors[colorDark]
	} else {
		return theme.colors[color]
	}
}

export default class Button extends React.Component<void, TProps, void> {
	static contextTypes = {
		theme: PropTypes.object,
	}
	context: TContext
	dummySubmitEl: ?HTMLInputElement = null

	onSubmit = (ev: Event) => {
		if (this.dummySubmitEl) {
			this.dummySubmitEl.click()
		}
	}

	render () {
		const {
			size,
			disabled,
			backgroundColor = 'blue',
			submit,
			onClick,
			children,
			...restProps
		} = this.props

		return (
			<Box
				as='button'
				type='button'
				padding={size}
				onClick={(ev) => {
					if (!disabled) {
						onClick && onClick(ev)
						this.onSubmit(ev)
					}
				}}
				backgroundColor={!disabled ? backgroundColor : 'neutral'}
				style={(theme) => ({
					border: 'none',
					cursor: !disabled ? 'pointer' : 'not-allowed',
					borderRadius: theme.button.borderRadius,
					':hover': {
						background: !disabled
							? getRawHoverColor(backgroundColor, theme)
							: undefined,

					},
				})}
				{...restProps}
			>
				<Text
					bold
					size={size}
					color='white'
				>
					{children}
				</Text>
				{submit &&
					<DummySubmit disabled={disabled} getRef={(el) => this.dummySubmitEl = el} />
				}
			</Box>
		)
	}
}
