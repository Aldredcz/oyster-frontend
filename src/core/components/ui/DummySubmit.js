// @flow
import React from 'react'
import Box from 'libs/box'

const DummySubmit = (restProps: Object) => (
	<Box
		as='input'
		type='submit'
		style={() => ({display: 'none'})}
		{...restProps}
	/>
)

export default DummySubmit
