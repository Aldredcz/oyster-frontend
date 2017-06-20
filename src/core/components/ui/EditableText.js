// @flow
import React from 'react'

import type {TProps as TTextProps} from './Text'
import type {TProps as TTextInputProps} from './TextInput'
import {composeStyles} from 'libs/box'
import Text from './Text'
import TextInput from './TextInput'

type TProps = TTextProps & TTextInputProps & {
	+isEditing?: boolean,
	//+selectContentOnFocus?: boolean,
	+onKeyDown?: (event: KeyboardEvent) => any,
	+onEnter?: (event: KeyboardEvent) => any,
}

export default class EditableText extends React.Component<void, TProps, void> {
	textInputEl: ?HTMLElement = null

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
