import React from 'react'

import {TProps as TTextProps} from './Text'
import {TProps as TTextInputProps} from './TextInput'
import {composeStyles} from 'libs/box'
import Text from './Text'
import TextInput from './TextInput'

type TProps = TTextProps & TTextInputProps & {
	readonly isEditing?: boolean,
	//readonly selectContentOnFocus?: boolean,
	readonly onKeyDown?: (event: KeyboardEvent) => any,
	readonly onEnter?: (event: KeyboardEvent) => any,
}

export default class EditableText extends React.Component<TProps> {
	textInputEl: HTMLElement | null = null

	componentDidUpdate (prevProps: TProps) {
		if (!prevProps.isEditing && this.props.isEditing && this.textInputEl) {
			this.textInputEl.focus()
		}
	}

	render () {
		const {
			style,
			isEditing,
			multiline,
			height = multiline ? '10em' : '1.5em',
			onKeyDown,
			onEnter,
			value,
			children,
			...restProps
		} = this.props
		delete restProps.onSubmit
		delete restProps.selectContentOnFocus


		const getEditableTextStyles = (theme) => ({})

		if (!isEditing) {
			return (
				<Text
					height={height}
					{...restProps}
				>{children}</Text>
			)
		} else {
			return (
				<TextInput
					getRef={(el) => this.textInputEl = el}
					height={height}
					style={composeStyles(style, getEditableTextStyles)}
					multiline={multiline}
					onKeyDown={(ev) => {
						onKeyDown && onKeyDown(ev)
						if (!ev.defaultPrevented && ev.key === 'Enter') {
							onEnter && onEnter(ev)
						}
					}}
					value={value || ''}
					{...restProps}
				/>
			)
		}


	}
}
