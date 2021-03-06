import React from 'react'
import {observable} from 'mobx'
import {observer} from 'mobx-react'
import formatDate from 'date-fns/format'
import DatePicker from 'react-day-picker'

import {TColor, TTextSize} from 'core/config/themes/types'
import {TBoxProps} from 'libs/box'
import Box from 'libs/box'
import Text from 'core/components/ui/Text'
import Ico from 'core/components/ui/Ico'


type TDatetimePreviewProps =  Partial<TBoxProps & {
	value: Date | null,
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
	<Box flex alignItems='center' {...(restProps as any)}>
		<Ico
			type='calendar'
			width={icoSize}
			marginRight={0.5}
			color={textColor}
		/>
		<Text textSize={textSize} color={textColor}>
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
	value: Date | null,
	onChange: (value: Date) => any,
	time?: boolean,
	editable?: boolean,
	minDate?: Date,
	maxDate?: Date,
	children?: any,
}

@observer
export default class Datetime extends React.Component<TProps> {
	@observable isOpen = false
	calendarWrapperEl: HTMLElement | null = null

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
				textSize='13'
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
		const {value, children, editable} = this.props

		return (
			<Box position='relative'>
				<Box
					onClick={editable && this.showCalendar}
					cursor={editable ? 'pointer' : 'default'}
				>
					{children || (
						<DatetimePreview value={value} />
					)}
				</Box>
				{this.isOpen && this.renderCalendar()}
			</Box>
		)
	}
}
