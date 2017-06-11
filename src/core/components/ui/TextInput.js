// @flow
import React from 'react'
import PropTypes from 'prop-types'
import type {TColor, TTextSize, TTheme} from 'core/config/themes/types'
import type {TBoxProps} from 'libs/box'

// TODO: based on Text
import Box from 'libs/box'


export type TProps = TBoxProps & {
	size?: TTextSize,
	color?: TColor,
	borderColor?: TColor,
	type?: 'text' | 'password' | 'email',
}

type TContext = {
	theme: TTheme,
}

const TextInput = (
	{
		as,
		style,
		size = '9',
		color = 'neutralDark',
		type = 'text',
		block,
		paddingVertical,
		paddingHorizontal,
		borderColor,
		...restProps
	}: TProps,
	{
		theme,
	}: TContext,
): ?React.Element<any> => {
	const {fontSize, lineHeight, letterSpacing} = theme.typography.sizes[size]
	const textStyle: Object = {
		fontSize,
		lineHeight,
		letterSpacing,
		color: theme.colors[color],
		fontFamily: theme.typography.fontFamily,
	}

	block && (textStyle.width = '100%')

	return (
		<Box
			as={as || 'input'}
			type={type}
			paddingVertical={paddingVertical || 1}
			paddingHorizontal={paddingHorizontal || '5px'}
			block={block}
			{...restProps}
			style={(theme, boxStyle) => ({
				border: 'none',
				borderBottom: `1px solid ${borderColor || theme.colors.neutral}`,
				...textStyle,
				...(style && style(theme, {...boxStyle, ...textStyle})),
			})}
		/>
	)
}

TextInput.contextTypes = {
	theme: PropTypes.object,
}

export default TextInput
