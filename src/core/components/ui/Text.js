// @flow
import React from 'react'
import PropTypes from 'prop-types'
import type {TColor, TTextSize, TTheme} from 'core/config/themes/types'
import type {TBoxProps} from 'libs/box'

import Box from 'libs/box'

export type TProps = TBoxProps & {
	+textSize?: TTextSize,
	+color?: TColor,
	+align?: 'left' | 'right' | 'center' | 'justify',
	+bold?: boolean,
	+decoration?: 'none' | 'underline' | 'line-through',
	+italic?: boolean,
}

type TContext = {
	theme: TTheme,
}
export default class Text extends React.Component<void, TProps, void> {
	static contextTypes = {
		theme: PropTypes.object,
	}
	context: TContext

	render () {
		const {
			as,
			style,
			textSize = '9',
			color = 'neutralDark',
			align,
			bold,
			decoration,
			italic,
			...restProps
		} = this.props

		const {fontSize, lineHeight, letterSpacing} = this.context.theme.typography.sizes[textSize]
		const textStyles: Object = {
			fontSize,
			lineHeight,
			letterSpacing,
			color: this.context.theme.colors[color],
			fontFamily: this.context.theme.typography.fontFamily,
		}

		align && (textStyles.textAlign = align)
		bold && (textStyles.fontWeight = 'bold')
		decoration && (textStyles.textDecoration = decoration)
		italic && (textStyles.fontStyle = 'italic')

		return (
			<Box
				as={as || (this.props.block ? 'div' : 'span')}
				{...restProps}
				style={(theme, boxStyles) => ({
					...textStyles,
					...(style && style(theme, {...boxStyles, ...textStyles})),
				})}
			/>
		)
	}
}
