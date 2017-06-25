// @flow
import React from 'react'
import ReactDOM from 'react-dom'
import lineHeight from 'line-height'
import throttle from 'lodash/throttle'

type TProps = $Shape<{
	onMove: (params: {dX: number, dY: number, event: Event, type: 'drag' | 'scroll' | 'touch'}) => any,
	speed: number,
	touchEvents: boolean,
	scrollEvents: boolean,
	dragEvents: boolean,
	children: any,
}>

export default class MoveDetector extends React.Component<*, TProps, void> {
	static defaultProps = {
		touchEvents: true,
		scrollEvents: true,
		dragEvents: true,
		speed: 1,
	}

	touchEventPreviousValues = {
		clientX: 0,
		clientY: 0,
	}

	dragEventPreviousValues = {
		clientX: 0,
		clientY: 0,
	}

	contentEl: ?HTMLElement = null
	lineHeightPx: number = 16

	componentDidMount () {
		// eslint-disable-next-line react/no-find-dom-node
		this.lineHeightPx = lineHeight(ReactDOM.findDOMNode(this.contentEl))
	}

	handleDragStart = (ev: MouseEvent) => {
		const {clientX, clientY} = ev

		ev.preventDefault()
		ev.stopPropagation()

		this.dragEventPreviousValues = {
			clientX,
			clientY,
		}
		document.addEventListener('mousemove', this.handleDragMove)
		document.addEventListener('mouseup', this.handleDragEnd)
	}

	handleDragMove = throttle((ev: MouseEvent) => {
		const {clientX, clientY} = ev

		const dX = clientX - this.dragEventPreviousValues.clientX
		const dY = clientY - this.dragEventPreviousValues.clientY

		this.props.onMove({dX, dY, event: ev, type: 'drag'})

		this.dragEventPreviousValues = {
			clientX,
			clientY,
		}
	}, 16, {trailing: false})

	handleDragEnd = () => {
		document.removeEventListener('mousemove', this.handleDragMove)
		document.removeEventListener('mouseup', this.handleDragEnd)
	}

	handleTouchStart = (ev: TouchEvent) => {
		const {touches} = ev
		if (touches.length === 1) {
			const {clientX, clientY} = touches[0]
			this.touchEventPreviousValues = {
				clientY,
				clientX,
			}
		}
	}

	handleTouchMove = throttle((ev: TouchEvent) => {
		ev.preventDefault()
		ev.stopPropagation()

		const {touches} = ev
		if (touches.length === 1) {
			const {clientX, clientY} = touches[0]

			const dY = this.touchEventPreviousValues.clientY - clientY
			const dX = this.touchEventPreviousValues.clientX - clientX

			this.touchEventPreviousValues = {
				clientY,
				clientX,
			}

			this.props.onMove({dX, dY, event: ev, type: 'touch'})
		}
	}, 16, {trailing: false})

	handleWheel = (ev: WheelEvent) => {
		let dY = ev.deltaY
		let dX = ev.deltaX

		/*
		 * WheelEvent.deltaMode can differ between browsers and must be normalized
		 * e.deltaMode === 0: The delta values are specified in pixels
		 * e.deltaMode === 1: The delta values are specified in lines
		 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode
		 */
		if (ev.deltaMode === 1) {
			dY = dY * this.lineHeightPx
			dX = dX * this.lineHeightPx
		}

		dY = dY * (this.props.speed || 1)
		dX = dX * (this.props.speed || 1)

		this.props.onMove({dX, dY, event: ev, type: 'scroll'})
	}

	render () {
		const {touchEvents, scrollEvents, dragEvents, children} = this.props

		return (
			<div
				style={{position: 'relative'}}
				onWheel={scrollEvents && this.handleWheel}
			>
				<div
					draggable={dragEvents}
					ref={(x) => this.contentEl = x}
					onDragStart={dragEvents && this.handleDragStart}
					onTouchStart={touchEvents && this.handleTouchStart}
					onTouchMove={touchEvents && this.handleTouchMove}
				>
					{children}
				</div>
			</div>
		)
	}
}
