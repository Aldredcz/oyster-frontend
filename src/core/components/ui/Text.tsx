import React from 'react'
import PropTypes from 'prop-types'
import {TColor, TTextSize, TTheme} from 'core/config/themes/types'
import {TBoxProps} from 'libs/box'

import Box, {composeStyles} from 'libs/box'

export type TProps = TBoxProps & {
	readonly textSize?: TTextSize,
	readonly color?: TColor,
	readonly align?: 'left' | 'right' | 'center' | 'justify',
	readonly bold?: boolean,
	readonly decoration?: 'none' | 'underline' | 'line-through',
	readonly italic?: boolean,
}

type TContext = {
	theme: TTheme,
}
export default class Text extends React.Component<TProps> {
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
		const getTextStyles = (theme) => {
			const textStyles: {[key: string]: any} = {
				fontSize,
				lineHeight,
				letterSpacing,
				color: theme.colors[color],
				fontFamily: theme.typography.fontFamily,
			}
			align && (textStyles.textAlign = align)
			bold && (textStyles.fontWeight = 'bold')
			decoration && (textStyles.textDecoration = decoration)
			italic && (textStyles.fontStyle = 'italic')

			return textStyles
		}


		return (
			<Box
				as={as || (this.props.block ? 'div' : 'span')}
				{...restProps}
				style={composeStyles(style, getTextStyles)}
			/>
		)
	}
}
