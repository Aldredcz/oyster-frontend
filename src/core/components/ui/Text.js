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
	isEditing?: boolean,
	onKeyDown?: (event: KeyboardEvent) => any,
	onClick?: (event: MouseEvent) => any,
	onChange?: (event: KeyboardEvent) => any,
	onFocus?: (event: FocusEvent) => any,
	onBlur?: (event: FocusEvent) => any,
	onSubmit?: (event: Event) => any,
	onInput?: (event: Event) => any,
}
type TState = {
	isEditing: boolean,
}

type TContext = {
	theme: TTheme,
}
export default class Text extends React.Component<void, TProps, TState> {
	static contextTypes = {
		theme: PropTypes.object,
	}

	state = {
		isEditing: false,
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
			onKeyDown,
			onClick,
			onFocus,
			onBlur,
			onSubmit,
			...restProps
		} = this.props

		const {fontSize, lineHeight, letterSpacing} = this.context.theme.typography.sizes[size]
		const textStyle: Object = {
			fontSize,
			lineHeight,
			letterSpacing,
			color: this.context.theme.colors[color],
			outline: this.state.isEditing ? `1px solid ${this.context.theme.colors.neutral}` : 'none',
			outlineOffset: '4px',
			display: 'inline-block',
		}

		textStyle.fontFamily = this.context.theme.typography.fontFamily
		align && (textStyle.textAlign = align)
		bold && (textStyle.fontWeight = 'bold')
		decoration && (textStyle.textDecoration = decoration)
		italic && (textStyle.fontStyle = 'italic')

		return (
			<Box
				getRef={(el) => this.element = el}
				as={as || 'span'}
				contentEditable={editable && this.state.isEditing}
				{...restProps}
				onKeyDown={(ev) => {
					onKeyDown && onKeyDown(ev)
					if (ev.key === 'Enter') {
						ev.preventDefault()
						this.element && this.element.blur()
					}
				}}
				onClick={(ev) => {
					onClick && onClick(ev)
					editable && this.setState({isEditing: true})
				}}
				onFocus={(ev) => {
					onFocus && onFocus(ev)
					editable && this.setState({isEditing: true})
				}}
				onBlur={(ev) => {
					onBlur && onBlur(ev)
					this.props.onSubmit && this.props.onSubmit(ev)
					this.setState({isEditing: false})
				}}
				onSubmit={(ev) => {
					onSubmit && onSubmit(ev)
					this.setState({isEditing: false})
				}}
				style={(theme, boxStyle) => ({
					...textStyle,
					...(style && style(theme, {...boxStyle, ...textStyle})),
				})}
			/>
		)
	}
}
