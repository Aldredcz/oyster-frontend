// @flow
import React from 'react'

type TProps = {
	+type: string,
	+placeholder: string,
	+value: string,
	+onChange: (value: string, ev: KeyboardEvent) => void,
	+onBlur: (ev: Event) => void,
	+isDirty: boolean,
	+disabled: boolean,
	+validation: ?string,
}

const SignupFormField = (props: TProps) => (
	<div>
		<input
			type={props.type}
			placeholder={props.placeholder}
			value={props.value}
			onChange={(ev: KeyboardEvent) => {
				if (ev.target instanceof HTMLInputElement) {
					props.onChange(ev.target.value, ev)
				}
			}}
			onBlur={props.onBlur}
			disabled={props.disabled}
		/>
		{props.isDirty && props.validation && (
			<p style={{color: 'red'}}>{props.validation}</p>
		)}
	</div>
)

export default SignupFormField
