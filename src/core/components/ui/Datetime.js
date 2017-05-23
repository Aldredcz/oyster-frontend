// @flow
import React from 'react'
import formatDate from 'date-fns/format'
import parseDate from 'date-fns/parse'

type TProps = {
	value: ?Date,
	onChange?: (value: Date) => any,
	editable?: boolean,
	time?: boolean,
	minDate?: Date,
	maxDate?: Date,
}

export const datetimeFactory = ({
	renderer,
}: {
	renderer?: (self: *) => React$Element<any>,
} = {}): * => {
	class Datetime extends React.Component<void, TProps, void> {
		render () {
			const {value, time, editable, onChange} = this.props

			const baseElem = (
				<span style={{cursor: editable ? 'pointer' : 'default'}}>
					{value
						? formatDate(value, 'DD. MM. YYYY')
						: '__.__.___'
					}
				</span>
			)

			if (editable) {
				return (
					<input
						required='required'
						type={time ? 'datetime-local' : 'date'}
						value={value ? formatDate(value, time ? 'YYYY-MM-DDTHH:mm' : 'YYYY-MM-DD') : ''}
						onChange={(ev) => onChange && onChange(parseDate(ev.target.value))}
					/>
				)
			} else {
				return baseElem
			}
		}
	}

	return Datetime
}

export default datetimeFactory()
