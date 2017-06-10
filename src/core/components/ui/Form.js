// @flow
import React from 'react'
import Box from 'libs/box'
import DummySubmit from './DummySubmit'

type TProps = {
	children?: any,
}

const Form = (
	{
		children,
		...restProps
	}: TProps,
): ?React.Element<any> => {
	return (
		<Box as='form' {...restProps}>{children}{<DummySubmit />}</Box>
	)
}

export default Form
