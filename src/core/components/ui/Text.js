// @flow
import React from 'react'
import PropTypes from 'prop-types'
import type {TColor, TTextSize, TTheme} from 'core/config/themes/types'
import type {TBoxProps} from 'libs/box'

import Box from 'libs/box'

type TProps = TBoxProps & {
	size?: TTextSize,
	color?: TColor,
	align?: 'left' | 'right' | 'center' | 'justify',
	bold?: boolean,
	decoration?: 'none' | 'underline' | 'line-through',
	italic?: boolean,
	block?: boolean,
}

type TContext = {
	theme: TTheme,
}

const Text = (
	{
		as,
		style,
		size = '9',
		color = 'neutralDark',
		align,
		bold,
		decoration,
		italic,
		block,
		...restProps
	}: TProps,
	{
		theme,
	}: TContext,
) => {
	const {fontSize, lineHeight, letterSpacing} = theme.typography.sizes[size]
	const textStyle: Object = {
		fontSize,
		lineHeight,
		letterSpacing,
		color: theme.colors[color],
	}

	textStyle.fontFamily = theme.typography.fontFamily
	align && (textStyle.textAlign = align)
	bold && (textStyle.fontWeight = 'bold')
	decoration && (textStyle.textDecoration = decoration)
	italic && (textStyle.fontStyle = 'italic')
	block && (textStyle.display = 'block')

	return (
		<Box
			as={as || 'span'}
			{...restProps}
			style={(theme, boxStyle) => ({
				...textStyle,
				...(style && style(theme, {...boxStyle, ...textStyle})),
			})}
		/>
	)
}

Text.contextTypes = {
	theme: PropTypes.object,
}

export default Text
