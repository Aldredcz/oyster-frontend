// @flow
import React from 'react'
import PropTypes from 'prop-types'
import type {TColor, TTextSize, TTheme} from 'core/config/themes/types'
import type {TBoxProps} from 'libs/box'

import Box from 'libs/box'

export type TProps = TBoxProps & {
	size?: TTextSize,
	color?: TColor,
	align?: 'left' | 'right' | 'center' | 'justify',
	bold?: boolean,
	decoration?: 'none' | 'underline' | 'line-through',
	italic?: boolean,
	editable?: boolean,
	isEditable?: boolean,
	onChange?: (event: any) => any,
	onBlur?: (event: any) => any,
	onInput?: (event: any) => any,
}

type TContext = {
	theme: TTheme,
}
export default class Text extends React.Component<void, TProps, void> {
	static contextTypes = {
		theme: PropTypes.object,
	}
	context: TContext

	element: ?HTMLElement = null
	
	render () {
		const {
			as,
			style,
			size = '9',
			color = 'neutralDark',
			align,
			bold,
			decoration,
			italic,
			editable,
			...restProps
		} = this.props

		const textStyle: Object = {}

		align && (textStyle.textAlign = align)
		bold && (textStyle.fontWeight = 'bold')
		decoration && (textStyle.textDecoration = decoration)
		italic && (textStyle.fontStyle = 'italic')

		return (
			<Box
				getRef={(el) => this.element = el}
				as={as || 'span'}
				{...restProps}
				contentEditable={editable}
				spellcheck='false'
				onKeyDown={(ev) => {
					if (ev.key === 'Enter') {
						ev.preventDefault()
						this.element && this.element.blur()
					}
				}}
				onChange={(ev) => this.props.onChange && this.props.onChange(ev)}
				onBlur={(ev) => this.props.onBlur && this.props.onBlur(ev)}
				style={(theme, boxStyle) => {
					const {fontSize, lineHeight, letterSpacing} = theme.typography.sizes[size]
					return {
						fontFamily: theme.typography.fontFamily,
						fontSize,
						lineHeight,
						letterSpacing,
						color: theme.colors[color],
						...textStyle,
						...(style && style(theme, {...boxStyle, ...textStyle})),
					}
				}}
			/>
		)
	}
}
