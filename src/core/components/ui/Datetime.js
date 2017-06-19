// @flow
import React from 'react'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import formatDate from 'date-fns/format'
import DatePicker from 'react-day-picker'

import type {TColor, TTextSize} from 'core/config/themes/types'
import type {TBoxProps} from 'libs/box'
import Box from 'libs/box'
import Text from 'core/components/ui/Text'
import Ico from 'core/components/ui/Ico'


type TDatetimePreviewProps =  $Shape<TBoxProps & {
	value: ?Date,
	time?: boolean,
	icoSize?: number | string,
	textSize?: TTextSize,
	textColor?: TColor,
	usage?: string,
}>

export const DatetimePreview = ({
	value,
	//$FlowFixMe - no idea what's wrong with this default param assignment
	icoSize = 1.25,
	textSize,
	textColor,
	usage,
	...restProps
}: TDatetimePreviewProps) => (
	<Box flex alignItems='center' {...(restProps: any)}>
		<Ico
			type='calendar'
			width={icoSize}
			marginRight={0.5}
			color={textColor}
		/>
		<Text size={textSize} color={textColor}>
			{value
				? formatDate(value, 'DD. MM. YYYY')
				: '__.__.___'
			}
			{usage && <br />}
			{usage}
		</Text>
	</Box>
)

type TProps = {
	value: ?Date,
	onChange: (value: Date) => any,
	time?: boolean,
	minDate?: Date,
	maxDate?: Date,
	children?: any,
}

@observer
export default class Datetime extends React.Component<void, TProps, void> {
	@observable isOpen = false
	calendarWrapperEl: ?HTMLElement = null

	showCalendar = () => {
		this.isOpen = true
		document.addEventListener('click', this.hideCalendarOnClickOutside)
	}

	hideCalendarOnClickOutside = (ev: any) => {
		if (ev.path && !ev.path.includes(this.calendarWrapperEl)) {
			this.hideCalendar()
		}
	}

	hideCalendar = () => {
		document.removeEventListener('click', this.hideCalendarOnClickOutside)
		this.isOpen = false
	}

	renderCalendar () {
		const {value, onChange} = this.props

		return (
			<Text
				getRef={(el) => this.calendarWrapperEl = el}
				position='absolute'
				backgroundColor='white'
				size='13'
			>
				<DatePicker
					firstDayOfWeek={1}
					onDayClick={(date) => {
						this.hideCalendar()
						onChange(date)
					}}
					selectedDays={value}
				/>
			</Text>
		)
	}

	render () {
		const {value, children} = this.props

		return (
			<Box position='relative'>
				<Box onClick={this.showCalendar} cursor='pointer'>
					{children || (
						<DatetimePreview value={value} />
					)}
				</Box>
				{this.isOpen && this.renderCalendar()}
			</Box>
		)
	}
}
