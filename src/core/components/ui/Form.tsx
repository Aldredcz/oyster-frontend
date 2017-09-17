import React from 'react'
import Box, {TBoxProps} from 'libs/box'
import DummySubmit from './DummySubmit'

type TProps = React.HTMLProps<HTMLFormElement> & TBoxProps & {
	children?: any,
}

const Form = (
	{
		children,
		...restProps
	}: TProps,
): React.ReactElement<any> | null => {
	return (
		<Box as='form' {...restProps}>{children}{<DummySubmit />}</Box>
	)
}

export default Form
