import React from 'react'

import Box from 'libs/box'
import TextInput from 'core/components/ui/TextInput'
import {TProps as TTextInputProps} from 'core/components/ui/TextInput'
import Text from 'core/components/ui/Text'

type TProps = {
	readonly type: TTextInputProps['type'],
	readonly title: string,
	readonly value: string,
	readonly onChange: (value: string, ev: KeyboardEvent) => void,
	readonly onBlur?: (ev: Event) => void,
	readonly isDirty?: boolean,
	readonly disabled?: boolean,
	readonly validation?: string | null,
	readonly width?: string,
}

const SignupFormField = (props: TProps) => {
	//const isValid = !props.validation
	const isInvalid = props.isDirty && props.validation

	return (
		<Box
			width={`calc(${props.width || '100%'} - 20px)`}
			marginHorizontal='10px'
			style={() => ({float: 'left'})}
		>
			<Text textSize='9' bold color={isInvalid ? 'red' : 'blue'}>
				{props.title}
			</Text>
			<TextInput
				block
				textSize='17'
				marginBottom={2}
				paddingVertical={1}
				paddingHorizontal={0.4}
				type={props.type}
				value={props.value}
				onChange={(ev: KeyboardEvent) => {
					if (ev.target instanceof HTMLInputElement) {
						props.onChange(ev.target.value, ev)
					}
				}}
				onBlur={props.onBlur}
				disabled={props.disabled}
				borderColor={isInvalid ? 'red' : undefined}
			/>
		</Box>
	)
}

export default SignupFormField
