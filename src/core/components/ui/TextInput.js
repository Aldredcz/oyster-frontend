// @flow
import React from 'react'
import PropTypes from 'prop-types'

import Text from 'core/components/ui/Text'
import type {TProps as TTextProps} from 'core/components/ui/Text'


export type TProps = TTextProps & {
	type?: 'text' | 'password' | 'email',
}

const TextInput = (
	{
		as,
		type = 'text',
		block,
		width,
		paddingVertical,
		paddingHorizontal,
		borderColor,
		...restProps
	}: TProps,
): ?React.Element<any> => {
	if (!width && block) {
		width = '100%'
	}

	return (
		<Text
			as={as || 'input'}
			type={type}
			paddingVertical={paddingVertical || 1}
			paddingHorizontal={paddingHorizontal || '5px'}
			block={block}
			width={width}
			{...restProps}
			style={(theme, boxStyle) => ({
				border: 'none',
				borderBottom: `1px solid ${borderColor || theme.colors.neutral}`,
			})}
		/>
	)
}

TextInput.displayName = 'TextInput'
TextInput.contextTypes = {
	theme: PropTypes.object,
}

export default TextInput
