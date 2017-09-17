import React from 'react'
import PropTypes from 'prop-types'

import {composeStyles} from 'libs/box'
import Text from 'core/components/ui/Text'
import {TProps as TTextProps} from 'core/components/ui/Text'


export type TProps = TTextProps & {
	type?: 'text' | 'password' | 'email',
	children?: any,
	value?: string,
	multiline?: boolean,
}

const TextInput: React.SFC<TProps> = (
	{
		as,
		type = 'text',
		block,
		multiline,
		width,
		padding,
		borderColor,
		children,
		value = String(children),
		style,
		...restProps
	}: TProps,
): React.ReactElement<any> | null => {
	if (!width && block) {
		width = '100%'
	}

	const getTextInputStyles = (theme) => !multiline
		? ({
			border: 'none',
			borderBottom: `1px solid ${borderColor || theme.colors.neutral}`,
		})
		: ({
			border: 'none',
			boxShadow: `0 0 0 1px ${borderColor || theme.colors.neutral}`,
		})

	return (
		<Text
			as={as || multiline ? 'textarea' : 'input'}
			padding={padding || 0}
			value={value}
			type={type}
			block={block}
			width={width}
			{...restProps}
			style={composeStyles(style, getTextInputStyles)}
		/>
	)
}

TextInput.displayName = 'TextInput'
TextInput.contextTypes = {
	theme: PropTypes.object,
}

export default TextInput
